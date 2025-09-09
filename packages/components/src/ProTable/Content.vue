<template>
  <div :class="['jtable-box', hashId]">
    <template v-if="mode === 'CARD'">
      <div class="jtable-card">
        <div style="margin-bottom: 10px" v-if="__rowSelection && __rowSelection.type === 'checkbox'">
          <a-checkbox :indeterminate="indeterminate" :checked="checkedAll"
                      @change="handleCheckedAllChange">{{ contextLocale.select.all }}
          </a-checkbox>
        </div>
        <div class="jtable-card-items" :style="{ gridTemplateColumns }" v-if="dataSource.length">
          <div :class="['jtable-card-item', props.cardBodyClass]" v-for="item in dataSource" :key="item[props.rowKey]" @click="onClick(item)">
            <slot name="card" v-bind="item"></slot>
          </div>
        </div>
        <div class="j-table-empty" v-else>
          <slot name="emptyText">
            <Empty/>
          </slot>
        </div>
      </div>
    </template>
    <template v-else>
      <Table v-bind="props" :row-selection="__rowSelection" :dataSource="dataSource" :columns="_columns" :pagination="false" :scroll="_scroll" :class="{'j-table-scroll': !props.scroll?.y}">
        <template v-for="(_, slotKey) in _slots" :key="slotKey" v-slot:[slotKey]="slotProps">
          <template v-if="!((column?.key || column?.dataIndex) && column?.scopedSlots && (_slots?.[column?.dataIndex] || _slots?.[column?.key]))">
            <slot :name="slotKey" v-bind="slotProps"></slot>
          </template>
        </template>
        <template #bodyCell="{ column, record, index }">
          <template v-if="(column?.key || column?.dataIndex) && column?.scopedSlots && (_slots?.[column?.dataIndex] || _slots?.[column?.key])">
            <slot :name="column?.key || column?.dataIndex" v-bind="record" :index="index" :column="column"></slot>
          </template>
          <template v-else>{{ get(record, column?.dataIndex || column?.key) || '--' }}</template>
        </template>
        <template #emptyText>
          <slot name="emptyText">
            <Empty />
          </slot>
        </template>
      </Table>
    </template>
  </div>
</template>

<script setup lang="ts">
import {useSlots, computed} from 'vue';
import {_contentProps} from "./setting";
import {Table} from 'ant-design-vue';
import {get, omit} from 'lodash-es';
import Empty from '../Empty';
import {useTableInject} from './hooks'
import useProTableStyle from './style'
import {useLocaleReceiver} from "../LocaleReciver";

defineOptions({
  name: 'Content'
})

const props = defineProps({
  ..._contentProps,
  column: {
    type: Number,
    default: 4
  }
})
const slots = useSlots()
const [contextLocale] = useLocaleReceiver('ProTable');
const prefixCls = computed(() => 'pro-table')
const [wrapSSR, hashId] = useProTableStyle(prefixCls)

const _rowSelection = useTableInject()

const _columns = computed(() => props.columns.filter((i) => !i?.hideInTable))

const _slots = computed(() => {
  return omit(slots, ['emptyText', 'bodyCell'])
})

const _scroll = computed(() => {
  if(props.scroll === false) {
    return {
      x: undefined,
      y: undefined
    }
  }

  return {
    x: props.scroll.x === false ? undefined : props.scroll.x || '100%',
    y: props.scroll.y === false ? undefined : props.scroll.y || '100%'
  }
})

const gridTemplateColumns = computed(() => {
  return `repeat(${props.column}, 1fr)`
})

const __rowSelection = computed(() => {
  return props.rowSelection || _rowSelection?.value
})

const indeterminate = computed(() => {
  return __rowSelection.value?.selectedRowKeys?.length > 0 && __rowSelection.value?.selectedRowKeys?.length < props.dataSource.length
})

const checkedAll = computed(() => {
  return __rowSelection.value?.selectedRowKeys?.length > 0 && __rowSelection.value?.selectedRowKeys?.length === props.dataSource.length
})

const onClick = (item) => {
  if(_rowSelection && _rowSelection.value) {
    const _selected = _rowSelection.value.selectedRowKeys?.includes(item[props.rowKey])
    _rowSelection.value.onSelect?.(item, !_selected)
  }
}
const handleCheckedAllChange = (e) => {
  const flag = e.target.checked;
  __rowSelection.value?.onSelectAll?.(flag, props.dataSource, props.dataSource)
}

</script>
