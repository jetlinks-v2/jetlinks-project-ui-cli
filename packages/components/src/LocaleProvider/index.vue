<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { provide, reactive } from "vue";
import defaultLocal from '../locale/zh-CN'

const props = defineProps({
  locale: {
    type: Object as PropType<Record<string, string>>,
  }
})
const state = reactive({
  antLocale: {
    ...props.locale || defaultLocal || {},
    exist: true,
  },
});

provide('componentLocaleData', state)
</script>

<style scoped lang="less">

</style>
