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
import { defineProps, defineOptions, defineEmits } from 'vue';
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

<style lang="less" scoped>
@import 'ant-design-vue/es/style/themes/variable.less';

.jtable-body-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .jtable-body-header-right {
    display: flex;
    gap: 8px;
    align-items: center;

    .jtable-body-header-right-button {
      .right-button-icon {
        font-size: 16px;
        color: #d9d9d9;
      }

      .ant-radio-button-wrapper {
        padding: 0 8px;
      }

      :deep(.ant-radio-button-wrapper-checked) {
        color: @primary-color;
      }
    }
  }
}
</style>
