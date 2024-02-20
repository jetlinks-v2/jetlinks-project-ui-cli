import type {PropType} from "vue";

export const configProviderProps = () => ({
  IconConfig: {
    type: Object as PropType<{ scriptUrl: string }>
  }
})
