<script setup>

const props = defineProps({
  tooltip: {
    type: Object ,
  },
  popConfirm: {
    type: Object ,
  },
  hasPermission: {
    type: [String, Array, Boolean],
    default: undefined
  },
  style: {
    type: Object
  },
  noPermissionTitle: {
    type: String
  }
})
</script>

<template>
  <j-permission-button v-bind="props">{{ hasPermission ? '有权限': '无权限' }}</j-permission-button>
</template>

<style scoped lang="less">

</style>
