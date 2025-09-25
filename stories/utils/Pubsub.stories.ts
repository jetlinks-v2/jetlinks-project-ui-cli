import type { Meta, StoryObj } from '@storybook/vue3';
import { subscribe, unsubscribe, publish } from '../../packages/utils/src/pubsub';
import { ref } from 'vue';

/**
 * 工具函数
 * 
 * 这里展示了项目中事件发布订阅工具函数的使用方法和示例。
 */
const meta: Meta = {
  title: '工具函数/Pubsub 事件发布订阅',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Pubsub 是基于 pubsub-js 库封装的事件发布订阅工具，提供了简化的 API。

### 主要特性
- 支持订阅单个或多个事件
- 支持取消订阅单个或多个事件
- 支持发布事件并传递数据
- 基于 pubsub-js 库，性能稳定

### 使用场景
- 组件间通信
- 全局事件管理
- 模块间解耦通信
- 异步事件处理

### 基本用法

\`\`\`javascript
import { subscribe, unsubscribe, publish } from '@jetlinks-web/utils';

// 订阅单个事件
subscribe('user.login', (msg, data) => {
  console.log('用户登录:', data);
});

// 订阅多个事件
subscribe(['user.login', 'user.logout'], (msg, data) => {
  console.log('用户状态变化:', msg, data);
});

// 发布事件
publish('user.login', { userId: 123, username: 'admin' });

// 取消订阅单个事件
unsubscribe('user.login');

// 取消订阅多个事件
unsubscribe(['user.login', 'user.logout']);
\`\`\`

### 在 Vue 组件中使用

\`\`\`vue
<template>
  <div>
    <a-button @click="handlePublish">发布事件</a-button>
    <a-button @click="handleSubscribe">订阅事件</a-button>
    <a-button @click="handleUnsubscribe">取消订阅</a-button>
  </div>
</template>

<script setup>
import { subscribe, unsubscribe, publish } from '@jetlinks-web/utils';

const handleSubscribe = () => {
  subscribe('test.event', (msg, data) => {
    console.log('收到事件:', msg, data);
  });
};

const handlePublish = () => {
  publish('test.event', { message: 'Hello World!' });
};

const handleUnsubscribe = () => {
  unsubscribe('test.event');
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
    eventKey: {
      control: 'text',
      description: '事件键名',
      defaultValue: 'test.event'
    },
    eventData: {
      control: 'object',
      description: '事件数据',
      defaultValue: { message: 'Hello World!' }
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Subscribe: Story = {
  name: '订阅事件',
  parameters: {
    docs: {
      source: {
        code: `
import { subscribe } from '@jetlinks-web/utils';

// 订阅单个事件
const handleSubscribe = () => {
  subscribe('user.login', (msg, data) => {
    console.log('收到用户登录事件:', data);
  });
};

// 在模板中使用
<a-button type="primary" @click="handleSubscribe">
  订阅事件
</a-button>
        `
      }
    }
  },
  render: (args) => ({
    setup() {
      const messages = ref<string[]>([]);
      
      const handleSubscribe = () => {
        subscribe(args.eventKey || 'test.event', (msg: string, data: any) => {
          const message = `收到事件: ${msg}, 数据: ${JSON.stringify(data)}`;
          messages.value.unshift(message);
        });
        messages.value.unshift(`已订阅事件: ${args.eventKey || 'test.event'}`);
      };
      
      return { handleSubscribe, messages };
    },
    template: `
      <div>
        <a-button type="primary" @click="handleSubscribe">
          订阅事件
        </a-button>
        <div style="margin-top: 16px;">
          <p style="color: #666;">事件日志：</p>
          <div style="max-height: 200px; overflow-y: auto; border: 1px solid #d9d9d9; padding: 8px; border-radius: 4px;">
            <div v-for="(msg, index) in messages" :key="index" style="font-size: 12px; margin-bottom: 4px;">
              {{ msg }}
            </div>
            <div v-if="messages.length === 0" style="color: #999; font-size: 12px;">
              暂无日志
            </div>
          </div>
        </div>
      </div>
    `
  }),
  args: {
    eventKey: 'test.event',
    eventData: { message: 'Hello World!' }
  }
};

export const Publish: Story = {
  name: '发布事件',
  parameters: {
    docs: {
      source: {
        code: `
import { publish } from '@jetlinks-web/utils';

// 发布事件
const handlePublish = () => {
  publish('user.login', { 
    userId: 123, 
    username: 'admin',
    timestamp: Date.now()
  });
};

// 在模板中使用
<a-button type="primary" @click="handlePublish">
  发布事件
</a-button>
        `
      }
    }
  },
  render: (args) => ({
    setup() {
      const publishCount = ref(0);
      const eventKey = args.eventKey || 'test.event';
      
      const handlePublish = () => {
        const data = {
          ...args.eventData,
          timestamp: Date.now(),
          count: ++publishCount.value
        };
        publish(eventKey, data);
      };
      
      return { handlePublish, publishCount, eventKey };
    },
    template: `
      <div>
        <a-button type="primary" @click="handlePublish">
          发布事件
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          已发布 {{ publishCount }} 次事件
        </p>
        <p style="margin-top: 8px; color: #999; font-size: 12px;">
          点击按钮发布事件，事件键: {{ eventKey }}
        </p>
      </div>
    `
  }),
  args: {
    eventKey: 'test.event',
    eventData: { message: 'Hello World!' }
  }
};

export const Unsubscribe: Story = {
  name: '取消订阅',
  parameters: {
    docs: {
      source: {
        code: `
import { unsubscribe } from '@jetlinks-web/utils';

// 取消订阅单个事件
const handleUnsubscribe = () => {
  unsubscribe('user.login');
};

// 取消订阅多个事件
const handleUnsubscribeMultiple = () => {
  unsubscribe(['user.login', 'user.logout']);
};

// 在模板中使用
<a-button danger @click="handleUnsubscribe">
  取消订阅
</a-button>
        `
      }
    }
  },
  render: (args) => ({
    setup() {
      const isSubscribed = ref(false);
      const messages = ref<string[]>([]);
      
      const handleSubscribe = () => {
        subscribe(args.eventKey || 'test.event', (msg: string, data: any) => {
          const message = `收到事件: ${msg}, 数据: ${JSON.stringify(data)}`;
          messages.value.unshift(message);
        });
        isSubscribed.value = true;
        messages.value.unshift(`已订阅事件: ${args.eventKey || 'test.event'}`);
      };
      
      const handleUnsubscribe = () => {
        unsubscribe(args.eventKey || 'test.event');
        isSubscribed.value = false;
        messages.value.unshift(`已取消订阅事件: ${args.eventKey || 'test.event'}`);
      };
      
      return { handleSubscribe, handleUnsubscribe, isSubscribed, messages };
    },
    template: `
      <div>
        <a-space>
          <a-button type="primary" @click="handleSubscribe" :disabled="isSubscribed">
            订阅事件
          </a-button>
          <a-button danger @click="handleUnsubscribe" :disabled="!isSubscribed">
            取消订阅
          </a-button>
        </a-space>
        <div style="margin-top: 16px;">
          <p style="color: #666;">操作日志：</p>
          <div style="max-height: 200px; overflow-y: auto; border: 1px solid #d9d9d9; padding: 8px; border-radius: 4px;">
            <div v-for="(msg, index) in messages" :key="index" style="font-size: 12px; margin-bottom: 4px;">
              {{ msg }}
            </div>
            <div v-if="messages.length === 0" style="color: #999; font-size: 12px;">
              暂无日志
            </div>
          </div>
        </div>
      </div>
    `
  }),
  args: {
    eventKey: 'test.event',
    eventData: { message: 'Hello World!' }
  }
};