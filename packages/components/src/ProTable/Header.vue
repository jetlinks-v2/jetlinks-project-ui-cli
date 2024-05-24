<template>
  <div class="jtable-body-header">
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
import { RadioGroup, RadioButton } from 'ant-design-vue'
import AIcon from '../Icon';
import { _headerProps } from './setting';

defineOptions({
  name: 'Header'
})

const props = defineProps({
  ..._headerProps,
  initMode: {
    type: [String, undefined],
    default: undefined
  }
})
const emits = defineEmits(['change'])
</script>
