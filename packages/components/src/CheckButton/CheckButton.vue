<template>
  <div :class="['j-check-button', props.class]" :style="style">
    <div
        v-for="item in _options"
        :key="item.value"
        :class="[
                'j-check-button-item',
                myValue.includes(item.value) ? 'selected' : '',
                item.disabled ? 'disabled' : '',
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
import { computed, CSSProperties, PropType, ref, watch } from 'vue';
import { isArray } from '@jetlinks-web/utils';

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

const myValue = ref();
const optionsMap = ref(new Map());

const _options = computed(() => {
  props.options.forEach((item: any) => {
    if (props.disabled) {
      item.display = props.disabled;
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
.j-check-button {
  display: flex;
  gap: 16px;
  width: 100%;

  .j-check-button-item {
    flex: 1;
    min-width: 0;
    padding: 8px;
    border-radius: @border-radius-base;
    background-color: #f2f3f5;
    transition: all 0.3s;
    color: #333;
    text-align: center;
    cursor: pointer;

    &:hover {
      background-color: @primary-color;
      opacity: 0.85;
      color: #fff;
    }

    &.selected {
      background-color: @primary-color;
      color: #fff;
    }

    &.disabled {
      cursor: not-allowed;
      color: #00000060;

      &:hover {
        background-color: #f2f3f5;
        color: #00000060;
      }
    }
  }
}
</style>
