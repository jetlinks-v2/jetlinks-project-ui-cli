import {watch, ref, inject, provide, isRef} from 'vue'
import type { Ref } from 'vue'
import { isBoolean } from "lodash-es";
import { ComponentsEnum } from '@jetlinks-web/constants'

export type PermissionCodeType = string | string[] | boolean
export const usePermission = (code?: Ref<PermissionCodeType> | string): {
  hasPerm: Ref<boolean>
} => {
  const hasPerm = ref(false)

  const { hasPermission } = inject<{ hasPermission?: (code: PermissionCodeType) => boolean}>(ComponentsEnum.Permission, {})

  const changePerm = (v: PermissionCodeType | string) => {
    hasPerm.value = isBoolean(v) ? v : (hasPermission?.(v) ?? false)
  }

  if (!isRef(code)) {
    changePerm(code)
  }

  watch(() => {
    if (isRef(code)) {
      return code.value
    }
    return code
  }, (v) => {
    if (v !== undefined) {
      changePerm(v)
    }
  }, { immediate: true })

  return {
    hasPerm
  }
}

export const usePermissionContext = (context: any) => {
  provide(ComponentsEnum.Permission, context)
}
