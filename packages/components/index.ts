import type { App } from 'vue'

import FullPage from './src/FullPage'
import PermissionButton from './src/PermissionButton'
import BadgeStatus from './src/BadgeStatus'
import GeoComponent from './src/GeoComponent'
import ValueItem from './src/ValueItem'
import Echarts from './src/Echarts'
import Icon from './src/Icon'
import ConfigProvider from './src/ConfigProvider'
import CardSelect from "./src/CardSelect";

import { PageContainer } from 'jetlinks-ui-components'
import { InitAMap } from './src/AMap'

export {
  FullPage,
  PermissionButton,
  BadgeStatus,
  GeoComponent,
  ValueItem,
  Echarts,
  Icon,
  ConfigProvider,
  CardSelect
}
export default {
  install(app: App) {
    app.component('JPageContainer', PageContainer)
      .component('AIcon', Icon)
      .component('JPermissionButton', PermissionButton)
      .component('JFullPage', FullPage)
      .component('JBadgeStatus', BadgeStatus)
      .component('JAMap', InitAMap)
      .component('jGeoComponent', GeoComponent)
      .component('JValueItem', ValueItem)
      .component('JEcharts', Echarts)
      .component('JConfigProvider', ConfigProvider)
      .component('JCardSelect', CardSelect)
  }
}
