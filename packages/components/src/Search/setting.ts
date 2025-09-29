import type { PropType } from 'vue';
import type { JColumnsProps, SearchType } from './typing';
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
} from 'ant-design-vue'
import {filterSelectNode, filterTreeSelectNode} from "./util";

export const optionsMapKey = Symbol('searchOptionsMap');

export const searchProps = () => ({
    columns: {
        type: Array as PropType<JColumnsProps[]>,
        default: () => [],
        required: true,
    },
    type: {
      type: String as PropType<SearchType>,
      default: 'terms',
      required: true,
    },
    mode: {
      type: String,
      default: 'default',
    },
    column: {
      type: Number,
      default: 4,
    },
    labelWidth: {
      type: Number,
      default: 40,
    },
    resetText: {
      type: String,
    },
    submitText: {
      type: String,
    },
    align: {
      type: String,
      default: 'value'
    }
})

export const typeOptions = (locale) => {
  return [
    { label: locale.setting.or, value: 'or' },
    { label: locale.setting.and, value: 'and' },
  ];
}

export const TermTypeMap = (locale) => {
  return {
    EQ: { label: '=', value: 'eq' },
    NOT: { label: '!=', value: 'not' },
    LIKE: { label: locale.setting?.include, value: 'like' },
    NLIKE: { label: locale.setting?.exclude, value: 'nlike' },
    GT: { label: '>', value: 'gt' },
    GTE: { label: '>=', value: 'gte' },
    LT: { label: '<', value: 'lt' },
    LTE: { label: '<=', value: 'lte' },
    IN: { label: locale.setting?.in, value: 'in' },
    NIN: { label: locale.setting?.notIn, value: 'nin' },
    BTW: { label: locale.setting?.between, value: 'btw' },
    NBTW: { label: locale.setting?.notBetween, value: 'nbtw' },
  }
};

export const termType = (locale) => Object.values(TermTypeMap(locale));

export const componentType = {
    input: 'input',
    inputNumber: 'inputNumber',
    password: 'password',
    switch: 'switch',
    radio: 'radio',
    checkbox: 'checkbox',
    time: 'time',
    date: 'date',
    timeRange: 'timeRange',
    rangePicker: 'rangePicker',
    treeSelect: 'treeSelect',
    upload: 'upload',
    tree: 'tree',
    select: 'select',
    component: 'component',
};

export const componentProps = (record: Record<string, any>) => {
  const type = record.type
  const _props = record.componentProps || {}

  switch (type) {
    case 'string':
    case componentType.input:
      return {
        type,
        name: Input,
        props: _props
      };
    case componentType.inputNumber:
      return {
        type,
        name: InputNumber,
        props: _props
      };
    case componentType.password:
      return {
        type,
        name: InputPassword,
        props: _props
      };
    case componentType.time:
      return {
        type,
        name: TimePicker,
        props: {
          valueFormat: 'HH:mm:ss',
          ..._props
        }
      };
    case componentType.date:
      return {
        type,
        name: DatePicker,
        props: {
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
          ..._props
        }
      };
    case componentType.timeRange:
      return {
        type,
        name: TimeRangePicker,
        props: {
          valueFormat: 'HH:mm:ss',
          ..._props
        }
      };
    case componentType.rangePicker:
      return {
        type,
        name: RangePicker,
        props: {
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
          showTime: true,
          ..._props
        }
      };
    case componentType.treeSelect:
      return {
        type,
        name: TreeSelect,
        props: {
          showSearch: true,
          height: 350,
          fieldNames: {
            label: 'name',
            value: 'id'
          },
          filterTreeNode: (v, option) => filterTreeSelectNode(v, option),
          filterTreeNode: (v, option) => filterTreeSelectNode(v, option),
          ..._props
        }
      };
    case componentType.select:
      return {
        type,
        name: Select,
        props: {
          showSearch: true,
          // mode: isBtw ? 'multiple' : 'combobox',
          filterOption: (v, option) => filterSelectNode(v, option, 'label'),
          style: {
            width: '100%',
            minWidth: '80px',
          },
          ..._props
        }
      };
    case componentType.component:
      return {
        type,
        name: record.components,
        props: _props
      };
      default:
        return {}
  }
}
