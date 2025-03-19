<template>
  <div class="j-title" :style="style">
    <div class="j-title-content">{{ data }}</div>
    <slot name="extra"></slot>
  </div>
</template>

<script setup>
import { defineProps, defineOptions } from 'vue'

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
</script>
