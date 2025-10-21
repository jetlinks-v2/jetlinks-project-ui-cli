import type { Meta, StoryObj } from '@storybook/vue3';
import { onlyMessage } from '../../packages/utils/src/util';

/**
 * 工具函数
 * 
 * 这里展示了项目中常用的工具函数的使用方法和示例。
 */
const meta: Meta = {
  title: '工具函数/Message 消息提示',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
onlyMessage 是一个优化的消息提示函数，基于 Ant Design Vue 的 message 组件。

### 主要特性
- 根据类型只提示一次，避免重复消息
- 支持成功、错误、警告三种类型
- 自动去重，相同类型的消息会被覆盖

### 使用场景
- API 请求成功/失败提示
- 表单验证错误提示
- 操作结果反馈

### 基本用法

\`\`\`javascript
import { onlyMessage } from '@jetlinks-web/utils';

// 显示成功消息
onlyMessage('操作成功！', 'success');

// 显示错误消息
onlyMessage('操作失败！', 'error');

// 显示警告消息
onlyMessage('请注意！', 'warning');

// 默认为成功消息
onlyMessage('默认成功消息');
\`\`\`

### 在 Vue 组件中使用

\`\`\`vue
<template>
  <div>
    <a-button @click="handleSuccess">成功</a-button>
    <a-button @click="handleError" danger>错误</a-button>
    <a-button @click="handleWarning" ghost>警告</a-button>
  </div>
</template>

<script setup>
import { onlyMessage } from '@jetlinks-web/utils';

const handleSuccess = () => {
  onlyMessage('操作成功！', 'success');
};

const handleError = () => {
  onlyMessage('操作失败！', 'error');
};

const handleWarning = () => {
  onlyMessage('请注意！', 'warning');
};
</script>
\`\`\`
        `
      },
      source: {
        type: 'code'
      }
    }
  },
  argTypes: {
    message: {
      control: 'text',
      description: '消息内容',
      defaultValue: '这是一条消息'
    },
    type: {
      control: 'select',
      options: ['success', 'error', 'warning'],
      description: '消息类型',
      defaultValue: 'success'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  name: '成功消息',
  parameters: {
    docs: {
      source: {
        code: `
import { onlyMessage } from '@jetlinks-web/utils';

// 显示成功消息
const handleSuccess = () => {
  onlyMessage('操作成功！', 'success');
};

// 在模板中使用
<a-button type="primary" @click="handleSuccess">
  显示成功消息
</a-button>
        `
      }
    }
  },
  render: (args) => ({
    setup() {
      const showMessage = () => {
        onlyMessage(args.message || '操作成功！', 'success');
      };
      return { showMessage };
    },
    template: `
      <div>
        <a-button type="primary" @click="showMessage">
          显示成功消息
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          点击按钮查看成功提示效果
        </p>
      </div>
    `
  }),
  args: {
    message: '操作成功！',
    type: 'success'
  }
};

export const Error: Story = {
  name: '错误消息',
  parameters: {
    docs: {
      source: {
        code: `
import { onlyMessage } from '@jetlinks-web/utils';

// 显示错误消息
const handleError = () => {
  onlyMessage('操作失败！', 'error');
};

// 在模板中使用
<a-button danger @click="handleError">
  显示错误消息
</a-button>
        `
      }
    }
  },
  render: (args) => ({
    setup() {
      const showMessage = () => {
        onlyMessage(args.message || '操作失败！', 'error');
      };
      return { showMessage };
    },
    template: `
      <div>
        <a-button danger @click="showMessage">
          显示错误消息
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          点击按钮查看错误提示效果
        </p>
      </div>
    `
  }),
  args: {
    message: '操作失败！',
    type: 'error'
  }
};

export const Warning: Story = {
  name: '警告消息',
  parameters: {
    docs: {
      source: {
        code: `
import { onlyMessage } from '@jetlinks-web/utils';

// 显示警告消息
const handleWarning = () => {
  onlyMessage('请注意！', 'warning');
};

// 在模板中使用
<a-button type="primary" ghost @click="handleWarning">
  显示警告消息
</a-button>
        `
      }
    }
  },
  render: (args) => ({
    setup() {
      const showMessage = () => {
        onlyMessage(args.message || '请注意！', 'warning');
      };
      return { showMessage };
    },
    template: `
      <div>
        <a-button type="primary" ghost @click="showMessage">
          显示警告消息
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          点击按钮查看警告提示效果
        </p>
      </div>
    `
  }),
  args: {
    message: '请注意！',
    type: 'warning'
  }
};

export const OnlyOnce: Story = {
  name: '去重效果演示',
  parameters: {
    docs: {
      source: {
        code: `
import { onlyMessage } from '@jetlinks-web/utils';

// 相同类型的消息会被覆盖
const showSameMessage = () => {
  onlyMessage('这条消息只会显示一次', 'success');
};

// 不同类型的消息可以同时显示
const showDifferentTypes = () => {
  onlyMessage('成功消息', 'success');
  onlyMessage('错误消息', 'error');
  onlyMessage('警告消息', 'warning');
};

// 在模板中使用
<a-button @click="showSameMessage">
  连续点击（相同类型会被覆盖）
</a-button>
<a-button @click="showDifferentTypes">
  显示不同类型消息
</a-button>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const showSameMessage = () => {
        onlyMessage('这条消息只会显示一次', 'success');
      };
      
      const showDifferentTypes = () => {
        onlyMessage('成功消息', 'success');
        onlyMessage('错误消息', 'error');
        onlyMessage('警告消息', 'warning');
      };
      
      return { showSameMessage, showDifferentTypes };
    },
    template: `
      <div>
        <a-space direction="vertical" style="width: 100%;">
          <div>
            <a-button @click="showSameMessage">
              连续点击（相同类型会被覆盖）
            </a-button>
            <p style="margin: 8px 0; color: #666; font-size: 12px;">
              连续点击按钮，相同类型的消息会被覆盖，不会重复显示
            </p>
          </div>
          
          <div>
            <a-button @click="showDifferentTypes">
              显示不同类型消息
            </a-button>
            <p style="margin: 8px 0; color: #666; font-size: 12px;">
              不同类型的消息可以同时显示
            </p>
          </div>
        </a-space>
      </div>
    `
  })
};