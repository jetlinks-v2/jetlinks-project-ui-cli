<template>
  <PopconfirmModal
      :show-cancel="false"
      body-style="width: 300px"
      @confirm="confirm"
  >
    <template #content>
      <Form :modal="formData">
        <FormItem v-if="range === false">
          <InputNumber
              v-model:value="formData.value"
              :precision="0"
              style="width: 100%"
          />
        </FormItem>
        <div v-else class="data-table-boolean-item">
          <div class="data-table-boolean-item--value">
            <FormItem name="trueText">
              <InputNumber
                  v-model:value="formData.rangeValue[0]"
                  :precision="0"
                  style="width: 100%"
              />
            </FormItem>
          </div>
          <div>-</div>
          <div class="data-table-boolean-item--value">
            <FormItem name="trueValue">
              <InputNumber
                  v-model:value="formData.rangeValue[1]"
                  :precision="0"
                  style="width: 100%"
              />
            </FormItem>
          </div>
        </div>
      </Form>
    </template>
    <Button my-icon="EditOutlined" style="padding: 4px 8px"></Button>
  </PopconfirmModal>
</template>

<script lang="ts" setup>
import { PopconfirmModal, } from '../../../../';
import { Button, Form, FormItem, InputNumber } from 'ant-design-vue'
import type { PropType } from 'vue';
import { reactive } from 'vue';

type ValueType = number | Array<number | undefined> | undefined;

type Emit = {
  (e: 'update:value', value: ValueType): void;
};

const props = defineProps({
  range: {
    type: Boolean,
    default: false,
  },
  value: {
    type: [Number, Array] as PropType<ValueType>,
    default: undefined,
  },
});

const emit = defineEmits<Emit>();

const formData = reactive<{
  value: ValueType;
  rangeValue: ValueType;
}>({
  value: props.range === false ? props.value : undefined,
  rangeValue: props.range
      ? props.value || [undefined, undefined]
      : [undefined, undefined],
});

const confirm = () => {
  emit('update:value', props.range ? formData.rangeValue : formData.value);
};
</script>

<style scoped></style>
