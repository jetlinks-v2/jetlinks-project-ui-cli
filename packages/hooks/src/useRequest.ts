import { ref } from 'vue'
import type { Ref } from 'vue'
import { isFunction, get } from 'lodash-es'
import type { AxiosResponseRewrite } from '@jetlinks/types'

interface RequestOptions<T> {
    immediate: boolean
    /**
     * 成功回调
     * @param data 
     * @returns 
     */
    onSuccess: (data: T) => void
    /**
     * 返回参数处理
     * @returns 
     */
    formatName: string | [string]
    onError: (e: any) => void
}

const defaultOptions: any = {
    immediate: true,
    formatName: 'result'
}

type Run = (...args: any[]) => void

export const useRequest = <T = any, S = any>(
  request: (...args: any[]) => Promise<AxiosResponseRewrite<T>>,
  options: Partial<RequestOptions<S>> = defaultOptions
): {
  data: Ref<S | undefined>,
  loading: Ref<boolean>,
  run: Run
} => {
    const data = ref<S>()
    const loading = ref(false)
    const _options = {
        ...defaultOptions,
        ...options
    }
   
    async function run(...arg: any) {
        if (request && isFunction(request)) {
            loading.value = true
            try {
              // @ts-ignore
              const resp = await request.apply(this, arg).catch((err) => {
                return {
                  success: false
                }
              })

              loading.value = false

              _options.onSuccess?.(resp as any)

              if (resp?.success) {
                data.value = get(resp, _options.formatName!)
              }
            } catch (e) {
              loading.value = false
              _options.onError?.(e)
            }

        }
    }

    if (_options.immediate) { // 主动触发
        run()
    }

    return {
        data,
        loading,
        run
    }
}
