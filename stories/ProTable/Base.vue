<script setup>
const props = defineProps({
  modeValue: { // mode 为undefined时
    type: String,
    default: 'TABLE',
  },
  columns: {
    type: Array,
    default: () => [],
  },
  dataSource: {
    type: Array,
    default: undefined
  },
})
</script>

<template>
  <j-pro-table
      :columns="columns"
      :dataSource="dataSource"
      :modeValue="modeValue"
      :noPagination="true"
      :gridColumns="[3]"
  >
    <template #headerLeftRender>
      <a-button type="primary">新增</a-button>
    </template>
    <template #headerRightRender>
      <a-button>批量操作</a-button>
    </template>
    <template #card="slotProps">
      <a-card style="width: 100%">
        <h4>名称： {{ slotProps?.name }}</h4>
        <p>年龄： {{ slotProps?.age }}</p>
      </a-card>
    </template>
    <template #address="slotProps">
      <a>{{ slotProps?.address }}</a>
    </template>
  </j-pro-table>
</template>

<style scoped lang="less">

</style>
