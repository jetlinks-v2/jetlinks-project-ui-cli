<template>
  <div :class="{
    'jetlinks-edit-table-wrapper': true,
    'table-full-screen': isFullscreen
  }" ref="tableWrapper">
    <div class="jetlinks-edit-table-extra">
      <slot name="extra" :isFullscreen="isFullscreen" :fullScreenToggle="toggle"/>
    </div>
    <div class="jetlinks-edit-table">
      <div class="jetlinks-edit-table-header" style="height: 50px" :style="{paddingRight: scrollWidth + 'px'}">
        <Header
          :columns="myColumns"
          :style="{width: tableStyle.width}"
          :rowKey="rowKey"
          :searchColumns="searchColumns"
        />
        <div class="jetlinks-edit-table-header-scroll-hidden" :style="{width: scrollWidth + 'px'}"></div>
      </div>
      <div class="jetlinks-edit-table-body" :style="{width: tableStyle.width, height: `${height}px`}">
        <Body
          ref="tableBody"
          :dataSource="_dataSource"
          :columns="myColumns"
          :cellHeight="cellHeight"
          :height="height"
          :disableMenu="disableMenu"
          :rowKey="rowKey"
          :rowSelection="rowSelection"
          @scrollDown="onScrollDown"
        >
        <template v-for="(_, name) in slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData || {}"/>
        </template>
        </Body>
        <slot name="bodyExtra"></slot>
      </div>
      <div v-if="scroll?.x" class="jetlinks-edit-table-horizontal-scroll">
        <div class="jetlinks-edit-table-horizontal-scroll-viewport" ref="horizontalScrollRef" @scroll="onHorizontalScroll">
          <div
          :style="{
            width: scroll.x + 'px',
            minWidth: scroll.x + 'px',
            maxWidth: scroll.x + 'px'
          }">
          </div>
        </div>
        <div class="jetlinks-edit-table-horizontal-scroll-hidden" :style="{width: scrollWidth + 'px'}">

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  FULL_SCREEN,
  RIGHT_MENU,
  TABLE_DATA_SOURCE,
  TABLE_ERROR,
  TABLE_TOOL,
  TABLE_WRAPPER
} from './consts'
import {handleColumnsWidth} from './utils'
import { useResizeObserver, useValidate, useFormContext } from './hooks'
import {tableProps} from 'ant-design-vue/lib/table'
import Header from './header.vue'
import Body from './body.vue'
import {useFullscreen} from '@vueuse/core';
import {provide, useAttrs, useSlots, ref, reactive, defineOptions, defineEmits, defineProps, computed, watch} from 'vue'
import {bodyProps, defaultProps} from "./props";
import {findIndex, get, sortBy} from 'lodash-es'

defineOptions({
  name: 'JEditTable'
})

const emit = defineEmits(['scrollDown', 'rightMenuClick', 'editChange', 'searchVisibleChange'])

const props = defineProps({
  ...tableProps(),
  ...defaultProps(),
  ...bodyProps(),
  serial: {
    type: [Object, Boolean],
    default: () => ({})
  },
  validateRowKey: {
    type: Boolean,
    default: false
  },
})

const slots = useSlots()
const attrs = useAttrs()

const myColumns = ref([])
const tableWrapper = ref()
const tableBody = ref()
const horizontalScrollRef = ref()
const scrollMap = reactive({
  x: 0,
  y: 0,
  down: undefined
})
const tableStyle = reactive({
  width: '100%',
  height: props.height
})

const fields = {}

const fieldsErrMap = ref({})

const sortData = reactive({
  key: undefined,
  order: undefined,
  orderKeys: [],
  dataIndex: undefined
})

const _dataSource = computed(() => {

  const sortDataSource = sortData.key ?
    sortBy(props.dataSource, (val) => {
      if (!val.id) return 99999999

      const index = findIndex(sortData.orderKeys, val2 => get(val, sortData.key) === val2)
      return sortData.order === 'desc' ? index : ~index + 1
    }) : props.dataSource

  sortDataSource.forEach((item, index) => {
    item.__dataIndex = index
    item.__serial = index + 1
  })

  return sortDataSource
})

useResizeObserver(tableWrapper, onResize)

const {isFullscreen, toggle} = useFullscreen(tableWrapper);

const {rules, validateItem, validate, errorMap} = useValidate(
  _dataSource,
  props.columns,
  props.rowKey,
  {
    onError: (err) => {
      fieldsErrMap.value = {}
      const errMap = {}

      // 显示全部err红标
      err.forEach((item, errIndex) => {
        item.forEach((e, eIndex) => {
          const field = findField(e.__dataIndex, e.field)

          const _eventKey = field ? field.eventKey : `${e.__dataIndex}-${e.field}`
          if (field) {
            field.showErrorTip(e.message)
          }

          errMap[_eventKey] = e.message

          if (errIndex === 0 && eIndex === 0) {

            setTimeout(() => {
              tableBody.value.scrollTo(e.__serial - 1)
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

provide(TABLE_WRAPPER, tableWrapper)
provide(FULL_SCREEN, isFullscreen)
provide(RIGHT_MENU, {click: rightMenu, getPopupContainer: () => tableWrapper.value})
provide(TABLE_ERROR, fieldsErrMap)
provide(TABLE_DATA_SOURCE, _dataSource)
provide(TABLE_TOOL, {
  scrollTo: (record) => {
    setTimeout(() => {
      tableBody.value.scrollTo(record.__serial)
    }, 10)
  },
  selected: (keys) => {
    tableBody.value.updateSelectedKeys(keys)
  },
  order: (type, key, orderKeys, dataIndex) => {
    sortData.key = key
    sortData.order = type
    sortData.orderKeys = orderKeys
    sortData.dataIndex = dataIndex
  },
  cleanOrder: () => {
    sortData.key = undefined
    sortData.order = undefined
    sortData.orderKeys = []
    sortData.dataIndex = undefined
  },
  searchVisible: (v) => {
    emit('searchVisibleChange', v)
  },
  scrollMap,
  sortData,
  columns: myColumns
})

const addField = (key, field) => {
  fields[key] = field
}

const removeField = (key) => {
  delete fields[key]
}

function findField(index, name) {
  const fieldId = Object.keys(fields).find(key => {
    const {names} = fields[key]
    return names[0] === index && names[1] === name
  })
  return fields[fieldId]
}

function removeFieldError(key) {
  delete fieldsErrMap.value[key]
}

function addFieldError(key, message) {
  fieldsErrMap.value[key] = message
}

const scrollWidth = computed(() => {
  let _width = 0
  if (props.dataSource.length * props.cellHeight) {
    _width = 17
  }

  if (tableBody.value?.getViewScrollRef) {
    const viewScrollDom = tableBody.value?.getViewScrollRef()

    const bodyContainer = viewScrollDom.querySelector('.jetlinks-edit-table-body-container')

    _width = viewScrollDom.offsetWidth - bodyContainer.offsetWidth
  }

  return _width
})

const onHorizontalScroll = () => {
  if (!horizontalScrollRef.value) return
  const { clientWidth, scrollLeft, scrollWidth } = horizontalScrollRef.value

  scrollMap.x = scrollLeft
  if (clientWidth + scrollLeft >= scrollWidth) {
    scrollMap.down = 'right'
  } else if (scrollLeft === 0) {
    scrollMap.down = undefined
  } else {
    scrollMap.down = 'left'
  }
}

function onResize({width = 0, height}) {

  const _width = width - scrollWidth.value

  tableStyle.width = width || '100%'

  let newColumns = [...props.columns]

  if (props.serial) {
    const options = Object.assign({
      title: '序号',
      width: 66,
      fixed: 'left'
    }, props.serial)

    const serial = {
      dataIndex: '__serial',
      title: options.title,
      customRender: (customData) => {
        if (props.serial?.customRender) {
          return props.serial?.customRender(customData)
        }
        return customData.index + 1
      },
      width: options.width,
      fixed: options.fixed
    }
    newColumns = [serial, ...props.columns]
  }

  myColumns.value = handleColumnsWidth(newColumns, _width, props.scroll?.x)
}

const onScrollDown = (len) => {
  emit('scrollDown', len)
}

function rightMenu(menuType, record, copyValue) {
  emit('rightMenuClick', menuType, record, copyValue)
}

const scrollToById = (key) => {
  const _index = _dataSource.value.findIndex(item => item[props.rowKey] === key)
  tableBody.value.scrollTo(_index)
}

const scrollToByIndex = (index) => {
  tableBody.value.scrollTo(index)
}

const getTableWrapperRef = () => {
  return tableWrapper.value
}

watch(() => scrollWidth.value, () => {
  onResize({width: tableStyle.width})
})

useFormContext({
  dataSource: computed(() => {
    return props.dataSource
  }),
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
})
</script>
