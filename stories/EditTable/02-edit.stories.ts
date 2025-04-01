import type { Meta, StoryObj } from '@storybook/vue3';
import { columns, dataSource } from './data'
import Edit from './Edit.vue?raw';
import EditTable from './Edit.vue';

const meta: Meta<typeof EditTable> = {
  title: '示例/EditTable/edit',
  component: EditTable,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'object' },
    dataSource: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj<typeof EditTable>;

// 在Storybook中，你可以通过设置`parameters`来自定义展示的代码内容。下面是修改后的代码，添加了自定义的代码展示内容。
export const 编辑: Story = {
  args: {
    columns: columns,
    dataSource: dataSource,
  },
  parameters: {
    docs: {
      source: {
        code: Edit
      }
    }
  }
}

export const 只读: Story = {
  args: {
    columns: columns,
    dataSource: dataSource,
    readonly: false,
  },
  parameters: {
    docs: {
      source: {
        code: Edit
      }
    }
  }
}
