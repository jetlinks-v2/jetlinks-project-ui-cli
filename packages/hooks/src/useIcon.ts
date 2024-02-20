import {inject} from "vue";
import { ComponentsEnum } from '@jetlinks-web/constants'

export const useIcon = () => {
  return inject(ComponentsEnum.Icon, {}) as  { scriptUrl: string}
}
