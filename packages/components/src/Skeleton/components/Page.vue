<template>
  <div style="padding: 24px; background-color: #ffffff; height: 100%">
    <template v-if="type === 'list'">
      <List :loading="loading" active>
        <slot></slot>
      </List>
    </template>
    <template v-if="type === 'detail'">
      <Detail :loading="loading" active>
        <slot></slot>
      </Detail>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </div>
</template>

<script setup name="JSkeletonPage">
import List from "./List.vue";
import Detail from "./Detail.vue";
import {defineOptions} from "vue";

defineOptions({
  name: 'JSkeletonPage'
})

const props = defineProps({
  type: {
    type: String,
    default: 'list', // detail
  },
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
