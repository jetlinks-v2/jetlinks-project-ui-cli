<template>
  <Select
      v-model:value="myValue"
      allowClear
      v-bind="props"
      :options="_options"
      mode="tags"
      style="width: 100%"
      @select="onSelect"
      @search="handleSearch"
      @change="handleChange"
  >
  </Select>
</template>

<script lang="ts" setup>
import { Select } from 'ant-design-vue';
import type { DefaultOptionType } from 'ant-design-vue/lib/vc-select/Select';
import { selectProps } from 'ant-design-vue/lib/select';
import {ref, defineProps, defineEmits, defineOptions, watch, computed} from 'vue';

defineOptions({
  name: 'JAutoComplete'
})

type Emit = {
  (e: 'select', value, option): void;
  (e: 'change', value): void;
  (e: 'update:value', value: string): void
};

const props = defineProps({
  ...selectProps(),
  searchKey: {
    type: String,
    default: 'label',
  },
});
const emit = defineEmits<Emit>();
const myValue = ref();
const _label = ref()

const handleChange = (e) => {
  if (e.length === 0) {
    myValue.value = undefined
    emit('update:value', undefined)
  }
}

const _options = computed(() => {
  const item = props.options.find(option => option.value === myValue.value);

  if (item || !myValue.value) {
    _label.value = item?.label;
    return props.options
  }

  _label.value = myValue.value;
  return [
    { label: myValue.value, value: myValue.value },
    ...props.options
  ]
})

const handleSearch = (e) => {
  myValue.value = e
}

const onSelect = (val: string, option: DefaultOptionType) => {
  myValue.value = val;
  emit('update:value', val)
  emit('select', val, option)
}

watch(
    () => props.value,
    (val) => {
      myValue.value = val
    },
    { immediate: true }
)
</script>

