import {defineComponent, provide, reactive, h} from 'vue'
import { configProps } from './context'
import type { MapConfigType, SearchConfigType } from './context'
import {ComponentsEnum, MAPConfig, SearchConfig} from '@jetlinks-web/constants'
import { ConfigProvider } from 'ant-design-vue'
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

    console.log('_searchConfig', _searchConfig)

    provide(ComponentsEnum.Icon, _iconConfig) // 全局Icon 配置

    provide(MAPConfig, _mapConfig) // 全局地图配置

    provide(SearchConfig, _searchConfig) // 全局搜索配置

    return () => {

      return h(
        ConfigProvider,
        {...omit(props, ['IconConfig', 'MapConfig', 'SearchConfig'])},
        {
          default: slots.default,
          renderEmpty: () => (slots.renderEmpty?.() || <Empty />)
        }
      )
    }
  }
})

JConfigProvider.config = ConfigProvider.config


JConfigProvider.install = function (app: App) {
  app.component(JConfigProvider.name, JConfigProvider)
}

export default JConfigProvider
