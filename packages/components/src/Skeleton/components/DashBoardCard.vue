<template>
  <template v-if="!loading">
    <slot></slot>
  </template>
  <div class="j-skeleton" v-else>
    <div class="j-skeleton-dashboard-card">
      <Item :active="active" width="50%" />
      <div style="min-height: 0; flex: 1">
        <Item :active="active" size="large" width="120px" />
      </div>
      <Item :active="active" size="small" width="100%" />
    </div>
  </div>
</template>

<script setup>
import Item from './Item.vue'
import {defineOptions} from "vue";

defineOptions({
  name: 'JSkeletonDashboardCard'
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
