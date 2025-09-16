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
import {Pagination, Spin} from 'ant-design-vue';
import { _paginationProps } from "./setting";
import {computed, h} from 'vue';
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
  let localePage = contextLocale.value.pagination?.page || '';
  let localeTotal = contextLocale.value.pagination?.total || '';
  const _maxSize = props.totalLoading ? MaxSize : (MaxSize > num ? num : MaxSize);
  [minSize, _maxSize].forEach((item, index) => {
    localePage = localePage.replace(`{${index}}`, item)
  })
  return h('span', {}, [
    localePage,
    props.totalLoading
        ? h(Spin, { size: 'small', style: { margin: '0 4px' } })
        : h('span', {style: { margin: '0 4px' }}, num),
    localeTotal
  ])
}

const onChange = (page: number, size: number) => {
  emits('change', page, size)
}
</script>
