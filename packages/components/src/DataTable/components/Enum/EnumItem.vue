<template>
  <FormItem :name="name" :rules="rules" :validate-first="true">
    <template #label>
            <span style="color: #ff4d4f; padding-right: 4px; padding-top: 2px"
            >*</span
            >
      枚举项
    </template>
    <FormItemRest v-if="multiple">
      <ButtonGroup v-model:value="typeRef" @change="typeChange"/>
    </FormItemRest>
    <div class="enum-table-warp">
      <DataTable
          ref="tableRef"
          :columns="columns"
          :data-source="formData.elements"
          :serial="true"
          :show-tool="false"
          @change="change"
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
  </FormItem>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { Form, FormItem, FormItemRest } from 'ant-design-vue';
import { AIcon } from '../../../../';
import DataTable from '../../dataTable.vue';
import ButtonGroup from './ButtonGroup.vue';

const formItemContext = Form.useInjectFormItemContext();

const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
  type: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: 'elements',
  },
});

const emit = defineEmits(['update:value', 'update:type', 'cancel', 'add']);

const formRef = ref();
const formData = reactive({
  elements: props.value || [],
});
const typeRef = ref(props.type || false);

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
          callback: (rule, value, dataSource) => {
            if (value) {
              const {field} = rule;
              const keys = field.split('.');
              const index = Number(keys[1]);
              // 排除自身
              const hasValue =
                  dataSource?.some(
                      (item, i) =>
                          item.value === value && i !== index,
                  ) || false;
              if (hasValue) {
                return Promise.reject('该Value值已存在');
              }
              return Promise.resolve();
            }
            return Promise.reject('请输入Value');
          },
        },
        {max: 64, message: '最多可输入64个字符'},
      ],
    },
  },
  {
    title: 'Text',
    dataIndex: 'text',
    type: 'text',
    width: 150,
    form: {
      required: true,
      rules: [
        {
          required: true,
          message: '请输入Text',
        },
        {max: 64, message: '最多可输入64个字符'},
      ],
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 60,
  },
];

const enumLength = ref(0);

const rules = [
  {
    validator(_, value) {
      if (!enumLength.value) {
        return Promise.reject('请添加枚举项');
      }
      return Promise.resolve();
    },
  },
];

const getData = () =>
    new Promise((resolve, reject) => {
      tableRef.value
          ?.getData()
          ?.then((data) => {
            resolve(data);
          })
          .catch((err) => {
            console.log(err);
            reject(false);
          });
    });

const addItem = () => {
  // formData.elements.push({
  //   value: undefined,
  //   text: undefined
  // })
  tableRef.value?.addItem({
    value: undefined,
    text: undefined,
  });
  formItemContext.onFieldChange();
};

const deleteItem = (index) => {
  tableRef.value?.removeItem(index);
  formItemContext.onFieldChange();
  // const newData = tableRef.value?.removeItem(index);
  // formData.elements.splice(index, 1)
  // console.log('update', newData);
};

const cancel = () => {
  tableRef.value?.initItems();
};

const typeChange = () => {
  emit('update:type', typeRef.value);
};

const change = (data) => {
  enumLength.value = data.length;
};

watch(
    () => JSON.stringify(props.value),
    () => {
      formData.elements = props.value || [];
    },
    {immediate: true},
);

watch(
    () => props.type,
    () => {
      typeRef.value = props.type;
    },
);

defineExpose({
  getData: getData,
  cancel: cancel,
});
</script>

<style lang="less" scoped>
.enum-table-warp {
  margin-top: 12px;

  .enum-table-add {
    margin-top: 12px;
    width: 100%;
  }
}

</style>
