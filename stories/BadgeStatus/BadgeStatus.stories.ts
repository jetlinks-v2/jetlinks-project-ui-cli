import type { Meta, StoryObj } from '@storybook/vue3';
import BadgeStatus from './BadgeStatus.vue';

// 定义元数据
const meta: Meta<typeof BadgeStatus> = {
  title: '示例/BadgeStatus',
  component: BadgeStatus,
  tags: ['autodocs'],
  argTypes: {
    // 定义 props 的控制类型
    statusText: { control: 'text' },
    status: { control: 'text' },
    statusNames: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基本使用示例
export const 基础使用: Story = {
  args: {
    statusText: '离线',
    status: 'offline',
    statusNames:{
      online: 'processing',
      offline: 'error',
      notActive: 'warning',
  }
  }
};
