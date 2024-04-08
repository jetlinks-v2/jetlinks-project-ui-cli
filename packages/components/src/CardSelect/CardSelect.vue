<template>
  <div class="j-card-select" :style="CardSelectStyle">
    <div
      v-for="item in options"
      :class="{
        'j-card-select-item': true,
        'disabled': disabled || item.disabled,
        'active': selectKeys.includes(item.value)
      }"
      @click="() => handleSelect(item.value, item)"
    >
      <slot name="itemRender" :node="item" >
        <div class="j-card-select-item-content">
          <div class="j-card-select-title">
            {{ item.label }}
          </div>
          <div class="j-card-select-describe">
            {{ item.describe }}
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup name="CardSelect">
import { has } from 'lodash-es'
const props = defineProps({
  layout: {
    type: String,
    default: 'horizontal'
  },
  options: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  column: {
    type: Number,
    default: 3,
  },
  value: {
    type: [String, Array],
    default: undefined,
  },
  itemLayout: {
    type: String,
    default: 'horizontal'
  }
})

const emit = defineEmits(['select', 'change', 'update:value'])

const selectKeys = ref([])

const CardSelectStyle = computed(() => {
  const _column = props.column > 0 && props.layout === 'horizontal' ? props.column : 1

  return {
    'grid-template-columns': `repeat(${_column}, 1fr)`
  }
})

const isMultiple = computed(() => {
  return has(props, 'multiple') && props.multiple !== false
})

const handleSelect = (key, node) => {
  if (props.disabled || node.disabled) {
    return
  }

  const selectKeysSet = new Set(selectKeys.value)
  const isActive = selectKeysSet.has(key)

  if (isMultiple.value) {
    if (isActive) {
      selectKeysSet.delete(key)
    } else {
      selectKeysSet.add(key)
    }
    selectKeys.value = [...selectKeysSet.values()]
    const nodes = props.options.filter(item => selectKeys.value.includes(item.value))
    emit('select', selectKeys.value, nodes)
    emit('change', selectKeys.value, nodes)
    emit('update:value', selectKeys.value)
  } else {
    selectKeys.value = [key]

    emit('select', key, node)
    emit('change', key, node)
    emit('update:value', key)
  }
}

watch(() => props.value, () => {
  selectKeys.value = isMultiple.value ? props.value : [props.value]
}, { immediate: true })

</script>

<style lang="less">
@import 'ant-design-vue/es/style/themes/index.less';

.j-card-select {
  display: grid;
  gap: 12px;

  .j-card-select-item {
    padding: 12px;
    border: 1px solid #e6e6e6;
    border-radius: @border-radius-base;
    cursor: pointer;

    &.active {
      border-color: @primary-color;
    }

    &.disabled {
      cursor: not-allowed;
      opacity: 0.75;
    }

    .j-card-select-describe {
      color: @text-color-subtitle;
    }
  }
}
</style>
