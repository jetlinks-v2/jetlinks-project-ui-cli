<template>
  <div class="jtable-pagination">
    <slot>
      <Pagination
          :total="total"
          :pageSize="pageSize"
          :current="pageIndex + 1"
          :show-total="(num) => _showTotal(num)"
          @change="onChange"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { Pagination } from 'ant-design-vue';
import { paginationProps } from "./setting";

defineOptions({
  name: 'Pagination'
})

const props = defineProps({ ...paginationProps })
const emits = defineEmits(['change'])
const _showTotal = (num: number) => {
  const minSize = props.pageIndex * props.pageSize + 1;
  const MaxSize = (props.pageIndex + 1) * props.pageSize;
  return `第 ${minSize} - ${ MaxSize > num ? num : MaxSize } 条/总共 ${num} 条`
}

const onChange = (page: number, size: number) => {
  emits('change', page, size)
}
</script>
