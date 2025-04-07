<script setup lang="ts">
import { defaultProps, bodyProps} from '@jetlinks-web/components/es/EditTable/props'
import { types } from './data'
import {ref} from 'vue'

const props = defineProps({
  ...defaultProps(),
  ...bodyProps()
})

const tableRef = ref() // 表格实例
const text = ref('')

const onSave = async () => {
  try {
    const result = await tableRef.value.validate()
    text.value = JSON.stringify(result)
  } catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <a-button type="primary" @click="onSave">
    保存
  </a-button>
  <j-edit-table ref="tableRef" :columns="columns" :dataSource="dataSource">
    <template #name="{ record, index}">
      <j-edit-table-form-item :name="[index, 'name']">
        <a-input v-model:value="record.name" />
      </j-edit-table-form-item>
    </template>
    <template #type="{ record }">
      <a-select style="width: 120px" :options="types" v-model:value="record.type" />
    </template>
  </j-edit-table>
  <div>
    <h3>结果输出:</h3>
    {{ text }}
  </div>
</template>

<style scoped lang="less">

</style>
