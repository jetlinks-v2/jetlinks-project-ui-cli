import type {PropType} from "vue";
import { configProviderProps } from 'ant-design-vue/es/config-provider/context';
import {PermissionButtonConfig} from "@jetlinks-web/constants";

export type MapConfigType = {
  mapStyle?: any
  JSKey?: string
  WebKey?: string
}

export type SearchConfigType = {
  align?: 'value' | 'label'
}

export type PermissionButtonConfigType = {
  components?: string
}

export type FullPageConfigType = {
  reduceHeight: Number
}

export const configProps = () => ({
  ...configProviderProps(),
  IconConfig: {
    type: Object as PropType<{ scriptUrl: string }>
  },
  MapConfig: {
    type: Object as PropType<MapConfigType>
  },
  SearchConfig: {
    type: Object as PropType<SearchConfigType>
  },
  PermissionButtonConfig: {
    type: Object as PropType<PermissionButtonConfigType>
  },
  FullPageConfig: {
    reduceHeight: Number
  }
})
