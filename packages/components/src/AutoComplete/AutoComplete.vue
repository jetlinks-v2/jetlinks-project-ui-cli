<template>
  <Select
    v-if="props.multiple"
    :value="myValue"
    allowClear
    v-bind="componentProps"
    mode="tags"
    :options="displayOptions"
    style="width: 100%"
    @select="onSelect"
    @search="handleSearch"
    @change="handleMultipleChange"
  />
  <AutoComplete
    v-else
    :value="myValue"
    allowClear
    v-bind="componentProps"
    :options="displayOptions"
    style="width: 100%"
    @select="onSelect"
    @search="handleSearch"
    @change="handleSingleChange"
    @blur="handleSingleBlur"
  />
</template>

<script lang="ts" setup>
import { AutoComplete, Select } from 'ant-design-vue'
import type { DefaultOptionType } from 'ant-design-vue/lib/vc-select/Select'
import { selectProps } from 'ant-design-vue/lib/select'
import {
  ref,
  defineProps,
  defineEmits,
  defineOptions,
  watch,
  computed,
} from 'vue'

defineOptions({
  name: 'JAutoComplete',
})

type Emit = {
  (e: 'select', value, option): void
  (e: 'change', value): void
  (e: 'update:value', value: string | string[] | undefined): void
}

const props = defineProps({
  ...selectProps(),
  searchKey: {
    type: String,
    default: 'label',
  },
  multiple: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<Emit>()
const myValue = ref()
const searchValue = ref('')
const customOptions = ref<DefaultOptionType[]>([])

const isEmpty = (val) => val === undefined || val === null || val === ''

const normalizeText = (val) => {
  if (isEmpty(val)) {
    return ''
  }
  if (typeof val === 'object' && val !== null && 'value' in val) {
    return String(val.value ?? '').trim()
  }
  return String(val).trim()
}

const isOptionMatched = (option: DefaultOptionType, keyword: string) => {
  const optionValue = normalizeText(option?.value)
  const optionLabel = normalizeText(option?.[props.searchKey] ?? option?.label)
  return optionValue === keyword || optionLabel === keyword
}

const isOptionContainsKeyword = (option: DefaultOptionType, keyword: string) => {
  const optionValue = normalizeText(option?.value)
  const optionLabel = normalizeText(option?.[props.searchKey] ?? option?.label)
  return optionValue.includes(keyword) || optionLabel.includes(keyword)
}

const componentProps = computed(() => {
  const { multiple, searchKey, options, value, mode, ...rest } = props
  return rest
})

const mergedOptions = computed<DefaultOptionType[]>(() => {
  const baseOptions = Array.isArray(props.options)
    ? (props.options as DefaultOptionType[])
    : []
  const result: DefaultOptionType[] = []
  const keys = new Set<string>()

  ;[...customOptions.value, ...baseOptions].forEach((option) => {
    const key = normalizeText(option?.value || option?.[props.searchKey] || option?.label)
    if (!key || keys.has(key)) {
      return
    }
    keys.add(key)
    result.push(option)
  })

  return result
})

const displayOptions = computed(() => {
  const keyword = normalizeText(searchValue.value)
  if (!keyword) {
    return mergedOptions.value
  }

  const matchedOptions = mergedOptions.value.filter((option) =>
    isOptionContainsKeyword(option, keyword),
  )
  const exists = mergedOptions.value.some((option) => isOptionMatched(option, keyword))
  if (exists) {
    return matchedOptions
  }

  return [{ label: keyword, value: keyword }, ...matchedOptions]
})

const appendCustomOption = (val) => {
  const keyword = normalizeText(val)
  if (!keyword) {
    return
  }

  const exists = mergedOptions.value.some((option) => isOptionMatched(option, keyword))
  if (exists) {
    return
  }

  customOptions.value = [{ label: keyword, value: keyword }, ...customOptions.value]
}

const handleSearch = (val) => {
  searchValue.value = normalizeText(val)
}

const resetSearchValue = () => {
  searchValue.value = ''
}

const handleMultipleChange = (val) => {
  const nextValue = Array.isArray(val)
    ? val
    : isEmpty(val)
    ? []
    : [val]

  nextValue.forEach((item) => appendCustomOption(item))
  myValue.value = nextValue
  resetSearchValue()
  emit('update:value', nextValue)
  emit('change', nextValue)
}

const handleSingleChange = (val) => {
  const nextValue = isEmpty(val) ? undefined : val
  myValue.value = nextValue
  emit('update:value', nextValue)
  emit('change', nextValue)
}

const handleSingleBlur = () => {
  appendCustomOption(myValue.value)
  resetSearchValue()
}

const onSelect = (val, option: DefaultOptionType) => {
  appendCustomOption(val)
  resetSearchValue()
  emit('select', val, option)
}

const normalizeValueByMode = (val) => {
  if (isEmpty(val)) {
    return props.multiple ? [] : undefined
  }
  if (props.multiple) {
    return Array.isArray(val) ? val : [val]
  }
  return Array.isArray(val) ? val[val.length - 1] : val
}

watch(
  [() => props.value, () => props.multiple],
  ([val]) => {
    const nextValue = normalizeValueByMode(val)
    myValue.value = nextValue

    if (Array.isArray(nextValue)) {
      nextValue.forEach((item) => appendCustomOption(item))
    } else {
      if (
        !props.multiple &&
        normalizeText(nextValue) === normalizeText(searchValue.value)
      ) {
        return
      }
      appendCustomOption(nextValue)
    }
  },
  { immediate: true },
)
</script>
