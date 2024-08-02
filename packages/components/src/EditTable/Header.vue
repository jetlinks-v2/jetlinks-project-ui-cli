<template>
  <div class="jetlinks-edit-table-header-container" :style="style">
    <div class="jetlinks-edit-table-header-cell" v-for="(item, index) in columns" :id="item.dataIndex" :style="{width: `${item.width}px`, left: `${item.left}px`}">
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
    <SearchModal
      v-if="searchData.visible"
      :searchKey="searchData.key"
      @close="searchData.visible = false"
    />
  </div>
</template>

<script setup>
import { Search as SearchModal } from './components/Search'
import { reactive, defineProps, defineOptions } from 'vue'

defineOptions({
  name: 'JEditTableHeader'
})

const props = defineProps({
  columns: {
    type: Array,
    default: () => []
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

const searchData = reactive({
  visible: false,
  key: undefined
})

const showFilter = (key) => {
  searchData.visible = true
  searchData.key = key
}

</script>
