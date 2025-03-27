import type { Meta, StoryObj } from '@storybook/vue3';
import Protable from './Protable.vue';
import Base from './Base.vue';
import Promise from './Promise.vue';
import Search from './Search.vue';
import Selection from './Selection.vue';
import {columns, data, query} from "./data";

// 定义元数据
const meta: Meta<typeof Protable> = {
  title: '示例/ProTable',
  component: Protable,
  tags: ['autodocs'],
  argTypes: {
    // 定义 props 的控制类型
    columns: {control: 'object', description: '表格列的配置描述' ,},
    dataSource: {control: 'object', description: '数据数组' ,},
    noPagination: {control: 'boolean', description: '数据请求' ,},
    mode: { control: 'radio', options: ['TABLE', 'CARD', undefined], description: '模式，只为表格或者卡片' ,},
    modeValue: { control: 'radio', options: ['TABLE', 'CARD'], description: '控制模式，当mode为undefined时生效' ,},
    rowSelection: {control: 'object', description: '列表项是否可选择，参数参考ant design vue的表格的rowSelection' ,},
    alertShow: {control: 'boolean', description: '是否显示选择多少项提示' ,},
    cardBodyClass: { control: 'text', description: '卡片class' ,},
    gridColumns: {control: 'object', description: '每行展示的卡片个数' ,},
    scroll: {control: 'object', description: '表格是否可滚动，也可以指定滚动区域的宽、高' ,},
    rowKey: { control: 'text', description: '表格行 key 的取值，可以是字符串或一个函数' ,},
    bodyStyle: {control: 'object', description: '表格外框style' ,},
    request: {
      action: 'request',
      description: '数据请求' ,
      table: {
        type: { summary: '(e, option) => Promise' },
        defaultValue: { summary: 'undefined' },
      }
    },
    params: {control: 'object', description: '请求参数' ,},
    defaultParams: {control: 'object', description: '默认参数' ,},
    type: { control: 'radio', options: ['TREE', 'PAGE'], description: '表格类型' ,},
    pagination: {control: 'object', description: '分页器,参数参考ant design vue的pagination' ,},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基本使用示例
export const 基础使用: Story = {
  args: {
    columns: columns,
    dataSource: data,
    modeValue: 'CARD'
  },
  render: (args) => {
    return <Base {...args} />
  }
};

export const 远程加载数据: Story = {
  args: {
    request: query,
  },
  render: (args) => {
    return <Promise {...args} />
  }
};

export const 结合Search: Story = {
  args: {
    request: query,
  },
  render: (args) => {
    return <Search {...args} />
  }
};

export const 可选择的表格: Story = {
  args: {
    request: query,
  },
  render: (args) => {
    return <Selection {...args} />
  }
};
