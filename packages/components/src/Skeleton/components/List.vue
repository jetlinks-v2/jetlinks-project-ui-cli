<template>
  <template v-if="!loading">
    <slot></slot>
  </template>
  <template v-else>
    <Search active />
    <ListCard v-if="mode !== 'TABLE'" />
    <ListTable v-else />
  </template>
</template>

<script setup>
import ListCard from "./ListCard.vue";
import ListTable from "./ListTable.vue";
import Search from "./Search.vue";
import {defineOptions,} from "vue";

defineOptions({
  name: 'JSkeletonList'
})

const props = defineProps({
  active: {
    type: Boolean,
    default: true,
  },
  loading: {
    type: Boolean,
    default: true,
  },
  mode: {
    type: [String, undefined],
    default: 'TABLE',
  },
})
</script>
