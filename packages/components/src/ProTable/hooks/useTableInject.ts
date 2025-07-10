import {PROTABLE_ROW_SELECTION_KEY} from "./useTableSelection";
import { inject } from "vue";
export const useTableInject = () => {
  return inject(PROTABLE_ROW_SELECTION_KEY, null)
}
