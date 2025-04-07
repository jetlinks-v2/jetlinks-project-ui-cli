<script setup lang="ts">
import { defaultProps, bodyProps} from '@jetlinks-web/components/es/EditTable/props'
import { types, bigData } from './data'
import {ref} from 'vue'
import { randomNumber } from '@jetlinks-web/utils'

const props = defineProps({
  ...defaultProps(),
  ...bodyProps()
})

const tableRef = ref() // 表格实例
const size = ref(50)
const _dataSource = ref(bigData(size.value))

const sizeChange = (e) => {
  _dataSource.value = bigData(e)
}

const scrollDown = async (len = 5) => {
  _dataSource.value.push(... Array.from({ length: len}).map(item => {
    return {
      id: randomNumber(),
      name: undefined,
      type: undefined
    }
  }))
}


</script>

<template>
  <a-input-number :min="10" :max="999999" style="width: 200px;margin-bottom: 12px" v-model:value="size" @change="sizeChange" />
  <j-edit-table
    ref="tableRef"
    :columns="columns"
    :dataSource="_dataSource"
    @scrollDown="scrollDown"
  >
    <template #name="{ record, index}">
      <j-edit-table-form-item :name="[index, 'name']">
        <a-input v-model:value="record.name" />
      </j-edit-table-form-item>
    </template>
    <template #type="{ record }">
      <a-select style="width: 120px" :options="types" v-model:value="record.type" />
    </template>
  </j-edit-table>
</template>

<style scoped lang="less">

</style>
