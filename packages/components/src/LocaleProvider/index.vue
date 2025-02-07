<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { provide, reactive, watch, defineOptions } from "vue";
import defaultLocal from '../locale/zh-CN'

defineOptions({
  name: 'JLocaleProvider'
})

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

watch(() => props.locale, () => {
  state.antLocale = {
    ...props.locale || defaultLocal || {},
    exist: true,
  }
}, { deep: true })

provide('componentLocaleData', state)
</script>

<style scoped lang="less">

</style>
