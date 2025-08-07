<template>
  <template v-if="!loading">
    <slot></slot>
  </template>
  <div :class="['j-skeleton', hashId]" v-else>
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
import {defineOptions, computed} from "vue";
import useSkeletonStyle from '../style';

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

const prefixCls = computed(() => 'j-skeleton')
const [wrapSSR, hashId] = useSkeletonStyle(prefixCls)
</script>
