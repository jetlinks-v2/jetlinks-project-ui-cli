import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject, timer, Subscription, EMPTY } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { notification } from 'ant-design-vue';

interface WebSocketMessage {
  type: string;
  id?: string;
  topic?: string;
  parameter?: Record<string, any>;
  requestId?: string;
  message?: string;
  [key: string]: any;
}

type WS_Options = {
  onError?: (message: WebSocketMessage) => void
}

const isApp = (window as any).__MICRO_APP_ENVIRONMENT__

export class WebSocketClient {
  private ws: WebSocketSubject<WebSocketMessage> | null = null;
  private subscriptions = new Map<string, Subject<WebSocketMessage>>();
  private pendingSubscriptions = new Map<string, Subject<WebSocketMessage>>();
  private heartbeatSubscription: Subscription | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 2;
  private isConnected = false;
  private tempQueue: WebSocketMessage[] = []; // 缓存消息队列
  private url: string = '';
  private options: WS_Options = {}
  private wsClient: WebSocketClient | undefined

  constructor(options?: WS_Options) {
    this.setOptions(options)
    this.setupConnectionMonitor();
    if (isApp) {
      (window as any).microApp.addGlobalDataListener((data) => {
        this.wsClient = data.wsClient
      })
    }
  }

  public setOptions(options: WS_Options) {
    this.options = options || {}
  }

  public initWebSocket(url: string) {
    this.url = url;
  }

  private setupConnectionMonitor() {
    if (!isApp) {
      window.addEventListener('online', () => {
        console.log('Network is online, attempting to reconnect...');
        this.reconnect();
      });

      window.addEventListener('offline', () => {
        console.log('Network is offline, caching subscriptions...');
        this.cacheSubscriptions();
      });

      window.addEventListener('beforeunload', () => {
        this.disconnect();
      });
    }
  }

  private getReconnectDelay(): number {
    if (this.reconnectAttempts <= 10) {
      return 5000; // 5s
    } else if (this.reconnectAttempts <= 20) {
      return 15000; // 15s
    }
    return 60000; // 60s
  }

  private setupWebSocket() {

    if (isApp && this.wsClient) {
      this.wsClient.setupWebSocket()
      return
    }

    if (this.ws || !this.url) {
      return;
    }

    this.ws = webSocket<WebSocketMessage>({
      url: this.url,
      openObserver: {
        next: () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.restoreSubscriptions();
          this.processTempQueue();
        }
      },
      closeObserver: {
        next: () => {
          console.log('WebSocket disconnected');
          this.isConnected = false;
          const time = this.getReconnectDelay()
          setTimeout(() => {
            this.reconnectAttempts += 1;
            if (this.reconnectAttempts > this.maxReconnectAttempts) {
              return
            }
            this.cacheSubscriptions();
            this.stopHeartbeat();
            this.reconnect();
          }, time)

        }
      }
    });

    this.ws.pipe(
      catchError(error => {
        console.error('WebSocket error:', error);
        return EMPTY;
      }),
      retry({
        delay: (error, retryCount) => {
          this.reconnectAttempts = retryCount;
          if (retryCount > this.maxReconnectAttempts) {
            throw new Error('Max reconnection attempts reached');
          }
          return timer(this.getReconnectDelay());
        }
      })
    ).subscribe(
      (message) => this.handleMessage(message),
      (error) => console.error('WebSocket error:', error)
    );
  }

  private startHeartbeat() {
    if (isApp && this.wsClient) {
      this.wsClient.startHeartbeat()
      return
    }
    this.stopHeartbeat();
    this.heartbeatSubscription = timer(0, 2000).subscribe(() => {
      this.send({ type: 'ping' });
    });
  }

  private stopHeartbeat() {
    if (isApp && this.wsClient) {
      this.wsClient.stopHeartbeat()
      return
    }

    if (this.heartbeatSubscription) {
      this.heartbeatSubscription.unsubscribe();
      this.heartbeatSubscription = null;
    }
  }

  private handleMessage(message: WebSocketMessage) {

    if (isApp && this.wsClient) {
      this.wsClient.handleMessage(message)
      return
    }

    if (message.type === 'pong') {
      return;
    }

    if (message.type === 'error') {
      if (this.options.onError) {
        this.options.onError(message)
      } else {
        notification.error({ key: 'error', message: message.message });
      }
      return;
    }

    const subscriber = this.subscriptions.get(message.requestId || '');
    if (subscriber) {
      if (message.type === 'complete') {
        subscriber.complete();
        this.subscriptions.delete(message.requestId || '');
      } else if (message.type === 'result') {
        subscriber.next(message);
      }
    }
  }

  private processTempQueue() {
    if (isApp && this.wsClient) {
      this.wsClient.processTempQueue()
      return
    }

    while (this.tempQueue.length > 0) {
      const message = this.tempQueue.shift();
      if (message) {
        this.send(message);
      }
    }
  }

  private cacheSubscriptions() {
    if (isApp && this.wsClient) {
      this.wsClient.cacheSubscriptions()
      return
    }
    this.pendingSubscriptions = new Map(this.subscriptions);
    this.subscriptions.clear();
  }

  private restoreSubscriptions() {
    if (isApp && this.wsClient) {
      this.wsClient.restoreSubscriptions()
      return
    }
    this.pendingSubscriptions.forEach((subject, id) => {
      this.subscriptions.set(id, subject);
    });
    this.pendingSubscriptions.clear();
  }

  private reconnect() {
    if (isApp && this.wsClient) {
      this.wsClient.reconnect()
      return
    }
    if (!this.isConnected && navigator.onLine) {
      this.ws = null;
      this.setupWebSocket();
    }
  }

  public connect() {
    if (isApp && this.wsClient) {
      this.wsClient.connect()
      return
    }
    this.setupWebSocket();
  }

  public disconnect() {
    if (isApp && this.wsClient) {
      this.wsClient.disconnect()
      return
    }
    if (this.ws) {
      this.ws.complete();
      this.ws = null;
    }
    this.stopHeartbeat();
    this.subscriptions.clear();
    this.pendingSubscriptions.clear();
    this.tempQueue = [];
  }

  public send(message: WebSocketMessage) {
    if (isApp && this.wsClient) {
      this.wsClient.send(message)
      return
    }
    if (this.ws && this.isConnected) {
      this.ws.next(message);
    } else {
      this.tempQueue.push(message);
    }
  }

  public getWebSocket(id: string, topic: string, parameter: Record<string, any> = {}): Observable<WebSocketMessage> {
    console.log('getWebSocket', this.wsClient, id)
    if (isApp && this.wsClient) {
      return this.wsClient.getWebSocket(
        id,
        topic,
        parameter
      )
    }

    const subject = new Subject<WebSocketMessage>();
    this.subscriptions.set(id, subject);

    const message: WebSocketMessage = {
      id,
      topic,
      parameter,
      type: 'sub'
    };

    this.send(message);

    return new Observable(subscriber => {
      const subscription = subject.subscribe(subscriber);

      return () => {
        subscription.unsubscribe();
        this.send({ id, type: 'unsub' });
        this.subscriptions.delete(id);
      };
    });
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
export const wsClient = new WebSocketClient();
