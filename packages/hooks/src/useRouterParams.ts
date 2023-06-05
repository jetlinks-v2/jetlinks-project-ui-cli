import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Ref } from 'vue'

type RouteParamsValue = {code: string, value: any}
let routerParams: Partial<RouteParamsValue> = {}

export const userRouterParams = (): {params: Ref<Record<string, any>>, setParamsValue: (code: string, value: any) => void} => {
    const params = ref<Record<string, any>>({})

    const router = useRouter()
    const routerName = router.currentRoute.value.name as string
    params.value = routerParams.code === routerName ? routerParams.value : {}

    onUnmounted(() => {
        if (routerName && routerParams.code) {
            params.value = {}
        }
    })

    const setParamsValue = (code, value) => {
        routerParams = {
            code,
            value
        }
    }

    return {
        params,
        setParamsValue
    }
}
