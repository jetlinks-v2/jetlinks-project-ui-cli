<script setup lang="ts">
import { defaultProps, bodyProps} from '../../packages/components/src/EditTable/props'
import { types } from './data'

const props = defineProps({
  ...defaultProps(),
  ...bodyProps()
})
</script>

<template>
  <j-edit-table :columns="columns" :dataSource="dataSource">
    <template #name="{ record}">
      <a-input v-model:value="record.name" />
    </template>
    <template #type="{ record }">
      <a-select style="width: 120px" :options="types" v-model:value="record.type" />
    </template>
  </j-edit-table>
</template>

<style scoped lang="less">

</style>
