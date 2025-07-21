<template>
  <div :class="['jtable-pagination', hashId]">
    <slot>
      <Pagination
          v-bind="props"
          :total="total"
          :pageSize="pageSize"
          :current="pageIndex + 1"
          :show-total="(num) => _showTotal(num)"
          :class="className"
          @change="onChange"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { Pagination } from 'ant-design-vue';
import { _paginationProps } from "./setting";
import {computed} from 'vue';
import {useLocaleReceiver} from "../LocaleReciver";
import useProTableStyle from './style'

defineOptions({
  name: 'JPagination'
})

const props = defineProps({ ..._paginationProps })
const emits = defineEmits(['change'])

const [contextLocale] = useLocaleReceiver('ProTable');

const prefixCls = computed(() => 'pro-table')
const [wrapSSR, hashId] = useProTableStyle(prefixCls)

const className = computed(() => {
  return {
    'hide-content': !props.isShowContent,
  };
});
const _showTotal = (num: number) => {
  const minSize = props.pageIndex * props.pageSize + 1;
  const MaxSize = (props.pageIndex + 1) * props.pageSize;
  // return `第 ${minSize} - ${ MaxSize > num ? num : MaxSize } 条/总共 ${num} 条`
  let locale = contextLocale.value.pagination?.total || '';
  [minSize, MaxSize > num ? num : MaxSize, num].forEach((item, index) => {
    locale = locale.replace(`{${index}}`, item)
  })
  return locale
}

const onChange = (page: number, size: number) => {
  emits('change', page, size)
}
</script>
