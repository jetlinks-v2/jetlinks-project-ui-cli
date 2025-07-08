<template>
  <template v-if="!loading">
    <slot></slot>
  </template>
  <div class="j-skeleton" v-else>
    <div class="j-skeleton-flex">
      <Item :active="active"/>
    </div>
    <div class="j-skeleton-flex">
      <Item :active="active" width="100px"/>
    </div>
    <template v-for="item in 6">
      <div class="j-skeleton-flex">
        <Item :active="active" size="small"/>
      </div>
    </template>
    <div class="j-skeleton-flex">
      <Item :active="active" size="small" width="140px"/>
    </div>
  </div>
</template>

<script setup>
import Item from "./Item.vue";
import {defineOptions} from "vue";

defineOptions({
  name: 'JSkeletonTree'
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

