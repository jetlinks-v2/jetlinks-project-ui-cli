import {computed, ref} from 'vue'
import type { Ref } from 'vue'
import { store } from '@jetlinks/router'
import {isBoolean} from "lodash-es";

export const usePermission = (code?: string | string[] | boolean): {
  hasPerm: Ref<boolean>
} => {
  const hasPerm = ref(false)

  computed(() => {
    if (code) {
      if (isBoolean(code)) {
        hasPerm.value = code
      } else {
        hasPerm.value = store.AuthStore.hasPermission(code)
      }
    }
  })

  return {
    hasPerm
  }
}
