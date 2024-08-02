<template>
  <DragModal
    :width="800"
    :height="modalHeight"
    :title="false"
    :dragRang="[600, 200]"
    :bodyStyle="{
      overflow: 'hidden'
    }"
    @heightChange="heightChange"
  >
    <div class="table-search">
      <div class="table-search-header">
        <div>
          <Space>
            <span>查找</span>
            <Input v-model:value="searchValue" :maxlength="64" placeholder="请输入查找内容" />
            <Button type="primary" ghost @click="() => search('all')">查找全部</Button>
            <Button type="primary" ghost @click="() => search('prev')">上一个</Button>
            <Button type="primary" ghost @click="() => search('next')">下一个</Button>
          </Space>
        </div>
        <div>
          <Button type="primary" @click.stop="onClose">关闭</Button>
        </div>
      </div>
      <div v-if="visible" style="margin: 12px 0">
        <Table
          ref="tableRef"
          :data-source="filterArray"
          :columns="columns"
          :height="tableHeight"
          :disableMenu="false"
          :cellHeight="36"
          :rowSelection="{
            onSelect: onSelect,
            selectedRowKeys: selectedRowKeys
          }"
          :serial="{
            title: '行数'
          }"
        >
          <template #serial="{ record }">
            <span>
              {{ record.__serial }}
            </span>
          </template>
          <template #id="{ record }">
            <Ellipsis>
              {{ record.id }}
            </Ellipsis>
          </template>
          <template #name="{ record }">
            <Ellipsis>
              {{ record.name }}
            </Ellipsis>
          </template>
        </Table>
      </div>
      <div v-if="visible">
        查找到 <span class="table-search-result-total">{{filterArray.length}}</span> 条相关属性
      </div>
    </div>
  </DragModal>
</template>

<script setup>
import Table from '../../EditTable.vue'
import {useTableDataSource, useTableTool } from "../../hooks";
import { Ellipsis, DragModal } from '../../../components'
import { Button, Input, Space } from 'ant-design-vue'
import { ref, defineProps, defineEmits, defineOptions } from 'vue'

defineOptions({
  name: 'JEditTableSearch'
})

const props = defineProps({
  searchKey: {
    type: String,
    default: 'id'
  }
})

const emit = defineEmits(['close'])

const dataSource = useTableDataSource()
const tableTool = useTableTool()

const searchValue = ref()
const filterArray = ref([])
const visible = ref(false)
const searchIndex = ref(-1)
const modalHeight = ref(100)
const tableHeight = ref(230)
const selectedRowKeys = ref([])
const tableRef = ref()

const columns = [
  {
    title: '标识',
    dataIndex: 'id',
  },
  {
    title: '名称',
    dataIndex: 'name',
  }
]

const selectedTableRow = (record) => {
  tableTool.scrollTo({
    ...record,
    __serial: record.__serial - 1
  })
  tableTool.selected([record.id])
}

const handleFilterArray = () => {
  const cloneDataSource = JSON.parse(JSON.stringify(dataSource.value || '[]')).map(item => Object.assign(item, { __oldSerial: item.__serial}))
  return cloneDataSource.filter(item => {
    if (item[props.searchKey]) {
      return item[props.searchKey].includes(searchValue.value)
    }
    return false
  })

}

const search = (key) => {
  filterArray.value = handleFilterArray()

  if (key === 'all') {
    visible.value = true
    modalHeight.value = 400
    searchIndex.value = 0
  } else if (key === 'next') {
    searchIndex.value += 1
  } else {
    searchIndex.value -= 1
  }

  if (searchIndex.value < 0) {
    searchIndex.value = filterArray.value.length - 1
  } else if (searchIndex.value > filterArray.value.length - 1){
    searchIndex.value = 0
  }

  const searchItem = filterArray.value[searchIndex.value]

  if (key !== 'all' && visible.value) {
    tableRef.value?.scrollToByIndex(searchIndex.value - 1)
  }

  if (filterArray.value.length > 1) {
    selectedRowKeys.value = [searchItem.id]
    selectedTableRow(searchItem)
  } else {
    selectedRowKeys.value = []
    tableTool.selected([])
  }
}

const heightChange = (h) => {
  if (h > 340) {
    tableHeight.value = h - 160
  }
}

const onClose = () => {
  emit('close')
}

const onSelect = (record) => {
  searchIndex.value = filterArray.value.findIndex(item => item.id === record.id)
  selectedRowKeys.value = [record.id]
  selectedTableRow(record)
}

</script>

