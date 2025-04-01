<template>
  <div style="height: 700px">
    <j-pro-table
        :columns="columns"
        :request="request"
        :rowSelection="{
            selectedRowKeys: selectedKeys,
            onSelect: onSelect,
            onSelectAll: onSelectAll,
            onSelectNone: cancelSelect,
        }"
        rowKwy="id"
    >
      <template #card="slotProps">
        <div
            style="width: 100%; padding: 20px"
            :style="{
                    border: `1px solid ${
                        selectedKeys.includes(slotProps.id)
                            ? 'red'
                            : 'lightgray'
                    }`,
                }"
            @click="handleClick(slotProps)"
        >
          <div style="width: 100%">
            {{ slotProps?.name + slotProps.id }}
          </div>
        </div>
      </template>
    </j-pro-table>
  </div>
</template>

<script setup>
import {ref} from 'vue'

const props = defineProps({
  request: {
    type: Function,
    default: undefined,
  },
})
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
  },
];
const selectedKeys = ref([]);

const onSelect = (record, selected) => {
  const arr = [...selectedKeys.value]
  const _index = arr.findIndex((item) => item === record?.id)
  if (selected) {
    if (!(_index > -1)) {
      selectedKeys.value.push(record.id)
    }
  } else {
    if (_index > -1) {
      // 去掉数据
      selectedKeys.value.splice(_index, 1)
    }
  }
}

const onSelectAll = (selected, _, changeRows) => {
  if (selected) {
    changeRows.map((i) => {
      if (!selectedKeys.value.includes(i.id)) {
        selectedKeys.value.push(i.id)
      }
    })
  } else {
    const arr = changeRows.map((item) => item.id)
    const _ids = [];
    [...selectedKeys.value].map((i) => {
      if (!arr.includes(i)) {
        _ids.push(i)
      }
    })
    selectedKeys.value = _ids
  }
}

const cancelSelect = () => {
  selectedKeys.value = []
}
const handleClick = (dt) => {
  if (selectedKeys.value.includes(dt.id)) {
    const _index = selectedKeys.value.findIndex((i) => i === dt.id);
    selectedKeys.value.splice(_index, 1);
  } else {
    selectedKeys.value = [...selectedKeys.value, dt.id];
  }
};
</script>

<style lang="less" scoped>

</style>
