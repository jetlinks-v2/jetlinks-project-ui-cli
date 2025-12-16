<script setup lang="ts">
import {computed, defineOptions, ref, reactive, watch, isRef, nextTick} from 'vue'
import { Select, DatePicker, RangePicker } from 'ant-design-vue'
import {componentProps, componentType, typeOptions} from "./setting";
import { getTermOptions, getItemDefaultValue} from "./util";
import {useLocaleReceiver} from "../LocaleReciver";
import type {SearchItemData} from "./typing";
import {useColumnsMap, useDefaultValue, useOptionMap} from "./hooks";
import {isArray, isFunction} from "lodash-es";
import useSearchStyle from './style'

defineOptions({
  name: 'JSearchItem'
})

const props = defineProps({
  column: {
    type: String,
  },
  value: {
    type: String
  },
  termType: {
    type: String,
    default: 'like'
  },
  type: {
    type: String,
    default: 'or'
  },
  expand: {
    type: Boolean,
    default: false,
  },
  onlyValue: {
    type: Boolean,
    default: true,
  },
  labelWidth: {
    type: Number,
    default: 40,
  },
  index: {
    type: Number,
    default: 1
  }
});
const emit = defineEmits(['update:value', 'update:termType', 'update:type', 'update:column']);

const termsModel = reactive<SearchItemData>({
  type: props.type || 'or',
  value: props.value || '',
  termType: props.termType || 'like',
  column: props.column || undefined,
});

const [contextLocale] = useLocaleReceiver('Search');
const optionsMap = useOptionMap()
const columnsMap = useColumnsMap()
const columnsValues = useDefaultValue()
const targetComponents = ref<{ type?:string, label?: string, name?: any, props?: Record<string, any> }>({})
const valueOptions = ref()

const btwKeys = computed(() => {
  const record = findItemByColumn()
  if (record.search.isBtw && Array.isArray(record.search.isBtw)) {
    return [...record.search.isBtw, 'in', 'nin']
  }

  return ['in', 'nin']
})

const prefixCls = computed(() => 'JSearch')
const [wrapSSR, hashId] = useSearchStyle(prefixCls);
const termTypeOptions = computed(() => {

  const columnTarget = findItemByColumn()
  const columnSearch = columnTarget?.search

  let _termsOptions = getTermOptions(targetComponents.value.type, contextLocale.value)

  if (columnSearch?.termOptions) {
    _termsOptions = columnSearch.termOptions
  }else if (columnSearch?.termFilter?.length) {
    _termsOptions = _termsOptions.filter((item) => !columnSearch.termFilter?.includes(item.value))
  }

  return _termsOptions
})

const columnOptions = computed(() => {
  return Object.values(columnsMap.value).sort((a, b) => a._sort_index - b._sort_index).map(item => ({ label: item.title, value: item.dataIndex }))
})

const findItemByColumn = () => {
  return columnsMap.value[termsModel.column as string];
}

const findOptionsByColumn = () => {
  return optionsMap.value[termsModel.column as string];
}

/**
 * 处理options
 * @param _options
 */
const handleColumnsOptions = async (_options: any) => {
  if (isFunction(_options)) {
    valueOptions.value = await _options();
    optionsMap.value[props.column] = [...valueOptions.value]
  } else if(isArray(_options)) {
    valueOptions.value = _options;
  } else if(isRef(_options) || (typeof _options === 'object' && 'value' in _options)) {
    valueOptions.value = _options.value;
  }
}

const onTypeChange = () => {
  emit('update:type', termsModel.type)
}

const onColumnChange = () => {
  const record = findItemByColumn();
  const defaultValue = getItemDefaultValue(record, columnsValues.value);
  // 处理默认选项
  termsModel.termType = defaultValue.termType;
  // 处理默认值
  termsModel.value = defaultValue.value;

  emit('update:column', termsModel.column)
  onTermTypeChange()
  onValueChange()
}

const onTermTypeChange = () => {
  const isBtw = btwKeys.value.includes(termsModel.termType);

  if (!isBtw && termsModel.value && Array.isArray(termsModel.value)) {
    termsModel.value = termsModel.value[0]
    onValueChange()
  } else if (isBtw && termsModel.value && !Array.isArray(termsModel.value)) {
    termsModel.value = [termsModel.value]
    onValueChange()
  }

  emit('update:termType', termsModel.termType)
}

const onValueChange = () => {
  emit('update:value', termsModel.value)
}
const handleTermsModelValue = (isBtw: boolean) => {
  if (isBtw) {
    if (termsModel.value && !Array.isArray(termsModel.value)) {
      termsModel.value = [termsModel.value]
    } else if (!termsModel.value) {
      termsModel.value = []
    }
  } else {
    if (termsModel.value && Array.isArray(termsModel.value)) {
      termsModel.value = termsModel.value[0]
    } else if (!termsModel.value) {
      termsModel.value = undefined
    }
  }
}

watch(() => [targetComponents.value.name, termsModel.termType], () => {
  const isBtw = btwKeys.value.includes(termsModel.termType);

  if (targetComponents.value.type === componentType.treeSelect) {
    targetComponents.value.props = {
      ...targetComponents.value.props,
      multiple: isBtw,
    }
    handleTermsModelValue(isBtw)
  } else if (targetComponents.value.type === componentType.select) {
    targetComponents.value.props = {
      ...targetComponents.value.props,
      mode: isBtw ? 'multiple' : 'combobox',
    }
    handleTermsModelValue(isBtw)
  } else if (targetComponents.value.type === componentType.date && ['btw', 'between'].includes(termsModel.termType)) {
    // 当日期类型选择了 btw 时，切换到 RangePicker 组件
    targetComponents.value.name = RangePicker
    termsModel.value = []
  } else if (targetComponents.value.type === componentType.date && !['btw', 'between'].includes(termsModel.termType)) {
    // 当 RangePicker 取消 btw 时，切换回 DatePicker 组件
    targetComponents.value.name = DatePicker
    termsModel.value = undefined
  }
}, { immediate: true, deep: true })

watch(() => [termsModel.column, columnsMap.value], async () => {
  // 根据column从map中获取record，再解析search属性
  const record = findItemByColumn();
  if (!record) return

  const options = findOptionsByColumn();

  targetComponents.value = componentProps(record.search );
  targetComponents.value.label = record.title

  //  处理options
  if (options) {
    valueOptions.value = options
  } else {
    await handleColumnsOptions(record.search.options)
  }
}, { immediate: true, deep: true })

watch(() => [props.value, props.termType, props.column, props.type], () => {
  termsModel.value = props.value;
  termsModel.termType = props.termType;
  termsModel.column = props.column;
  termsModel.type = props.type;
})

</script>

<template>
  <div :class="['JSearch-item', hashId]">
    <div
      v-if="onlyValue"
      class="JSearch-item--label"
      :style="{ minWidth: `${labelWidth}px` }"
    >
      {{ targetComponents.label }}
    </div>
    <template v-else>
      <div v-if="expand" class="JSearch-item--type">
        <Select
          v-if="index !== 1 && index !== 4"
          v-model:value="termsModel.type"
          :options="typeOptions(contextLocale)"
          style="width: 100%"
          @change="onTypeChange"
        />
        <span v-else>
          {{ index === 1 ? contextLocale.item.firstGroup :  contextLocale.item.secondGroup }}
        </span>
      </div>
      <Select
        v-model:value="termsModel.column"
        :placeholder="contextLocale.item.placeholder"
        class="JSearch-item--column"
        :options="columnOptions"
        @change="onColumnChange"
      />
      <Select
        v-model:value="termsModel.termType"
        :placeholder="contextLocale.item.placeholder"
        class="JSearch-item--termType"
        :options="termTypeOptions"
        @change="onTermTypeChange"
      />
    </template>
    <div class="JSearch-item--value">
      <component
        :is="targetComponents.name"
        allow-clear
        style="width: 100%; min-width: 80px"
        v-bind="targetComponents.props"
        :options="!['treeSelect', 'tree'].includes(targetComponents.type) && valueOptions"
        :treeData="['treeSelect', 'tree'].includes(targetComponents.type) && valueOptions"
        v-model:value="termsModel.value"
        @change="onValueChange"
      />
    </div>
  </div>
</template>
