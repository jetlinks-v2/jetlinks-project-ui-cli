<template>
  <div :class="['jetlinks-table-group-warp', hashId]">
    <a-tabs type="editable-card" v-model:activeKey="myActiveKey" @edit="onAdd" :hideAdd="readonly" @change="change">
      <a-tab-pane v-for="item in options" :key="item.value" :closable="false">
        <template #tab>
          <a-dropdown
            v-if="myActiveKey === item.value"
            :trigger="['click']"
            :getPopupContainer="(node) => tableWrapperRef || node"
            :disabled="readonly"
          >
            <template #overlay>
              <a-menu @click="(e) => { menuClick(e, item)}">
                <a-menu-item key="edit">
                  {{ contextLocale.Group.edit }}
                </a-menu-item>
                <a-menu-item key="delete">
                  {{ contextLocale.Group.delete }}
                </a-menu-item>
              </a-menu>
            </template>
            <div class="jetlinks-table-group-error-warp">
              {{ item.label }} ({{ item.effective}})
              <a-tooltip
                v-if="errorMap[item.value]"
                color="#ffffff"
                :arrowPointAtCenter="true"
                :get-popup-container="popContainer"
              >
                <template #title>
                  <span style="color: #1d2129">{{ contextLocale.Group.validate }}</span>
                </template>
                <div class="jetlinks-table-group-error-target"></div>
              </a-tooltip>
            </div>
          </a-dropdown>
          <div v-else class="jetlinks-table-group-error-warp">
            {{ item.label }} ({{ item.effective}})
            <a-tooltip
              v-if="errorMap[item.value]"
              color="#ffffff"
              :arrowPointAtCenter="true"
              :getContainer="popContainer"
            >
              <template #title>
                <span style="color: #1d2129">{{ contextLocale.Group.validate }}</span>
              </template>
              <div class="jetlinks-table-group-error-target"></div>
            </a-tooltip>
          </div>
        </template>
      </a-tab-pane>
    </a-tabs>
    <a-modal
      :visible="visible"
      :title="contextLocale.Group.editGroup"
      :maskClosable="false"
      :getContainer="modalContainer"
      @cancel="onCancel"
      @ok="onOk"
    >
      <a-form ref="formRef" :model="formData" @finish="onOk">
        <a-form-item name="label" :rules="[{ required: true, message: contextLocale.Group.placeholder}, { max: 16, message: contextLocale.Group.max}]">
          <a-input v-model:value="formData.label" :placeholder="contextLocale.Group.placeholder"/>
        </a-form-item>
        <a-form-item v-show="false">
          <a-button html-type="submit"></a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import {Modal} from "ant-design-vue";
import {randomNumber} from "@jetlinks-web/utils";
import {isFullScreen} from "./utils";
import {useTableGroupError, useTableWrapper} from './context'
import { ref, defineProps, defineEmits, defineOptions} from 'vue'
import {useLocaleReceiver} from "../LocaleReciver";
import genEditTableStyle from './style'

defineOptions({
  name: 'JEditTableGroup'
})

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  activeKey: {
    type: String,
    default: undefined
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['delete', 'edit', 'add', 'change', 'update:activeKey'])
const [contextLocale] = useLocaleReceiver('EditTable');
const myActiveKey = ref(props.activeKey)
const visible = ref(false)
const type = ref(contextLocale.value.Group.addGroup)
const errorMap = useTableGroupError()
const tableWrapperRef = useTableWrapper()
const addIndex = ref(0)

const formRef = ref()
const formData = reactive({
  label: undefined
})

const prefixCls = computed(() => 'jetlinks-edit-table')
const [wrapSSR, hashId] = genEditTableStyle(prefixCls);
const onAdd = (targetKey, action) => {
  // if(props.readonly) return
  if (action === 'add') {
    type.value = 'add'
    // 获取上一个包含 “分组_” 的信息
    const groupName = props.options.filter(item => item.label.includes(contextLocale.value.Group.one))
    let index = addIndex.value + 1
    let findStatus = false
    while (!findStatus) {
      const status = groupName.some(item => {
        const [ _, _index] = item.label.split('_')
        if (index === Number(_index)) {
          index = Number(_index) + 1
          return true
        }
        return false
      })

      findStatus = !status
    }

    addIndex.value = index
    formData.label = contextLocale.value.Group.one + index
    onOk()
  }
}

const onEdit = (record) => {
  visible.value = true
  type.value = 'edit'
  formData.label = record.label
}

const onCancel = () => {
  formRef.value.resetFields()
  visible.value = false
}
const onOk = () => {
  const data = { ...formData }

  if (type.value === 'add') {
    data.value = 'group_'+randomNumber()
    myActiveKey.value = data.value
    emit(type.value, data)
    emit('change', data.value, data.label)
    emit('update:activeKey', data.value)
    visible.value = false
  } else {
    formRef.value.validate().then(() => {
      data.value = myActiveKey.value
      emit(type.value, data)
      emit('change', data.value, data.label)
      visible.value = false
    })
  }
}

const change = () => {
  const item = props.options.find(item => item.value === myActiveKey.value)
  emit('change', myActiveKey.value, item.label)
  emit('update:activeKey', myActiveKey.value)
}

const menuClick = (e, record) => {
  if(props.readonly) return
  if (e.key === 'edit') {
    onEdit(record)
  } else {
    Modal.confirm({
      title: contextLocale.value.Group.deleteMessage,
      onOk: () => {
        // activeKey 根据数据长度进行左右移动
        const index = props.options.findIndex(item => item.value === record.value)
        let label = ''

        if (index !== 0 && index === props.options.length - 1) {
          myActiveKey.value = props.options[index - 1].value
          label = props.options[index - 1].label
        } else if (index === 0 && props.options.length === 1) {
          myActiveKey.value = props.options[0].value
          label = props.options[0].label
        } else {
          myActiveKey.value = props.options[index + 1].value
          label = props.options[index + 1].label
        }

        emit('delete', record.value, index)
        emit('change', myActiveKey.value, label)
      },
    })
  }
}

const popContainer = (e) => {
  return tableWrapperRef.value || e
}

const modalContainer = (e) =>{
  if (isFullScreen()) {
    return tableWrapperRef.value || document.body
  }
  return document.body
}

onMounted(() => {
  myActiveKey.value = props.options[0]?.value
  emit('change', myActiveKey.value, props.options[0]?.label)
  emit('update:activeKey', myActiveKey.value)
})

watch(() => props.activeKey, (val) => {
  myActiveKey.value = val
})

</script>
