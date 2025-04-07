<template>
    <a-radio-group v-model:value="value">
        <a-radio-button value="object">object</a-radio-button>
        <a-radio-button value="terms">terms</a-radio-button>
    </a-radio-group>
    <j-search
        :columns="columns"
        @search="onSearch"
        :type="value"
        :labelWidth="90"
    />
    <div>
        查询结果:
        <br />
        {{ paramsStr }}
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Custom from './Custom.vue';

const paramsStr = ref();
const value = ref('terms');
const columns = [
  {
    title: '名称名称名称',
    dataIndex: 'name',
    search: {
      type: 'component',
      components: Custom, // 自定义的组件
      // componentProps: {
      //   placeholder: '请输入名称',
      //   style: {
      //     width: '100%',
      //   },
      // },
      defaultOnceValue: '123123',
    },
  },
  {
    title: '年龄',
    dataIndex: 'age',
    search: {
      type: 'number',
      componentProps: {
        placeholder: '请输入真实年龄',
      },
    },
  },
  {
    title: '类型',
    dataIndex: 'type',
    search: {
      type: 'select',
      options: [
        { label: '类型1', value: 1 },
        { label: '类型2', value: 2 },
      ],
      componentProps: {
        placeholder: '请选择类型',
      },
    },
  },
  {
    title: '测试地址长度',
    dataIndex: 'address',
    search: {
      type: 'string',
    },
  },
  {
    title: '时间',
    dataIndex: 'time',
    search: {
      type: 'timeRange',
    },
  },
];

const onSearch = (e) => {
  paramsStr.value = JSON.stringify(e);
};
</script>

<style scoped></style>
