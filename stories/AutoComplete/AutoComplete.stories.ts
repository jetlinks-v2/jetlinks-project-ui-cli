import type { Meta, StoryObj } from '@storybook/vue3';
import component from './AutoComplete.vue';
import componentRaw from './AutoComplete.vue?raw';

// 定义元数据
const meta: Meta<typeof component> = {
  title: '示例/AutoComplete',
  component: component,
  tags: ['autodocs'],
  argTypes: {
    // 定义 props 的控制类型
    searchKey: { control: 'text', description: '搜索字段' },
    options: { control: 'array', description: 'options 数据' },
    // 定义事件
    onSelect: {
      action: 'onSelect',
      description: '被选中时调用' ,
      table: {
        type: { summary: '(e, option) => void' },
        defaultValue: { summary: 'undefined' },
      }
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基本使用示例
export const 基础使用: Story = {
  args: {
    searchKey: 'label',
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: '张三', value: 'zhangsan' },
      { label: '李四', value: 'lisi' },
    ],
  },
  parameters: {
    docs: {
      source: {
        code: componentRaw
      }
    }
  }
};
