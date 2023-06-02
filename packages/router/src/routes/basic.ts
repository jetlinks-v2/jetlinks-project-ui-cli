import { Exception } from '../page'
import type { RouteRecordItem } from '@jetlinks/types'

export const NOT_FIND_ROUTE = {
    path: '/:pathMatch(.*)',
    name: 'error',
    component: () => Exception
}

export const LOGIN_ROUTE: RouteRecordItem = {
    path: '/login',
    name: 'Login',
    // @ts-ignore
    component: () => import('@/views/login/index.vue'),
    meta: {
        title: '登录页'
    }
}
