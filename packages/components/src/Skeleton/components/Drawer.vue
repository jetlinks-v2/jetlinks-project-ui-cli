<template>
  <template v-if="!loading">
    <slot></slot>
  </template>
  <div :class="['j-skeleton', hashId]">
    <Item :active="active" width="70%"/>
    <div class="j-skeleton-box">
      <Item :active="active" size="small" width="35%"/>
    </div>
    <div class="j-skeleton-desc">
      <div style="margin-top: 16px">
        <Item :active="active" width="300px"/>
      </div>
      <div class="j-skeleton-desc-content" style="grid-template-columns: repeat(2, 1fr);">
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
  name: 'JSkeletonDrawer'
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
