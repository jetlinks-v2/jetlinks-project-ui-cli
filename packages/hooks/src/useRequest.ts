import {onUnmounted, ref} from 'vue'
import type { Ref } from 'vue'
import {isFunction, get, isArray} from 'lodash-es'
import type { AxiosResponseRewrite } from '@jetlinks-web/types'

export interface UseRequestResult<S> {
  data: Ref<S>,
  loading: Ref<boolean>,
  run: (...args: any[]) => Promise<S>,
  reload: Reload,
  stopPolling: StopPolling,
}

export interface RequestOptions<T, S, U = any> {
  immediate: boolean
  /**
   * 成功回调
   * @param data
   * @returns
   */
  onSuccess: (data: AxiosResponseRewrite<S>) => U | void
  /**
   * 返回参数处理
   * @returns
   */
  formatName: string | string[]
  onError: (e: any) => void

  onWarn: (e: any) => void

  defaultParams: S | any | any[]

  defaultValue?: S

  /**
   * 轮询间隔，单位毫秒，小于等于 0 时不启用
   */
  pollingInterval?: number
}

export const defaultOptions: any = {
  immediate: true,
  formatName: 'result',
  pollingInterval: 0,
}

type Reload = () => void
type StopPolling = () => void

export const useRequest = <T = any, S = any>(
  request: (...args: any[]) => Promise<AxiosResponseRewrite<T>>,
  options: Partial<RequestOptions<T, S>> = defaultOptions,
): UseRequestResult<S> => {
  const _options = {
    ...defaultOptions,
    ...options
  }

  const loading = ref(false)
  const data = ref<S>(_options.defaultValue)
  let pollingTimer: ReturnType<typeof setTimeout> | undefined
  let lastRunArgs: any[] = []
  let hasLastRunArgs = false
  let isUnmounted = false
  let isPollingStopped = false

  const clearPollingTimer = () => {
    if (pollingTimer) {
      clearTimeout(pollingTimer)
      pollingTimer = undefined
    }
  }

  const resolveDefaultArgs = (): any[] => {
    if (_options.defaultParams === undefined) {
      return []
    }

    return isArray(_options.defaultParams) ? _options.defaultParams : [_options.defaultParams]
  }

  const resolvePollingArgs = (): any[] => {
    return hasLastRunArgs ? lastRunArgs : resolveDefaultArgs()
  }

  const schedulePolling = () => {
    clearPollingTimer()

    const interval = Number(_options.pollingInterval ?? 0)

    if (isUnmounted || isPollingStopped || !Number.isFinite(interval) || interval <= 0) {
      return
    }

    pollingTimer = setTimeout(() => {
      if (isUnmounted) {
        return
      }

      void run(...resolvePollingArgs()).catch(() => undefined)
    }, interval)
  }

  async function run(...arg: any[]): Promise<S> {
    if (!request || !isFunction(request)) {
      return Promise.reject('request is not a function')
    }

    hasLastRunArgs = true
    lastRunArgs = arg
    clearPollingTimer()
    loading.value = true

    try {
      // @ts-ignore
      const resp = await request.apply(this, arg)

      if (resp?.success) {
        const successData = await _options.onSuccess?.(resp)
        data.value = successData ?? get(resp, _options.formatName!)
        return data.value as S
      }

      _options.onError?.(resp)
      return Promise.reject(resp)
    } catch (e) {
      console.warn(e)
      _options.onWarn?.(e)
      throw e
    } finally {
      loading.value = false
      schedulePolling()
    }
  }

  function reload () { // 重新触发
    const args = resolveDefaultArgs()

    if (args.length) {
      void run(...args).catch(() => undefined)
    } else {
      void run().catch(() => undefined)
    }
  }

  function stopPolling() {
    isPollingStopped = true
    clearPollingTimer()
  }

  if (_options.immediate) { // 主动触发
    reload()
  }

  onUnmounted(() => {
    isUnmounted = true
    stopPolling()
  })

  return {
    data: data as Ref<S>,
    loading,
    run,
    reload,
    stopPolling,
  }
}
