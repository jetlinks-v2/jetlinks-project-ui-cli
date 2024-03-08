<template>
  <j-badge
    :color="_color"
    :text="text"
  ></j-badge>
</template>

<script setup lang="ts" name="BadgeStatus">
import { computed } from 'vue'
import { getHexColor } from './color'

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
  return getHexColor(props.status, props.statusNames, 1)
})
</script>
