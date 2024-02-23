import type {PropType} from "vue";
import { configProviderProps } from 'ant-design-vue/lib/config-provider/context';
export const configProps = () => ({
  ...configProviderProps(),
  IconConfig: {
    type: Object as PropType<{ scriptUrl: string }>
  }
})
