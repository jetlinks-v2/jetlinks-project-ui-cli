import { ref } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import type { Ref } from 'vue'

type RouteParamsValue = {code: string, value: any}
let routerParams: Partial<RouteParamsValue> = {}

export const setParamsValue = (code, value) => {
  routerParams = {
    code,
    value
  }
}

export const useRouterParams = (): {params: Ref<Record<string, any>>} => {
    const params = ref<Record<string, any>>({})

    const router = useRouter()
    const routerName = router.currentRoute.value.name as string
    params.value = routerParams.code === routerName ?  routerParams.value : {}

    const clear = () => {
      if (routerParams.code === routerName) {
        routerParams = {}
      }
    }

    onBeforeRouteLeave(() => {
      clear()
    })

    return {
        params
    }
}
