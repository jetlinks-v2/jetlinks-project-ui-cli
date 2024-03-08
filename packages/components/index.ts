import type { App } from 'vue'

import { InitAMap } from './src/AMap'
import BadgeStatus from './src/BadgeStatus'
import CardSelect from "./src/CardSelect";
import CheckButton from "./src/CheckButton";
import ConfigProvider from './src/ConfigProvider'
import DataTable, {
    DataTables,
    DataTableMetrics,
    DataTableDouble,
    DataTableBoolean,
    DataTableEnum,
    DataTableFile,
    DataTableDate,
    DataTableTypeSelect,
    DataTableInteger,
    DataTableArray,
    DataTableString,
    DataTableObject,
} from "./src/DataTable";
import Echarts from './src/Echarts'
import Ellipsis from "./src/Ellipsis";
import Empty from "./src/Empty";
import FullPage from './src/FullPage'
import GeoComponent from './src/GeoComponent'
import AIcon from './src/Icon'
import MonacoEditor from './src/MonacoEditor'
import PermissionButton from './src/PermissionButton'
import PopconfirmModal from './src/PopconfirmModal'
import ProLayout, { PageContainer } from './src/ProLayout'
import ProTable from './src/ProTable'
import Scrollbar from './src/Scrollbar'
import Search, { AdvancedSearch } from './src/Search'
import ValueItem from './src/ValueItem'

export * from './src/style';

export {
    BadgeStatus,
    CardSelect,
    CheckButton,
    DataTable,
    DataTables,
    Echarts,
    Ellipsis,
    Empty,
    FullPage,
    GeoComponent,
    AIcon,
    MonacoEditor,
    PermissionButton,
    PopconfirmModal,
    ValueItem,
    ProTable,
    Scrollbar,
    Search,
    AdvancedSearch,
    ConfigProvider,
}
export default {
    install(app: App) {
        app.component('JAMap', InitAMap)
            .component('JBadgeStatus', BadgeStatus)
            .component('JCardSelect', CardSelect)
            .component('JCheckButton', CheckButton)
            .component('JConfigProvider', ConfigProvider)
            .component('JDataTable', DataTable)
            .component('JDataTables', DataTables)
            .component('JDataTableArray', DataTableArray)
            .component('JDataTableString', DataTableString)
            .component('JDataTableBoolean', DataTableBoolean)
            .component('JDataTableInteger', DataTableInteger)
            .component('JDataTableDouble', DataTableDouble)
            .component('JDataTableEnum', DataTableEnum)
            .component('JDataTableFile', DataTableFile)
            .component('JDataTableDate', DataTableDate)
            .component('JDataTableType', DataTableTypeSelect)
            .component('JDataTableObject', DataTableObject)
            .component('JDataTableMetrics', DataTableMetrics)
            .component('JEcharts', Echarts)
            .component('JEllipsis', Ellipsis)
            .component('JEmpty', Empty)
            .component('JFullPage', FullPage)
            .component('JGeoComponent', GeoComponent)
            .component('AIcon', AIcon)
            .component('JMonacoEditor', MonacoEditor)
            .component('JPermissionButton', PermissionButton)
            .component('JPopconfirmModal', PopconfirmModal)
            .component('JProLayout', ProLayout)
            .component('JPageContainer', PageContainer)
            .component('JProTable', ProTable)
            .component('JScrollbar', Scrollbar)
            .component('JSearch', Search)
            .component('JAdvancedSearch', AdvancedSearch)
            .component('JValueItem', ValueItem)
    }
}
