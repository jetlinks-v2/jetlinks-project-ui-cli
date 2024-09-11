<template>
  <div class="JSearch-item">
    <template v-if="!onlyValue">
      <div v-if="expand" class="JSearch-item--type">
        <Select
          v-if="index !== 1 && index !== 4"
          v-model:value="termsModel.type"
          :options="typeOptions"
          style="width: 100%"
          @change="valueChange"
        />
        <span v-else>
                    {{ index === 1 ? '第一组' : '第二组' }}
                </span>
      </div>
      <Select
        v-model:value="termsModel.column"
        placeholder="请选择"
        class="JSearch-item--column"
        :options="columnOptions"
        @change="columnChange"
      />
      <Select
        v-model:value="termsModel.termType"
        placeholder="请选择"
        class="JSearch-item--termType"
        :options="termTypeOptions.option"
        @change="termTypeChange"
      />
    </template>
    <template v-else>
      <div
        class="JSearch-item--label"
        :style="{ minWidth: `${labelWidth}px` }"
      >
        {{
          columnOptions.length ? columnOptions[index - 1]?.label : ''
        }}
      </div>
    </template>
    <div class="JSearch-item--value">
      <FormItem no-style>
        <Input
          v-if="component === componentType.input"
          v-model:value="termsModel.value"
          allow-clear
          v-bind="cProps"
          style="width: 100%"
          @change="valueChange"
        />
        <Select
          v-else-if="component === componentType.select"
          v-model:value="termsModel.value"
          allow-clear
          show-search
          :mode="isBtw ? 'multiple' : 'combobox'"
          v-bind="cProps"
          style="width: 100%; min-width: 80px"
          :loading="optionLoading"
          :options="options"
          :filter-option="
                        (v, option) => filterSelectNode(v, option, 'label')
                    "
          @change="valueChange"
        />
        <InputNumber
          v-else-if="component === componentType.inputNumber"
          v-model:value="termsModel.value"
          allow-clear
          v-bind="cProps"
          style="width: 100%"
          @change="valueChange"
        />
        <InputPassword
          v-else-if="component === componentType.password"
          v-model:value="termsModel.value"
          allow-clear
          v-bind="cProps"
          style="width: 100%"
          @change="valueChange"
        />
        <TimePicker
          v-else-if="component === componentType.time"
          v-model:value="termsModel.value"
          allow-clear
          value-format="HH:mm:ss"
          style="width: 100%"
          v-bind="cProps"
          @change="valueChange"
        />
        <TimeRangePicker
          v-else-if="component === componentType.timeRange"
          v-model:value="termsModel.value"
          allow-clear
          value-format="HH:mm:ss"
          style="width: 100%"
          v-bind="cProps"
          @change="valueChange"
        />
        <DatePicker
          v-else-if="component === componentType.date"
          v-model:value="termsModel.value"
          allow-clear
          show-time
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%"
          v-bind="cProps"
          @change="valueChange"
        />
        <RangePicker
          v-else-if="component === componentType.rangePicker"
          v-model:value="termsModel.value"
          allow-clear
          show-time
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%"
          v-bind="cProps"
          @change="valueChange"
        />
        <TreeSelect
          v-else-if="component === componentType.treeSelect"
          v-model:value="termsModel.value"
          allow-clear
          show-search
          style="width: 100%"
          :height="350"
          :field-names="{ label: 'name', value: 'id' }"
          :multiple="isBtw"
          :filter-tree-node="
                        (v, option) => filterTreeSelectNode(v, option)
                    "
          v-bind="cProps"
          :tree-data="options"
          @change="valueChange"
        />
        <component
          :is="componentName"
          v-else-if="
                        component === componentType.component && componentName
                    "
          v-bind="cProps"
          v-model:value="termsModel.value"
          @change="valueChange"
        />
      </FormItem>
    </div>
  </div>
</template>

<script setup lang="ts" name="SearchItem">
import { typeOptions, termType, componentType, optionsMapKey } from './setting';
import type { PropType } from 'vue';
import { ref, reactive, nextTick, watch, computed, inject } from 'vue';
import type { SearchItemData, SearchProps } from './typing';
import { cloneDeep, debounce, isArray, isFunction, omit } from 'lodash-es';
import {
  filterTreeSelectNode,
  filterSelectNode,
  getTermTypeFn,
  getTermOptions,
  getTermTypes,
} from './util';
import {
  TreeSelect,
  Select,
  Input,
  InputNumber,
  DatePicker,
  TimePicker,
  InputPassword,
  RangePicker,
  TimeRangePicker,
  FormItem
} from 'ant-design-vue'
import { isPromise } from '@jetlinks-web/utils';

type ItemType = SearchProps['type'];

type UrlParam = {
  q: string | null;
  target: string | null;
};

interface Emit {
  (e: 'change', data: SearchItemData): void;
}

const props = defineProps({
  columns: {
    type: Array as PropType<SearchProps[]>,
    default: () => [],
    required: true,
  },
  index: {
    type: Number,
    default: 1,
  },
  expand: {
    type: Boolean,
    default: false,
  },
  termsItem: {
    type: Object as PropType<SearchItemData>,
    default: () => ({}),
  },
  componentProps: {
    type: Object,
    default: () => ({}),
  },
  onlyValue: {
    type: Boolean,
    default: false,
  },
  reset: {
    type: Number,
    default: 1,
  },
  labelWidth: {
    type: Number,
    default: 40,
  },
});

type optionItemType = { label: string; value: any };

const emit = defineEmits<Emit>();

const termsModel = reactive<SearchItemData>({
  type: props.termsItem?.type || 'or',
  value: props.termsItem?.value || '',
  termType: props.termsItem?.termType || 'like',
  column: props.termsItem?.column || undefined,
});

const isBtw = computed(() => {
  return ['in', 'nin'].includes(termsModel.termType);
});

const component = ref(componentType.input);
const componentName = ref();
const cProps = ref({});

const options = ref<any[]>([]);

const columnOptions = ref<optionItemType[]>([]);
const columnOptionMap = inject(optionsMapKey, new Map());

const termTypeOptions = reactive({option: termType});

const optionLoading = ref(false);

/**
 * 根据类型切换默termType值
 * @param type {}
 * @param column {}
 * @param options {}
 * @param defaultTermType {}
 */
const getTermType = (
  type?: ItemType,
  column?: string,
  options?: string[],
  defaultTermType?: string,
  termFilter?: string[],
) => {
  termTypeOptions.option = options?.length
    ? getTermTypes(options)
    : getTermOptions(type, column);
  if (termFilter?.length) {
    termTypeOptions.option = termTypeOptions.option.filter(
      (item) => !termFilter.includes(item.value),
    );
  }
  return defaultTermType || options?.length
    ? termTypeOptions.option[0].value
    : getTermTypeFn(type, column);
};

/**
 * 根据类型返回组件
 * @param type
 */
const getComponent = (type?: ItemType) => {
  switch (type) {
    case 'select':
      component.value = componentType.select;
      break;
    case 'treeSelect':
      component.value = componentType.treeSelect;
      break;
    case 'date':
      component.value = componentType.date;
      break;
    case 'time':
      component.value = componentType.time;
      break;
    case 'number':
      component.value = componentType.inputNumber;
      break;
    case 'timeRange':
      component.value = componentType.timeRange;
      break;
    case 'rangePicker':
      component.value = componentType.rangePicker;
      break;
    case 'component':
      component.value = componentType.component;
      break;
    default:
      component.value = componentType.input;
      break;
  }
};

const removeOptionByKey = (options: any[]): any[] => {
  return options.map((item) => {
    if (item.children) {
      item.children = removeOptionByKey(item.children);
    }
    return omit(item, ['key']);
  });
};

const handleItemOptions = debounce((option?: any[] | Function) => {
  options.value = [];
  if (isArray(option)) {
    options.value = option;
  } else if (isFunction(option)) {
    optionLoading.value = true;
    const fn = option();
    if (isPromise(fn)) {
      (fn as Promise<any>)
        .then((res: any[]) => {
          optionLoading.value = false;
          options.value = removeOptionByKey(res);
        })
        .catch((_: any) => {
          optionLoading.value = false;
        });
    } else {
      optionLoading.value = false;
      options.value = removeOptionByKey(fn || []);
    }
  }
}, 100);

const initModel = () => {
  termsModel.type = 'or';
  termsModel.column = undefined;
  termsModel.value = undefined;
  termsModel.termType = undefined;
  termTypeOptions.option = termType;
};
const columnChange = (
  value: string,
  isChange: boolean,
  changeValue: boolean = true,
) => {
  const item = columnOptionMap.value?.get(value);

  if (!item) {
    initModel();
    return;
  }
  cProps.value = item.componentProps;
  optionLoading.value = false;
  // 设置value为undefined
  termsModel.column = value;
  getComponent(item.type); // 处理Item的组件类型
  componentName.value = item.components;

  // 处理options 以及 request

  if ('options' in item) {
    handleItemOptions(item.options);
  }

  const termsTypeValue = getTermType(
    item.type,
    value,
    item.termOptions,
    item.defaultTermType,
    item.termFilter,
  );

  if (changeValue) {
    termsModel.value = undefined;
    termsModel.termType = termsTypeValue;
  }

  if (isChange) {
    valueChange();
  }
};

const handleItem = () => {
  columnOptions.value = [];
  if (!props.columns.length) return;
  columnOptions.value = props.columns.map((item) => {
    // 对columns进行Map处理以及值处理
    return {
      label: item.title,
      value: item.column,
    };
  });

  if (!props.onlyValue) {
    // 获取第一个值
    const sortColumn = cloneDeep(props.columns);
    sortColumn?.sort((a, b) => a.sortIndex! - b.sortIndex!);

    const _index =
      props.index > sortColumn.length
        ? sortColumn.length - 1
        : props.index;

    if (props.index <= sortColumn.length) {
      const _itemColumn = sortColumn[_index - 1];
      columnChange(_itemColumn.column as string, false);
    } else {
      columnChange(null, false);
    }
  } else {
    columnChange(props.columns[props.index - 1]?.column as string, false);
  }
};

const termTypeChange = (v) => {
  const isOldValueMultiple = ['in', 'nin'].includes(
    props.termsItem?.termType,
  );
  const isValueMultiple = ['in', 'nin'].includes(v);

  if (isOldValueMultiple !== isValueMultiple) {
    termsModel.value = isValueMultiple ? [] : undefined;
  }
  valueChange();
};

const valueChange = () => {
  emit('change', {
    type: props.onlyValue ? 'and' : termsModel.type || 'or',
    value: termsModel.value,
    termType: termsModel.termType || 'like',
    column: termsModel.column,
  });
};

const reset = () => {
  termsModel.value = undefined;
};

watch(
  () => props.columns,
  () => {
    if (props.columns) {
      handleItem();
    }
  },
  {immediate: true, deep: true},
);

watch(
  () => props.termsItem,
  (val, oldVal) => {
    if (val?.column) {
      nextTick(() => {
        Object.keys(props.termsItem).forEach((key) => {
          termsModel[key] = props.termsItem[key];
          if (key === 'column' && val?.column !== oldVal?.column) {
            columnChange(
              props.termsItem.column as string,
              false,
              false,
            );
          }
        });
      });
    } else {
      handleItem();
    }
  },
  {immediate: true, deep: true},
);
</script>

<style scoped lang="less">
.JSearch-item {
  display: flex;
  gap: 16px;
  align-items: center;

  .JSearch-item--type {
    width: 90px;
    min-width: 0;

    > span {
      line-height: 34px;
      font-weight: bold;
    }
  }

  .JSearch-item--column {
    width: 130px;
    min-width: 0;
  }

  .JSearch-item--termType {
    width: 110px;
    min-width: 0;
  }

  .JSearch-item--label {
    min-width: 40px;
  }

  .JSearch-item--value {
    display: flex;
    width: 0;
    flex-grow: 1;
  }
}

</style>
