import type { Meta, StoryObj } from '@storybook/vue3';
import { columns, dataSource } from './data'
import component from './EditTable.vue';
import componentRaw from './EditTable.vue?raw';

const meta: Meta<typeof component> = {
  title: '示例/EditTable/basic',
  component: component,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'object' },
    dataSource: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj<typeof component>;

export const 基础使用: Story = {
  args: {
    columns: columns,
    dataSource: dataSource,
  },
  parameters: {
    docs: {
      source: {
        code: componentRaw
      }
    }
  }
};
