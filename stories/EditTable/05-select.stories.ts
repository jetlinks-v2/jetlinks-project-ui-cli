import type { Meta, StoryObj } from '@storybook/vue3';
import { columns, dataSource } from './data'
import componentRaw from './select.vue?raw';
import component from './select.vue';

const meta: Meta<typeof component> = {
  title: '示例/EditTable/select',
  component: component,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'object' },
    dataSource: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj<typeof component>;

export const 选择: Story = {
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
