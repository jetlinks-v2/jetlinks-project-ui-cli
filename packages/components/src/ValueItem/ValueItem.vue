<!-- 参数类型输入组件 -->
<template>
  <div class="value-item-warp">
    <Select
      v-if="typeMap.get(itemType) === 'select'"
      v-model:value="myValue"
      allowClear
      v-bind="props"
      @change="(_, options) => onChange(options)"
    />
    <DatePicker
      v-else-if="typeMap.get(itemType) === 'date'"
      v-model:value="myValue"
      :valueFormat="valueFormat || 'YYYY-MM-DD HH:mm:ss'"
      allowClear
      showTime
      v-bind="props"
      @change="onChange"
    />
    <TimePicker
      v-else-if="typeMap.get(itemType) === 'time'"
      v-model:value="myValue"
      :valueFormat="valueFormat || 'HH:mm:ss'"
      allowClear
      v-bind="props"
      @change="onChange"
    />
    <InputNumber
      v-else-if="typeMap.get(itemType) === 'inputNumber'"
      v-model:value="myValue"
      allowClear
      v-bind="props"
      @change="onChange"
    />
    <Input
      v-else-if="typeMap.get(itemType) === 'object'"
      v-model:value="myValue"
      allowClear
      v-bind="props"
      @change="onChange"
    >
      <template #addonAfter>
        <AIcon type="FormOutlined" @click="modalVisible = true" />
      </template>
    </Input>
    <Input
      v-else-if="typeMap.get(itemType) === 'file'"
      v-model:value="myValue"
      allowClear
      placeholder="请输入链接"
      v-bind="props"
      @change="onChange"
    >
      <template #addonAfter>
        <Upload
          :action="action"
          :headers="headers"
          :showUploadList="false"
          name="file"
          @change="handleFileChange"
        >
          <AIcon type="UploadOutlined" />
        </Upload>
      </template>
    </Input>
    <InputPassword
      v-else-if="typeMap.get(itemType) === 'password'"
      v-model:value="myValue"
      allowClear
      type="password"
      v-bind="props"
      @change="onChange"
    />
    <Input
      v-else
      v-model:value="myValue"
      allowClear
      type="text"
      v-bind="props"
      @change="onChange"
    />

    <!-- 代码编辑器弹窗 -->
    <Modal
      v-model:visible="modalVisible"
      :zIndex="1100"
      cancel-text="取消"
      ok-text="确认"
      title="编辑"
      width="700px"
      @cancel="modalVisible = false"
      @ok="handleItemModalSubmit"
    >
      <div style="width: 100%; height: 300px">
        <MonacoEditor v-model:modelValue="objectValue" />
      </div>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { CSSProperties, PropType, ref, watch } from 'vue'
import { componentsType } from './util'
import { MonacoEditor } from '../../'
import {
  Select,
  DatePicker,
  TimePicker,
  Input,
  InputNumber,
  InputPassword,
  Upload,
  Modal,
} from 'ant-design-vue'

defineOptions({
  name: 'JValueItem',
})

type Emits = {
  (e: 'update:modelValue', data: string | number | boolean): void
  (e: 'change', data: any, item?: any): void
}

interface ItemProps {
  style?: CSSProperties
  class?: string
}

const emit = defineEmits<Emits>()

const props = defineProps({
  // 组件双向绑定的值
  modelValue: {
    type: [Number, String],
    default: '',
  },
  // 组件类型
  itemType: {
    type: String,
    default: () => 'string',
  },
  // 多选框
  mode: {
    type: String as PropType<'multiple' | 'tags' | 'combobox' | ''>,
    default: '',
  },
  placeholder: String,
  options: Array, // 下拉选择框下拉数据
  style: Object as PropType<ItemProps['style']>,
  class: String,
  valueFormat: String,
  action: [String, Promise],
  headers: Object,
  disabled: Boolean
})

const typeMap = new Map(Object.entries(componentsType))

const myValue = ref<any>(undefined)
const modalVisible = ref<boolean>(false)
const objectValue = ref<string>('')

const handleItemModalSubmit = () => {
  myValue.value = objectValue.value.replace(/[\r\n]\s*/g, '')
  modalVisible.value = false
  emit('update:modelValue', objectValue.value)
  emit('change', objectValue.value)
}

const onChange = (e) => {
  emit('update:modelValue', myValue.value)
  emit('change', e)
}

const handleFileChange = (info: any) => {
  if (info.file.status === 'done') {
    const url = info.file.response?.result
    myValue.value = url
    emit('update:modelValue', url)
    emit('change', url)
  }
}

watch(
  () => props.modelValue,
  () => {
    myValue.value = props.modelValue
    if (props.itemType === 'object') {
      objectValue.value = props.modelValue as string
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped></style>
