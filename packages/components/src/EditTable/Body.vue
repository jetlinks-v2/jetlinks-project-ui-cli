<template>
  <div
    v-if="dataSource.length"
    ref="viewScrollRef"
    class="jetlinks-edit-table-body-viewport"
    :style="{ ...style, height: height + 'px'}"
    @scroll="onScroll"
  >
    <div :style="{position: 'relative'}">
      <div class="jetlinks-edit-scrollbar" :style="containerStyle"> </div>
      <div class="jetlinks-edit-table-center" ref="tableCenterRef" >
        <div
          v-if="virtualData.length"
          v-for="(item, index) in virtualData"
          :class="{
              'jetlinks-edit-table-row': true,
              'jetlinks-edit-table-row-selected': selectedRowKeys?.includes(item[rowKey] || virtualRang.start + index + 1)
            }"
          :key="`record_${item.__key}`"
          :style="{height: `${cellHeight}px`,}"
          :data-row-key="item[rowKey] || virtualRang.start + index + 1"
          @click.right.native="(e) => showContextMenu(e,item, virtualRang.start + index)"
          @click.stop="() => rowClick(item)"
        >
          <div
            v-for="(column, __index) in columns"
            class="jetlinks-edit-table-cell"
            :style="{
                width: `${column.width}px`,
                left: `${column.left || 200 * __index}px`,
              }"
          >
            <div v-if="column.dataIndex === '__serial'" class="body-cell-box">
              <slot name="serial" :record="item" :index="item.__dataIndex" :column="column" >
                {{ virtualRang.start + index + 1 }}
              </slot>
            </div>
            <div v-else class="body-cell-box">
              <slot :name="column.dataIndex" :record="item" :index="item.__dataIndex" :column="column" >
                {{ item[column.dataIndex] }}
              </slot>
            </div>
          </div>
        </div>
        <div class="readonly-mask" v-if="readonly"></div>
      </div>
    </div>
  </div>
  <template v-else>
    <slot name="empty">
      <div class="jetlinks-edit-table-body-empty">
        <Empty />
      </div>
    </slot>
  </template>
</template>

<script setup>
import ContextMenu from './components/ContextMenu'
import {useRightMenuContext} from "./hooks";
import {randomString} from "@jetlinks-web/utils";
import {bodyProps} from "./props";
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, defineExpose, nextTick} from 'vue'
import Empty from '../Empty/Empty.vue'

defineOptions({
  name: 'JEditTableBody'
})

const props = defineProps({
  ...bodyProps(),
  groupKey: {
    type: [String, Number],
    default: undefined
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:dataSource', 'scrollDown'])

const viewScrollRef = ref()
const tableCenterRef = ref()
const virtualRang = reactive({
  start: 0,
  end: 15
})
const containerStyle = ref(0)
const context = useRightMenuContext()

let scrollLock = ref(false)
let menuInstance

const maxLen = computed(() => {
  return Math.trunc(props.height / props.cellHeight)
})

const selectedRowKeys = ref([])

const virtualData = computed(()=> {

  const array = props.dataSource.slice(virtualRang.start, virtualRang.end)
  if (tableCenterRef.value) {
    tableCenterRef.value.style.webkitTransform  =  `translate3d(0, ${virtualRang.start * props.cellHeight}px, 0)`
  }
  return array
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
}

const scrollTo = (index) => {
  if (viewScrollRef.value) {
    viewScrollRef.value.scrollTop = index * props.cellHeight
  }
}

const showContextMenu = (e, record, _index) => {
  e.preventDefault()
  if (props.disableMenu) {
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

onMounted(() => {
  nextTick(() => {
    onScroll()
  })
})

onBeforeUnmount(() => {
  menuInstance?.destroy()
  menuInstance?.cleanCopy()
})

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

watch(() => props.groupKey, () => {
  if (props.openGroup) {
    scrollTo(0)
  }
})

defineExpose({
  scrollTo,
  updateSelectedKeys
})

</script>
