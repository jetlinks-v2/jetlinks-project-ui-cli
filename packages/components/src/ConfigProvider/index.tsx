import {defineComponent, provide, reactive, h} from 'vue'
import {configProps, PermissionButtonConfigType} from './context'
import type { MapConfigType, SearchConfigType,FullPageConfigType,TableConfigType } from './context'
import {
  ComponentsEnum,
  MAPConfig,
  PermissionButtonConfig,
  SearchConfig,
  FullPageConfig, TableConfig
} from '../utils/constants'
import { ConfigProvider } from 'ant-design-vue'
import LocaleProvider from '../LocaleProvider/index.vue'
import {omit} from 'lodash-es'
import Empty from '../Empty'
import type { App } from 'vue';

const JConfigProvider = defineComponent({
  name: 'JConfigProvider',
  inheritAttrs: false,
  props: {
    ...configProps()
  },
  setup(props, { slots }) {

    const _iconConfig = reactive(props.IconConfig || {})
    const _mapConfig = reactive<MapConfigType>(props.MapConfig || {})
    const _searchConfig = reactive<SearchConfigType>(props.SearchConfig || {})
    const _PermissionButtonConfig = reactive<PermissionButtonConfigType>(props.PermissionButtonConfig || {})
    const _FullPageConfig = reactive<FullPageConfigType>(props.FullPageConfig || {})
    const _TableConfig = reactive<TableConfigType>(props.TableConfig || {})

    provide(ComponentsEnum.Icon, _iconConfig) // 全局Icon 配置

    provide(MAPConfig, _mapConfig) // 全局地图配置

    provide(SearchConfig, _searchConfig) // 全局搜索配置

    provide(PermissionButtonConfig, _PermissionButtonConfig) // 权限组件

    provide(FullPageConfig, _FullPageConfig) // 权限组件

    provide(TableConfig, _TableConfig) // ProTable配置

    return () => {

      return h(
        ConfigProvider,
        {...omit(props, ['IconConfig', 'MapConfig', 'SearchConfig'])},
        [h(
          LocaleProvider,
          {locale: props.componentsLocale},
          {
            default: slots.default,
            renderEmpty: () => (slots.renderEmpty?.() || <Empty />),
          }
        )]
      )
    }
  }
})

JConfigProvider.config = ConfigProvider.config


JConfigProvider.install = function (app: App) {
  app.component(JConfigProvider.name, JConfigProvider)
}

export default JConfigProvider
