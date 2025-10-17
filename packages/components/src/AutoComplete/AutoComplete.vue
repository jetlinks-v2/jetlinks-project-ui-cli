<template>
  <AutoComplete
      v-bind="{ ...omit(props, ['onSelect']) }"
      style="width: 100%"
      v-model:value="displayText"
      :options="filteredOptions"
      @search="onSearch"
      @select="onSelect"
  >
    <slot name="default" />
    <template #option="{ value, label }">
      <slot name="option" :value="value">
        {{ label || value }}
      </slot>
    </template>
  </AutoComplete>
</template>

<script lang="ts" setup>
import { AutoComplete } from 'ant-design-vue';
import type { DefaultOptionType } from 'ant-design-vue/lib/vc-select/Select';
import { autoCompleteProps } from 'ant-design-vue/lib/auto-complete';
import {ref, defineProps, defineEmits, defineOptions, watch, computed} from 'vue';
import {omit} from "lodash-es";

defineOptions({
  name: 'JAutoComplete'
})

type Emit = {
  (e: 'select', value, option): void;
  (e: 'change', value): void;
  (e: 'update:value', value: string): void
};

const props = defineProps({
  ...autoCompleteProps(),
  searchKey: {
    type: String,
    default: 'label',
  },
});
const emit = defineEmits<Emit>();

const displayText = ref()
const keyword = ref('')

const filteredOptions = computed(() => {
  if (!keyword.value) return props.options
  const filterArr = props.options.filter(opt =>
    String(opt[props.searchKey] ?? '')
      .includes(keyword.value))

  if (filterArr.length === 0) {
    return [{
      label: keyword.value,
      value: keyword.value
    }]
  }

  return filterArr
})
/**
 * 根据关键词提示
 * @param searchText 关键词
 */
const onSearch = (searchText: string) => {
  keyword.value = searchText
};

const onSelect = (val: string, option: DefaultOptionType) => {
  displayText.value = option.label
  keyword.value = undefined
  emit('update:value', val)
  emit('select', val, option)
}

watch(
    () => props.value,
    (val) => {
      if (!val) {
        displayText.value = ''
      } else {
        const found = props.options?.find((opt) => opt.value === val)
        displayText.value = found?.label ?? ''
      }
    },
    { immediate: true }
)
</script>

