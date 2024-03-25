import type { App } from 'vue'

import { InitAMap } from './src/AMap'
import BadgeStatus from './src/BadgeStatus'
import CardSelect from './src/CardSelect'
import CheckButton from './src/CheckButton'
import ConfigProvider from './src/ConfigProvider'
import Echarts from './src/Echarts'
import Ellipsis from './src/Ellipsis'
import Empty from './src/Empty'
import FullPage from './src/FullPage'
import AIcon from './src/Icon'
import MonacoEditor from './src/MonacoEditor'
import PermissionButton from './src/PermissionButton'
import ProLayout, { PageContainer } from './src/ProLayout'
import ProTable from './src/ProTable'
import Scrollbar from './src/Scrollbar'
import Search, { AdvancedSearch } from './src/Search'
import ValueItem from './src/ValueItem'

export * from './src/style'

export {
  BadgeStatus,
  CardSelect,
  CheckButton,
  Echarts,
  Ellipsis,
  Empty,
  FullPage,
  AIcon,
  MonacoEditor,
  PermissionButton,
  ValueItem,
  ProTable,
  Scrollbar,
  Search,
  AdvancedSearch,
  ConfigProvider,
}
export default {
  install(app: App) {
    app
      .component('JAMap', InitAMap)
      .component('JBadgeStatus', BadgeStatus)
      .component('JCardSelect', CardSelect)
      .component('JCheckButton', CheckButton)
      .component('JConfigProvider', ConfigProvider)
      .component('JEcharts', Echarts)
      .component('JEllipsis', Ellipsis)
      .component('JEmpty', Empty)
      .component('JFullPage', FullPage)
      .component('AIcon', AIcon)
      .component('JMonacoEditor', MonacoEditor)
      .component('JPermissionButton', PermissionButton)
      .component('JProLayout', ProLayout)
      .component('JPageContainer', PageContainer)
      .component('JProTable', ProTable)
      .component('JScrollbar', Scrollbar)
      .component('JSearch', Search)
      .component('JAdvancedSearch', AdvancedSearch)
      .component('JValueItem', ValueItem)
  },
}
