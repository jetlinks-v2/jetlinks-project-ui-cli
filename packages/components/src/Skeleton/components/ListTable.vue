<template>
  <div class="j-skeleton">
    <div class="j-skeleton-flex">
      <Item :active="active" width="100px"/>
      <Item :active="active" width="100px"/>
    </div>
    <div class="j-skeleton-table">
      <div
          v-for="item in 10"
          :key="item"
          class="j-skeleton-table-cell"
          :class="{'j-skeleton-table-header': item === 1}"
      >
        <div v-for="i in 4" :class="{'j-skeleton-table-action': i === 4}">
          <template v-if="i !== 4 || item === 1">
            <Item :active="active"/>
          </template>
          <template v-else>
            <template v-for="_i in 3">
              <Item :active="active"/>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Item from "./Item.vue";
import {defineOptions} from "vue";

defineOptions({
  name: 'JSkeletonListTable'
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
