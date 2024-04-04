import { watch, ref, inject} from 'vue'
import type { Ref } from 'vue'
import { isBoolean } from "lodash-es";
import { ComponentsEnum } from '@jetlinks-web/constants'

export type PermissionCodeType = string | string[] | boolean
export const usePermission = (code?: PermissionCodeType): {
  hasPerm: Ref<boolean>
} => {
  const hasPerm = ref(false)

  const { hasPermission } = inject<{ hasPermission: (code: PermissionCodeType) => boolean}>(ComponentsEnum.Permission)

  watch(() => code, () => {
    if (code) {
      hasPerm.value = isBoolean(code) ? code : hasPermission?.(code)
    }
  }, { immediate: true })

  return {
    hasPerm
  }
}
