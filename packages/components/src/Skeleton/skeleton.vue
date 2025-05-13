<template>
  <div class="j-skeleton">
    <template v-if="!loading">
      <slot></slot>
    </template>
    <div class="j-skeleton-flex-column">
      <Item :active="active" width="40%"/>
      <template v-for="item in 3">
        <Item :active="active"/>
      </template>
      <Item :active="active" width="80%"/>
    </div>
  </div>
</template>

<script setup>
import Item from "./components/Item.vue";
import {defineOptions} from "vue";

defineOptions({
  name: 'JSkeleton'
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
