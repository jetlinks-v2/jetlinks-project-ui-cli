<template>
  <Select
      v-model:value="value"
      :get-popup-container="(node) => fullRef || node.parentNode"
      :options="unitOptions"
      :size="size"
      mode="tags"
      placeholder="请选择单位"
      style="width: 100%"
      @change="change"
  />
</template>

<script lang="ts" name="UnitSelect" setup>
import { UnitProps } from './defaultSetting';
import type { PropType } from 'vue';
import { inject, ref, watch } from 'vue';
import { isArray, isFunction } from '@jetlinks-web/utils';
import { Form, Select } from 'ant-design-vue';
import { FULL_CODE } from '../../index';

type valueType = string | number;

type Emits = {
  (e: 'update:value', data: valueType | undefined): void;
  (e: 'change', data: valueType | undefined): void;
};

type SizeType = 'small' | 'middle' | 'large' | undefined;
const emit = defineEmits<Emits>();
const props = defineProps({
  ...UnitProps,
  value: {
    type: [String, Number],
    default: undefined,
  },
  size: {
    type: String as PropType<SizeType>,
    default: undefined,
  },
});

const fullRef = inject(FULL_CODE);

const value = ref<valueType[]>(props.value ? [props.value] : []);
const unitOptions = ref([]);

const formItemContext = Form.useInjectFormItemContext();

const change = (v: valueType[]) => {
  const newValue = v.length > 1 ? v.pop() : v?.[0];
  value.value = [newValue];
  emit('update:value', newValue);
  emit('change', newValue);
  formItemContext.onFieldChange();
};

const initOptions = async () => {
  if (isArray(props.options)) {
    unitOptions.value = props.options;
  } else if (isFunction(props.options)) {
    unitOptions.value = await props.options();
  }
};

initOptions();

watch(
    () => props.value,
    (newV) => {
      value.value = newV ? [newV] : undefined;
    },
    {immediate: true},
);
</script>

<style scoped></style>
