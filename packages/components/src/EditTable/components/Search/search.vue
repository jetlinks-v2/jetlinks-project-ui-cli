<template>
  <DragModal
    :width="800"
    :height="modalHeight"
    :title="false"
    :footer="false"
    :dragRang="[600, 200]"
    :bodyStyle="{
      overflow: 'hidden'
    }"
    @heightChange="heightChange"
  >
    <div class="jetlinks-table-search">
      <div class="jetlinks-table-search-header">
        <div>
          <a-space>
            <span>{{ contextLocale.Search.find }}</span>
            <a-input v-model:value="searchValue" allow-clear :maxlength="64" :placeholder="contextLocale.Search.placeholder" @drag.stop />
            <a-button type="primary" ghost @click="() => search('all')">{{ contextLocale.Search.all }}</a-button>
            <a-button type="primary" ghost @click="() => search('prev')">{{ contextLocale.Search.prev }}</a-button>
            <a-button type="primary" ghost @click="() => search('next')">{{ contextLocale.Search.next }}</a-button>
          </a-space>
        </div>
        <div>
          <a-button type="primary" @click.stop="onClose">{{ contextLocale.Search.close }}</a-button>
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
            width: openGroup ? 150 : 66,
            title: contextLocale.serial
          }"
        >
          <template #serial="{ record }">
            <span v-if="openGroup">
              <Ellipsis>
                {{ record.expands.groupName }} {{ contextLocale.Search.rd }} {{ record.__oldSerial }} {{ contextLocale.Search.row }}
              </Ellipsis>
            </span>
            <span v-else>
              {{ record.__oldSerial }}
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
        {{ contextLocale.Search.found }} <span class="jetlinks-table-search-result-total">{{filterArray.length}}</span> {{ contextLocale.Search.related }}
      </div>
    </div>
  </DragModal>
</template>

<script setup>
import Table from '../../EditTable.vue'
import {useTableDataSource, useTableOpenGroup, useTableTool, useGroupOptions} from "../../context";
import {ref, reactive, defineProps, defineOptions, defineEmits} from "vue";
import Ellipsis from '../../../Ellipsis/Ellipsis.vue'
import DragModal from '../../../DragModal/DragModal.vue'
import {useLocaleReceiver} from "../../../LocaleReciver/index";
import { isNumber, isArray, isObject, isBoolean} from 'lodash-es'

defineOptions({
  name:'JEditTableSearch'
})

const props = defineProps({
  searchKey: {
    type: String,
    default: 'id'
  }
})

const emit = defineEmits(['close'])
const [contextLocale] = useLocaleReceiver('EditTable');
const dataSource = useTableDataSource()
const openGroup = useTableOpenGroup()
const tableTool = useTableTool()
const groupOptions = useGroupOptions()

const searchValue = ref()
const filterArray = ref([])
const visible = ref(false)
const searchIndex = ref(-1)
const modalHeight = ref(100)
const tableHeight = ref(230)
const selectedRowKeys = ref([])
const tableRef = ref()

const columns = reactive([
  {
    title: contextLocale.value.columns.sign,
    dataIndex: 'id',
  },
  {
    title: contextLocale.value.columns.name,
    dataIndex: 'name',
  }
])

const selectedTableRow = (record) => {
  tableTool.scrollTo({
    ...record,
    __serial: record.__oldSerial - 1
  })
  tableTool.selected([record.id])
}

const handleFilterArray = () => {
  const cloneDataSource = JSON.parse(JSON.stringify(dataSource.value || '[]')).map(item => Object.assign(item, { __oldSerial: item.__serial}))
  const _filterArray = cloneDataSource.filter(item => {
    let targetValue = item[props.searchKey]
    if (targetValue) {
      // 判断是否为string
      if (isNumber(targetValue) || isBoolean(targetValue)) {
        targetValue = toString(targetValue)
      } else if (isArray(targetValue) || isObject(targetValue)) {
        targetValue = JSON.stringify(targetValue)
      }
      return targetValue.includes(searchValue.value)
    }
    return false
  })

  if (openGroup) {
    const handleGroup = []

    groupOptions.value.forEach(group => {
      handleGroup.push(..._filterArray.filter(item => item.expands.groupId === group.value))
    })

    return handleGroup
  }

  return _filterArray
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

  if (filterArray.value.length >= 1) {
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
