<template>
  <div class="jetlinks-edit-table-header-container" :style="style">
    <div
      v-if="columnFixedMap.left.keys.length"
      class="jetlinks-header-left"
      :style="{
        maxWidth: columnFixedMap.left.width + 'px',
        minWidth: columnFixedMap.left.width + 'px',
        width: columnFixedMap.left.width + 'px',
        boxShadow: tableTool.scrollMap.x ? '0 0 12px 0 rgba(0 ,0, 0, .2)' : ''
      }"
    >
      <div class="jetlinks-edit-table-header-cell" v-for="(item, index) in columnFixedMap.left.keys" :id="item.dataIndex" :style="{width: `${item._width}px`}">
        <div :class="{ 'jetlinks-edit-table-header-cell-box': true, 'header-cell-box-tool': !!(item.sort || item.filter) }">
          <div class="table-header-cell-title">
            <span>{{ item.title }}</span>
            <span v-if="item.form?.required" class="header-cell-required">*</span>
          </div>
          <div v-if="!!(item.filter)" class="table-header-cell-trigger">
            <AIcon
              v-if="item.filter"
              type="SearchOutlined"
              style="color: rgba(0,0,0, 0.25)"
              @click="() => {showFilter(item.filter.key || item.dataIndex)}"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="jetlinks-header-center" :style="{webkitTransform: `translate3d(-${tableTool.scrollMap.x}px, 0, 0)`}">
      <div :style="{width: columnFixedMap.center.width + 'px'}">
        <div class="jetlinks-edit-table-header-cell" v-for="(item, index) in columnFixedMap.center.keys" :id="item.dataIndex" :style="{width: `${item._width}px`}">
          <div :class="{ 'jetlinks-edit-table-header-cell-box': true, 'header-cell-box-tool': !!(item.sort || item.filter) }">
            <div class="table-header-cell-title">
              <span>{{ item.title }}</span>
              <span v-if="item.form?.required" class="header-cell-required">*</span>
            </div>
            <div v-if="!!(item.filter)" class="table-header-cell-trigger">
              <AIcon
                v-if="item.filter"
                type="SearchOutlined"
                style="color: rgba(0,0,0, 0.25)"
                @click="() => {showFilter(item.filter.key || item.dataIndex)}"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="jetlinks-header-right"
      v-if="columnFixedMap.right.keys.length"
      :style="{
        maxWidth: columnFixedMap.right.width + 'px',
        minWidth: columnFixedMap.right.width + 'px',
        width: columnFixedMap.right.width + 'px',
        boxShadow: tableTool.scrollMap.down !== 'right' ? '0 0 12px 0 rgba(0 ,0, 0, .2)' : ''
      }"
    >
      <div class="jetlinks-edit-table-header-cell" v-for="(item, index) in columnFixedMap.right.keys" :id="item.dataIndex" :style="{width: `${item._width}px`}">
        <div :class="{ 'jetlinks-edit-table-header-cell-box': true, 'header-cell-box-tool': !!(item.sort || item.filter) }">
          <div class="table-header-cell-title">
            <span>{{ item.title }}</span>
            <span v-if="item.form?.required" class="header-cell-required">*</span>
          </div>
          <div v-if="!!(item.filter)" class="table-header-cell-trigger">
            <AIcon
              v-if="item.filter"
              type="SearchOutlined"
              style="color: rgba(0,0,0, 0.25)"
              @click="() => {showFilter(item.filter.key || item.dataIndex)}"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <SearchModal
    v-if="searchData.visible"
    :searchKey="searchData.key"
    :rowKey="rowKey"
    @close="searchData.visible = false"
  />
</template>

<script setup>
import { Search as SearchModal } from './components/Search'
import {reactive, defineProps, defineOptions, computed} from 'vue'
import {defaultProps} from "./props";
import {handleColumnFixed} from "./utils";
import {useTableTool} from "./hooks";

defineOptions({
  name: 'JEditTableHeader'
})

const props = defineProps({
  ...defaultProps(),
  serial: {
    type: Boolean,
    default: false
  },
  style: {
    type: Object,
    default: undefined
  }
})

const tableTool = useTableTool()

const columnFixedMap = computed(() => {
  return handleColumnFixed(props.columns)
})

const searchData = reactive({
  visible: false,
  key: undefined
})

const showFilter = (key) => {
  searchData.visible = true
  searchData.key = key
}

</script>
