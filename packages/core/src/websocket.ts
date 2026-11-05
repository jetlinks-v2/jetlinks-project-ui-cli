import { webSocket } from 'rxjs/webSocket'
import type { WebSocketSubject } from 'rxjs/webSocket'
import { Observable, Subject, timer, Subscription } from 'rxjs'
import { notification } from 'ant-design-vue'

interface WebSocketMessage {
  type: string
  id?: string
  topic?: string
  parameter?: Record<string, any>
  requestId?: string
  message?: string
  [key: string]: any
}

type WS_Options = {
  onError?: (message: WebSocketMessage) => void
}

interface WebSocketSubscription {
  subject: Subject<WebSocketMessage>
  request: WebSocketMessage
  consumers: number
}

export type WebSocketConnectionEventType =
  | 'connected'
  | 'disconnected'
  | 'reconnected'

/**
 * WebSocket 连接生命周期事件。
 * `reconnected` 只会在有效业务订阅重放完成后触发，业务模块可据此补拉断线期间的数据。
 */
export interface WebSocketConnectionEvent {
  type: WebSocketConnectionEventType
  timestamp: number
}

const isApp = (window as any).__MICRO_APP_ENVIRONMENT__

/**
 * 共享 WebSocket 客户端，统一管理连接、心跳、重连和业务订阅生命周期。
 * 业务模块只负责订阅消息并在连接恢复事件后执行自己的数据补偿。
 */
export class WebSocketClient {
  private ws: WebSocketSubject<WebSocketMessage> | null = null
  private subscriptions = new Map<string, WebSocketSubscription>()
  private heartbeatSubscription: Subscription | null = null
  private reconnectTimer: number | undefined
  private connectionTimeoutTimer: number | undefined
  private reconnectAttempts = 0
  private readonly maxReconnectDelay = 15000
  private readonly heartbeatInterval = 2000
  private readonly heartbeatTimeout = 10000
  private readonly connectionTimeout = 10000
  private isConnected = false
  private shouldReconnect = false
  private hasConnected = false
  private lastPongAt = 0
  private tempQueue: WebSocketMessage[] = [] // 缓存消息队列
  private url: string = ''
  private options: WS_Options = {}
  private wsClient: WebSocketClient | undefined
  private delegatedConnectionEventsSubscription: Subscription | undefined
  private connectionEventSubject = new Subject<WebSocketConnectionEvent>()

  /** 连接生命周期事件流，不缓存或重放历史事件。 */
  public readonly connectionEvents$ = this.connectionEventSubject.asObservable()

  constructor(options?: WS_Options) {
    this.setOptions(options)
    this.setupConnectionMonitor()
    if (isApp) {
      ;(window as any).microApp.addGlobalDataListener(
        (data: { wsClient?: WebSocketClient }) => {
          if (data?.wsClient === this.wsClient) return
          this.delegatedConnectionEventsSubscription?.unsubscribe()
          this.wsClient = data?.wsClient
          this.delegatedConnectionEventsSubscription =
            this.wsClient?.connectionEvents$?.subscribe((event) => {
              this.connectionEventSubject.next(event)
            })
        },
        true,
      )
    }
  }

  public setOptions(options?: WS_Options) {
    this.options = options || {}
  }

  public initWebSocket(url: string) {
    this.url = url
  }

  private setupConnectionMonitor() {
    if (!isApp) {
      window.addEventListener('online', () => {
        this.scheduleReconnect(0)
      })

      window.addEventListener('offline', () => {
        this.closeSocketForReconnect()
      })

      window.addEventListener('beforeunload', () => {
        this.disconnect()
      })
    }
  }

  private getReconnectDelay(): number {
    const exponentialDelay = Math.min(
      1000 * 2 ** Math.min(this.reconnectAttempts, 4),
      this.maxReconnectDelay,
    )
    // 抖动可以避免服务恢复时大量客户端在同一时刻集中重连。
    return Math.round(exponentialDelay * (0.8 + Math.random() * 0.2))
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer === undefined) return
    window.clearTimeout(this.reconnectTimer)
    this.reconnectTimer = undefined
  }

  private scheduleReconnect(delay = this.getReconnectDelay()) {
    if (!this.shouldReconnect || this.isConnected || !window.navigator.onLine)
      return
    if (this.reconnectTimer !== undefined) {
      if (delay !== 0) return
      this.clearReconnectTimer()
    }
    this.reconnectAttempts += 1
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = undefined
      this.reconnect()
    }, delay)
  }

  private clearConnectionTimeout() {
    if (this.connectionTimeoutTimer === undefined) return
    window.clearTimeout(this.connectionTimeoutTimer)
    this.connectionTimeoutTimer = undefined
  }

  private startConnectionTimeout(socket: WebSocketSubject<WebSocketMessage>) {
    this.clearConnectionTimeout()
    this.connectionTimeoutTimer = window.setTimeout(() => {
      if (this.ws === socket && !this.isConnected) {
        this.closeSocketForReconnect()
      }
    }, this.connectionTimeout)
  }

  private setupWebSocket() {
    if (isApp && this.wsClient) {
      this.wsClient.setupWebSocket()
      return
    }

    if (
      this.ws ||
      !this.url ||
      !this.shouldReconnect ||
      !window.navigator.onLine
    ) {
      return
    }

    const socket = webSocket<WebSocketMessage>({
      url: this.url,
      openObserver: {
        next: () => {
          this.handleSocketOpen(socket)
        },
      },
      closeObserver: {
        next: (event) => {
          if (this.ws !== socket) return
          // 策略/鉴权拒绝需要用户重新认证，不进入自动重连循环。
          if ([1008, 4001, 4003, 4401, 4403].includes(event.code)) {
            this.shouldReconnect = false
            this.tempQueue = []
            this.endSubscriptions({
              type: 'error',
              code: event.code,
              status: [4001, 4401].includes(event.code) ? 401 : 403,
              message: event.reason || 'WebSocket authorization rejected',
            })
          }
          this.handleSocketClose(socket)
        },
      },
    })

    this.ws = socket
    this.startConnectionTimeout(socket)
    socket.subscribe({
      next: (message) => {
        if (this.ws === socket) this.handleMessage(message)
      },
      error: (error) => {
        console.error('WebSocket error:', error)
        this.handleSocketClose(socket)
      },
    })
  }

  private handleSocketOpen(socket: WebSocketSubject<WebSocketMessage>) {
    if (this.ws !== socket) return
    const type: WebSocketConnectionEventType = this.hasConnected
      ? 'reconnected'
      : 'connected'
    this.isConnected = true
    this.hasConnected = true
    this.reconnectAttempts = 0
    this.lastPongAt = Date.now()
    this.clearReconnectTimer()
    this.clearConnectionTimeout()
    this.startHeartbeat()

    // 先恢复全部有效业务订阅，再通知业务层补拉断线期间的数据。
    this.restoreSubscriptions()
    this.processTempQueue()
    this.connectionEventSubject.next({ type, timestamp: Date.now() })
  }

  private handleSocketClose(socket: WebSocketSubject<WebSocketMessage>) {
    if (this.ws !== socket) return
    this.ws = null
    this.clearConnectionTimeout()
    this.stopHeartbeat()
    const wasConnected = this.isConnected
    this.isConnected = false
    if (wasConnected) {
      this.connectionEventSubject.next({
        type: 'disconnected',
        timestamp: Date.now(),
      })
    }
    this.scheduleReconnect()
  }

  private closeSocketForReconnect() {
    const socket = this.ws
    if (!socket) {
      this.scheduleReconnect()
      return
    }
    this.handleSocketClose(socket)
    // 超时连接可能仍处于 CONNECTING，unsubscribe 可立即关闭底层连接，避免旧连接随后再次 open。
    socket.unsubscribe()
  }

  private startHeartbeat() {
    if (isApp && this.wsClient) {
      this.wsClient.startHeartbeat()
      return
    }
    this.stopHeartbeat()
    this.lastPongAt = Date.now()
    this.heartbeatSubscription = timer(0, this.heartbeatInterval).subscribe(
      () => {
        if (Date.now() - this.lastPongAt >= this.heartbeatTimeout) {
          console.warn('WebSocket heartbeat timed out, reconnecting...')
          this.closeSocketForReconnect()
          return
        }
        this.send({ type: 'ping' })
      },
    )
  }

  private stopHeartbeat() {
    if (isApp && this.wsClient) {
      this.wsClient.stopHeartbeat()
      return
    }

    if (this.heartbeatSubscription) {
      this.heartbeatSubscription.unsubscribe()
      this.heartbeatSubscription = null
    }
  }

  private handleMessage(message: WebSocketMessage) {
    if (isApp && this.wsClient) {
      this.wsClient.handleMessage(message)
      return
    }

    if (message.type === 'pong') {
      this.lastPongAt = Date.now()
      return
    }

    if (message.type === 'error') {
      const id = message.requestId || message.id || ''
      const subscription = this.subscriptions.get(id)
      if (subscription) {
        // 先删除注册，避免 error 回调中的重新订阅被旧 teardown 取消。
        this.subscriptions.delete(id)
        subscription.subject.error(message)
        return
      }
      if (this.options.onError) {
        this.options.onError(message)
      } else {
        notification.error({ key: 'error', message: message.message })
      }
      return
    }

    const subscription = this.subscriptions.get(message.requestId || '')
    if (subscription) {
      if (message.type === 'complete') {
        this.subscriptions.delete(message.requestId || '')
        subscription.subject.complete()
      } else if (message.type === 'result') {
        subscription.subject.next(message)
      }
    }
  }

  private processTempQueue() {
    if (isApp && this.wsClient) {
      this.wsClient.processTempQueue()
      return
    }

    while (this.tempQueue.length > 0) {
      const message = this.tempQueue.shift()
      if (message) {
        this.send(message)
      }
    }
  }

  private restoreSubscriptions() {
    if (isApp && this.wsClient) {
      this.wsClient.restoreSubscriptions()
      return
    }
    this.subscriptions.forEach((subscription) => {
      this.ws?.next(subscription.request)
    })
  }

  private reconnect() {
    if (isApp && this.wsClient) {
      this.wsClient.reconnect()
      return
    }
    if (this.shouldReconnect && !this.isConnected && window.navigator.onLine) {
      this.setupWebSocket()
    }
  }

  public connect() {
    if (isApp && this.wsClient) {
      this.wsClient.connect()
      return
    }
    this.shouldReconnect = true
    this.reconnect()
  }

  public disconnect() {
    if (isApp && this.wsClient) {
      this.wsClient.disconnect()
      return
    }
    this.shouldReconnect = false
    this.hasConnected = false
    this.reconnectAttempts = 0
    this.clearReconnectTimer()
    this.clearConnectionTimeout()
    const socket = this.ws
    this.ws = null
    const wasConnected = this.isConnected
    this.isConnected = false
    this.stopHeartbeat()
    this.tempQueue = []
    this.endSubscriptions()
    socket?.complete()
    if (wasConnected) {
      this.connectionEventSubject.next({
        type: 'disconnected',
        timestamp: Date.now(),
      })
    }
  }

  /** 显式退出/身份切换结束旧消费者，清空注册后再通知，隔离同步回调。 */
  private endSubscriptions(error?: WebSocketMessage) {
    const subscriptions = [...this.subscriptions.values()]
    this.subscriptions.clear()
    for (const subscription of subscriptions) {
      if (error) subscription.subject.error(error)
      else subscription.subject.complete()
    }
  }

  public send(message: WebSocketMessage) {
    if (isApp && this.wsClient) {
      this.wsClient.send(message)
      return
    }
    if (this.ws && this.isConnected) {
      this.ws.next(message)
    } else {
      this.tempQueue.push(message)
    }
  }

  public getWebSocket(
    id: string,
    topic: string,
    parameter: Record<string, any> = {},
  ): Observable<WebSocketMessage> {
    if (isApp && this.wsClient) {
      return this.wsClient.getWebSocket(id, topic, parameter)
    }

    const request: WebSocketMessage = {
      id,
      topic,
      parameter,
      type: 'sub',
    }
    let entry: WebSocketSubscription | undefined

    // 创建 Observable 本身不声明主题；同一个流的多个消费者共享一次服务端订阅。
    return new Observable((subscriber) => {
      let register = false
      if (!entry || entry.subject.isStopped || entry.consumers === 0) {
        const previous = this.subscriptions.get(id)
        entry = { subject: new Subject<WebSocketMessage>(), request, consumers: 0 }
        this.subscriptions.set(id, entry)
        if (previous) {
          if (this.ws && this.isConnected) this.ws.next({ id, type: 'unsub' })
          previous.subject.complete()
        }
        register = true
      }
      const current = entry
      current.consumers++
      const subscription = current.subject.subscribe(subscriber)
      if (register && this.subscriptions.get(id) === current && this.ws && this.isConnected) {
        this.ws.next(request)
      }

      return () => {
        subscription.unsubscribe()
        current.consumers--
        if (current.consumers > 0 || this.subscriptions.get(id) !== current) return
        this.subscriptions.delete(id)
        if (this.ws && this.isConnected) {
          this.ws.next({ id, type: 'unsub' })
        }
      }
    })
  }
}

/**
 * 创建单例
 * @example
 * wsClient.initWebSocket('ws://example.com/ws');
 * wsClient.connect();
 * const subscription = wsClient.getWebSocket('id1', 'topic1', { param: 'value' })
 *   .subscribe(
 *     message => console.log('Received:', message)
 *   );
 *
 * // 清理
 * subscription.unsubscribe();
 *
 */
export const wsClient = new WebSocketClient()
