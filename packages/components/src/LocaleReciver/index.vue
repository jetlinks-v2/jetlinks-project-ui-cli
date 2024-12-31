<template>

</template>

<script setup lang="ts">
const props = defineProps({
  componentName: {
    type: String
  },
  defaultLocale: {
    type: [Object, Function]
  },
  children: {
    type: [Object, Function]
  }
})
</script>

<style scoped lang="less">

</style>
