import {defineComponent, provide, reactive} from 'vue'
import { configProviderProps } from './context'
import { ComponentsEnum } from '@jetlinks-web/constants'

const ConfigProvider = defineComponent({
  name: 'JConfigProvider',
  inheritAttrs: false,
  props: configProviderProps(),
  setup(props, { slots }) {

    const IconConfig = reactive(props.IconConfig || {})

    provide(ComponentsEnum.Icon, IconConfig)

    return () => (<> { slots.default?.() }</>)
  }
})

export default ConfigProvider
