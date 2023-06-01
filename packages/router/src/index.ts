import { createRouter, createWebHashHistory, Router } from 'vue-router'
import { getToken, removeToken } from '@jetlinks/utils'
import {
  BasicRoutes,
  LOGIN_ROUTE,
  ACCOUNT_CENTER_BIND_ROUTE,
  OAUTH_ROUTE,
  INIT_HOME_ROUTE,
  NOT_FIND_ROUTE
} from './routes'
import { assign } from 'lodash-es'

export let router: Router

interface Store {
    UserInfoStore?: any
    MenuStore?: any
    SystemStore?: any
    AuthStore?: any
}

export const store: Store = {}

export const initRoute = (): Router => {
    router = createRouter({
        history: createWebHashHistory(),
        routes: BasicRoutes,
        scrollBehavior(to, form, savedPosition) {
            return savedPosition || { top: 0 }
        }
    })
    return router
}

export const jumpLogin = () => {
    setTimeout(() => {
        removeToken()
        location.href = `#${LOGIN_ROUTE.path}`
    })
}

/**
 * 获取子项目中的store
 * @param s {Store}
 */
export const initRouteAssignStore = (s: Store) => {
    assign(store, s)
}

const TokenFilterRoute = [
    ACCOUNT_CENTER_BIND_ROUTE.path,
    OAUTH_ROUTE.path
]

const NoTokenJump = (to: any, next: any, isLogin: boolean) => {
    // 登录页，不需要token 的页面直接放行，否则跳转登录页
    if (isLogin || TokenFilterRoute.includes(to.path)) {
        next()
    } else {
        next({ path: LOGIN_ROUTE.path })
    }
}

const getRoutesByServer = async (to: any, next: any) => {
    const { UserInfoStore, SystemStore, MenuStore } = store
    const FilterPath = [ INIT_HOME_ROUTE.path ]
    if (!Object.keys(UserInfoStore.userInfo).length) { // 是否有用户信息
      await UserInfoStore.getUserInfo()
      //
      await SystemStore.queryInfo()
    }
  // 没有菜单的情况下获取菜单
    if (!MenuStore.menu.length && !FilterPath.includes(to.path)) {
        //
        await MenuStore.queryMenus()
        if (!MenuStore.menu) { // 请求之后还是没有页面，跳转异常处理页面

        } else {
          MenuStore.menu.forEach(r => {
            router.addRoute('base', r)
          })
          router.addRoute('base', NOT_FIND_ROUTE)
          next({ ...to, replace: true })
        }
    } else {
        next()
    }
}

/**
 * 创建动态菜单
 */
export const createAuthRoute = () => {
    router.beforeEach((to, from, next) => {
        const token = getToken()
        const isLogin = to.path === LOGIN_ROUTE.path
        if (token) {
            if (isLogin) {
                next({ path: '/'})
            } else {
                getRoutesByServer(to, next)
            }
        } else {
            NoTokenJump(to, next, isLogin)
        }
    })
}
