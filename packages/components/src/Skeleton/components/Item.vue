<template>
  <div :class="_className" :style="sizeStyle"></div>
</template>

<script setup name="Item">
import { computed } from 'vue'

const props = defineProps({
  active: {
    type: Boolean,
    default: true,
  },
  size: {
    type: [String, Number], // 'large' | 'small' | 'default' | number,
    default: 'default',
  },
  width: {
    type: [String, Number],
    default: '100%',
  }
})

const _className = computed(() => {
  const { active, size } = props
  return {
    'j-skeleton-item': true,
    'j-skeleton-item-active': active,
    'j-skeleton-item-lg': size === 'large',
    'j-skeleton-item-sm': size === 'small',
  }
})

const sizeStyle = computed(() => {
  const { size, width } = props
  if (typeof size === 'number') {
    return {
      height: `${size}px`,
      width: `${width}px`,
    }
  } else {
    return {
      width: typeof size === 'number' ? `${width}px` : width,
    }
  }
})
</script>
