import {watch, ref} from 'vue'
import type { Ref } from 'vue'
import { store } from '@jetlinks/stores'
import {isBoolean} from "lodash-es";

export const usePermission = (code?: string | string[] | boolean): {
  hasPerm: Ref<boolean>
} => {
  const hasPerm = ref(false)

  watch(() => code, () => {
    if (code) {
      hasPerm.value = isBoolean(code) ? code : store.AuthStore.hasPermission(code)
    }
  }, { immediate: true })

  return {
    hasPerm
  }
}
