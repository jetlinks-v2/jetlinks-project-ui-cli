import type { Meta, StoryObj } from '@storybook/vue3';
import { ndJson, NdJson } from '../../packages/core/src/fetch';

/**
 * 核心模块
 *
 * 这里展示了 NdJson 流式请求类的使用方法和示例。
 */
const meta: Meta = {
  title: '核心功能/NdJson 流式请求',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
NdJson 是一个专门处理流式 JSON 数据的请求类，基于 Fetch API 实现。

### 主要特性
- 支持流式数据接收
- 基于 RxJS Observable 的响应式编程
- 自动处理 NDJSON 格式数据
- 支持请求取消
- 内置认证和请求拦截

### 核心方法
- create: 配置请求选项
- get: 发送 GET 流式请求
- post: 发送 POST 流式请求
- cancel: 取消正在进行的请求

### 使用场景
- 实时数据流处理
- 大文件下载
- 服务器发送事件 (SSE)
- 长轮询替代方案
- 流式 API 响应

### 基本用法

\`\`\`javascript
import { ndJson } from '@jetlinks-web/core';

// 配置选项
ndJson.create({
  code: 200,
  codeKey: 'status'
});

// GET 流式请求
const subscription = ndJson.get('/api/stream-data').subscribe({
  next: (data) => console.log('接收到数据:', data),
  error: (error) => console.error('请求失败:', error),
  complete: () => console.log('请求完成')
});

// POST 流式请求
const postSubscription = ndJson.post('/api/stream-upload', {
  fileId: '123',
  chunkSize: 1024
}).subscribe({
  next: (response) => console.log('上传进度:', response),
  complete: () => console.log('上传完成')
});

// 取消请求
ndJson.cancel();
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

export const CreateConfiguration: Story = {
  name: '配置创建',
  parameters: {
    docs: {
      source: {
        code: `
import { ndJson } from '@jetlinks-web/core';

// 创建配置示例
const handleCreate = () => {
  ndJson.create({
    code: 200,
    codeKey: 'status',
    filter_url: ['/api/public'],
    requestOptions: (config) => ({
      ...config,
      timeout: 30000
    }),
    handleResponse: (response) => {
      response.success = response.status === 200;
      return response;
    }
  });
  console.log('NdJson 配置已创建');
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const handleCreate = () => {
        try {
          console.log('模拟配置 NdJson 实例');
          console.log('配置参数:', {
            code: 200,
            codeKey: 'status',
            timeout: 30000
          });
          // 实际项目中这里会执行真实的配置
          // ndJson.create({ code: 200, codeKey: 'status' });
        } catch (error) {
          console.error('配置失败:', error);
        }
      };

      return { handleCreate };
    },
    template: `
      <div>
        <a-button type="primary" @click="handleCreate">
          创建 NdJson 配置
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          配置 NdJson 实例的基本选项
        </p>
      </div>
    `
  })
};

export const GetStreamRequest: Story = {
  name: 'GET 流式请求',
  parameters: {
    docs: {
      source: {
        code: `
import { ndJson } from '@jetlinks-web/core';

// GET 流式请求示例
const handleGetStream = () => {
  const subscription = ndJson.get('/api/real-time-data', '{}', {
    headers: {
      'Accept': 'application/x-ndjson'
    }
  }).subscribe({
    next: (data) => {
      console.log('接收到流式数据:', data);
    },
    error: (error) => {
      console.error('流式请求错误:', error);
    },
    complete: () => {
      console.log('流式请求完成');
    }
  });
  
  // 5秒后取消订阅
  setTimeout(() => {
    subscription.unsubscribe();
  }, 5000);
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const handleGetStream = () => {
        try {
          console.log('模拟 GET 流式请求执行');
          console.log('请求 URL: /api/real-time-data');
          console.log('开始接收流式数据...');

          // 模拟流式数据接收
          let count = 0;
          const interval = setInterval(() => {
            count++;
            console.log(`模拟接收数据 ${count}:`, {
              timestamp: Date.now(),
              message: `数据片段 ${count}`
            });

            if (count >= 3) {
              clearInterval(interval);
              console.log('模拟流式请求完成');
            }
          }, 1000);

          // 实际项目中这里会执行真实的流式请求
          // const subscription = ndJson.get('/api/real-time-data').subscribe(...);
        } catch (error) {
          console.error('GET 流式请求失败:', error);
        }
      };

      return { handleGetStream };
    },
    template: `
      <div>
        <a-button type="primary" @click="handleGetStream">
          执行 GET 流式请求
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          发送 GET 流式请求获取实时数据
        </p>
      </div>
    `
  })
};

export const PostStreamRequest: Story = {
  name: 'POST 流式请求',
  parameters: {
    docs: {
      source: {
        code: `
import { ndJson } from '@jetlinks-web/core';

// POST 流式请求示例
const handlePostStream = () => {
  const requestData = {
    action: 'process',
    params: {
      batchSize: 100,
      processType: 'analysis'
    }
  };
  
  const subscription = ndJson.post('/api/batch-process', requestData).subscribe({
    next: (response) => {
      console.log('处理进度更新:', response);
      if (response.progress) {
        console.log(\`处理进度: \${response.progress}%\`);
      }
    },
    error: (error) => {
      console.error('批处理请求错误:', error);
    },
    complete: () => {
      console.log('批处理完成');
    }
  });
  
  return subscription;
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const handlePostStream = () => {
        try {
          const requestData = {
            action: 'process',
            params: {
              batchSize: 100,
              processType: 'analysis'
            }
          };

          console.log('模拟 POST 流式请求执行');
          console.log('请求 URL: /api/batch-process');
          console.log('请求数据:', requestData);

          // 模拟批处理进度更新
          let progress = 0;
          const interval = setInterval(() => {
            progress += 25;
            console.log(`处理进度更新:`, {
              progress,
              status: progress < 100 ? 'processing' : 'completed',
              timestamp: Date.now()
            });

            if (progress >= 100) {
              clearInterval(interval);
              console.log('模拟批处理完成');
            }
          }, 1000);

          // 实际项目中这里会执行真实的流式请求
          // const subscription = ndJson.post('/api/batch-process', requestData).subscribe(...);
        } catch (error) {
          console.error('POST 流式请求失败:', error);
        }
      };

      return { handlePostStream };
    },
    template: `
      <div>
        <a-button type="primary" @click="handlePostStream">
          执行 POST 流式请求
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          发送 POST 流式请求进行批处理
        </p>
      </div>
    `
  })
};

export const CancelRequest: Story = {
  name: '取消请求',
  parameters: {
    docs: {
      source: {
        code: `
import { ndJson } from '@jetlinks-web/core';

// 取消请求示例
const handleCancelRequest = () => {
  // 开始一个长时间运行的请求
  const subscription = ndJson.get('/api/long-running-task').subscribe({
    next: (data) => console.log('接收数据:', data),
    error: (error) => console.error('请求错误:', error),
    complete: () => console.log('请求完成')
  });
  
  // 3秒后取消请求
  setTimeout(() => {
    console.log('取消请求...');
    ndJson.cancel(); // 取消正在进行的请求
    subscription.unsubscribe(); // 取消订阅
  }, 3000);
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      let isRequesting = false;
      let cancelTimer: number | null = null;

      const handleCancelRequest = () => {
        if (isRequesting) {
          console.log('已有请求正在进行中');
          return;
        }

        try {
          isRequesting = true;
          console.log('模拟开始长时间运行的请求');
          console.log('请求 URL: /api/long-running-task');

          // 模拟长时间请求
          let count = 0;
          const requestInterval = setInterval(() => {
            count++;
            console.log(`模拟接收数据 ${count}:`, {
              taskId: 'task-123',
              progress: count * 10,
              status: 'running'
            });
          }, 500);

          // 3秒后自动取消
          cancelTimer = setTimeout(() => {
            clearInterval(requestInterval);
            console.log('自动取消请求');
            console.log('请求已被中止');
            isRequesting = false;
          }, 3000);

          // 实际项目中这里会执行真实的请求和取消逻辑
          // const subscription = ndJson.get('/api/long-running-task').subscribe(...);
          // setTimeout(() => ndJson.cancel(), 3000);
        } catch (error) {
          console.error('请求失败:', error);
          isRequesting = false;
        }
      };

      const handleManualCancel = () => {
        if (cancelTimer) {
          clearTimeout(cancelTimer);
          cancelTimer = null;
        }
        console.log('手动取消请求');
        isRequesting = false;
      };

      return { handleCancelRequest, handleManualCancel };
    },
    template: `
      <div>
        <a-space>
          <a-button type="primary" @click="handleCancelRequest">
            开始可取消的请求
          </a-button>
          <a-button danger @click="handleManualCancel">
            手动取消
          </a-button>
        </a-space>
        <p style="margin-top: 16px; color: #666;">
          演示如何取消正在进行的流式请求
        </p>
      </div>
    `
  })
};

export const NdJsonInstance: Story = {
  name: 'NdJson 实例',
  parameters: {
    docs: {
      source: {
        code: `
import { NdJson } from '@jetlinks-web/core';

// 创建自定义 NdJson 实例示例
const handleCustomInstance = () => {
  // 创建新的实例
  const customNdJson = new NdJson();
  
  // 配置实例
  customNdJson.create({
    code: 200,
    codeKey: 'code',
    filter_url: ['/api/auth'],
    tokenExpiration: () => {
      console.log('Token 已过期，需要重新登录');
    },
    requestOptions: (config) => ({
      ...config,
      headers: {
        ...config.headers,
        'X-Custom-Header': 'custom-value'
      }
    }),
    handleResponse: (response) => {
      response.timestamp = Date.now();
      return response;
    }
  });
  
  // 使用自定义实例
  const subscription = customNdJson.get('/api/custom-data').subscribe({
    next: (data) => console.log('自定义实例数据:', data),
    error: (error) => console.error('自定义实例错误:', error)
  });
  
  return { customNdJson, subscription };
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const handleCustomInstance = () => {
        try {
          console.log('模拟创建自定义 NdJson 实例');
          console.log('配置自定义选项:', {
            code: 200,
            codeKey: 'code',
            customHeaders: true,
            responseHandler: true
          });

          console.log('模拟使用自定义实例发送请求');
          console.log('请求 URL: /api/custom-data');

          // 模拟自定义实例响应
          setTimeout(() => {
            console.log('自定义实例响应:', {
              data: { message: '自定义实例数据' },
              timestamp: Date.now(),
              customProcessed: true
            });
          }, 1000);

          // 实际项目中这里会执行真实的自定义实例创建和使用
          // const customNdJson = new NdJson();
          // customNdJson.create({ ... });
          // const subscription = customNdJson.get('/api/custom-data').subscribe(...);
        } catch (error) {
          console.error('自定义实例创建失败:', error);
        }
      };

      return { handleCustomInstance };
    },
    template: `
      <div>
        <a-button type="primary" @click="handleCustomInstance">
          创建自定义 NdJson 实例
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          创建并配置自定义的 NdJson 实例
        </p>
      </div>
    `
  })
};
