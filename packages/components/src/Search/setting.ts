import { PropType } from 'vue';
import { JColumnsProps } from './typing';

export const optionsMapKey = Symbol('searchOptionsMap');
export const basicSearch = {
    columns: {
        type: Array as PropType<JColumnsProps[]>,
        default: () => [],
        required: true,
    },
    type: {
        type: String,
        default: 'advanced',
    },
};

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
    LIKE: { label: locale.setting.include, value: 'like' },
    NLIKE: { label: locale.setting.exclude, value: 'nlike' },
    GT: { label: '>', value: 'gt' },
    GTE: { label: '>=', value: 'gte' },
    LT: { label: '<', value: 'lt' },
    LTE: { label: '<=', value: 'lte' },
    IN: { label: locale.setting.in, value: 'in' },
    NIN: { label: locale.setting.notIn, value: 'nin' },
    BTW: { label: locale.setting.between, value: 'btw' },
    NBTW: { label: locale.setting.notBetween, value: 'nbtw' },
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
