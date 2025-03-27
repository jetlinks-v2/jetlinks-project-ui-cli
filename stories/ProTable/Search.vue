<template>
<!--  <j-advanced-search :columns="columns" @search="handleParams" type="simple" target="test" />-->
  <a-input-search placeholder="请输入" @search="handleParams" />
  <div style="height: 720px">
    <j-pro-table
        :columns="columns"
        :request="request"
        :params="params"
        :defaultParams="{ sorts: [{ name: 'createTime', order: 'desc' }] }"
        ref="instanceRef"
    >
      <template #headerLeftRender>
        <a-button type="primary" @click="refresh">刷新页面</a-button>
      </template>
      <template #card="slotProps">
        <div style="width: 100%; border: 1px solid lightgray; padding: 20px">
          <p>年龄： {{ slotProps?.age }}</p>
          <p>{{ slotProps?.address }}</p>
        </div>
      </template>
    </j-pro-table>
  </div>
</template>

<script setup>
import {ref} from 'vue'

const props = defineProps({
  request: {
    type: Function,
    default: undefined,
  },
})

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    search: {
      type: 'string',
      componentProps: {
        placeholder: '请输入名称',
      },
      // defaultValue: '111111111',
    },
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    search: {
      type: 'number',
    },
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
  },
];

const instanceRef = ref({});
const params = ref({});

const refresh = () => {
  instanceRef.value?.reload();
};

const handleParams = (p) => {
  params.value = {
    terms: [
      { column: 'name', termType: 'like', value: `${p}` },
    ]
  }
};
</script>

<style lang="less" scoped>

</style>
