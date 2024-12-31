<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { provide, reactive } from "vue";

const props = defineProps({
  locale: {
    type: Object as PropType<Record<string, string>>,
  }
})
const state = reactive({
  antLocale: {
    ...props.locale,
    exist: true,
  },
});

console.log(state);
provide('componentLocaleData', state)
</script>

<style scoped lang="less">

</style>
