<script setup>

const props = defineProps({
    layout: {
    type: String,
    default: 'horizontal'
  },
  options: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  column: {
    type: Number,
    default: 3,
  },
  value: {
    type: [String, Array],
    default: undefined,
  },
  itemLayout: {
    type: String,
    default: 'horizontal'
  }
})
</script>

<template>
  <j-card-select
    v-bind="props"
  />
</template>

<style scoped lang="less">

</style>
