<template>
  <div style="width: 300px">
    <j-ellipsis v-bind="props">
      <slot></slot>
    </j-ellipsis>
  </div>
</template>

<script setup>
const props = defineProps({
  expandTrigger: {
    type: String,
    default: undefined,
  },
  lineClamp: {
    type: [Number, String],
    default: 1,
  },
  tooltip: {
    type: [Boolean, Object],
    default: true,
  },
})
</script>

<style lang="less" scoped>

</style>
