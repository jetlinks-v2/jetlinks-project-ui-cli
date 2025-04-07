import type { Meta, StoryObj } from '@storybook/vue3';
import component from './BadgeStatus.vue';
import componentRaw from './BadgeStatus.vue?raw';

// 定义元数据
const meta: Meta<typeof component> = {
  title: '示例/BadgeStatus',
  component: component,
  tags: ['autodocs'],
  args: {
    statusText: '-',
    status: '-',
    statusNames:{
      'success': 'success',
      'warning': 'warning',
      'error': 'error',
      'default': 'default',
    }
  },
  argTypes: {
    // 定义 props 的控制类型
    statusText: { control: 'text', description: '状态文案' },
    status: { control: 'text', description: '状态值' },
    statusNames: { control: 'object', description: `自定义状态字段` },
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
  },
  parameters: {
    docs: {
      source: {
        code: componentRaw
      }
    }
  }
};
