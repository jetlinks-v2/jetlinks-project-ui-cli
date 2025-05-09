<template>
  <template v-if="!loading">
    <slot></slot>
  </template>
  <div class="j-skeleton" v-else>
    <div class="j-skeleton-flex">
      <Item :active="active" width="100px" />
      <Item :active="active" width="100px" />
    </div>
    <div class="j-skeleton-cards">
      <template v-for="item in 9" :key="item">
        <ListCardItem />
      </template>
    </div>
  </div>
</template>

<script setup>
import Item from "./Item.vue";
import ListCardItem from "./ListCardItem.vue";
import {defineOptions} from "vue";

defineOptions({
  name: 'JSkeletonListCard'
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
