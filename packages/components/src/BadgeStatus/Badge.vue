<template>
  <Badge
    :color="_color"
    :text="text"
  ></Badge>
</template>

<script setup lang="ts">
import { computed, defineProps, defineOptions } from 'vue'
import { getHexColor } from './color'
import {Badge} from 'ant-design-vue'

defineOptions({
  name: 'JBadgeStatus'
})

const props = defineProps({
  text: {
    type: String,
  },
  status: {
    type: [String, Number],
    default: 'default',
  },
  /**
   * 自定义status值颜色
   * @example {
   *   1: 'success',
   *   0: 'error'
   * }
   */
  statusNames: {
    type: Object,
    default: () => ({
      'success': 'success',
      'warning': 'warning',
      'error': 'error',
      'default': 'default',
    })
  },
});

const _color = computed(() => {
  return getHexColor(props.statusNames[props.status], 1)
})
</script>
