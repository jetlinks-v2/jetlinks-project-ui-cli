<template>
  <div :class="['j-check-button', props.class, hashId]" :style="style">
    <div
        v-for="item in _options"
        :key="item.value"
        :class="[
                'j-check-button-item',
                myValue.includes(item.value) ? 'selected' : '',
                item.disabled ? 'disabled' : '',
                hashId
            ]"
        @click="
                () => {
                    selected(item.value, item.disabled);
                }
            "
    >
      {{ item.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties, PropType } from 'vue';
import { computed, ref, watch, defineEmits, defineOptions, defineProps } from 'vue';
import { isArray } from '@jetlinks-web/utils';
import useCheckButtonStyle from './style';

defineOptions({
  name: 'JCheckButton'
})

const props = defineProps({
  value: {
    type: [String, Array],
    default: undefined,
  },
  options: {
    type: Array as PropType<{ disabled?: boolean; label: string; value: string }[]>,
    default: () => [],
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
    default: undefined,
  },
  style: {
    type: Object as PropType<CSSProperties>,
    default: () => ({}),
  },
});
const emit = defineEmits(['update:value', 'change', 'select']);

// 使用样式
const prefixCls = computed(() => 'j-check-button')
const [wrapSSR, hashId] = useCheckButtonStyle(prefixCls)

const myValue = ref();
const optionsMap = ref(new Map());

const _options = computed(() => {
  props.options.forEach((item: any) => {
    if (props.disabled) {
      item.disabled = props.disabled;
    }
    optionsMap.value.set(item.value, item);
  });
  return props.options;
});

watch(
    () => props.value,
    () => {
      if (props.value) {
        myValue.value = isArray(props.value) ? props.value : [props.value];
      } else {
        myValue.value = [];
      }
    },
    {immediate: true, deep: true},
);

const selected = (key: string | number, disabled: boolean) => {
  if (disabled) return;

  const values = new Set(myValue.value);

  if (values.has(key)) {
    values.delete(key);
  } else {
    if (!props.multiple) {
      values.clear();
    }
    values.add(key);
  }

  myValue.value = [...values.values()];

  const optionsItems = myValue.value.map((_key) => {
    return optionsMap.value.get(_key);
  });

  const _value = props.multiple ? myValue.value : myValue.value[0];

  emit('update:value', _value);
  emit('change', _value, props.multiple ? optionsItems : optionsItems[0]);
  emit('select', _value, props.multiple ? optionsItems : optionsItems[0]);
};
</script>

<style scoped lang="less">
</style>
