import {defineComponent, provide, reactive} from 'vue'
import { configProps } from './context'
import { ComponentsEnum } from '@jetlinks-web/constants'
import { ConfigProvider } from 'ant-design-vue'
import {omit} from 'lodash-es'
import Empty from '../Empty'

const JConfigProvider = defineComponent({
  name: 'JConfigProvider',
  inheritAttrs: false,
  props: {
    ...configProps()
  },
  setup(props, { slots }) {

    const IconConfig = reactive(props.IconConfig || {})

    provide(ComponentsEnum.Icon, IconConfig) // 全局Icon 配置
    // TODO 地图key配置

    return () => {
      return (
        <ConfigProvider
          {...omit(props, ['IconConfig'])}
          v-slots={{
            renderEmpty: () => (slots.renderEmpty?.() || <Empty />),
            ...slots,
          }}
        >
          { slots.default?.() }
        </ConfigProvider>
      )
    }
  }
})

JConfigProvider.config = ConfigProvider.config

export default JConfigProvider
