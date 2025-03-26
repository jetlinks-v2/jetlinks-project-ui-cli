import type { Meta, StoryObj } from '@storybook/vue3';
import { fn } from '@storybook/test';
import AutoCompleteComponent from './AutoComplete.vue';

// 定义元数据
const meta: Meta<typeof AutoCompleteComponent> = {
  title: '示例/AutoComplete',
  component: AutoCompleteComponent,
  tags: ['autodocs'],
  argTypes: {
    // 定义 props 的控制类型
    searchKey: { control: 'text' },
    options: { control: 'array' },
    // 定义事件
    onSelect: fn(),
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
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
  }
};
