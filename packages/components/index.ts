import type { App } from 'vue'

import FullPage from './src/FullPage/index.vue'
import PermissionButton from './src/PermissionButton/index'
import BadgeStatus from './src/BadgeStatus'
import GeoComponent from './src/GeoComponent'
import ValueItem from './src/ValueItem'

import { PageContainer, AIcon } from 'jetlinks-ui-components'
import { InitAMap } from './src/AMap'

export default {
  install(app: App) {
    app.component('PageContainer', PageContainer)
      .component('AIcon', AIcon)
      .component('PermissionButton', PermissionButton)
      .component('FullPage', FullPage)
      .component('BadgeStatus', BadgeStatus)
      .component('InitAmap', InitAMap)
      .component('GeoComponent', GeoComponent)
      .component('ValueItem', ValueItem)
  }
}
