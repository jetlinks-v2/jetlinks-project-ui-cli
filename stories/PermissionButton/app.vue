<script setup>
import { ComponentsEnum } from '@jetlinks-web/constants'
import { provide } from 'vue'

provide(ComponentsEnum.Permission, { hasPermission: (code) => {
  return code === 'device:add'
  }
})
</script>

<template>
  <div class="test-app">
    <slot /> <!-- 这里会渲染 stories -->
  </div>
</template>

<style scoped lang="less">

</style>
