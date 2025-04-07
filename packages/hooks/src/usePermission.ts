import {watch, ref, inject, provide} from 'vue'
import type { Ref } from 'vue'
import { isBoolean } from "lodash-es";
import { ComponentsEnum } from '@jetlinks-web/constants'

export type PermissionCodeType = string | string[] | boolean
export const usePermission = (code?: Ref<PermissionCodeType>): {
  hasPerm: Ref<boolean>
} => {
  const hasPerm = ref(false)

  const { hasPermission } = inject<{ hasPermission?: (code: PermissionCodeType) => boolean}>(ComponentsEnum.Permission, {})

  watch(() => code.value, (v) => {
    if (v !== undefined) {
      hasPerm.value = isBoolean(v) ? v : (hasPermission?.(v) ?? false)
    }
  }, { immediate: true })

  return {
    hasPerm
  }
}

export const usePermissionContext = (context: any) => {
  provide(ComponentsEnum.Permission, context)
}
