<template>
  <template v-if="isPermission">

  </template>
  <j-tooltip v-else title="暂无权限，请联系管理员">
    <slot name="button">
      <j-button>
        <slot></slot>
        <template #ico>
          <slot name="icon"></slot>
        </template>
      </j-button>
    </slot>
  </j-tooltip>
</template>

<script setup lang="ts" name="PermissionButton">
import type { CSSProperties, PropType } from 'vue'
import { buttonProps } from 'ant-design-vue/es/button/button'
import { TooltipProps, PopconfirmProps } from 'ant-design-vue/es'
import { omit } from 'lodash-es'
import { usePermission } from './hooks'

const props = defineProps({
  tooltip: {
    type: Object as PropType<TooltipProps>,
  },
  popConfirm: {
    type: Object as PropType<PopconfirmProps>,
  },
  hasPermission: {
    type: String || Array || Boolean,
  },
  style: {
    type: Object as PropType<CSSProperties>
  },
  ...omit(buttonProps(), 'icon')
})

const { hasPerm } = usePermission(props.hasPermission)

</script>

<style scoped>

</style>
