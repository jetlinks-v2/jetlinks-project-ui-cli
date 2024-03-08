<template>
  <Select
      v-bind="props"
      v-model:value="_value"
      :options="_options"
      placeholder="请选择数据类型"
      style="width: 100%"
      @change="change"
  />
</template>

<script lang="ts" name="TypeSelect" setup>
import type { PropType } from 'vue';
import { computed, inject, ref, watch } from 'vue';
import defaultOptions from './data';
import { selectProps } from 'ant-design-vue/lib/select';
import { Select } from 'ant-design-vue';
import { FULL_CODE } from '../../index';

const emit = defineEmits(['update:value']);

const props = defineProps({
  ...selectProps(),
  filter: {
    type: [Array] as PropType<string[]>,
    default: () => [],
  },
});

const _value = ref(props.value);

const _options = computed(() => {
  return props.filter.length
      ? defaultOptions.filter(
          (item: { value: string }) => !props.filter.includes(item.value),
      )
      : defaultOptions;
});

const fullRef = inject(FULL_CODE);

const change = (key) => {
  _value.value = key;
  emit('update:value', key);
};

watch(
    () => props.value,
    () => {
      _value.value = props.value;
    },
);
</script>

<style scoped></style>
