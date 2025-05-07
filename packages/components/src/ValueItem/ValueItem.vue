<!-- 参数类型输入组件 -->
<template>
  <div class="value-item-warp">
    <Select
      v-if="typeMap.get(itemType) === 'select'"
      v-model:value="myValue"
      allowClear
      v-bind="bindProps"
      @change="(_, options) => onChange(options)"
    />
    <DatePicker
      v-else-if="typeMap.get(itemType) === 'date'"
      v-model:value="myValue"
      :valueFormat="valueFormat || 'YYYY-MM-DD HH:mm:ss'"
      allowClear
      showTime
      v-bind="bindProps"
      @change="onChange"
    />
    <TimePicker
      v-else-if="typeMap.get(itemType) === 'time'"
      v-model:value="myValue"
      :valueFormat="valueFormat || 'HH:mm:ss'"
      allowClear
      v-bind="bindProps"
      @change="onChange"
    />
    <InputNumber
      v-else-if="itemType === 'int'"
      v-model:value="myValue"
      :precision="0"
      :max="2147483647"
      :min="-2147483648"
      style="width: 100%"
      v-bind="bindProps"
      @change="onChange"
    />
    <InputNumber
      v-else-if="itemType === 'long'"
      v-model:value="myValue"
      :max="999999999999999"
      :min="-999999999999999"
      :precision="0"
      style="width: 100%"
      v-bind="bindProps"
      @change="onChange"
    />
    <InputNumber
      v-else-if="['float', 'double'].includes(itemType)"
      v-model:value="myValue"
      :max="999999999999999"
      :min="-999999999999999"
      style="width: 100%"
      v-bind="bindProps"
      @change="onChange"
    />
    <Input
      v-else-if="typeMap.get(itemType) === 'object'"
      v-model:value="myValue"
      allowClear
      v-bind="bindProps"
      @change="onChange"
    >
    </Input>
    <Input
      v-else-if="typeMap.get(itemType) === 'file'"
      v-model:value="myValue"
      allowClear
      placeholder="请输入链接"
      v-bind="bindProps"
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
      v-bind="bindProps"
      @change="onChange"
    />
    <Input
      v-else
      v-model:value="myValue"
      allowClear
      type="text"
      v-bind="bindProps"
      @change="onChange"
    />

  </div>
</template>

<script lang="ts" setup>
import { CSSProperties, PropType, ref, watch, computed } from 'vue'
import { componentsType } from './util'
import {
  Select,
  DatePicker,
  TimePicker,
  Input,
  InputNumber,
  InputPassword,
  Upload,
} from 'ant-design-vue'
import {omit} from "lodash-es";

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
    default: undefined,
  },
  placeholder: String,
  options: Array, // 下拉选择框下拉数据
  style: Object as PropType<
    ['style']>,
  class: String,
  valueFormat: String,
  action: [String, Promise],
  headers: Object,
  disabled: Boolean,
  extraProps: {
    type: Object,
    default: () => ({})
  },
  handleFileChange: {
    type: Function,
  }
})

const typeMap = new Map(Object.entries(componentsType))

const myValue = ref<any>(undefined)
const objectValue = ref<string>('')

const bindProps = computed(() => {
  return Object.assign(omit(props, ['extraProps']), props.extraProps)
})

const onChange = (e) => {
  emit('update:modelValue', myValue.value)
  emit('change', e && e.target ? e.target.value : e)
}

const handleFileChange = async (info: any) => {
  if (info.file.status === 'done') {
    let url = info.file.response?.result?.accessUrl

    if (props.handleFileChange) {
      url = await props.handleFileChange(info, info.file.response)
    }
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
