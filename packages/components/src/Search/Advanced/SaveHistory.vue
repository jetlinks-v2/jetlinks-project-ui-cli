<template>
  <Popover
      v-model:open="visible"
      :title="contextLocale.advanced.saveHistory.searchName"
      trigger="click"
      placement="bottom"
      @visibleChange="visibleChange"
  >
    <template #content>
      <div v-if="visible" style="width: 240px">
        <Form ref="formRef" :model="modelRef">
          <FormItem
              name="name"
              :rules="[
                            { required: true, message: contextLocale.advanced.saveHistory.placeholder },
                            { max: 64, message: contextLocale.advanced.saveHistory.ruleName },
                        ]"
          >
                        <Textarea
                            v-model:value="modelRef.name"
                            :rows="3"
                            :maxlength="200"
                        />
          </FormItem>
        </Form>
        <Button
            :loading="saveHistoryLoading"
            type="primary"
            class="save-btn"
            style="width: 100%"
            @click="saveHistory"
        >
          {{contextLocale.advanced.saveHistory.save}}
        </Button>
      </div>
    </template>
    <Button ghost type="primary">{{contextLocale.advanced.saveHistory.save}}</Button>
  </Popover>
</template>

<script setup lang="ts">
import type { Terms } from '../typing';
import type { PropType } from 'vue';
import { ref, reactive } from 'vue';
import { Form, Button, FormItem, Popover, Textarea, message } from 'ant-design-vue'
import { isFunction } from 'lodash-es';
import {useLocaleReceiver} from "../../LocaleReciver";

const props = defineProps({
  terms: {
    type: Object as PropType<Terms>,
    default: () => ({}),
  },
  target: {
    type: String,
    default: '',
    required: true,
  },
  request: {
    type: Function as PropType<(data: any, target: string) => Promise<any>>,
    default: null,
  },
});

const [contextLocale] = useLocaleReceiver('Search');
const saveHistoryLoading = ref(false);

const visible = ref(false);

const formRef = ref();

const modelRef = reactive({
  name: undefined,
});

const visibleChange = (e: boolean) => {
  visible.value = e;
  if (!e) {
    setTimeout(() => {
      modelRef.name = undefined;
    }, 100);
  }
};

/**
 * 保存当前查询条件
 */
const saveHistory = async () => {
  // 获取当前查询条件并转化为字符串
  const formData = await formRef.value.validate();
  if (formData && props.request && isFunction(props.request)) {
    formData.content = JSON.stringify(props.terms);
    saveHistoryLoading.value = true;
    const resp = await props.request(formData, props.target);
    saveHistoryLoading.value = false;
    if (resp.success || resp.status === 200 || resp.code === 200) {
      message.success(contextLocale.value.advanced.saveHistory.success);
      visibleChange(false);
    } else {
      message.error(contextLocale.value.advanced.saveHistory.fail);
    }
  }
};
</script>

<style scoped lang="less">
.save-btn {
  width: 100%;
}
</style>
