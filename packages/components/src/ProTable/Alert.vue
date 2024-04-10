<template>
  <div class="jtable-alert">
    <slot>
      <Alert type="info" :message="_message">
        <template #closeText>
          <Button type="link" @click="onClose">取消选择</Button>
        </template>
      </Alert>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { Alert, Button } from 'ant-design-vue';
import { defineOptions, defineProps, computed } from "vue";
import {_alertProps} from "./setting";

defineOptions({
  name: 'Alert'
})

const props = defineProps({ ..._alertProps })
const emits = defineEmits(['close'])

const _message = computed(() => {
  return  '已选择' + (props.rowSelection?.selectedRowKeys?.length || 0) + '项'
})

const onClose = () => {
  emits('close')
}
</script>

<style lang="less" scoped>
.jtable-alert {
  margin-bottom: 16px;
}
</style>
