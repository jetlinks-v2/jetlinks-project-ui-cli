import type { Meta, StoryObj } from '@storybook/vue3';
import component from './base.vue';
import componentRaw from './base.vue?raw';

// 定义元数据
const meta: Meta<typeof component> = {
    title: '示例/PermissionButton/base',
    component: component,
    tags: ['autodocs'],
    argTypes: {
      hasPermission: { control: 'boolean', description: '是否有权限或者权限标识' },
      tooltip: { control: 'object', description: '文字提示' },
      popConfirm: { control: 'object', description: '二次确认'},
      style: { control: 'object'},
      noPermissionTitle: { control: 'text', description: '无权限时的提示信息' },
    },
};
export default meta;
type Story = StoryObj<typeof meta>;


export const 基础使用: Story = {
    args: {
      hasPermission: true,
    },
    parameters: {
      docs: {
        description: {
          story: '该组件基于`a-button`二次封装，其它props参考[Button 按钮](https://3x.antdv.com/components/button-cn/#API)',
        },
        source: {
          code: componentRaw
        }
      }
    }
};

export const 文字提示: Story = {
  args: {
    hasPermission: true,
    tooltip: {
      title: '这是一个提示'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'tooltip其它props参考[Tooltip 文字提示](https://3x.antdv.com/components/tooltip-cn#API)',
      },
      source: {
        code: componentRaw
      }
    }
  }
};

export const 二次确认: Story = {
  args: {
    hasPermission: true,
    popConfirm: {
      title: '确认删除？',
      onConfirm: () => {
        console.log('确认')
      },
      cancel: () => {
        console.log('取消')
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'popConfirm其它props参考[Popconfirm 气泡确认框](https://3x.antdv.com/components/popconfirm-cn#API)',
      },
      source: {
        code: componentRaw
      }
    }
  }
};

