import type { App } from 'vue'

import { default as FullPage} from './src/FullPage/index.vue'
import { default as PermissionButton} from './src/PermissionButton/index'
import { default as BadgeStatus} from './src/BadgeStatus'
import { default as GeoComponent} from './src/GeoComponent'
import { default as ValueItem} from './src/ValueItem'
import { default as Echarts} from './src/Echarts'

import { PageContainer, AIcon } from 'jetlinks-ui-components'
import { InitAMap } from './src/AMap'

export { default as ConfigProvider } from './src/ConfigProvider'
export { default as Icon} from './src/Icon/icon'

export default {
  install(app: App) {
    app.component('JPageContainer', PageContainer)
      .component('AIcon', AIcon)
      .component('JPermissionButton', PermissionButton)
      .component('JFullPage', FullPage)
      .component('JBadgeStatus', BadgeStatus)
      .component('JAMap', InitAMap)
      .component('jGeoComponent', GeoComponent)
      .component('JValueItem', ValueItem)
      .component('JEcharts', Echarts)
  }
}
