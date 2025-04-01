import type { Meta, StoryObj } from '@storybook/vue3';
import { columns, dataSource } from './data'
import componentRaw from './query.vue?raw';
import component from './query.vue';

const meta: Meta<typeof component> = {
  title: '示例/EditTable/query',
  component: component,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'object' },
    dataSource: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj<typeof component>;

export const 筛选: Story = {
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
