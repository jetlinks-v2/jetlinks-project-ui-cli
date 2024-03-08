<template>
  <PopconfirmModal body-style="padding-top:4px;" @confirm="confirm">
    <template #content>
      <div class="data-table-metrics">
        <Table
            :columns="columns"
            :data-source="source"
            :pagination="false"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'index'">
              {{ index + 1 }}
            </template>
            <template v-if="column.dataIndex === 'id'">
              <Input
                  v-model="record.value"
                  max-length="64"
                  placeholder="请输入"
              />
            </template>
            <template v-if="column.dataIndex === 'name'">
              <Input
                  v-model="record.text"
                  max-length="64"
                  placeholder="请输入"
              />
            </template>
            <template v-if="column.dataIndex === 'range'">
              <SelectBoolean
                  v-model:value="record.range"
                  false-text="固定值"
                  style="width: 100%"
                  true-text="范围值"
                  @select="() => itemSelect(record)"
              />
            </template>
            <template v-if="column.dataIndex === 'value'">
              <div>
                                <span>
                                    {{ record.value || '' }}
                                </span>
                <ValueItem
                    v-model:value="record.value"
                    :range="record.range"
                />
              </div>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <Button
                  type="link"
                  @click="() => deleteItem(index)"
              >
                <AIcon type="DeleteOutlined"/>
              </Button>
            </template>
          </template>
        </Table>
        <Button class="data-table-metrics--add" @click="addItem">
          <template #icon>
            <AIcon type="PlusOutlined"/>
          </template>
          添加指标值
        </Button>
      </div>
    </template>
    <Icon/>
  </PopconfirmModal>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import ValueItem from './ValueItem.vue';
import {
  Table,
  Button,
  Input,
} from 'ant-design-vue';
import { AIcon, PopconfirmModal } from '../../../../'
import SelectBoolean from '../Boolean/Boolean.vue';
import Icon from '../Icon.vue';
import { cloneDeep } from 'lodash-es';

const source = reactive([]);

const emit = defineEmits(['update:value', 'change']);

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 60,
  },
  {
    title: '指标标识',
    dataIndex: 'id',
  },
  {
    title: '指标名称',
    dataIndex: 'name',
  },
  {
    title: '指标值',
    dataIndex: 'range',
    width: 120,
  },
  {
    title: '指标配置',
    dataIndex: 'value',
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 80,
  },
];
const updateValue = () => {
  emit('update:value', cloneDeep(source));
  emit('change', cloneDeep(source));
};

const addItem = () => {
  source.push({
    id: undefined,
    name: undefined,
    range: false,
    value: undefined,
  });

  updateValue();
};

const deleteItem = (index: number) => {
  source.splice(index, 1);
  updateValue();
};

const itemSelect = (data: any) => {
  data.value = undefined;
};
</script>

<style lang="less" scoped>
.data-table-metrics {
  .data-table-metrics--add {
    width: 100%;
    margin-top: 12px;
  }
}
</style>
