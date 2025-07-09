<template>
  <div class="jtable-box">
    <template v-if="mode === 'CARD'">
      <div class="jtable-card">
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
      <Table v-bind="props" :row-selection="rowSelection || _rowSelection" :dataSource="dataSource" :columns="_columns" :pagination="false" :scroll="_scroll" :class="{'j-table-scroll': !props.scroll?.y}">
        <template #headerCell="{ column, title }">
          <slot name="headerCell" v-bind="{column, title}"></slot>
        </template>
        <template #bodyCell="{ column, record, index }">
          <template
              v-if="(column?.key || column?.dataIndex) && column?.scopedSlots && (slots?.[column?.dataIndex] || slots?.[column?.key])">
            <slot :name="column?.key || column?.dataIndex" v-bind="record" :index="index" :column="column"></slot>
          </template>
          <template v-else>{{ get(record, column?.dataIndex || column?.key) || '--' }}</template>
        </template>
        <template #emptyText>
          <slot name="emptyText">
            <Empty/>
          </slot>
        </template>
        <template v-for="(_, slotKey) in slots" :key="slotKey" v-slot:[slotKey]="slotProps">
          <template v-if="!['headerCell', 'bodyCell', 'emptyText'].includes(slotKey)">
            <slot :name="slotKey" v-bind="slotProps"></slot>
          </template>
        </template>
      </Table>
    </template>
  </div>
</template>

<script setup lang="ts">
import {useSlots, computed, inject} from 'vue';
import {_contentProps} from "./setting";
import {Table} from 'ant-design-vue';
import {get} from 'lodash-es';
import Empty from '../Empty';
import { PROTABLE_ROW_SELECTION_KEY } from './hooks'

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

const _rowSelection = inject(PROTABLE_ROW_SELECTION_KEY, null)

const _columns = computed(() => props.columns.filter((i) => !i?.hideInTable))

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


const onClick = (item) => {
  if(_rowSelection && _rowSelection.value) {
    const _selected = _rowSelection.value?.selectedRowKeys?.includes(item[props.rowKey])
    _rowSelection.value?.onSelect?.(item, !_selected)
  }
}
</script>
