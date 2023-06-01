import { ref } from 'vue'
import type { Ref } from 'vue'
import { store } from '@jetlinks/router'

export const usePermission = (code: string | string[] | boolean): {
  hasPerm: Ref<boolean>
} => {
  const hasPerm = ref(false)

  const hasPermissionFn = () => {
    // const authStore = store
  }

  if (code) {
    hasPermissionFn()
  }

  return {
    hasPerm
  }
}
