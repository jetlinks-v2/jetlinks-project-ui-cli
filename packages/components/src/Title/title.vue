<template>
  <div :class="['j-title', hashId]" :style="style">
    <div class="j-title-content">{{ data }}</div>
    <slot name="extra"></slot>
  </div>
</template>

<script setup>
import { defineProps, defineOptions, computed } from 'vue'
import useTitleStyle from './style'

defineOptions({
  name: 'JTitle'
})

const props = defineProps({
  data: {
    type: String,
    default: '',
  },
  style: {
    type: Object,
    default: () => ({}),
  },
});

const prefixCls = computed(() => 'j-title')
const [wrapSSR, hashId] = useTitleStyle(prefixCls)
</script>
