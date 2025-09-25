import type { Meta, StoryObj } from '@storybook/vue3';
import { useChainedRequests } from '../../packages/hooks/src/useSmartRequest';
import { ref } from 'vue';

/**
 * Hook函数
 * 
 * 这里展示了 useChainedRequests hook 的使用方法和示例。
 */
const meta: Meta = {
  title: 'Hook函数/useChainedRequests 链式请求管理',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
useChainedRequests 是一个用于管理链式异步请求的 Vue Hook，支持串行执行多个依赖请求。

### 主要特性
- 支持多步骤串行请求
- 参数解析器，自动传递上一步结果
- 条件跳转和循环控制
- 结果收集和合并
- 自动管理 loading 状态
- 灵活的错误处理

### 返回值
- \`stepData\`: 各步骤的响应数据
- \`loading\`: 整体加载状态
- \`run\`: 执行链式请求
- \`data\`: 最终合并的结果

### 基本用法

\`\`\`javascript
import { useChainedRequests } from '@jetlinks-web/hooks';

// 定义请求步骤
const steps = [
  {
    name: 'step1',
    request: getUserInfo,
    options: { formatName: 'result' }
  },
  {
    name: 'step2',
    request: getUserPosts,
    paramsResolver: (prevResult) => [prevResult.id],
    options: { formatName: 'result' }
  }
];

const { stepData, loading, run, data } = useChainedRequests(steps);
\`\`\`

### 高级功能

\`\`\`javascript
// 带条件跳转和结果收集
const steps = [
  {
    name: 'checkAuth',
    request: checkAuthStatus,
    shouldBreak: (result) => !result.isAuthenticated,
    jumpTo: (result) => result.needRefresh ? 1 : 2
  },
  {
    name: 'refreshToken',
    request: refreshAuthToken,
    collector: (currentResult, collected) => ({
      ...collected,
      token: currentResult.token
    })
  },
  {
    name: 'fetchData',
    request: fetchUserData,
    paramsResolver: (prevResult) => [prevResult.userId]
  }
];
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
const mockGetUserInfo = (userId = 1) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        result: {
          id: userId,
          name: '用户' + userId,
          email: `user${userId}@example.com`,
          posts: Math.floor(Math.random() * 10) + 1
        }
      });
    }, 800);
  });
};

const mockGetUserPosts = (userId: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = Array.from({ length: 3 }, (_, i) => ({
        id: i + 1,
        title: `用户${userId}的文章${i + 1}`,
        content: `这是用户${userId}发布的第${i + 1}篇文章内容...`
      }));
      
      resolve({
        success: true,
        result: posts
      });
    }, 600);
  });
};

const mockCheckAuth = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const isAuth = Math.random() > 0.3; // 70% 概率认证成功
      resolve({
        success: true,
        result: {
          isAuthenticated: isAuth,
          needRefresh: !isAuth && Math.random() > 0.5,
          userId: 1
        }
      });
    }, 500);
  });
};

const mockRefreshToken = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        result: {
          token: 'new_token_' + Date.now(),
          userId: 1
        }
      });
    }, 400);
  });
};

export const BasicUsage: Story = {
  name: '基本用法',
  parameters: {
    docs: {
      source: {
        code: `
import { useChainedRequests } from '@jetlinks-web/hooks';

// 定义请求步骤
const steps = [
  {
    name: 'getUserInfo',
    request: mockGetUserInfo,
    options: { formatName: 'result' }
  },
  {
    name: 'getUserPosts',
    request: mockGetUserPosts,
    paramsResolver: (prevResult) => [prevResult.id],
    options: { formatName: 'result' }
  }
];

const { stepData, loading, run, data } = useChainedRequests(steps);

// 执行链式请求
const handleRun = () => {
  run(1); // 传入初始参数
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const steps = [
        {
          name: 'getUserInfo',
          request: mockGetUserInfo,
          options: { formatName: 'result' }
        },
        {
          name: 'getUserPosts',
          request: mockGetUserPosts,
          paramsResolver: (prevResult: any) => [prevResult.id],
          options: { formatName: 'result' }
        }
      ];

      const { stepData, loading, run, data } = useChainedRequests(steps);

      const handleRun = () => {
        run(Math.floor(Math.random() * 5) + 1);
      };

      return { stepData, loading, handleRun, data };
    },
    template: `
      <div style="text-align: left;">
        <a-card title="基本链式请求示例" style="width: 500px;">
          <div style="margin-bottom: 16px;">
            <a-button type="primary" @click="handleRun" :loading="loading">
              执行链式请求
            </a-button>
          </div>
          
          <a-spin :spinning="loading">
            <div v-if="data" style="margin-bottom: 16px;">
              <h4>最终结果：</h4>
              <div style="padding: 12px; background: #f5f5f5; border-radius: 4px;">
                <p><strong>用户信息:</strong> {{ data.name }} ({{ data.email }})</p>
                <p><strong>文章数量:</strong> {{ data.length }}篇</p>
                <div v-if="data.length">
                  <p><strong>文章列表:</strong></p>
                  <ul style="margin: 0; padding-left: 20px;">
                    <li v-for="post in data" :key="post.id">
                      {{ post.title }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div v-else style="padding: 20px; text-align: center; color: #999;">
              点击按钮执行链式请求
            </div>
          </a-spin>
          
          <div style="margin-top: 16px; font-size: 12px; color: #666;">
            <p>• 第一步：获取用户信息</p>
            <p>• 第二步：根据用户ID获取文章列表</p>
          </div>
        </a-card>
      </div>
    `
  })
};

export const ConditionalFlow: Story = {
  name: '条件跳转',
  parameters: {
    docs: {
      source: {
        code: `
import { useChainedRequests } from '@jetlinks-web/hooks';

// 带条件跳转的步骤
const steps = [
  {
    name: 'checkAuth',
    request: mockCheckAuth,
    options: { formatName: 'result' },
    shouldBreak: (result) => !result.isAuthenticated && !result.needRefresh,
    jumpTo: (result) => result.needRefresh ? 1 : undefined
  },
  {
    name: 'refreshToken',
    request: mockRefreshToken,
    options: { formatName: 'result' }
  },
  {
    name: 'fetchData',
    request: mockGetUserInfo,
    paramsResolver: (prevResult) => [prevResult.userId],
    options: { formatName: 'result' }
  }
];

const { stepData, loading, run, data } = useChainedRequests(steps);
        `
      }
    }
  },
  render: () => ({
    setup() {
      const status = ref('');
      
      const steps = [
        {
          name: 'checkAuth',
          request: mockCheckAuth,
          options: { 
            formatName: 'result',
            onSuccess: (response: any) => {
              const result = response.result;
              if (!result.isAuthenticated) {
                if (result.needRefresh) {
                  status.value = '认证失效，需要刷新Token';
                } else {
                  status.value = '认证失败，终止请求';
                }
              } else {
                status.value = '认证成功，继续执行';
              }
              return result;
            }
          },
          shouldBreak: (result: any) => !result.isAuthenticated && !result.needRefresh,
          jumpTo: (result: any) => result.needRefresh ? 1 : undefined
        },
        {
          name: 'refreshToken',
          request: mockRefreshToken,
          options: { 
            formatName: 'result',
            onSuccess: (response: any) => {
              status.value = 'Token刷新成功，继续执行';
              return response.result;
            }
          }
        },
        {
          name: 'fetchData',
          request: mockGetUserInfo,
          paramsResolver: (prevResult: any) => [prevResult.userId],
          options: { formatName: 'result' }
        }
      ];

      const { stepData, loading, run, data } = useChainedRequests(steps);

      const handleRun = () => {
        status.value = '开始认证检查...';
        run();
      };

      return { stepData, loading, handleRun, data, status };
    },
    template: `
      <div style="text-align: left;">
        <a-card title="条件跳转示例" style="width: 500px;">
          <div style="margin-bottom: 16px;">
            <a-button type="primary" @click="handleRun" :loading="loading">
              开始认证流程
            </a-button>
          </div>
          
          <div v-if="status" style="margin-bottom: 16px;">
            <a-alert :message="status" type="info" />
          </div>
          
          <a-spin :spinning="loading">
            <div v-if="data" style="padding: 12px; background: #f5f5f5; border-radius: 4px;">
              <h4>执行结果：</h4>
              <pre style="margin: 0; white-space: pre-wrap;">{{ JSON.stringify(data, null, 2) }}</pre>
            </div>
            <div v-else style="padding: 20px; text-align: center; color: #999;">
              点击按钮开始认证流程
            </div>
          </a-spin>
          
          <div style="margin-top: 16px; font-size: 12px; color: #666;">
            <p>• 模拟认证检查（30%概率失败）</p>
            <p>• 如需刷新则跳转到刷新步骤</p>
            <p>• 认证成功后获取用户数据</p>
          </div>
        </a-card>
      </div>
    `
  })
};

export const DataCollection: Story = {
  name: '结果收集',
  parameters: {
    docs: {
      source: {
        code: `
import { useChainedRequests } from '@jetlinks-web/hooks';

// 带结果收集的步骤
const steps = [
  {
    name: 'getUserInfo',
    request: mockGetUserInfo,
    options: { formatName: 'result' },
    collector: (currentResult, collected) => ({
      ...collected,
      userInfo: currentResult
    })
  },
  {
    name: 'getUserPosts',
    request: mockGetUserPosts,
    paramsResolver: (prevResult) => [prevResult.id],
    options: { formatName: 'result' },
    collector: (currentResult, collected) => ({
      ...collected,
      posts: currentResult
    })
  }
];

const { stepData, loading, run, data } = useChainedRequests(steps);
        `
      }
    }
  },
  render: () => ({
    setup() {
      const steps = [
        {
          name: 'getUserInfo',
          request: mockGetUserInfo,
          options: { formatName: 'result' },
          collector: (currentResult: any, collected: any) => ({
            ...collected,
            userInfo: currentResult
          })
        },
        {
          name: 'getUserPosts',
          request: mockGetUserPosts,
          paramsResolver: (prevResult: any) => [prevResult.id],
          options: { formatName: 'result' },
          collector: (currentResult: any, collected: any) => ({
            ...collected,
            posts: currentResult
          })
        }
      ];

      const { stepData, loading, run, data } = useChainedRequests(steps);

      const handleRun = () => {
        run(Math.floor(Math.random() * 3) + 1);
      };

      return { stepData, loading, handleRun, data };
    },
    template: `
      <div style="text-align: left;">
        <a-card title="结果收集示例" style="width: 600px;">
          <div style="margin-bottom: 16px;">
            <a-button type="primary" @click="handleRun" :loading="loading">
              执行并收集结果
            </a-button>
          </div>
          
          <a-spin :spinning="loading">
            <div v-if="data" style="margin-bottom: 16px;">
              <h4>收集的结果：</h4>
              <a-row :gutter="16">
                <a-col :span="12" v-if="data.userInfo">
                  <div style="padding: 12px; background: #e6f7ff; border-radius: 4px; margin-bottom: 8px;">
                    <h5 style="margin: 0 0 8px 0;">用户信息</h5>
                    <p style="margin: 4px 0;"><strong>ID:</strong> {{ data.userInfo.id }}</p>
                    <p style="margin: 4px 0;"><strong>姓名:</strong> {{ data.userInfo.name }}</p>
                    <p style="margin: 4px 0;"><strong>邮箱:</strong> {{ data.userInfo.email }}</p>
                  </div>
                </a-col>
                <a-col :span="12" v-if="data.posts">
                  <div style="padding: 12px; background: #f6ffed; border-radius: 4px; margin-bottom: 8px;">
                    <h5 style="margin: 0 0 8px 0;">文章列表 ({{ data.posts.length }}篇)</h5>
                    <div v-for="post in data.posts" :key="post.id" style="margin-bottom: 4px;">
                      <small>{{ post.title }}</small>
                    </div>
                  </div>
                </a-col>
              </a-row>
            </div>
            <div v-else style="padding: 20px; text-align: center; color: #999;">
              点击按钮执行请求并查看收集结果
            </div>
          </a-spin>
          
          <div style="margin-top: 16px; font-size: 12px; color: #666;">
            <p>• 每个步骤都可以收集特定数据</p>
            <p>• 最终结果包含所有收集的数据</p>
            <p>• 支持数据合并和处理</p>
          </div>
        </a-card>
      </div>
    `
  })
};