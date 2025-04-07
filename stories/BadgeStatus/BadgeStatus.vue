<script setup>

const props = defineProps({
  statusText: {
    type: String,
    default: '正常',
  },
  status: {
    type: [String, Number],
    default: 'default',
  },
  statusNames: {
    type: Object,
    default: () => ({
      'success': 'success',
      'warning': 'warning',
      'error': 'error',
      'default': 'default',
    })
},
})
</script>

<template>
  <j-badge-status
    :status="status"
    :text="statusText"
    :statusNames="statusNames"
  />
</template>

<style scoped lang="less">

</style>
