import type {PropType} from "vue";
import { configProviderProps } from 'ant-design-vue/lib/config-provider/context';

export type MapConfigType = {
  mapStyle?: any
  JSKey?: string
  WebKey?: string
}
export const configProps = () => ({
  ...configProviderProps(),
  IconConfig: {
    type: Object as PropType<{ scriptUrl: string }>
  },
  MapConfig: {
    type: Object as PropType<MapConfigType>
  }
})
