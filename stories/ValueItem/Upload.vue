<template>
  <div style="display: flex; flex-direction: column; gap: 24px">
    <div>上传地址: <a-input placeholder="例如：http://192.168.33.6:31801/api/file/upload" v-model:value="data.action" /></div>
    <div>token key: <a-input placeholder="请输入token key" v-model:value="data.key" /></div>
    <div>token value: <a-input placeholder="请输入token value" v-model:value="data.token" /></div>
    <j-value-item
        itemType="file"
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

const data = reactive({
  action: undefined,
  token: undefined,
  key: undefined
})
</script>

<style lang="less" scoped>

</style>
