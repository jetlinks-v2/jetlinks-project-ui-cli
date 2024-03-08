<template>
  <PopconfirmModal
      :get-popup-container="(node) => fullRef || node.parentNode"
      :placement="placement"
      body-style="padding-top:4px;"
      @cancel="cancel"
      @confirm="confirm"
  >
    <template #content>
      <Form ref="formRef" :model="formData" layout="vertical">
        <StringItem v-model:value="formData.maxLength"/>
      </Form>
    </template>
    <slot>
      <Icon/>
    </slot>
  </PopconfirmModal>
</template>

<script lang="ts" name="String" setup>
import { watch, reactive, inject, ref } from 'vue';
import { Form } from 'ant-design-vue';
import { PopconfirmModal } from '../../../../';
import StringItem from './StringItem.vue';
import Icon from '../Icon.vue';
import { FULL_CODE } from '../../index';

const emit = defineEmits(['update:value', 'confirm', 'cancel']);

const props = defineProps({
  value: {
    type: Number,
    default: undefined,
  },
  placement: {
    type: String,
    default: 'top',
  },
});

const fullRef = inject(FULL_CODE);
const formRef = ref();
const formData = reactive({
  maxLength: props.value,
});

const confirm = () => {
  emit('update:value', formData.maxLength);
  emit('confirm', formData.maxLength);
};

const cancel = () => {
  formRef.value?.resetFields();
  formData.maxLength = props.value;
  emit('cancel');
};

watch(
    () => props.value,
    () => {
      formData.maxLength = props.value;
    },
);
</script>

<style scoped></style>
