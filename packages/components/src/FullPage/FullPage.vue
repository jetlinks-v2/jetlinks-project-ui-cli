<template>
  <div
    class="full-page-warp"
    ref="fullPage"
    :style="{ minHeight: `calc(100vh - ${y + config.reduceHeight}px)` }"
  >
    <div class="full-page-warp-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { useElementBounding } from '@vueuse/core'
import {FullPageConfig} from "../utils/constants";

defineOptions({
  name: 'JFullPage'
})

const config = inject(FullPageConfig, { reduceHeight: 24 })

const fullPage = ref(null)
const { y } = useElementBounding(fullPage)

</script>

<style scoped lang="less">
.full-page-warp {
  background: #fff;
  display: flex;

  .full-page-warp-content {
    width: 100%;
  }
}
</style>
