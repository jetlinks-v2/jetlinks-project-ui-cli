<template>
  <a-form :model="formData" ref="formRef" layout="vertical">
    <a-form-item :label="item.name" v-for="item in schema" :key="item.key">
      <j-value-item style="width: 100%" v-model="formData[item.key]" v-bind="item" :itemType="item.type" />
    </a-form-item>
  </a-form>
  {{ formData}}
</template>

<script setup>
import { reactive, ref } from 'vue'
const schema = [
  {
    key: 'a',
    name: 'int',
    type: 'int',
    placeholder: '请输入1~100的数字',
    extraProps: {
      min: 1,
      max: 100,
      precision: 0
    }
  },
  {
    key: 'b',
    type: 'double',
    name: 'double',
    placeholder: '请输入数字'
  },
  {
    key: 'c',
    type: 'string',
    name: 'string',
    placeholder: '请输入'
  },
  {
    key: 'd',
    type: 'password',
    name: 'password',
    placeholder: '请输入密码'
  },
  {
    key: 'e',
    type: 'enum',
    name: 'enum',
    placeholder: '请选择',
    options: [
      {label: "选项1", value: '1'},
      {label: "选项2", value: '2'},
      {label: "选项3", value: '3'},
      {label: "选项4", value: '4'},
      {label: "选项5", value: '5'}
    ]
  },
  {
    key: 'f',
    type: 'boolean',
    name: 'boolean',
    placeholder: '请选择',
    options: [
      {label: "是", value: 'true'},
      {label: "否", value: 'false'},
    ]
  },
  {
    key: 'g',
    type: 'date',
    name: 'date',
    placeholder: '请输入'
  },
]
const formRef = ref()
const formData = reactive({
  b: 123
})
</script>

<style lang="scss" scoped>

</style>
