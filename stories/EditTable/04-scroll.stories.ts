import type { Meta, StoryObj } from '@storybook/vue3';
import { columns } from './data'
import componentRaw from './scroll.vue?raw';
import component from './scroll.vue';

const meta: Meta<typeof component> = {
  title: '示例/EditTable/scroll',
  component: component,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj<typeof component>;

// 在Storybook中，你可以通过设置`parameters`来自定义展示的代码内容。下面是修改后的代码，添加了自定义的代码展示内容。
export const 虚拟滚动: Story = {
  args: {
    columns: columns,
  },
  parameters: {
    docs: {
      source: {
        code: componentRaw
      }
    }
  }
}
