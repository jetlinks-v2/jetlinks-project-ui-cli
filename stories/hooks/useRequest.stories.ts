import type { Meta, StoryObj } from '@storybook/vue3';
import { useRequest } from '../../packages/hooks/src/useRequest';
import { ref } from 'vue';

/**
 * Hook函数
 * 
 * 这里展示了 useRequest hook 的使用方法和示例。
 */
const meta: Meta = {
  title: 'Hook函数/useRequest 请求管理',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
useRequest 是一个用于管理异步请求的 Vue Hook，提供了数据获取、加载状态管理等功能。

### 主要特性
- 自动管理 loading 状态
- 支持立即执行或手动触发
- 提供成功、错误、警告回调
- 支持数据格式化和默认值
- 组件卸载时自动清理

### 返回值
- \`data\`: 响应数据
- \`loading\`: 加载状态
- \`run\`: 手动执行请求
- \`reload\`: 重新加载（使用默认参数）

### 基本用法

\`\`\`javascript
import { useRequest } from '@jetlinks-web/hooks';

// 基本用法
const { data, loading, run, reload } = useRequest(fetchData, {
  immediate: true, // 立即执行
  formatName: 'result', // 数据格式化字段
  onSuccess: (response) => {
    console.log('请求成功:', response);
  },
  onError: (error) => {
    console.error('请求失败:', error);
  }
});
\`\`\`

### 在 Vue 组件中使用

\`\`\`vue
<template>
  <div>
    <a-spin :spinning="loading">
      <div v-if="data">{{ data }}</div>
    </a-spin>
    <a-button @click="run">手动请求</a-button>
    <a-button @click="reload">重新加载</a-button>
  </div>
</template>

<script setup>
import { useRequest } from '@jetlinks-web/hooks';

const fetchUserData = async (id) => {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
};

const { data, loading, run, reload } = useRequest(fetchUserData, {
  immediate: false,
  defaultParams: [1],
  onSuccess: (response) => {
    console.log('用户数据获取成功');
  }
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

// 模拟 API 请求函数
const mockApiRequest = (delay = 1000, shouldFail = false) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject({
          success: false,
          message: '请求失败',
          code: 500
        });
      } else {
        resolve({
          success: true,
          result: {
            id: Math.floor(Math.random() * 1000),
            name: '用户' + Math.floor(Math.random() * 100),
            email: 'user@example.com',
            createTime: new Date().toLocaleString()
          },
          message: '请求成功'
        });
      }
    }, delay);
  });
};

export const BasicUsage: Story = {
  name: '基本用法',
  parameters: {
    docs: {
      source: {
        code: `
import { useRequest } from '@jetlinks-web/hooks';

// 基本请求
const { data, loading, run } = useRequest(mockApiRequest, {
  immediate: true,
  formatName: 'result'
});

// 在模板中使用
<a-spin :spinning="loading">
  <div v-if="data">
    <p>ID: {{ data.id }}</p>
    <p>姓名: {{ data.name }}</p>
    <p>邮箱: {{ data.email }}</p>
  </div>
</a-spin>
<a-button @click="run" :loading="loading">
  重新请求
</a-button>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const { data, loading, run } = useRequest(mockApiRequest, {
        immediate: true,
        formatName: 'result'
      });
      
      return { data, loading, run };
    },
    template: `
      <div style="text-align: left;">
        <a-card title="基本用法示例" style="width: 400px;">
          <a-spin :spinning="loading">
            <div v-if="data" style="margin-bottom: 16px;">
              <p><strong>ID:</strong> {{ data.id }}</p>
              <p><strong>姓名:</strong> {{ data.name }}</p>
              <p><strong>邮箱:</strong> {{ data.email }}</p>
              <p><strong>创建时间:</strong> {{ data.createTime }}</p>
            </div>
            <div v-else style="padding: 20px; text-align: center; color: #999;">
              暂无数据
            </div>
          </a-spin>
          <a-button type="primary" @click="run" :loading="loading">
            重新请求
          </a-button>
        </a-card>
      </div>
    `
  })
};

export const ManualTrigger: Story = {
  name: '手动触发',
  parameters: {
    docs: {
      source: {
        code: `
import { useRequest } from '@jetlinks-web/hooks';

// 手动触发请求
const { data, loading, run } = useRequest(mockApiRequest, {
  immediate: false, // 不立即执行
  formatName: 'result'
});

// 手动调用
const handleFetch = () => {
  run();
};

// 在模板中使用
<a-button @click="handleFetch" :loading="loading">
  点击获取数据
</a-button>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const { data, loading, run } = useRequest(mockApiRequest, {
        immediate: false,
        formatName: 'result'
      });
      
      const handleFetch = () => {
        run();
      };
      
      return { data, loading, handleFetch };
    },
    template: `
      <div style="text-align: left;">
        <a-card title="手动触发示例" style="width: 400px;">
          <div style="margin-bottom: 16px;">
            <a-button type="primary" @click="handleFetch" :loading="loading">
              点击获取数据
            </a-button>
          </div>
          <a-spin :spinning="loading">
            <div v-if="data" style="padding: 16px; border: 1px solid #d9d9d9; border-radius: 6px;">
              <p><strong>ID:</strong> {{ data.id }}</p>
              <p><strong>姓名:</strong> {{ data.name }}</p>
              <p><strong>邮箱:</strong> {{ data.email }}</p>
              <p><strong>创建时间:</strong> {{ data.createTime }}</p>
            </div>
            <div v-else style="padding: 20px; text-align: center; color: #999;">
              点击按钮获取数据
            </div>
          </a-spin>
        </a-card>
      </div>
    `
  })
};

export const WithCallbacks: Story = {
  name: '回调处理',
  parameters: {
    docs: {
      source: {
        code: `
import { useRequest } from '@jetlinks-web/hooks';
import { message } from 'ant-design-vue';

// 带回调的请求
const { data, loading, run } = useRequest(mockApiRequest, {
  immediate: false,
  formatName: 'result',
  onSuccess: (response) => {
    message.success('数据获取成功！');
    console.log('成功回调:', response);
  },
  onError: (error) => {
    message.error('请求失败: ' + error.message);
    console.error('错误回调:', error);
  },
  onWarn: (warning) => {
    message.warning('请求警告');
    console.warn('警告回调:', warning);
  }
});

// 测试成功和失败
const testSuccess = () => run();
const testFailure = () => run(1000, true); // 传入失败参数
        `
      }
    }
  },
  render: () => ({
    setup() {
      const successMessage = ref('');
      const errorMessage = ref('');
      
      const { data, loading, run } = useRequest(mockApiRequest, {
        immediate: false,
        formatName: 'result',
        onSuccess: (response) => {
          successMessage.value = '数据获取成功！时间：' + new Date().toLocaleTimeString();
          errorMessage.value = '';
        },
        onError: (error) => {
          errorMessage.value = '请求失败：' + (error.message || '未知错误') + ' 时间：' + new Date().toLocaleTimeString();
          successMessage.value = '';
        }
      });
      
      const testSuccess = () => {
        run(1000, false);
      };
      
      const testFailure = () => {
        run(1000, true);
      };
      
      return { data, loading, testSuccess, testFailure, successMessage, errorMessage };
    },
    template: `
      <div style="text-align: left;">
        <a-card title="回调处理示例" style="width: 450px;">
          <div style="margin-bottom: 16px;">
            <a-space>
              <a-button type="primary" @click="testSuccess" :loading="loading">
                测试成功
              </a-button>
              <a-button danger @click="testFailure" :loading="loading">
                测试失败
              </a-button>
            </a-space>
          </div>
          
          <div v-if="successMessage" style="margin-bottom: 16px;">
            <a-alert :message="successMessage" type="success" show-icon />
          </div>
          
          <div v-if="errorMessage" style="margin-bottom: 16px;">
            <a-alert :message="errorMessage" type="error" show-icon />
          </div>
          
          <a-spin :spinning="loading">
            <div v-if="data" style="padding: 16px; border: 1px solid #d9d9d9; border-radius: 6px;">
              <p><strong>ID:</strong> {{ data.id }}</p>
              <p><strong>姓名:</strong> {{ data.name }}</p>
              <p><strong>邮箱:</strong> {{ data.email }}</p>
            </div>
            <div v-else style="padding: 20px; text-align: center; color: #999;">
              点击按钮测试回调效果
            </div>
          </a-spin>
        </a-card>
      </div>
    `
  })
};

export const ReloadFunction: Story = {
  name: '重新加载',
  parameters: {
    docs: {
      source: {
        code: `
import { useRequest } from '@jetlinks-web/hooks';

// 带默认参数的请求
const { data, loading, run, reload } = useRequest(fetchUserData, {
  immediate: true,
  defaultParams: ['user123'], // 默认参数
  formatName: 'result'
});

// reload 会使用 defaultParams 重新执行
const handleReload = () => {
  reload();
};

// run 可以传入新参数
const handleRunWithNewParams = () => {
  run('user456');
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const mockFetchUserData = (userId = 'default') => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              result: {
                userId,
                name: '用户-' + userId,
                lastUpdate: new Date().toLocaleTimeString()
              }
            });
          }, 800);
        });
      };
      
      const { data, loading, run, reload } = useRequest(mockFetchUserData, {
        immediate: true,
        defaultParams: ['user123'],
        formatName: 'result'
      });
      
      const handleReload = () => {
        reload();
      };
      
      const handleRunWithNewParams = () => {
        run('user' + Math.floor(Math.random() * 1000));
      };
      
      return { data, loading, handleReload, handleRunWithNewParams };
    },
    template: `
      <div style="text-align: left;">
        <a-card title="重新加载示例" style="width: 400px;">
          <div style="margin-bottom: 16px;">
            <a-space>
              <a-button @click="handleReload" :loading="loading">
                重新加载（默认参数）
              </a-button>
              <a-button type="primary" @click="handleRunWithNewParams" :loading="loading">
                使用新参数
              </a-button>
            </a-space>
          </div>
          
          <a-spin :spinning="loading">
            <div v-if="data" style="padding: 16px; border: 1px solid #d9d9d9; border-radius: 6px;">
              <p><strong>用户ID:</strong> {{ data.userId }}</p>
              <p><strong>姓名:</strong> {{ data.name }}</p>
              <p><strong>最后更新:</strong> {{ data.lastUpdate }}</p>
            </div>
            <div v-else style="padding: 20px; text-align: center; color: #999;">
              加载中...
            </div>
          </a-spin>
          
          <div style="margin-top: 16px; font-size: 12px; color: #666;">
            <p>• reload() 使用 defaultParams 重新执行</p>
            <p>• run() 可以传入新参数执行</p>
          </div>
        </a-card>
      </div>
    `
  })
};