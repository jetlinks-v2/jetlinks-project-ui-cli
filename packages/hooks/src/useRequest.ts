import {onUnmounted, ref} from 'vue'
import type { Ref, UnwrapRef } from 'vue'
import {isFunction, get, isArray} from 'lodash-es'
import type { AxiosResponseRewrite } from '@jetlinks-web/types'

export interface RequestOptions<T, S> {
  immediate: boolean
  /**
   * 成功回调
   * @param data
   * @returns
   */
  onSuccess: (data: AxiosResponseRewrite<S>) => S | void
  /**
   * 返回参数处理
   * @returns
   */
  formatName: string | string[]
  onError: (e: any) => void

  onWarn: (e: any) => void

  defaultParams: S | any | any[]

  defaultValue?: S
}

export interface UseRequestResult<S> {
  data: Ref<UnwrapRef<S>>,
  loading: Ref<boolean>,
  run: (...args: any[]) => Promise<S>,
  reload: Reload,
}

export const defaultOptions: any = {
  immediate: true,
  formatName: 'result'
}

type Reload = () => void

export const useRequest = <T = any, S = any>(
  request: (...args: any[]) => Promise<AxiosResponseRewrite<T>>,
  options: Partial<RequestOptions<T, S>> = defaultOptions,
): UseRequestResult<S> => {
  const _options = {
    ...defaultOptions,
    ...options
  }

  const loading = ref(false)
  const data = ref<S>(_options.defaultValue as S)

  function run(...arg: any[]): Promise<S> {
    return new Promise(async ( resolve, reject) => {
      if (request && isFunction(request)) {
        loading.value = true
        try {
          // @ts-ignore
          const resp = await request.apply(this, arg)

          loading.value = false

          if (resp?.success) {
            const successData = await _options.onSuccess?.(resp)
            data.value = successData ?? get(resp, _options.formatName!)
            // console.log(data.value)
            resolve(data.value as S)
          } else {
            _options.onError?.(resp)
            reject(resp)
          }
        } catch (e) {
          console.warn(e)
          reject(e)
          loading.value = false
          _options.onWarn?.(e)
        }
      } else {
        reject('request is not a function')
      }
    })
  }

  function reload () { // 重新触发
    if (_options.defaultParams) {
      isArray(_options.defaultParams) ? run(..._options.defaultParams) : run(_options.defaultParams)
    } else {
      run()
    }
  }

  if (_options.immediate) { // 主动触发
    reload()
  }

  onUnmounted(() => {
    // 销毁时，撤销该请求
    if (request && isFunction(request)) {

    }
    // request()
  })

  return {
    data,
    loading,
    run,
    reload,
  }
}
