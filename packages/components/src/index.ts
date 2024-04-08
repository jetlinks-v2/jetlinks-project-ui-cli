import type { App } from 'vue'

import InitAMap from './AMap'
import BadgeStatus from './BadgeStatus'
import CardSelect from './CardSelect'
import CheckButton from './CheckButton'
import ConfigProvider from './ConfigProvider'
import Echarts from './Echarts'
import Ellipsis from './Ellipsis'
import Empty from './Empty'
import FullPage from './FullPage'
import AIcon from './Icon'
import MonacoEditor from './MonacoEditor'
import PermissionButton from './PermissionButton'
import ProLayout, { PageContainer } from './ProLayout'
import ProTable from './ProTable'
import Scrollbar from './Scrollbar'
import Search, { AdvancedSearch } from './Search'
import ValueItem from './ValueItem'

export * from './style'

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
