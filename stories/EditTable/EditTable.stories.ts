import type { Meta, StoryObj } from '@storybook/vue3';
import EditTable from './EditTable.vue';
import { columns, dataSource } from './data'

const meta: Meta<typeof EditTable> = {
  title: '示例/EditTable',
  component: EditTable,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'object' },
    dataSource: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj<typeof EditTable>;

export const 基础使用: Story = {
  render: (args) => ({
    components: { EditTable },
    setup() {
      return { args };
    },
    template: '<j-edit-table v-bind="args" />',
  }),
  args: {
    columns: columns,
    dataSource: dataSource,
  },
};

export const 编辑: Story = {
  render: (args) => ({
    components: { EditTable },
    setup() {
      return { args };
    },
    template: '<EditTable v-bind="args" />',
  }),
  args: {
    columns: columns,
    dataSource: dataSource,
  },
}

