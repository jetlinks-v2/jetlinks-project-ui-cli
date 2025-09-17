import type { Meta, StoryObj } from '@storybook/vue3';
import { EventEmitter } from '../../packages/utils/src/util';
import { ref } from 'vue';

/**
 * 工具函数
 * 
 * 这里展示了项目中常用的工具函数的使用方法和示例。
 */
const meta: Meta = {
  title: '工具函数/EventEmitter 事件发射器',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
EventEmitter 是一个简单的事件发射器，用于组件间通信和事件管理。

### 主要特性
- 支持事件订阅和发布
- 支持多个事件同时订阅
- 支持传递数据到事件监听器
- 支持取消订阅

### 使用场景
- 组件间通信
- 全局事件管理
- 模块解耦
- 状态变化通知

### 基本用法

\`\`\`javascript
import { EventEmitter } from '@jetlinks-web/utils';

// 订阅事件
EventEmitter.subscribe(['userLogin'], (data) => {
  console.log('用户登录：', data);
});

// 发射事件
EventEmitter.emit('userLogin', { userId: 123, username: 'admin' });

// 取消订阅
const handler = (data) => console.log(data);
EventEmitter.subscribe(['userLogout'], handler);
EventEmitter.unSubscribe(['userLogout'], handler);
\`\`\`

### 在 Vue 组件中使用

\`\`\`vue
<template>
  <div>
    <a-button @click="login">登录</a-button>
    <a-button @click="logout">登出</a-button>
    <p>状态：{{ status }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { EventEmitter } from '@jetlinks-web/utils';

const status = ref('未登录');

const loginHandler = (data) => {
  status.value = \`已登录：\${data.username}\`;
};

const logoutHandler = () => {
  status.value = '未登录';
};

onMounted(() => {
  EventEmitter.subscribe(['login'], loginHandler);
  EventEmitter.subscribe(['logout'], logoutHandler);
});

onUnmounted(() => {
  EventEmitter.unSubscribe(['login'], loginHandler);
  EventEmitter.unSubscribe(['logout'], logoutHandler);
});

const login = () => {
  EventEmitter.emit('login', { username: 'admin' });
};

const logout = () => {
  EventEmitter.emit('logout');
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
    eventName: {
      control: 'text',
      description: '事件名称',
      defaultValue: 'testEvent'
    },
    eventData: {
      control: 'text',
      description: '事件数据',
      defaultValue: 'Hello EventEmitter!'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicUsage: Story = {
  name: '基本用法',
  parameters: {
    docs: {
      source: {
        code: `
import { EventEmitter } from '@jetlinks-web/utils';
import { ref } from 'vue';

// 监听事件
const message = ref('等待消息...');

const messageHandler = (data) => {
  message.value = \`收到消息：\${data}\`;
};

// 订阅事件
EventEmitter.subscribe(['message'], messageHandler);

// 发射事件
const sendMessage = () => {
  EventEmitter.emit('message', '这是一条测试消息');
};

// 在模板中使用
<div>
  <a-button @click="sendMessage">发送消息</a-button>
  <p>{{ message }}</p>
</div>
        `
      }
    }
  },
  render: (args) => ({
    setup() {
      const message = ref('等待消息...');
      
      const messageHandler = (data) => {
        message.value = `收到消息：${data}`;
      };
      
      EventEmitter.subscribe(['message'], messageHandler);
      
      const sendMessage = () => {
        EventEmitter.emit('message', args.eventData || '这是一条测试消息');
      };
      
      return { message, sendMessage };
    },
    template: `
      <div>
        <a-button type="primary" @click="sendMessage">
          发送消息
        </a-button>
        <p style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          {{ message }}
        </p>
      </div>
    `
  }),
  args: {
    eventName: 'message',
    eventData: '这是一条测试消息'
  }
};

export const MultipleEvents: Story = {
  name: '多事件订阅',
  parameters: {
    docs: {
      source: {
        code: `
import { EventEmitter } from '@jetlinks-web/utils';
import { ref } from 'vue';

// 同时订阅多个事件
const log = ref([]);

const eventHandler = (data) => {
  log.value.push(\`\${new Date().toLocaleTimeString()}: \${data}\`);
};

// 订阅多个事件
EventEmitter.subscribe(['event1', 'event2', 'event3'], eventHandler);

// 发射不同事件
const emitEvent1 = () => EventEmitter.emit('event1', '事件1被触发');
const emitEvent2 = () => EventEmitter.emit('event2', '事件2被触发');
const emitEvent3 = () => EventEmitter.emit('event3', '事件3被触发');

// 在模板中使用
<div>
  <a-space>
    <a-button @click="emitEvent1">触发事件1</a-button>
    <a-button @click="emitEvent2">触发事件2</a-button>
    <a-button @click="emitEvent3">触发事件3</a-button>
  </a-space>
  <div style="margin-top: 16px;">
    <p v-for="item in log" :key="item">{{ item }}</p>
  </div>
</div>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const log = ref([]);
      
      const eventHandler = (data) => {
        log.value.push(`${new Date().toLocaleTimeString()}: ${data}`);
      };
      
      EventEmitter.subscribe(['event1', 'event2', 'event3'], eventHandler);
      
      const emitEvent1 = () => EventEmitter.emit('event1', '事件1被触发');
      const emitEvent2 = () => EventEmitter.emit('event2', '事件2被触发');
      const emitEvent3 = () => EventEmitter.emit('event3', '事件3被触发');
      
      const clearLog = () => {
        log.value = [];
      };
      
      return { log, emitEvent1, emitEvent2, emitEvent3, clearLog };
    },
    template: `
      <div>
        <a-space style="margin-bottom: 16px;">
          <a-button @click="emitEvent1">触发事件1</a-button>
          <a-button @click="emitEvent2">触发事件2</a-button>
          <a-button @click="emitEvent3">触发事件3</a-button>
          <a-button @click="clearLog" type="dashed">清空日志</a-button>
        </a-space>
        
        <div style="background: #f5f5f5; padding: 12px; border-radius: 4px; min-height: 120px;">
          <p style="margin: 0 0 8px 0; font-weight: bold;">事件日志：</p>
          <p v-for="item in log" :key="item" style="margin: 4px 0; font-family: monospace; font-size: 12px;">
            {{ item }}
          </p>
          <p v-if="!log.length" style="color: #999; margin: 0;">暂无事件日志...</p>
        </div>
      </div>
    `
  })
};

export const SubscribeUnsubscribe: Story = {
  name: '订阅与取消订阅',
  parameters: {
    docs: {
      source: {
        code: `
import { EventEmitter } from '@jetlinks-web/utils';
import { ref } from 'vue';

// 管理订阅状态
const isSubscribed = ref(false);
const message = ref('未订阅');

const messageHandler = (data) => {
  message.value = \`收到消息：\${data}\`;
};

// 订阅事件
const subscribe = () => {
  if (!isSubscribed.value) {
    EventEmitter.subscribe(['test'], messageHandler);
    isSubscribed.value = true;
    message.value = '已订阅，等待消息...';
  }
};

// 取消订阅
const unsubscribe = () => {
  if (isSubscribed.value) {
    EventEmitter.unSubscribe(['test'], messageHandler);
    isSubscribed.value = false;
    message.value = '已取消订阅';
  }
};

// 发送消息
const sendMessage = () => {
  EventEmitter.emit('test', '这是一条测试消息');
};

// 在模板中使用
<div>
  <a-space>
    <a-button @click="subscribe" :disabled="isSubscribed">订阅</a-button>
    <a-button @click="unsubscribe" :disabled="!isSubscribed">取消订阅</a-button>
    <a-button @click="sendMessage">发送消息</a-button>
  </a-space>
  <p>状态：{{ message }}</p>
</div>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const isSubscribed = ref(false);
      const message = ref('未订阅');
      
      const messageHandler = (data) => {
        message.value = `收到消息：${data}`;
      };
      
      const subscribe = () => {
        if (!isSubscribed.value) {
          EventEmitter.subscribe(['test'], messageHandler);
          isSubscribed.value = true;
          message.value = '已订阅，等待消息...';
        }
      };
      
      const unsubscribe = () => {
        if (isSubscribed.value) {
          EventEmitter.unSubscribe(['test'], messageHandler);
          isSubscribed.value = false;
          message.value = '已取消订阅';
        }
      };
      
      const sendMessage = () => {
        EventEmitter.emit('test', '这是一条测试消息');
      };
      
      return { isSubscribed, message, subscribe, unsubscribe, sendMessage };
    },
    template: `
      <div>
        <a-space style="margin-bottom: 16px;">
          <a-button 
            @click="subscribe" 
            :disabled="isSubscribed"
            type="primary"
          >
            订阅事件
          </a-button>
          <a-button 
            @click="unsubscribe" 
            :disabled="!isSubscribed"
            danger
          >
            取消订阅
          </a-button>
          <a-button @click="sendMessage">
            发送消息
          </a-button>
        </a-space>
        
        <div style="padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold;">
            订阅状态：
            <span :style="{ color: isSubscribed ? '#52c41a' : '#ff4d4f' }">
              {{ isSubscribed ? '已订阅' : '未订阅' }}
            </span>
          </p>
          <p style="margin: 8px 0 0 0;">{{ message }}</p>
        </div>
        
        <p style="margin-top: 16px; color: #666; font-size: 12px;">
          提示：只有在订阅状态下才能收到消息
        </p>
      </div>
    `
  })
};