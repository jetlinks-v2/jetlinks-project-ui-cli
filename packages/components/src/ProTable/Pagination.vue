<template>
  <div class="jtable-pagination">
    <slot>
      <Pagination
          v-bind="props"
          :total="total"
          :pageSize="pageSize"
          :current="pageIndex + 1"
          :show-total="(num) => _showTotal(num)"
          @change="onChange"
          :class="className"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { Pagination } from 'ant-design-vue';
import { _paginationProps } from "./setting";
import {computed} from 'vue';

defineOptions({
  name: 'Pagination'
})

const props = defineProps({ ..._paginationProps })
const emits = defineEmits(['change'])

const className = computed(() => {
  return {
    'show-content': !props.isShowContent,
  };
});
const _showTotal = (num: number) => {
  const minSize = props.pageIndex * props.pageSize + 1;
  const MaxSize = (props.pageIndex + 1) * props.pageSize;
  return `第 ${minSize} - ${ MaxSize > num ? num : MaxSize } 条/总共 ${num} 条`
}

const onChange = (page: number, size: number) => {
  emits('change', page, size)
}
</script>
