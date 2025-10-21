<template>
  <div :class="['virtual-table-wrapper', hashId]">
    <div class="virtual-table-header">
      <Table
          :columns="_columns"
          :pagination="false"
          :rowKey="rowKey"
          :data-source="[]"
          :components="{
            body: {
               wrapper: () => h('div')
            },
          }"
      >
        <template #headerCell="{ column, title }">
          <template v-if="column.key === '__selection__'">
                    <span class="virtual-table-all-selected">
                      <Checkbox
                          v-model:checked="selectedAll"
                          @change="onSelectedAllChange"
                          v-if="rowSelection.type !== 'radio' && !rowSelection.hideSelectAll"
                          :indeterminate="_indeterminate"
                          :disabled="visibleRows.length === 0"
                      />
                      <span>{{ rowSelection?.columnTitle }}</span>
                    </span>
          </template>
          <template v-else>
            <slot name="headerCell" :title="title" :column="column">
              {{ title }}
            </slot>
          </template>
        </template>
      </Table>
    </div>
    <div class="virtual-table-body" ref="container" @scroll="onScroll" :style="{height: `${viewportHeight}px`}">
      <div class="virtual-table-height" :style="{height: totalHeight + 'px'}"></div>
      <div class="virtual-table-visible-box"
           :style="{ transform: `translateY(${offsetY}px)`, position: 'absolute', top: 0, left: 0, right: 0 }">
        <Table :columns="columns" :rowKey="rowKey" :data-source="visibleRows" :showHeader="false" :pagination="false"
                 :rowSelection="_rowSelection">
          <template #bodyCell="{text, record, index, column}">
            <template v-if="column.dataIndex === firstColumn.dataIndex || column.key === firstColumn.key">
              <span class="ant-table-row-indent indent-level-3" :style="{paddingLeft: `${record.level * 15}px`}"></span>
              <span
                  class="virtual-table-row-expand-icon"
                  @click="toggleExpand(record)"
              >
                <AIcon v-if="record.hasChildren"
                       :type="!record.expanded ? 'PlusSquareOutlined' : 'MinusSquareOutlined'"/>
              </span>
            </template>
            <slot name="bodyCell" :text="text" :record="record" :index="index" :column="column">
              {{ text || '--' }}
            </slot>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>

<script setup>
import {findAllChildren, flattenTree} from "./data";
import {isNumber, map, omit} from "lodash-es";
import {defineOptions, h, computed, ref, watch, onMounted, defineEmits, defineProps, nextTick} from 'vue'
import {Table, Checkbox} from 'ant-design-vue';
import AIcon from '../Icon';
import useVirtualTableStyle from './style'
import {useLocaleReceiver} from "../LocaleReciver";

const props = defineProps({
  dataSource: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    default: () => []
  },
  expandedRowKeys: {
    type: Array,
    default: () => []
  },
  rowSelection: {
    type: Object
  },
  rowKey: {
    type: [String, Function],
    default: 'id',
  },
  height: {
    type: Number,
    default: 500
  }
})

const emits = defineEmits(['update:expandedRowKeys'])

defineOptions({
  name: 'JVirtualTable'
})

const prefixCls = computed(() => 'virtual-table')
const [wrapSSR, hashId] = useVirtualTableStyle(prefixCls)
const [contextLocale] = useLocaleReceiver('ProTable');

const container = ref(null)
const rowHeights = ref([])
const prefixSum = ref([])
const start = ref(0)
const end = ref(15)
const offsetY = ref(0)
const buffer = 5
const selectedAll = ref(false)
// 被展开的所有数据
const visibleNodes = ref([])
const flattenData = ref([])

const firstColumn = computed(() => props.columns[0])

const totalHeight = computed(() => prefixSum.value.length ? prefixSum.value[prefixSum.value.length - 1] : 0)

const visibleRows = computed(() => visibleNodes.value.slice(start.value, end.value))

const _indeterminate = computed(() => !selectedAll.value && props.rowSelection?.selectedRowKeys?.length > 0)

const viewportHeight = computed(() => props.height || 500)

const _columns = computed(() => {
  const arr = []
  if (props.rowSelection) {
    const _width = props.rowSelection.columnWidth || 32
    arr.push({
      key: '__selection__',
      title: contextLocale.value.select.all,
      dataIndex: '__selection__',
      width: isNumber(_width) ? `${_width}px` : _width,
      customHeaderCell: (props) => {
        return {
          class: 'ant-table-selection-column',
        }
      }
    }) //
  }
  arr.push(...props.columns)
  return arr
})

const _rowSelection = computed(() => {
  return props.rowSelection ? {
    ...props.rowSelection,
    onSelect: (record, selected, selectedRows, nativeEvent) => {
      const _selectedRowKeys = props.rowSelection.selectedRowKeys || []
      const _set = new Set([..._selectedRowKeys])
      if (props.rowSelection.type === 'radio') {
        _set.clear()
        _set.add(record[props.rowKey])
      } else {
        const _checkStrictly = props.rowSelection.checkStrictly !== undefined ? props.rowSelection.checkStrictly : true
        let __arr = []
        if (_checkStrictly) { // 需要获取子
          __arr = [record[props.rowKey]]
        } else {
          __arr = map(findAllChildren(flattenData.value, record[props.rowKey]), props.rowKey)
          __arr.push(record[props.rowKey])
        }
        if (selected) {
          __arr.forEach(i => _set.add(i))
        } else {
          __arr.forEach(i => _set.delete(i))
        }
      }
      const _selectedRows = flattenData.value.filter(i => _set.has(i[props.rowKey])).map(item => omit(item, ['expanded', 'hasChildren', 'visible']))
      if (props.rowSelection.onSelect) {
        props.rowSelection.onSelect(record, selected, _selectedRows, nativeEvent)
      }
      if (props.rowSelection.onChange) {
        props.rowSelection.onChange([..._set], _selectedRows)
      }
    },
    onChange: () => {
    },
    onSelectAll: () => {
    },
    onSelectNone: () => {
      if (props.rowSelection.onSelectNone) {
        props.rowSelection.onSelectNone()
      }
    }
  } : undefined
})

const onSelectedAllChange = (e) => {
  const selected = e.target.checked
  const arr = flattenData.value.map(i => omit(i, ['expanded', 'hasChildren', 'visible']))
  const _checked = selected
  const _selectedRowKeys = _checked ? map(arr, props.rowKey) : []
  if (props.rowSelection.onSelectAll) {
    props.rowSelection.onSelectAll(_checked, _checked ? arr : [],)
  }
  if (props.rowSelection.onChange) {
    props.rowSelection.onChange(_selectedRowKeys, _checked ? arr : [])
  }
}

const onScroll = (e) => {
  const scrollTop = e.target.scrollTop
  const vh = viewportHeight.value || 500

  // 二分查找
  let low = 0, high = prefixSum.value.length - 1
  while (low < high) {
    let mid = Math.floor((low + high) / 2)
    if (prefixSum.value[mid] <= scrollTop) low = mid + 1
    else high = mid
  }
  start.value = Math.max(0, low - 1)

  // 计算 end
  let y = prefixSum.value[start.value] || 0
  let i = start.value
  while (i < visibleNodes.value.length && y < scrollTop + vh) {
    y += rowHeights.value[i] || 40
    i++
  }
  end.value = Math.min(i + buffer, visibleNodes.value.length)

  offsetY.value = prefixSum.value[start.value - 1] || 0
}

const toggleExpand = (row) => {
  row.expanded = !row.expanded
  const stack = [...flattenData.value.filter(n => n.parentId === row[props.rowKey])]
  while (stack.length) {
    const child = stack.pop()
    child.visible = row.expanded
    if (!child.visible) {
      child.expanded = false
    }
    if (!row.expanded && child.hasChildren) {
      stack.push(...flattenData.value.filter(n => n.parentId === child[props.rowKey]))
    }
  }
  updateVisibleNodes()
}

const updatePrefixSum = () => {
  rowHeights.value = visibleNodes.value.map(() => 40) // 默认行高
  prefixSum.value = []
  let sum = 0
  for (let h of rowHeights.value) {
    sum += h
    prefixSum.value.push(sum)
  }
}
const updateVisibleNodes = () => {
  visibleNodes.value = flattenData.value.filter(i => i.visible)
  updatePrefixSum()
  nextTick(() => onScroll({target: container.value}))
}

watch(() => [JSON.stringify(props.dataSource), JSON.stringify(props.expandedRowKeys)], () => {
  flattenData.value = flattenTree(props.dataSource, 0, null)
  flattenData.value.forEach(i => {
    if (props.expandedRowKeys.includes(i[props.rowKey])) {
      toggleExpand(i)
      // i.expanded = true
    }
  })
  updateVisibleNodes()
}, {
  immediate: true
})

// watch(() => props.expandedRowKeys, () => {
//   flattenData.value.forEach(i => {
//     if (props.expandedRowKeys.includes(i[props.rowKey])) {
//       toggleExpand(i)
//       // i.expanded = true
//     }
//   })
//   updateVisibleNodes()
// }, {
//   immediate: true
// })

watch(() => props.rowSelection?.selectedRowKeys, (val) => {
  if (val) {
    selectedAll.value = val.length > 0 && flattenData.value.length === val.length
  }
}, {
  immediate: true
})

onMounted(() => {
  updateVisibleNodes()
})
</script>
