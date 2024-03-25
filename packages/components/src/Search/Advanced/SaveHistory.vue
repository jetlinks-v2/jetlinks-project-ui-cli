<template>
  <Popover
      v-model:visible="visible"
      title="搜索名称"
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
                            { required: true, message: '请输入名称' },
                            { max: 64, message: '最多64个字符' },
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
          保存
        </Button>
      </div>
    </template>
    <Button ghost type="primary"> 保存</Button>
  </Popover>
</template>

<script setup lang="ts">
import type { Terms } from '../typing';
import type { PropType } from 'vue';
import { ref, reactive } from 'vue';
import { Form, Button, FormItem, Popover, Textarea, message } from 'ant-design-vue'
import { isFunction } from 'lodash-es';

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
      message.success('操作成功');
      visibleChange(false);
    } else {
      message.error('操作失败');
    }
  }
};
</script>

<style scoped lang="less">
.save-btn {
  width: 100%;
}
</style>
