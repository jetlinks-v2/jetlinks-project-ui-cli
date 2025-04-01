<script setup>
const props = defineProps({
  mode: {
    type: [String, undefined], //TABLE , CARD, undefined
    default: undefined,
  },
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
  alertShow: {
    type: Boolean,
    default: true,
  },
  rowSelection: {
    type: Object,
    default: () => undefined,
  },
  cardBodyClass: {
    type: String,
    default: '',
  },
  gridColumns: {
    type: Array,
    default: () => [1, 2, 3, 4],
  },
  scroll: {
    type: Object,
    default: () => ({}) //  x: 1366
  },
  rowKey: {
    type: [String, Function],
    default: 'id',
  },
  bodyStyle: {
    type: Object,
    default: () => ({
      padding: '16px 24px 24px'
    })
  },
  request: {
    type: Function,
    default: undefined,
  },
  params: {
    type: Object,
    default: () => ({})
  },
  type: {
    type: String, // TREE , PAGE
    default: 'PAGE',
  },
  defaultParams: {
    type: Object,
    default: () => ({})
  },
  noPagination: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Object, // Boolean,
    default: () => {
      return {
        showSizeChanger: true,
        size: 'size',
        pageSizeOptions: ['12', '24', '48', '96'],
      };
    },
  },
})
</script>

<template>
  <div style="height: 600px">
    <j-pro-table
        v-bind="props"
        :columns="columns"
        :dataSource="dataSource"
        :mode="mode"
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
  </div>
</template>

<style scoped lang="less">

</style>
