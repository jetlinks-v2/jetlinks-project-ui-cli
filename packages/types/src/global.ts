import type { VNodeChild, PropType as VuePropType } from 'vue'
import type { RouteRecordItem as IRouteRecordItem } from './router'

declare global {
  // router
  type RouteRecordItem = IRouteRecordItem

  // vue
  type PropType<T> = VuePropType<T>
  type VueNode = VNodeChild | JSX.Element

  interface ViteEnv {
    readonly VITE_APP_BASE_API: string
    readonly VITE_APP_WS_URL: string
    readonly MODE: string
  }

  interface ImportMeta extends ViteEnv {}
}
