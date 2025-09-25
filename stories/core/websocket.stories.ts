import type { Meta, StoryObj } from '@storybook/vue3';
import { wsClient, WebSocketClient } from '../../packages/core/src/websocket';

/**
 * WebSocket 客户端
 * 
 * 这里展示了项目中 WebSocket 客户端的使用方法和示例。
 */
const meta: Meta = {
  title: '核心功能/WebSocket 客户端',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
WebSocketClient 是一个功能完整的 WebSocket 客户端，基于 RxJS 实现。

### 主要特性
- 自动重连机制
- 心跳检测
- 消息订阅管理
- 离线消息缓存
- 微应用支持

### 使用场景
- 实时数据推送
- 消息订阅/取消订阅
- 设备状态监控
- 实时通信

### 基本用法

\`\`\`javascript
import { wsClient } from '@jetlinks-web/core';

// 初始化 WebSocket
wsClient.initWebSocket('ws://localhost:8080/websocket');
wsClient.connect();

// 订阅消息
const subscription = wsClient.getWebSocket('unique-id', 'topic/path', { param: 'value' })
  .subscribe(
    message => console.log('收到消息:', message),
    error => console.error('错误:', error)
  );

// 发送消息
wsClient.send({
  type: 'sub',
  id: 'unique-id',
  topic: 'topic/path',
  parameter: { param: 'value' }
});

// 清理
subscription.unsubscribe();
wsClient.disconnect();
\`\`\`

### 在 Vue 组件中使用

\`\`\`vue
<template>
  <div>
    <a-button @click="connect">连接</a-button>
    <a-button @click="subscribe">订阅</a-button>
    <a-button @click="unsubscribe">取消订阅</a-button>
    <a-button @click="disconnect">断开</a-button>
    <div>{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { wsClient } from '@jetlinks-web/core';

const message = ref('');
let subscription = null;

const connect = () => {
  wsClient.initWebSocket('ws://localhost:8080/websocket');
  wsClient.connect();
};

const subscribe = () => {
  subscription = wsClient.getWebSocket('test-id', 'test/topic', {})
    .subscribe(
      msg => message.value = JSON.stringify(msg)
    );
};

const unsubscribe = () => {
  if (subscription) {
    subscription.unsubscribe();
    subscription = null;
  }
};

const disconnect = () => {
  wsClient.disconnect();
};

onUnmounted(() => {
  unsubscribe();
  disconnect();
});
</script>
\`\`\`
        `
      },
      source: {
        type: 'code'
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const InitAndConnect: Story = {
  name: '初始化和连接',
  parameters: {
    docs: {
      source: {
        code: `
import { wsClient } from '@jetlinks-web/core';

// 初始化 WebSocket 连接
const initWebSocket = () => {
  wsClient.initWebSocket('ws://localhost:8080/websocket');
  wsClient.connect();
};

// 在模板中使用
<a-button type="primary" @click="initWebSocket">
  初始化并连接 WebSocket
</a-button>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const initWebSocket = () => {
        // 模拟 WebSocket 连接
        console.log('初始化 WebSocket: ws://localhost:8080/websocket');
        wsClient.initWebSocket('ws://localhost:8080/websocket');
        wsClient.connect();
      };
      
      return { initWebSocket };
    },
    template: `
      <div>
        <a-button type="primary" @click="initWebSocket">
          初始化并连接 WebSocket
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          点击按钮初始化并连接 WebSocket，请查看控制台输出
        </p>
      </div>
    `
  })
};

export const Subscribe: Story = {
  name: '订阅消息',
  parameters: {
    docs: {
      source: {
        code: `
import { wsClient } from '@jetlinks-web/core';

// 订阅消息
const subscribeMessage = () => {
  const subscription = wsClient.getWebSocket(
    'device-status-001',
    'device/status/update',
    { deviceId: 'device001' }
  ).subscribe(
    message => {
      console.log('收到消息:', message);
      // 处理接收到的消息
    },
    error => {
      console.error('订阅错误:', error);
    }
  );
  
  // 保存 subscription 以便后续取消订阅
  return subscription;
};

// 在模板中使用
<a-button @click="subscribeMessage">
  订阅设备状态消息
</a-button>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const subscribeMessage = () => {
        console.log('订阅消息: device-status-001');
        const subscription = wsClient.getWebSocket(
          'device-status-001',
          'device/status/update',
          { deviceId: 'device001' }
        ).subscribe(
          message => {
            console.log('收到消息:', message);
          },
          error => {
            console.error('订阅错误:', error);
          }
        );
        
        // 5秒后自动取消订阅
        setTimeout(() => {
          subscription.unsubscribe();
          console.log('自动取消订阅');
        }, 5000);
      };
      
      return { subscribeMessage };
    },
    template: `
      <div>
        <a-button @click="subscribeMessage">
          订阅设备状态消息
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          点击按钮订阅消息，5秒后自动取消订阅，请查看控制台输出
        </p>
      </div>
    `
  })
};

export const SendMessage: Story = {
  name: '发送消息',
  parameters: {
    docs: {
      source: {
        code: `
import { wsClient } from '@jetlinks-web/core';

// 发送消息
const sendMessage = () => {
  const message = {
    type: 'sub',
    id: 'control-001',
    topic: 'device/control',
    parameter: {
      deviceId: 'device001',
      command: 'turn_on'
    }
  };
  
  wsClient.send(message);
};

// 在模板中使用
<a-button type="primary" @click="sendMessage">
  发送控制命令
</a-button>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const sendMessage = () => {
        const message = {
          type: 'sub',
          id: 'control-001',
          topic: 'device/control',
          parameter: {
            deviceId: 'device001',
            command: 'turn_on'
          }
        };
        
        console.log('发送消息:', message);
        wsClient.send(message);
      };
      
      return { sendMessage };
    },
    template: `
      <div>
        <a-button type="primary" @click="sendMessage">
          发送控制命令
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          点击按钮发送 WebSocket 消息，请查看控制台输出
        </p>
      </div>
    `
  })
};

export const Disconnect: Story = {
  name: '断开连接',
  parameters: {
    docs: {
      source: {
        code: `
import { wsClient } from '@jetlinks-web/core';

// 断开连接
const disconnectWebSocket = () => {
  wsClient.disconnect();
  console.log('WebSocket 已断开连接');
};

// 在模板中使用
<a-button danger @click="disconnectWebSocket">
  断开 WebSocket 连接
</a-button>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const disconnectWebSocket = () => {
        wsClient.disconnect();
        console.log('WebSocket 已断开连接');
      };
      
      return { disconnectWebSocket };
    },
    template: `
      <div>
        <a-button danger @click="disconnectWebSocket">
          断开 WebSocket 连接
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          点击按钮断开 WebSocket 连接，请查看控制台输出
        </p>
      </div>
    `
  })
};

export const CreateClient: Story = {
  name: '创建客户端实例',
  parameters: {
    docs: {
      source: {
        code: `
import { WebSocketClient } from '@jetlinks-web/core';

// 创建自定义 WebSocket 客户端实例
const createCustomClient = () => {
  const customClient = new WebSocketClient({
    onError: (message) => {
      console.error('自定义错误处理:', message);
      // 自定义错误处理逻辑
    }
  });
  
  customClient.initWebSocket('ws://custom.example.com/ws');
  customClient.connect();
  
  return customClient;
};

// 在模板中使用
<a-button @click="createCustomClient">
  创建自定义客户端
</a-button>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const createCustomClient = () => {
        console.log('创建自定义 WebSocket 客户端');
        const customClient = new WebSocketClient({
          onError: (message) => {
            console.error('自定义错误处理:', message);
          }
        });
        
        customClient.initWebSocket('ws://custom.example.com/ws');
        customClient.connect();
        
        console.log('自定义客户端创建完成');
      };
      
      return { createCustomClient };
    },
    template: `
      <div>
        <a-button @click="createCustomClient">
          创建自定义客户端
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          点击按钮创建带有自定义错误处理的 WebSocket 客户端，请查看控制台输出
        </p>
      </div>
    `
  })
};

