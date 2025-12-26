<template>
  <div :class="{
    'jetlinks-edit-table-wrapper': true,
    'table-full-screen': isFullscreen,
    [hashId]: true
  }" ref="tableWrapper">
    <div class="jetlinks-edit-table-extra">
      <slot name="extra" :isFullscreen="isFullscreen" :fullScreenToggle="toggle"/>
    </div>
    <div class="jetlinks-edit-table">
<!--      <Header-->
<!--        ref="headerRef"-->
<!--        :columns="myColumns"-->
<!--        :searchColumns="searchColumns"-->
<!--        :style="{width: tableStyle.width, transform: `translateX(-${horizontalScrollLeft}px)`}"-->
<!--        :scrollWidth="scrollWidth"-->
<!--      />-->
<!--      <div class="jetlinks-edit-table-body" :style="{width: tableStyle.width, height: `${height}px`}">-->
      <div class="jetlinks-edit-table-body">
        <VirtualTable
          ref="virtualTableRef"
          :dataSource="bodyDataSource"
          :columns="tableColumns"
          :height="height"
          :rowKey="rowKey"
          :rowSelection="rowSelection"
          :treeData="false"
          :rowHeight="cellHeight"
          :scroll="{x: '100%'}"
          @scroll="onTableScroll"
          @scrollEnd="onScrollDown"
        >
          <template #bodyCell="{ text, record, index, column }">
            {{ column.dataIndex }}
            <template v-if="column.dataIndex === '__serial'">
              <slot name="serial" :record="record" :index="record.__dataIndex" :column="column">
                {{ record.__serial }}
              </slot>
            </template>
            <template v-else>
              <slot :name="column.dataIndex" :record="record" :index="record.__dataIndex" :column="column">
                <CellRender
                  v-if="column.customRender"
                  :record="record"
                  :value="record[column.dataIndex]"
                  :index="record.__dataIndex"
                  :render-fn="column.customRender"
                />
                <template v-else>
                  {{ record[column.dataIndex] }}
                </template>
              </slot>
            </template>
          </template>
        </VirtualTable>
        <div class="readonly-mask" v-if="readonly"></div>
        <slot name="bodyExtra"></slot>
      </div>
<!--      <div class="jetlinks-table-horizontal-scroll" v-if="showScroll">-->
<!--        <div-->
<!--          class="jetlinks-table-horizontal-scroll-bar"-->
<!--          ref="scrollBarRef"-->
<!--          :style="{-->
<!--            width: 'calc(100% - 15px)',-->
<!--            height: '100%',-->
<!--            overflowX: 'scroll'-->
<!--          }"-->
<!--          @scroll="onHorizontalScroll"-->
<!--        >-->
<!--          <div :style="{ minWidth: horizontalScrollWidth + 'px', maxWidth: horizontalScrollWidth + 'px', height: '100%'}"> </div>-->
<!--        </div>-->
<!--        <div style="width: 15px; height: 100%; overflow-x: hidden;"></div>-->
<!--      </div>-->
      <Group
        v-if="dataSource.length && openGroup"
        v-model:activeKey="groupActive.value"
        :options="groupOptions"
        :readonly="readonly"
        @add="addGroup"
        @delete="groupDelete"
        @edit="groupEdit"
        @change="updateGroupActive"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  FULL_SCREEN,
  RIGHT_MENU,
  TABLE_DATA_SOURCE,
  TABLE_ERROR,
  TABLE_GROUP_ACTIVE,
  TABLE_GROUP_ERROR,
  TABLE_GROUP_OPTIONS,
  TABLE_H_SCROLL,
  TABLE_OPEN_GROUP,
  TABLE_TOOL,
  TABLE_WRAPPER
} from './consts'
import { handleColumnsWidth } from './utils'
import { useGroup, useResizeObserver, useValidate } from './hooks'
import { tableProps } from 'ant-design-vue/lib/table'
import { useFormContext } from './context'
import { useFullscreen } from '@vueuse/core'
import { provide, useSlots, ref, reactive, computed, watch, nextTick } from 'vue'
import { bodyProps } from "./props"
import { findIndex, get, sortBy, cloneDeep } from 'lodash-es'
import Header from './Header.vue'
import Group from './group.vue'
import CellRender from './CellRender.vue'
import VirtualTable from '../VirtualTable/VirtualTable.vue'
import { useLocaleReceiver } from "../LocaleReciver"
import useEditTableStyle from './style'

defineOptions({
  name: 'JEditTable'
})

const emit = defineEmits(['scrollDown', 'rightMenuClick', 'editChange', 'searchVisibleChange', 'groupDelete', 'groupEdit'])
const [contextLocale] = useLocaleReceiver('EditTable')

const props = defineProps({
  ...tableProps(),
  ...bodyProps(),
  searchColumns: {
    type: Array,
    default: undefined
  },
  serial: {
    type: [Object, Boolean],
    default: () => ({
      width: 66,
      title: ''
    })
  },
  validateRowKey: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const prefixCls = computed(() => 'jetlinks-edit-table')
const [wrapSSR, hashId] = useEditTableStyle(prefixCls)
const slots = useSlots()
const myColumns = ref<any[]>([])
const tableWrapper = ref()
const virtualTableRef = ref()
const headerRef = ref()
const scrollBarRef = ref()
const tableStyle = reactive({
  width: '100%' as string | number,
  height: props.height
})
const showScroll = ref(false)
const horizontalScrollWidth = ref(0)
const horizontalScrollLeft = ref(0)

const fields: Record<string, any> = {}
const defaultGroupId = 'group_1'

const fieldsErrMap = ref<Record<string, string>>({})
const fieldsGroupError = ref<Record<string, any>>({})
const scrollDefaultWidth = ref(17)
const sortData = reactive({
  key: undefined as string | undefined,
  order: undefined as 'asc' | 'desc' | undefined,
  orderKeys: [] as any[],
  dataIndex: undefined as string | undefined
})

const {
  groupActive,
  groupOptions,
  addGroup,
  removeGroup,
  updateGroupActive,
  updateGroupOptions
} = useGroup(props.openGroup)

// 处理数据源
const _dataSource = computed(() => {
  const _options = new Map()

  const sortDataSource = sortData.key
    ? sortBy(props.dataSource, (val: any) => {
        if (!val.id) return 99999999
        const index = findIndex(sortData.orderKeys, (val2: any) => get(val, sortData.key!) === val2)
        return sortData.order === 'desc' ? index : ~index + 1
      })
    : props.dataSource

  sortDataSource.forEach((item: any, index: number) => {
    item.__dataIndex = index
    if (props.openGroup) {
      const _groupId = item.expands?.groupId
      if (!_groupId) {
        item.expands.groupId = groupActive.value || defaultGroupId
        item.expands.groupName = groupActive.label || (contextLocale.value.Group.one + '1')
      }

      const _optionsItem = _options.get(item.expands.groupId)

      if (!_optionsItem) {
        _options.set(item.expands.groupId, {
          value: item.expands?.groupId,
          label: item.expands?.groupName,
          effective: item.id ? 1 : 0,
          len: 1
        })
      } else {
        if (item.id) {
          _optionsItem.effective += 1
        }
        _optionsItem.len += 1
        _options.set(item.expands.groupId, _optionsItem)
      }

      item.__serial = _optionsItem?.len || 1
    } else {
      item.__serial = index + 1
    }
  })

  if (props.openGroup) {
    updateGroupOptions([..._options.values()])
  }

  return sortDataSource
})

// 按分组过滤的数据
const bodyDataSource = computed(() => {
  if (props.openGroup) {
    return _dataSource.value.filter((item: any) => {
      return item.expands.groupId === groupActive.value
    })
  }
  return _dataSource.value
})

// 为 VirtualTable 准备的列配置
const tableColumns = computed(() => {
  return myColumns.value.map(col => ({
    ...col,
    // 移除 left 属性，VirtualTable 不需要
    left: undefined
  }))
})

useResizeObserver(tableWrapper, onResize)

const { isFullscreen, toggle } = useFullscreen(tableWrapper)

const { rules, validateItem, validate, errorMap } = useValidate(
  _dataSource,
  props.columns,
  props.rowKey,
  {
    onError: (err: any) => {
      fieldsErrMap.value = {}
      fieldsGroupError.value = {}
      const errMap: Record<string, string> = {}

      err.forEach((item: any, errIndex: number) => {
        item.forEach((e: any, eIndex: number) => {
          const field = findField(e.__dataIndex, e.field)
          const _eventKey = field ? field.eventKey : `${e.__dataIndex}-${e.field}`

          if (field) {
            field.showErrorTip(e.message)
          }
          errMap[_eventKey] = e.message

          if (errIndex === 0 && eIndex === 0) {
            if (props.openGroup) {
              const expands = _dataSource.value[e.__dataIndex].expands
              updateGroupActive(expands.groupId, expands.groupName)
            }

            setTimeout(() => {
              scrollToByIndex(e.__serial - 1)
            }, 10)
          }
        })
      })

      fieldsErrMap.value = errMap
    },
    onSuccess: () => {
      fieldsErrMap.value = {}
    },
    onEdit: () => {
      emit('editChange', true)
    },
    validateRowKey: props.validateRowKey
  }
)

// Provide context
provide(TABLE_WRAPPER, tableWrapper)
provide(FULL_SCREEN, isFullscreen)
provide(RIGHT_MENU, { click: rightMenu, getPopupContainer: () => tableWrapper.value })
provide(TABLE_ERROR, fieldsErrMap)
provide(TABLE_GROUP_ERROR, fieldsGroupError)
provide(TABLE_DATA_SOURCE, _dataSource)
provide(TABLE_OPEN_GROUP, props.openGroup)
provide(TABLE_TOOL, {
  scrollTo: (record: any) => {
    if (props.openGroup) {
      const expands = record.expands
      updateGroupActive(expands.groupId, expands.groupName)
    }

    setTimeout(() => {
      scrollToByIndex(record.__serial)
    }, 10)
  },
  selected: (keys: any[]) => {
    // VirtualTable 通过 rowSelection.selectedRowKeys 控制选中
  },
  order: (type: string, key: string, orderKeys: any[], dataIndex: string) => {
    sortData.key = key
    sortData.order = type as 'asc' | 'desc'
    sortData.orderKeys = orderKeys
    sortData.dataIndex = dataIndex
  },
  cleanOrder: () => {
    sortData.key = undefined
    sortData.order = undefined
    sortData.orderKeys = []
    sortData.dataIndex = undefined
  },
  sortData
})
provide(TABLE_GROUP_OPTIONS, groupOptions)
provide(TABLE_GROUP_ACTIVE, groupActive)
provide(TABLE_H_SCROLL, horizontalScrollLeft)

const addField = (key: string, field: any) => {
  fields[key] = field
}

const removeField = (key: string) => {
  delete fields[key]
}

function findField(index: number, name: string) {
  const fieldId = Object.keys(fields).find(key => {
    const { names } = fields[key]
    return names[0] === index && names[1] === name
  })
  return fields[fieldId!]
}

function removeFieldError(key: string) {
  delete fieldsErrMap.value[key]
}

function addFieldError(key: string, message: string) {
  fieldsErrMap.value[key] = message
}

const scrollWidth = computed(() => {
  return (props.dataSource.length * props.cellHeight) > props.height ? scrollDefaultWidth.value : 0
})

const handleColumns = () => {
  let newColumns = [...props.columns] as any[]
  if (props.serial) {
    const serial = {
      dataIndex: '__serial',
      title: (props.serial as any).title || contextLocale.value.serial,
      customRender: (customData: any) => {
        if ((props.serial as any)?.customRender) {
          return (props.serial as any)?.customRender(customData)
        }
        return customData.index + 1
      },
      width: (props.serial as any)?.width,
      fixed: 'left'
    }
    newColumns = [serial, ...props.columns]
  }

  const width = typeof tableStyle.width === 'number' ? tableStyle.width : parseFloat(tableStyle.width as string) || 0
  myColumns.value = handleColumnsWidth(newColumns, width - scrollWidth.value)

  horizontalScrollWidth.value = myColumns.value.reduce((prev: number, next: any) => {
    prev += next.width
    return prev
  }, 0)

  if (horizontalScrollWidth.value > width) {
    showScroll.value = true
  }
}

function onResize({ width = 0 }) {
  tableStyle.width = width || '100%'
  handleColumns()
}

function rightMenu(menuType: string, record: any, copyValue: any) {
  emit('rightMenuClick', menuType, record, copyValue)
}

const scrollToById = (key: string) => {
  const _index = _dataSource.value.findIndex((item: any) => item[props.rowKey] === key)
  scrollToByIndex(_index)
}

const scrollToByIndex = (index: number) => {
  // 通过 VirtualTable 暴露的方法滚动
  if (virtualTableRef.value) {
    virtualTableRef.value.scrollToIndex(index)
  }
}

const getTableWrapperRef = () => {
  return tableWrapper.value
}

const groupDelete = (id: string, index: number) => {
  removeGroup(index)
  Object.keys(fieldsErrMap.value).forEach(errorKey => {
    const [idx] = errorKey.split('-')
    const dataSourceItem = _dataSource.value[parseInt(idx)]
    const groupId = dataSourceItem?.expands?.groupId
    if (groupId === id) {
      removeFieldError(errorKey)
      removeField(errorKey)
    }
  })
  emit('groupDelete', id)
}

const groupEdit = (record: any) => {
  emit('groupEdit', record)
}

const getGroupActive = () => {
  return groupActive.value
}

const onHorizontalScroll = (e: Event) => {
  horizontalScrollLeft.value = (e.target as HTMLElement).scrollLeft
}

// VirtualTable 滚动事件
const onTableScroll = (e: Event) => {
  const target = e.target as HTMLElement
  horizontalScrollLeft.value = target.scrollLeft

  // 同步滚动条
  if (scrollBarRef.value && scrollBarRef.value.scrollLeft !== target.scrollLeft) {
    scrollBarRef.value.scrollLeft = target.scrollLeft
  }
}

// VirtualTable 滚动到底部事件
const onScrollDown = () => {
  emit('scrollDown')
}

// 监听错误变化
watch(() => fieldsErrMap.value, (errorMap) => {
  fieldsGroupError.value = {}

  if (props.openGroup) {
    const _errorObj = errorMap
    const groupErrorMap: Record<string, any[]> = {}

    Object.keys(_errorObj).forEach(errorKey => {
      const [index] = errorKey.split('-')
      const dataSourceItem = _dataSource.value[parseInt(index)]
      const groupId = dataSourceItem?.expands?.groupId

      const groupError = groupErrorMap[groupId]

      const groupErrorItem = {
        [errorKey]: {
          message: _errorObj[errorKey],
          index,
          serial: dataSourceItem.__serial
        }
      }

      if (groupError) {
        groupError.push(groupErrorItem)
      } else {
        groupErrorMap[groupId] = [groupErrorItem]
      }
    })

    fieldsGroupError.value = groupErrorMap
  }
}, { deep: true })

watch(() => scrollWidth.value, () => {
  onResize({ width: tableStyle.width as number })
})

watch(() => [JSON.stringify(props.columns), tableStyle.width], () => {
  handleColumns()
})

useFormContext({
  dataSource: computed(() => props.dataSource),
  errorMap,
  rules,
  addField,
  removeField,
  removeFieldError,
  addFieldError,
  validateItem
})

defineExpose({
  validate,
  tableWrapper,
  scrollToById,
  scrollToByIndex,
  getTableWrapperRef,
  getGroupActive
})
</script>
