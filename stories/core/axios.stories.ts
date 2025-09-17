import type { Meta, StoryObj } from '@storybook/vue3';
import { post, get, put, patch, remove, getStream, postStream, Request } from '../../packages/core/src/axios';

/**
 * 核心模块
 *
 * 这里展示了 axios 相关方法的使用方法和示例。
 */
const meta: Meta = {
  title: '核心功能/Axios 网络请求',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Axios 网络请求封装库，提供了统一的 HTTP 请求方法和 Request 类。

### 主要特性
- 统一的错误处理
- 请求拦截和响应拦截
- 支持多种 HTTP 方法
- 类型安全的请求响应
- 流式响应支持

### 基本方法
- post: POST 请求
- get: GET 请求
- put: PUT 请求
- patch: PATCH 请求
- remove: DELETE 请求
- getStream: GET 流式请求
- postStream: POST 流式请求

### Request 类方法
- page: 分页查询
- noPage: 不分页查询
- detail: 详情查询
- save: 保存
- update: 更新
- delete: 删除
- batch: 批量操作

### 使用场景
- API 数据获取
- 表单提交
- 文件上传下载
- 分页数据查询
- CRUD 操作

### 基本用法

\`\`\`javascript
import { post, get, put, patch, remove, Request } from '@jetlinks-web/core';

// 基本请求
const response = await get('/api/users');

// POST 请求
const result = await post('/api/users', { name: '用户名' });

// Request 类使用
const userAPI = new Request('/api/users');
const users = await userAPI.page({ pageSize: 10, pageIndex: 0 });
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

export const PostRequest: Story = {
  name: 'POST 请求',
  parameters: {
    docs: {
      source: {
        code: `
import { post } from '@jetlinks-web/core';

// POST 请求示例
const handlePost = async () => {
  try {
    const response = await post('/api/users', { 
      name: '新用户',
      email: 'user@example.com' 
    });
    console.log('POST 请求成功:', response);
  } catch (error) {
    console.error('POST 请求失败:', error);
  }
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const handlePost = async () => {
        try {
          console.log('模拟 POST 请求执行');
          console.log('发送数据:', { name: '新用户', email: 'user@example.com' });
          // 实际项目中这里会执行真实的 POST 请求
          // const response = await post('/api/users', { name: '新用户', email: 'user@example.com' });
        } catch (error) {
          console.error('POST 请求失败:', error);
        }
      };

      return { handlePost };
    },
    template: `
      <div>
        <a-button type="primary" @click="handlePost">
          执行 POST 请求
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          发送 POST 请求到 /api/users 接口
        </p>
      </div>
    `
  })
};

export const GetRequest: Story = {
  name: 'GET 请求',
  parameters: {
    docs: {
      source: {
        code: `
import { get } from '@jetlinks-web/core';

// GET 请求示例
const handleGet = async () => {
  try {
    const response = await get('/api/search', { q: 'user123' });
    console.log('GET 请求成功:', response);
  } catch (error) {
    console.error('GET 请求失败:', error);
  }
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const handleGet = async () => {
        try {
          console.log('模拟 GET 请求执行');
          console.log('查询参数:', { q: 'user123' });
          // 实际项目中这里会执行真实的 GET 请求
          // const response = await get('/api/search', { q: 'user123' });
        } catch (error) {
          console.error('GET 请求失败:', error);
        }
      };

      return { handleGet };
    },
    template: `
      <div>
        <a-button type="primary" @click="handleGet">
          执行 GET 请求
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          发送 GET 请求到 /api/search 接口
        </p>
      </div>
    `
  })
};

export const PutRequest: Story = {
  name: 'PUT 请求',
  parameters: {
    docs: {
      source: {
        code: `
import { put } from '@jetlinks-web/core';

// PUT 请求示例
const handlePut = async () => {
  try {
    const userId = '550e8400-e29b-41d4-a716-446655440000';
    const response = await put(\`/api/users/\${userId}\`, { 
      name: '更新用户名' 
    });
    console.log('PUT 请求成功:', response);
  } catch (error) {
    console.error('PUT 请求失败:', error);
  }
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const handlePut = async () => {
        try {
          const userId = '550e8400-e29b-41d4-a716-446655440000';
          console.log('模拟 PUT 请求执行');
          console.log('更新用户 ID:', userId);
          console.log('更新数据:', { name: '更新用户名' });
          // 实际项目中这里会执行真实的 PUT 请求
          // const response = await put(`/api/users/${userId}`, { name: '更新用户名' });
        } catch (error) {
          console.error('PUT 请求失败:', error);
        }
      };

      return { handlePut };
    },
    template: `
      <div>
        <a-button type="primary" @click="handlePut">
          执行 PUT 请求
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          发送 PUT 请求更新用户信息
        </p>
      </div>
    `
  })
};

export const PatchRequest: Story = {
  name: 'PATCH 请求',
  parameters: {
    docs: {
      source: {
        code: `
import { patch } from '@jetlinks-web/core';

// PATCH 请求示例
const handlePatch = async () => {
  try {
    const response = await patch('/api/profile', { 
      email: 'user@example.com' 
    });
    console.log('PATCH 请求成功:', response);
  } catch (error) {
    console.error('PATCH 请求失败:', error);
  }
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const handlePatch = async () => {
        try {
          console.log('模拟 PATCH 请求执行');
          console.log('更新数据:', { email: 'user@example.com' });
          // 实际项目中这里会执行真实的 PATCH 请求
          // const response = await patch('/api/profile', { email: 'user@example.com' });
        } catch (error) {
          console.error('PATCH 请求失败:', error);
        }
      };

      return { handlePatch };
    },
    template: `
      <div>
        <a-button type="primary" @click="handlePatch">
          执行 PATCH 请求
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          发送 PATCH 请求更新用户资料
        </p>
      </div>
    `
  })
};

export const DeleteRequest: Story = {
  name: 'DELETE 请求',
  parameters: {
    docs: {
      source: {
        code: `
import { remove } from '@jetlinks-web/core';

// DELETE 请求示例
const handleDelete = async () => {
  try {
    const itemId = '123';
    const response = await remove(\`/api/items/\${itemId}\`);
    console.log('DELETE 请求成功:', response);
  } catch (error) {
    console.error('DELETE 请求失败:', error);
  }
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const handleDelete = async () => {
        try {
          const itemId = '123';
          console.log('模拟 DELETE 请求执行');
          console.log('删除项目 ID:', itemId);
          // 实际项目中这里会执行真实的 DELETE 请求
          // const response = await remove(`/api/items/${itemId}`);
        } catch (error) {
          console.error('DELETE 请求失败:', error);
        }
      };

      return { handleDelete };
    },
    template: `
      <div>
        <a-button danger @click="handleDelete">
          执行 DELETE 请求
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          发送 DELETE 请求删除项目
        </p>
      </div>
    `
  })
};

export const StreamRequest: Story = {
  name: '流式请求',
  parameters: {
    docs: {
      source: {
        code: `
import { getStream } from '@jetlinks-web/core';

// 流式请求示例
const handleStream = async () => {
  try {
    const response = await getStream('/api/download', { file: 'report_2024.pdf' });
    console.log('流式请求成功:', response);
  } catch (error) {
    console.error('流式请求失败:', error);
  }
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const handleStream = async () => {
        try {
          const fileName = 'report_2024.pdf';
          console.log('模拟流式请求执行');
          console.log('下载文件:', fileName);
          // 实际项目中这里会执行真实的流式请求
          // const response = await getStream('/api/download', { file: fileName });
        } catch (error) {
          console.error('流式请求失败:', error);
        }
      };

      return { handleStream };
    },
    template: `
      <div>
        <a-button type="primary" @click="handleStream">
          执行流式请求
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          发送流式请求下载文件
        </p>
      </div>
    `
  })
};

export const RequestClass: Story = {
  name: 'Request 类',
  parameters: {
    docs: {
      source: {
        code: `
import { Request } from '@jetlinks-web/core';

// Request 类使用示例
const handleRequestClass = async () => {
  try {
    const apiPath = '/user-management';
    const userAPI = new Request(apiPath);
    
    // 分页查询
    const pageData = await userAPI.page({
      pageSize: 10,
      pageIndex: 0,
      sorts: [{ name: 'createTime', order: 'desc' }]
    });
    
    console.log('Request 类请求成功:', pageData);
  } catch (error) {
    console.error('Request 类请求失败:', error);
  }
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const handleRequestClass = async () => {
        try {
          const apiPath = '/user-management';
          console.log('模拟 Request 类实例化和分页查询');
          console.log('API 路径:', apiPath);
          console.log('分页参数:', { pageSize: 10, pageIndex: 0 });
          // 实际项目中这里会执行真实的 Request 类操作
          // const userAPI = new Request(apiPath);
          // const pageData = await userAPI.page({ pageSize: 10, pageIndex: 0 });
        } catch (error) {
          console.error('Request 类请求失败:', error);
        }
      };

      return { handleRequestClass };
    },
    template: `
      <div>
        <a-button type="primary" @click="handleRequestClass">
          使用 Request 类
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          使用 Request 类进行分页查询
        </p>
      </div>
    `
  })
};
