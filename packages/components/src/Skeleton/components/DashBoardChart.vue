<template>
  <template v-if="!loading">
    <slot></slot>
  </template>
  <div class="j-skeleton" v-else>
    <div class="j-skeleton-dashboard-card">
      <div class="j-skeleton-flex-between">
        <Item :active="active" width="200px"/>
        <Item :active="active" width="150px"/>
      </div>
      <div style="width: 100%; height: 200px">
        <svg
            viewBox="0 0 800 200"
            preserveAspectRatio="none"
            style="width: 100%; height: 100%; display: block;"
        >
        <!-- 坐标轴（4px宽度，#f0f2f5颜色） -->
        <path d="M0 150 L800 150" stroke="#f0f2f5" stroke-width="4" stroke-opacity="0.8"/> <!-- X轴 -->
        <path d="M0 150 L0 50" stroke="#f0f2f5" stroke-width="4" stroke-opacity="0.8"/>   <!-- Y轴 -->

        <!-- 两条曲线 -->
        <path d="M0 100 C200 30, 600 170, 800 100"
              stroke="#f0f2f5" fill="none" stroke-width="4"/>
        <path d="M0 120 C200 60, 600 140, 800 80"
              stroke="#f0f2f5" fill="none" stroke-width="4"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import Item from './Item.vue'
import {defineOptions} from "vue";

defineOptions({
  name: 'JSkeletonDashboardChart'
})

const props = defineProps({
  active: {
    type: Boolean,
    default: true,
  },
  loading: {
    type: Boolean,
    default: true,
  }
})
</script>
