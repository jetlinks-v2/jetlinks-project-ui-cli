import { customRef, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Router } from 'vue-router'

const _queue = new WeakMap<Router, Map<string, any>>()

export const useRouteQuery = (name: string) => {
  const router = useRouter()
  const route = useRoute()

  let transformGet = (value: any) => value
  let transformSet = (value: any) => value

  if (!_queue.has(router))
    _queue.set(router, new Map())

  const _queriesQueue = _queue.get(router)!

  let query = route.query[name] as any

  let _trigger: () => void

  const proxy = customRef<any>((track, trigger) => {
    _trigger = trigger

    return {
      get() {
        track()
        return transformGet(query !== undefined ? query : undefined)
      },
      set(v) {
        v = transformSet(v)

        if (query === v)
          return

        query = (v === undefined) ? undefined : v
        _queriesQueue.set(name, (v === undefined) ? undefined : v)

        trigger()

        nextTick(() => {
          if (_queriesQueue.size === 0)
            return

          const newQueries = Object.fromEntries(_queriesQueue.entries())
          _queriesQueue.clear()

          const { params, query, hash } = route

          router.replace({
            params,
            query: { ...query, ...newQueries },
            hash,
          })
        })
      }
    }
  })

  watch(
    () => route.query[name],
    (v) => {
      if (query === transformGet(v))
        return

      query = v

      _trigger()
    },
    { flush: 'sync' },
  )

  return proxy
}
