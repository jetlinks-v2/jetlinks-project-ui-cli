<template>
  <div style="display: flex; flex-direction: column; gap: 24px">
    <div>action: <a-input placeholder="请输入action" v-model:value="data.action" /></div>
    <div>token key: <a-input placeholder="请输入token key" v-model:value="data.key" /></div>
    <div>token value: <a-input placeholder="请输入token value" v-model:value="data.token" /></div>
    <j-value-item
        :itemType="itemType"
        placeholder="请上传"
        :action="data.action"
        :headers="{
          [data.key]: data.token
        }"
    />
  </div>
</template>

<script setup>
import { reactive } from 'vue'
const props = defineProps({
  itemType: {
    type: String,
    default: "file"
  }
})
const data = reactive({
  action: undefined,
  token: undefined,
  key: undefined
})
</script>

<style lang="less" scoped>

</style>
