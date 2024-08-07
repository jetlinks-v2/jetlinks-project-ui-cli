<template>
  <div
    v-if="dataSource.length"
    class="jetlinks-edit-table-body-viewport"
    :style="{ ...style, height: height + 'px'}"
    ref="viewScrollRef"
    @scroll="onScroll"
  >
    <div class="jetlinks-edit-table-body-container" :style="{position: 'relative'}">
      <div class="jetlinks-edit-scrollbar" :style="containerStyle"> </div>
      <div
        v-if="columnFixedMap.left.keys.length"
        class="jetlinks-edit-table-left"
        :style="{
          webkitTransform: `translate3d(0, ${virtualRang.start * props.cellHeight}px, 0)`,
          maxWidth: columnFixedMap.left.width + 'px',
          minWidth: columnFixedMap.left.width + 'px',
          width: columnFixedMap.left.width + 'px',
          boxShadow: tableTool.scrollMap.x ? '0 0 12px 0 rgba(0 ,0, 0, .2)' : ''
        }"
      >
        <div
          v-for="(item, index) in virtualData"
          :class="{
              'jetlinks-edit-table-row': true,
              'jetlinks-edit-table-row-selected': selectedRowKeys?.includes(item[rowKey] || virtualRang.start + index + 1),
              'jetlinks-edit-table-row-hover': hoverKeys === (item[rowKey] || virtualRang.start + index + 1)
            }"
          :key="'left' + index"
          :style="{height: `${cellHeight}px`}"
          :data-row-key="item[rowKey] || virtualRang.start + index + 1"
          @click.right.native="(e) => showContextMenu(e,item, virtualRang.start + index)"
          @click.stop="() => rowClick(item)"
          @mouseover="hoverKeys = (item[rowKey] || virtualRang.start + index + 1)"
          @mouseleave="hoverKeys = undefined"
        >
          <div
            v-for="column in columnFixedMap.left.keys"
            class="jetlinks-edit-table-cell"
            :style="{
                width: `${column._width}px`,
              }"
          >
            <div class="body-cell-box">
              <slot :name="column.dataIndex" :record="item" :index="item.__dataIndex" :column="column" >
                {{ column.dataIndex === '__serial' ?  virtualRang.start + index + 1 : item[column.dataIndex] }}
              </slot>
            </div>
          </div>
        </div>
      </div>
      <div
        class="jetlinks-edit-table-center"
        :style="{
          webkitTransform: `translate3d(-${tableTool.scrollMap.x}px, ${virtualRang.start * props.cellHeight}px, 0)`
        }"
      >
        <div :style="{width: columnFixedMap.center.width + 'px'}">
          <div
            v-if="virtualData.length"
            v-for="(item, index) in virtualData"
            :class="{
              'jetlinks-edit-table-row': true,
              'jetlinks-edit-table-row-selected': selectedRowKeys?.includes(item[rowKey] || virtualRang.start + index + 1),
              'jetlinks-edit-table-row-hover': hoverKeys === (item[rowKey] || virtualRang.start + index + 1)
            }"
            :key="'center' + index"
            :style="{height: `${cellHeight}px`,}"
            :data-row-key="item[rowKey] || virtualRang.start + index + 1"
            @click.right.native="(e) => showContextMenu(e,item, virtualRang.start + index)"
            @click.stop="() => rowClick(item)"
            @mouseover="hoverKeys = (item[rowKey] || virtualRang.start + index + 1)"
            @mouseleave="hoverKeys = undefined"
          >
            <div
              v-for="column in columnFixedMap.center.keys"
              class="jetlinks-edit-table-cell"
              :style="{
                width: `${column._width}px`,
              }"
            >
              <div class="body-cell-box">
                <slot :name="column.dataIndex" :record="item" :index="item.__dataIndex" :column="column" >
                  {{ column.dataIndex === '__serial' ?  virtualRang.start + index + 1 : item[column.dataIndex] }}
                </slot>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="columnFixedMap.right.keys.length"
        class="jetlinks-edit-table-right"
        :style="{
          webkitTransform: `translate3d(0, ${virtualRang.start * props.cellHeight}px, 0)`,
          maxWidth: columnFixedMap.right.width + 'px',
          minWidth: columnFixedMap.right.width + 'px',
          width: columnFixedMap.right.width + 'px',
          boxShadow: tableTool.scrollMap.down !== 'right' ? '0 0 12px 0 rgba(0 ,0, 0, .2)' : ''
        }"
      >
        <div
          v-for="(item, index) in virtualData"
          :class="{
              'jetlinks-edit-table-row': true,
              'jetlinks-edit-table-row-selected': selectedRowKeys?.includes(item[rowKey] || virtualRang.start + index + 1),
              'jetlinks-edit-table-row-hover': hoverKeys === (item[rowKey] || virtualRang.start + index + 1)
            }"
          :key="'right' + index"
          :style="{height: `${cellHeight}px`}"
          :data-row-key="item[rowKey] || virtualRang.start + index + 1"
          @click.right.native="(e) => showContextMenu(e,item, virtualRang.start + index)"
          @click.stop="() => rowClick(item)"
          @mouseover="hoverKeys = (item[rowKey] || virtualRang.start + index + 1)"
          @mouseleave="hoverKeys = undefined"
        >
          <div
            v-for="column in columnFixedMap.right.keys"
            class="jetlinks-edit-table-cell"
            :style="{
                width: `${column._width}px`,
              }"
          >
            <div class="body-cell-box">
              <slot :name="column.dataIndex" :record="item" :index="item.__dataIndex" :column="column" >
                {{ column.dataIndex === '__serial' ?  virtualRang.start + index + 1 : item[column.dataIndex] }}
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <template v-else>
    <slot name="empty">
      <div class="jetlinks-edit-table-body-empty">
        <j-empty />
      </div>
    </slot>
  </template>
</template>

<script setup>
import ContextMenu from './components/ContextMenu'
import {useRightMenuContext, useTableTool} from "./hooks";
import {randomString} from "@jetlinks-web/utils";
import {bodyProps, defaultProps} from "./props";
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, defineExpose} from 'vue'
import {handleColumnFixed} from "./utils";

defineOptions({
  name: 'JEditTableBody'
})

const props = defineProps({
  ...defaultProps(),
  ...bodyProps(),
  groupKey: {
    type: [String, Number],
    default: undefined
  }
})

const emit = defineEmits(['update:dataSource', 'scrollDown'])

const viewScrollRef = ref()
const virtualRang = reactive({
  start: 0,
  end: 15
})
const containerStyle = ref(0)
const context = useRightMenuContext()
const tableTool = useTableTool()

const selectedRowKeys = ref([])
const hoverKeys = ref()
const scrollLock = ref(false)
let menuInstance

const maxLen = computed(() => {
  return Math.trunc(props.height / props.cellHeight)
})

const virtualData = computed(()=> props.dataSource.slice(virtualRang.start, virtualRang.end))

const columnFixedMap = computed(() => {
  return handleColumnFixed(props.columns)
})

const onScroll = () => {
  if (!viewScrollRef.value) return

  const height = viewScrollRef.value.scrollTop
  const clientHeight = viewScrollRef.value.clientHeight
  const scrollHeight = viewScrollRef.value.scrollHeight

  const _index = Math.round(height / props.cellHeight) - 1


  const start = _index < 0 ? 0 : _index
  const end = start + maxLen.value + 4

  if (height + clientHeight >= props.dataSource.length * props.cellHeight && !scrollLock.value) { // 滚动到底
    emit('scrollDown')
    scrollLock.value = true
  }

  virtualRang.start = start
  virtualRang.end = end
  // updateVirtualData(start, end)
}

const scrollTo = (index) => {
  if (viewScrollRef.value) {
    let top = index * props.cellHeight
    viewScrollRef.value.scrollTop = top
  }
}

const showContextMenu = (e, record, _index) => {
  e.preventDefault()
  if (!props.disableMenu) {
    record = {
      ...record,
      __index: _index
    }
    menuInstance = ContextMenu(e, record, context)
  }
}

const rowClick = (record) => {
  if (props.rowSelection?.selectedRowKeys) {
    const rowSet = new Set(selectedRowKeys.value)
    const key = record[props.rowKey]
    const selected = !rowSet.has(key)

    if (selected) {
      rowSet.delete(key)
    } else {
      rowSet.add(key)
    }

    props.rowSelection.onSelect?.(record, selected )

    selectedRowKeys.value = [...rowSet.values()]
  }
}

const updateSelectedKeys = (keys) => {
  selectedRowKeys.value = keys
}

const getViewScrollRef = () => viewScrollRef.value

watch(() => JSON.stringify(props.rowSelection?.selectedRowKeys), (val) => {
  selectedRowKeys.value = JSON.parse(val || '[]')
}, { immediate: true })

watch(() => props.dataSource, (val, oldVal) => {

  props.dataSource.forEach((item, index) => {
    if (!item.__key) {
      item.__key = randomString()
    }
  })

}, {
  immediate: true,
  deep: true
})

watch(() => props.dataSource.length, () => {
  scrollLock.value = false
  containerStyle.value = {
    height: props.dataSource.length * props.cellHeight + 'px'
  }

  if (props.dataSource.length <= maxLen.value || props.dataSource.length === 0) {
    emit('scrollDown', maxLen.value - props.dataSource.length + 3)
  }
}, { immediate: true})

// watch(() => props.height, () => {
//   updateView()
// })

onMounted(() => {
  nextTick(() => {
    onScroll()
  })
})

onBeforeUnmount(() => {
  menuInstance?.destroy()
  menuInstance?.cleanCopy()
})

defineExpose({
  scrollTo,
  updateSelectedKeys,
  getViewScrollRef
})

</script>
