import {defineComponent, provide, reactive, h} from 'vue'
import { configProps } from './context'
import type { MapConfigType } from './context'
import { ComponentsEnum, MAPConfig } from '@jetlinks-web/constants'
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

    provide(ComponentsEnum.Icon, _iconConfig) // 全局Icon 配置

    provide(MAPConfig, _mapConfig) // 全局地图配置

    return () => {

      return h(
        ConfigProvider,
        {...omit(props, ['IconConfig', 'MapConfig'])},
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
