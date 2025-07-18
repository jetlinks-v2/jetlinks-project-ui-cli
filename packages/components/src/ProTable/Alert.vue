<template>
  <div :class="['jtable-alert', hashId]">
    <slot>
      <Alert type="info" :message="_message">
        <template #closeText>
          <Button type="link" @click="onClose">{{contextLocale.alert?.cancelChoose}}</Button>
        </template>
      </Alert>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { Alert, Button } from 'ant-design-vue';
import { computed } from "vue";
import {_alertProps} from "./setting";
import {useLocaleReceiver} from "../LocaleReciver/index";
import useProTableStyle from './style'

defineOptions({
  name: 'Alert'
})

const [contextLocale] = useLocaleReceiver('ProTable');
const props = defineProps({ ..._alertProps })
const emits = defineEmits(['close'])

const prefixCls = computed(() => 'pro-table')
const [wrapSSR, hashId] = useProTableStyle(prefixCls)
const _message = computed(() => {
  let locale = contextLocale.value?.alert?.selectItem || '';
  [props.rowSelection?.selectedRowKeys?.length || 0].forEach((item, index) => {
    locale = locale.replace(`{${index}}`, item)
  })
  return  locale
})

const onClose = () => {
  emits('close')
}
</script>
