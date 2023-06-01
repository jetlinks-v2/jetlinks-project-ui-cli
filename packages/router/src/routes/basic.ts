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
    component: () => import('@/views/login/index.vue'),
    meta: {
        title: '登录页'
    }
}

export const ACCOUNT_CENTER_BIND_ROUTE: RouteRecordItem = {
    path: '/account/center/bind',
    name: 'AccountCenterBind',
    component: () => import('@/views/login/index.vue'),
    meta: {
        title: '绑定中心'
    }
}

export const INIT_HOME_ROUTE: RouteRecordItem = {
    path: '/init-home',
    name: 'InitHome',
    component: () => import('@/views/login/index.vue'),
    meta: {
        title: '初始化'
    }
}

export const OAUTH_ROUTE: RouteRecordItem = {
    path: '/oauth',
    name: 'Oauth',
    component: () => import('@/views/login/index.vue'),
    meta: {
        title: '授权中心'
    }
}
