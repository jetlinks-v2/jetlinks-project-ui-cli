<template>
  <div class="j-skeleton-flex-between">
    <div class="j-skeleton-flex">
      <Item :active="active" width="120px"/>
      <Item :active="active" width="120px"/>
      <Item :active="active" width="300px"/>
    </div>
    <div class="j-skeleton-flex">
      <Item :active="active" width="100px"/>
      <Item :active="active" width="100px"/>
      <Item :active="active" width="100px"/>
    </div>
  </div>
</template>

<script setup name="JSkeletonSearch">
import Item from "./Item.vue";

const props = defineProps({
  active: {
    type: Boolean,
    default: true,
  }
})
</script>
