<template>
  <div v-if="showHeader" :class="['jtable-body-header', hashId]">
    <div class="jtable-body-header-left">
      <slot name="headerLeftRender"></slot>
    </div>
    <div class="jtable-body-header-right">
      <slot name="headerRightRender"></slot>
      <div class="table-body-header-right-button" v-if="!initMode">
        <RadioGroup :value="mode" @change="(e) => emits('change', e)">
          <RadioButton value="TABLE"><AIcon type="UnorderedListOutlined" /></RadioButton>
          <RadioButton value="CARD"><AIcon type="AppstoreOutlined" /></RadioButton>
        </RadioGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Comment, Fragment, Text, computed, useSlots, type VNode } from 'vue'
import { RadioGroup, RadioButton } from 'ant-design-vue'
import AIcon from '../Icon';
import { _headerProps } from './setting';
import useProTableStyle from './style'

defineOptions({
  name: 'Header'
})

const props = defineProps({
  ..._headerProps,
  initMode: {
    type: [String, Boolean, undefined],
    default: undefined
  }
})
const emits = defineEmits(['change'])
const slots = useSlots()

const prefixCls = computed(() => 'pro-table')
const [wrapSSR, hashId] = useProTableStyle(prefixCls)

const isValidSlotNode = (node: VNode): boolean => {
  if (node.type === Comment) {
    return false
  }

  if (node.type === Text) {
    return String(node.children || '').trim().length > 0
  }

  if (node.type === Fragment && Array.isArray(node.children)) {
    return node.children.some((child) => isValidSlotNode(child as VNode))
  }

  return true
}

const hasSlotContent = (name: 'headerLeftRender' | 'headerRightRender') => {
  const slot = slots[name]

  return slot?.().some(isValidSlotNode) || false
}

const showHeader = computed(() => {
  const shouldHideEmptyHeader = !props.initMode

  return shouldHideEmptyHeader || hasSlotContent('headerLeftRender') || hasSlotContent('headerRightRender')
})
</script>
