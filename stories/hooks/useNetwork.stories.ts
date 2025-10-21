import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { useNetwork } from '../../packages/hooks/src/useNetwork';

/**
 * Hook 函数
 * 
 * 这里展示了项目中网络状态检测相关 Hook 的使用方法和示例。
 */
const meta: Meta = {
  title: 'Hook函数/useNetwork 网络状态检测',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
useNetwork 是一个用于检测网络连接状态的 Vue 3 Hook，提供了实时的网络状态监控功能。

### 主要特性
- 实时监控网络连接状态变化
- 支持网络连接和断开的回调函数
- 响应式的网络状态，自动更新 UI
- 基于浏览器原生 Connection API

### 使用场景
- 网络状态指示器
- 网络断开时的提示信息
- 根据网络状态调整应用行为
- 离线模式的切换

### 基本用法

\`\`\`javascript
import { useNetwork } from '@jetlinks-web/hooks';

// 基本使用
const { isOnline } = useNetwork();

// 带回调函数的使用
const { isOnline } = useNetwork({
  onLine: () => {
    console.log('网络已连接');
  },
  offline: () => {
    console.log('网络已断开');
  }
});
\`\`\`

### 在 Vue 组件中使用

\`\`\`vue
<template>
  <div>
    <a-tag :color="isOnline ? 'green' : 'red'">
      {{ isOnline ? '在线' : '离线' }}
    </a-tag>
    
    <div v-if="!isOnline">
      <a-alert
        message="网络连接已断开"
        description="请检查您的网络连接"
        type="warning"
        show-icon
      />
    </div>
  </div>
</template>

<script setup>
import { useNetwork } from '@jetlinks-web/hooks';

const { isOnline } = useNetwork({
  onLine: () => {
    message.success('网络连接已恢复');
  },
  offline: () => {
    message.warning('网络连接已断开');
  }
});
</script>
\`\`\`

### 注意事项

- 该 Hook 依赖于浏览器的 Navigator Connection API
- 在不支持该 API 的浏览器中，默认返回在线状态
- 网络状态检测基于浏览器的连接信息，可能存在延迟
        `
      },
      source: {
        type: 'code'
      }
    }
  },
  argTypes: {
    showNotification: {
      control: 'boolean',
      description: '是否显示网络状态变化通知',
      defaultValue: true
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicUsage: Story = {
  name: '基本使用',
  parameters: {
    docs: {
      source: {
        code: `
import { useNetwork } from '@jetlinks-web/hooks';

// 基本使用
const { isOnline } = useNetwork();

// 在模板中使用
<template>
  <div>
    <a-tag :color="isOnline ? 'green' : 'red'">
      {{ isOnline ? '在线' : '离线' }}
    </a-tag>
    
    <a-card title="网络状态">
      <p>当前网络状态: {{ isOnline ? '已连接' : '已断开' }}</p>
    </a-card>
  </div>
</template>
        `
      }
    }
  },
  render: (args) => ({
    setup() {
      const { isOnline } = useNetwork();
      
      return { isOnline };
    },
    template: `
      <div>
        <a-space direction="vertical" style="width: 100%;">
          <div>
            <strong>网络状态:</strong> 
            <a-tag :color="isOnline ? 'green' : 'red'" size="large">
              {{ isOnline ? '在线' : '离线' }}
            </a-tag>
          </div>
          
          <a-card title="网络连接信息" style="width: 300px;">
            <div>
              <a-descriptions :column="1" size="small">
                <a-descriptions-item label="连接状态">
                  {{ isOnline ? '已连接' : '已断开' }}
                </a-descriptions-item>
                <a-descriptions-item label="状态图标">
                  <a-icon :type="isOnline ? 'wifi' : 'disconnect'" 
                          :style="{ color: isOnline ? '#52c41a' : '#ff4d4f' }" />
                </a-descriptions-item>
              </a-descriptions>
            </div>
          </a-card>
          
          <a-alert
            v-if="!isOnline"
            message="网络连接已断开"
            description="请检查您的网络连接设置"
            type="warning"
            show-icon
          />
        </a-space>
      </div>
    `
  }),
  args: {
    showNotification: true
  }
};

export const WithCallbacks: Story = {
  name: '带回调函数的使用',
  parameters: {
    docs: {
      source: {
        code: `
import { ref } from 'vue';
import { useNetwork } from '@jetlinks-web/hooks';

// 带回调函数的使用
const messages = ref([]);

const { isOnline } = useNetwork({
  onLine: () => {
    messages.value.push({
      type: 'success',
      content: '网络连接已恢复',
      time: new Date().toLocaleTimeString()
    });
  },
  offline: () => {
    messages.value.push({
      type: 'error',
      content: '网络连接已断开',
      time: new Date().toLocaleTimeString()
    });
  }
});

// 在模板中使用
<template>
  <div>
    <a-tag :color="isOnline ? 'green' : 'red'">
      {{ isOnline ? '在线' : '离线' }}
    </a-tag>
    
    <div class="message-list">
      <div v-for="msg in messages" :key="msg.time">
        <a-alert :type="msg.type" :message="msg.content" />
      </div>
    </div>
  </div>
</template>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const messages = ref([
        {
          type: 'info',
          content: '网络状态监控已启动',
          time: new Date().toLocaleTimeString()
        }
      ]);
      
      const { isOnline } = useNetwork({
        onLine: () => {
          messages.value.push({
            type: 'success',
            content: '网络连接已恢复',
            time: new Date().toLocaleTimeString()
          });
        },
        offline: () => {
          messages.value.push({
            type: 'error',
            content: '网络连接已断开',
            time: new Date().toLocaleTimeString()
          });
        }
      });
      
      const clearMessages = () => {
        messages.value = [];
      };
      
      const simulateOffline = () => {
        messages.value.push({
          type: 'warning',
          content: '模拟网络断开（仅为演示）',
          time: new Date().toLocaleTimeString()
        });
      };
      
      return { 
        isOnline, 
        messages, 
        clearMessages,
        simulateOffline
      };
    },
    template: `
      <div>
        <a-space direction="vertical" style="width: 100%;">
          <div>
            <strong>当前网络状态:</strong> 
            <a-tag :color="isOnline ? 'green' : 'red'" size="large">
              {{ isOnline ? '在线' : '离线' }}
            </a-tag>
          </div>
          
          <a-space>
            <a-button @click="clearMessages" size="small">
              清空消息
            </a-button>
            <a-button @click="simulateOffline" size="small" type="dashed">
              模拟网络事件
            </a-button>
          </a-space>
          
          <a-card title="网络状态变化日志" style="width: 400px;">
            <div style="max-height: 200px; overflow-y: auto;">
              <div v-if="messages.length === 0" style="text-align: center; color: #999;">
                暂无网络状态变化记录
              </div>
              <div v-else>
                <div v-for="(msg, index) in messages" :key="index" style="margin-bottom: 8px;">
                  <a-alert 
                    :type="msg.type" 
                    :message="msg.content" 
                    size="small"
                    show-icon
                  >
                    <template #description>
                      时间: {{ msg.time }}
                    </template>
                  </a-alert>
                </div>
              </div>
            </div>
          </a-card>
          
          <a-typography-text type="secondary" style="font-size: 12px;">
            注意: 实际的网络状态变化需要真实的网络环境变化才能触发回调函数
          </a-typography-text>
        </a-space>
      </div>
    `
  })
};