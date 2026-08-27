<template>
  <div
    class="full-page-warp"
    ref="fullPage"
    :style="wrapStyle"
  >
    <div class="full-page-warp-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { theme } from 'ant-design-vue'
import { useElementBounding } from '@vueuse/core'
import {FullPageConfig} from "../utils/constants";

defineOptions({
  name: 'JFullPage'
})

const config = inject(FullPageConfig, { reduceHeight: 24 })

const fullPage = ref(null)
const { y } = useElementBounding(fullPage)
const { token } = theme.useToken()

const wrapStyle = computed(() => ({
  minHeight: `calc(100vh - ${y.value + config.reduceHeight}px)`,
  background: token.value.colorBgContainer,
}))

</script>

<style scoped lang="less">
.full-page-warp {
  display: flex;

  .full-page-warp-content {
    width: 100%;
  }
}
</style>
