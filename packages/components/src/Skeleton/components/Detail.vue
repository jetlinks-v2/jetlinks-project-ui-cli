<template>
  <template v-if="!loading">
    <slot></slot>
  </template>
  <div :class="['j-skeleton', hashId]" v-else>
    <div class="j-skeleton-flex">
      <Item :active="active" width="40%"/>
    </div>
    <div class="j-skeleton-flex">
      <Item :active="active" size="small" width="15%"/>
      <Item :active="active" size="small" width="15%"/>
    </div>
    <div class="j-skeleton-tabs">
      <div v-for="item in 5" :key="item" class="j-skeleton-flex">
        <Item :active="active" size="small" width="80px"/>
      </div>
    </div>

    <div v-for="item in 2" class="j-skeleton-desc" :key="item">
      <div class="j-skeleton-item j-skeleton-item-large" style="width: 300px"></div>
      <div class="j-skeleton-desc-content">
        <div v-for="i in 10" class="j-skeleton-desc-item" :key="i">
          <Item :active="active" size="small" width="40%"/>
          <Item :active="active" size="small" width="60%"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Item from "./Item.vue";
import {defineOptions, computed} from "vue";
import useSkeletonStyle from '../style';
defineOptions({
  name: 'JSkeletonDetail'
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
