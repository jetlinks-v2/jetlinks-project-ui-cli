<template>
  <j-check-button v-model:value="myValue" :options="options" :columns="4" />
</template>

<script setup>
import { ref } from "vue";
const options = [
  {label: "选项1", value: '1'},
  {label: "选项2", value: '2'},
  {label: "选项3", value: '3'},
  {label: "选项4", value: '4'},
  {label: "选项5", value: '5'}
]

const myValue = ref(['1', '4'])
</script>

<style lang="less" scoped>

</style>
