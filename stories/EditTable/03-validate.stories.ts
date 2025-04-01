import type { Meta, StoryObj } from '@storybook/vue3';
import { columns, dataSource } from './data'
import componentRaw from './validate.vue?raw';
import component from './validate.vue';

const meta: Meta<typeof component> = {
  title: '示例/EditTable/validate',
  component: component,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'object' },
    dataSource: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj<typeof component>;

// 在Storybook中，你可以通过设置`parameters`来自定义展示的代码内容。下面是修改后的代码，添加了自定义的代码展示内容。
export const 校验: Story = {
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
}
