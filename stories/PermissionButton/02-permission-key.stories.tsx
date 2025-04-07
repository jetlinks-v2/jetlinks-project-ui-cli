import type { Meta, StoryObj } from '@storybook/vue3';
import component from './base.vue';
import componentRaw from './base.vue?raw';

// 定义元数据
const meta: Meta<typeof component> = {
    title: '示例/PermissionButton/hasPermission',
    component: component,
    tags: ['autodocs'],
    argTypes: {
      hasPermission: { control: 'text' },
    },
};
export default meta;
type Story = StoryObj<typeof meta>;


export const 权限标识: Story = {
    args: {
        hasPermission: 'device:add'
    },
  parameters: {
    docs: {
      source: {
        code: componentRaw
      }
    }
  }
};
