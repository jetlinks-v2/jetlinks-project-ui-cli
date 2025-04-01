import type { Meta, StoryObj } from '@storybook/vue3';
import ValueItem from '../../packages/components/src/ValueItem/ValueItem.vue';
import Upload from './Upload.vue'

// 定义元数据
const meta: Meta<typeof ValueItem> = {
    title: '示例/ValueItem',
    component: ValueItem,
    tags: ['autodocs'],
    argTypes: {
        // 定义 props 的控制类型
        modelValue: { control: 'text', description: '值' },
        itemType: { control: 'select', options: ['int', 'long', 'float', 'double', 'string', 'array', 'password', 'enum', 'boolean', 'date', 'time', 'object', 'file'], description: '组件类型, 默认为string' },
        mode: { control: 'select', options: ['multiple', 'tags', 'combobox', ''], description: '设置 Select 的模式为多选或标签' },
        placeholder: { control: 'text', description: '默认文字' },
        options: { control: 'object', description: '选项数据' },
        style: { control: 'object', description: '样式style' },
        class: { control: 'text', description: '样式class' },
        valueFormat: { control: 'text', description: '类型为日期组件时，绑定值的格式，对 value、defaultValue、defaultPickerValue 起作用。不指定则绑定值为 dayjs 对象' },
        action: { control: 'text', description: '上传的地址' },
        headers: { control: 'object', description: '设置上传的请求头部' },
        disabled: { control: 'boolean', description: '是否禁用' },
        extraProps: { control: 'object', description: '额外的参数' },
        handleFileChange: { control: 'object', description: '处理上传组件的值的方法' },
    },
};
export default meta;
type Story = StoryObj<typeof meta>;

// 基本使用示例
export const 基础使用: Story = {
    args: {
        itemType: 'init',
        modelValue: ''
    },
};

export const 上传组件: Story = {
    args: {
        itemType: 'file',
    },
    render: ({...args }) => ({
        components: { Upload },
        setup() {
            return { args };
        },
        template: `
          <Upload v-bind="args" />
        `,
    }),
};
