import {onUnmounted, ref} from 'vue'
import type { Ref } from 'vue'
import {isFunction, get, isArray} from 'lodash-es'
import type { AxiosResponseRewrite } from '@jetlinks-web/types'

interface RequestOptions<T, S> {
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

  handleResponse: (data: any) => any
}

const defaultOptions: any = {
  immediate: true,
  formatName: 'result'
}

type Reload = () => void

export const useRequest = <T = any, S = any>(
  request: (...args: any[]) => Promise<AxiosResponseRewrite<T>>,
  options: Partial<RequestOptions<T, S>> = defaultOptions,
): {
  data: Ref<S | undefined>,
  loading: Ref<boolean>,
  run: (...args: any[]) => Promise<S>,
  reload: Reload,
} => {
  const data = ref<S>()
  const loading = ref(false)
  const _options = {
    ...defaultOptions,
    ...options
  }

  function run(...arg: any[]) {
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
            resolve(data.value)
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
