<template>
  <div class="enum-table-warp">
    <DataTable
        ref="tableRef"
        :columns="columns"
        :data-source="source"
        :serial="true"
        :show-tool="false"
        item-key="value"
        @change="valueChange"
    >
      <template #action="{ data }">
        <Button type="link" @click="() => deleteItem(data.index)">
          <AIcon type="DeleteOutlined"/>
        </Button>
      </template>
    </DataTable>
    <Button class="enum-table-add" @click="addItem">
      <template #icon>
        <AIcon type="PlusOutlined"/>
      </template>
      新增枚举项
    </Button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Button } from 'ant-design-vue';
import { AIcon, DataTable } from '../../../../';

const emit = defineEmits(['update:value', 'change', 'add']);

const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
});

const source = ref(props.value || []);
const tableRef = ref();

const columns = [
  {
    title: 'Value',
    dataIndex: 'value',
    type: 'text',
    width: 150,
    form: {
      required: true,
      rules: [
        {
          required: true,
          message: '请输入value',
        },
      ],
    },
  },
  {
    title: 'Text',
    dataIndex: 'text',
    type: 'text',
    form: {
      required: true,
      rules: [
        {
          required: true,
          message: '请输入Text',
        },
      ],
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 60,
  },
];

const updateValue = () => {
  emit('update:value', source.value);
  emit('change', source.value);
};

const addItem = () => {
  source.value.push({
    value: undefined,
    text: undefined,
  });
  // nextTick(() => {
  //     emit('add');
  //     updateValue();
  // });
};

const valueChange = () => {
  updateValue();
};

const deleteItem = (index: number) => {
  source.value.splice(index, 1);
  updateValue();
};

const getData = () => {
  return new Promise((resolve, reject) => {
    console.log('开始校验2');
    tableRef.value
        .getData()
        .then((data) => {
          source.value = data;
          updateValue();
          resolve(true);
        })
        .catch((err) => reject(err));
  });
};

defineExpose({
  getData: getData,
});
</script>

<style scoped></style>
