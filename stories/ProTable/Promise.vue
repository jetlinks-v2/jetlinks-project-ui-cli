<template>
  <div style="height: 720px">
    <j-pro-table
        :columns="columns"
        :request="request"
        :params="params"
        :defaultParams="{ sorts: [{ name: 'createTime', order: 'desc' }] }"
        ref="instanceRef"
    >
      <template #headerLeftRender><a-button type="primary" @click="refresh">刷新页面</a-button></template>
      <template #card="slotProps">
        <a-card style="width: 100%;">
          <p>年龄： {{ slotProps?.age }}</p>
          <p>{{ slotProps?.address }}</p>
        </a-card>
      </template>
    </j-pro-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
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
</script>

<style lang="less" scoped>

</style>
