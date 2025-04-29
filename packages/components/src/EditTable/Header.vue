<template>
  <div class="jetlinks-edit-table-header-container" :style="style">
    <div class="jetlinks-edit-table-header-cell" v-for="(item, index) in columns" :id="item.dataIndex" :style="{width: `${item.width}px`, left: `${item.left || (200 * index)}px`}">
      <div :class="{ 'jetlinks-edit-table-header-cell-box': true, 'header-cell-box-tool': !!(item.sort || item.filter) }">
        <div class="table-header-cell-title">
          <div class="cell-title-box">
            <HeaderItemRender v-if="item.render" :render-fn="item.render" :value="item.title" />
            <span v-else>{{ item.title }}</span>
          </div>
          <span v-if="item.form?.required" class="header-cell-required">*</span>
        </div>
        <div v-if="!!(item.sort || item.filter)" class="table-header-cell-trigger">
          <AIcon
            v-if="item.filter"
            type="SearchOutlined"
            style="color: rgba(0,0,0, 0.25)"
            @click="() => {showFilter(item.filter.key || item.dataIndex)}"
          />
          <Sort
            v-if="item.sort"
            v-bind="item.sort"
            :key="item.dataIndex"
            :active="tableTool.sortData.dataIndex === item.dataIndex"
            :selectedRowKeys="tableTool.sortData.dataIndex === item.dataIndex ? tableTool.sortData.orderKeys : []"
            :dataIndex="item.dataIndex"
            @click="sortClick"
          />
        </div>
      </div>
    </div>
    <SearchModal
      v-if="searchData.visible"
      :searchKey="searchData.key"
      :columns="searchColumns"
      @close="searchData.visible = false"
    />
  </div>
</template>

<script setup>
import { SearchModal, Sort } from './components/Search'
import {reactive, defineProps, defineOptions} from 'vue'
import {useHScroll, useTableTool} from "./hooks";
import HeaderItemRender from './HeaderRender.vue'

defineOptions({
  name: 'JEditTableHeader'
})

const props = defineProps({
  columns: {
    type: Array,
    default: () => []
  },
  searchColumns: {
    type: Array,
    default: undefined
  },
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
const hScroll = useHScroll()
const searchData = reactive({
  visible: false,
  key: undefined
})

const showFilter = (key) => {
  searchData.visible = true
  searchData.key = key
}

const sortClick = () => {
  searchData.visible = false
}
</script>
