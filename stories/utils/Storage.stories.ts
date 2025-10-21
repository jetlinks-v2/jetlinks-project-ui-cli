import type { Meta, StoryObj } from '@storybook/vue3';
import { LocalStore, getToken, setToken, removeToken } from '../../packages/utils/src/storage';
import { onlyMessage } from '../../packages/utils/src/util';
import { ref } from 'vue';

/**
 * 工具函数
 * 
 * 这里展示了项目中常用的本地存储工具函数的使用方法和示例。
 */
const meta: Meta = {
  title: '工具函数/Storage 本地存储',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
LocalStore 是一个本地存储工具对象，基于 localStorage 封装了常用的存储操作。

### 主要特性
- 支持字符串和对象的存储
- 自动序列化/反序列化 JSON 数据
- 提供 Token 相关的便捷方法
- 异常处理机制，防止存储失败

### LocalStore 方法
- \`set(key, data)\`: 存储数据
- \`get(key)\`: 获取数据
- \`remove(key)\`: 删除指定数据
- \`removeAll()\`: 清空所有数据

### Token 相关方法
- \`setToken(value)\`: 存储 Token
- \`getToken()\`: 获取 Token
- \`removeToken()\`: 删除 Token

### 基本用法

\`\`\`javascript
import { LocalStore, getToken, setToken, removeToken } from '@jetlinks-web/utils';

// 存储字符串
LocalStore.set('username', 'admin');

// 存储对象
LocalStore.set('user', { id: 1, name: 'admin' });

// 获取数据
const username = LocalStore.get('username');
const user = LocalStore.get('user');

// 删除数据
LocalStore.remove('username');

// 清空所有数据
LocalStore.removeAll();

// Token 操作
setToken('your-token');
const token = getToken();
removeToken();
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

export const SetData: Story = {
  name: '存储数据',
  parameters: {
    docs: {
      source: {
        code: `
import { LocalStore } from '@jetlinks-web/utils';
import { onlyMessage } from '@jetlinks-web/utils';

// 存储数据示例
const key = ref('');
const value = ref('');

const handleSet = () => {
  if (!key.value || !value.value) {
    onlyMessage('请输入键名和值', 'warning');
    return;
  }
  
  try {
    // 尝试解析为 JSON，如果失败则作为字符串存储
    const data = JSON.parse(value.value);
    LocalStore.set(key.value, data);
  } catch {
    LocalStore.set(key.value, value.value);
  }
  
  onlyMessage('数据存储成功！', 'success');
};

// 在模板中使用
<template>
  <div>
    <a-input v-model:value="key" placeholder="请输入键名" />
    <a-input v-model:value="value" placeholder="请输入值" />
    <a-button @click="handleSet">存储数据</a-button>
  </div>
</template>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const key = ref('demo_key');
      const value = ref('Hello World');
      
      const handleSet = () => {
        if (!key.value || !value.value) {
          onlyMessage('请输入键名和值', 'warning');
          return;
        }
        
        try {
          const data = JSON.parse(value.value);
          LocalStore.set(key.value, data);
        } catch {
          LocalStore.set(key.value, value.value);
        }
        
        onlyMessage('数据存储成功！', 'success');
      };
      
      return { key, value, handleSet };
    },
    template: `
      <div style="width: 400px;">
        <a-space direction="vertical" style="width: 100%;">
          <a-input 
            v-model:value="key" 
            placeholder="请输入键名"
            addonBefore="键名"
          />
          <a-input 
            v-model:value="value" 
            placeholder="请输入值"
            addonBefore="值"
          />
          <a-button type="primary" @click="handleSet" block>
            存储数据
          </a-button>
          <p style="color: #666; font-size: 12px; margin: 0;">
            支持存储字符串和JSON对象。输入JSON格式会自动解析为对象存储。
          </p>
        </a-space>
      </div>
    `
  })
};

export const GetData: Story = {
  name: '获取数据',
  parameters: {
    docs: {
      source: {
        code: `
import { LocalStore } from '@jetlinks-web/utils';
import { onlyMessage } from '@jetlinks-web/utils';

// 获取数据示例
const key = ref('');
const result = ref('');

const handleGet = () => {
  if (!key.value) {
    onlyMessage('请输入键名', 'warning');
    return;
  }
  
  const data = LocalStore.get(key.value);
  
  if (data === null) {
    result.value = '数据不存在';
    onlyMessage('数据不存在', 'error');
  } else {
    result.value = typeof data === 'object' 
      ? JSON.stringify(data, null, 2) 
      : data;
    onlyMessage('数据获取成功！', 'success');
  }
};

// 在模板中使用
<template>
  <div>
    <a-input v-model:value="key" placeholder="请输入键名" />
    <a-button @click="handleGet">获取数据</a-button>
    <a-textarea v-model:value="result" readonly />
  </div>
</template>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const key = ref('demo_key');
      const result = ref('');
      
      const handleGet = () => {
        if (!key.value) {
          onlyMessage('请输入键名', 'warning');
          return;
        }
        
        const data = LocalStore.get(key.value);
        
        if (data === null) {
          result.value = '数据不存在';
          onlyMessage('数据不存在', 'error');
        } else {
          result.value = typeof data === 'object' 
            ? JSON.stringify(data, null, 2) 
            : data;
          onlyMessage('数据获取成功！', 'success');
        }
      };
      
      return { key, result, handleGet };
    },
    template: `
      <div style="width: 400px;">
        <a-space direction="vertical" style="width: 100%;">
          <a-input 
            v-model:value="key" 
            placeholder="请输入键名"
            addonBefore="键名"
          />
          <a-button type="primary" @click="handleGet" block>
            获取数据
          </a-button>
          <a-textarea 
            v-model:value="result" 
            placeholder="获取的数据将显示在这里"
            :rows="4"
            readonly
          />
          <p style="color: #666; font-size: 12px; margin: 0;">
            先使用"存储数据"示例存储一些数据，然后在这里获取。
          </p>
        </a-space>
      </div>
    `
  })
};

export const RemoveData: Story = {
  name: '删除数据',
  parameters: {
    docs: {
      source: {
        code: `
import { LocalStore } from '@jetlinks-web/utils';
import { onlyMessage } from '@jetlinks-web/utils';

// 删除数据示例
const key = ref('');

const handleRemove = () => {
  if (!key.value) {
    onlyMessage('请输入键名', 'warning');
    return;
  }
  
  // 检查数据是否存在
  const data = LocalStore.get(key.value);
  if (data === null) {
    onlyMessage('数据不存在', 'error');
    return;
  }
  
  LocalStore.remove(key.value);
  onlyMessage('数据删除成功！', 'success');
};

// 在模板中使用
<template>
  <div>
    <a-input v-model:value="key" placeholder="请输入要删除的键名" />
    <a-button danger @click="handleRemove">删除数据</a-button>
  </div>
</template>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const key = ref('demo_key');
      
      const handleRemove = () => {
        if (!key.value) {
          onlyMessage('请输入键名', 'warning');
          return;
        }
        
        const data = LocalStore.get(key.value);
        if (data === null) {
          onlyMessage('数据不存在', 'error');
          return;
        }
        
        LocalStore.remove(key.value);
        onlyMessage('数据删除成功！', 'success');
      };
      
      return { key, handleRemove };
    },
    template: `
      <div style="width: 400px;">
        <a-space direction="vertical" style="width: 100%;">
          <a-input 
            v-model:value="key" 
            placeholder="请输入要删除的键名"
            addonBefore="键名"
          />
          <a-button danger @click="handleRemove" block>
            删除数据
          </a-button>
          <p style="color: #666; font-size: 12px; margin: 0;">
            删除指定键名的存储数据。如果数据不存在会提示错误。
          </p>
        </a-space>
      </div>
    `
  })
};

export const RemoveAllData: Story = {
  name: '清空所有数据',
  parameters: {
    docs: {
      source: {
        code: `
import { LocalStore } from '@jetlinks-web/utils';
import { onlyMessage } from '@jetlinks-web/utils';

// 清空所有数据示例
const handleRemoveAll = () => {
  LocalStore.removeAll();
  onlyMessage('所有数据已清空！', 'success');
};

// 在模板中使用
<template>
  <div>
    <a-button danger @click="handleRemoveAll">
      清空所有数据
    </a-button>
  </div>
</template>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const handleRemoveAll = () => {
        LocalStore.removeAll();
        onlyMessage('所有数据已清空！', 'success');
      };
      
      return { handleRemoveAll };
    },
    template: `
      <div style="width: 400px;">
        <a-space direction="vertical" style="width: 100%;" align="center">
          <a-button danger @click="handleRemoveAll" size="large">
            ⚠️ 清空所有数据
          </a-button>
          <p style="color: #ff4d4f; font-size: 12px; margin: 0; text-align: center;">
            警告：此操作将清空localStorage中的所有数据，请谨慎操作！
          </p>
        </a-space>
      </div>
    `
  })
};

export const SetTokenExample: Story = {
  name: '设置Token',
  parameters: {
    docs: {
      source: {
        code: `
import { setToken } from '@jetlinks-web/utils';
import { onlyMessage } from '@jetlinks-web/utils';

// 设置Token示例
const token = ref('');

const handleSetToken = () => {
  if (!token.value) {
    onlyMessage('请输入Token', 'warning');
    return;
  }
  
  setToken(token.value);
  onlyMessage('Token设置成功！', 'success');
};

// 在模板中使用
<template>
  <div>
    <a-input v-model:value="token" placeholder="请输入Token" />
    <a-button @click="handleSetToken">设置Token</a-button>
  </div>
</template>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const token = ref('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
      
      const handleSetToken = () => {
        if (!token.value) {
          onlyMessage('请输入Token', 'warning');
          return;
        }
        
        setToken(token.value);
        onlyMessage('Token设置成功！', 'success');
      };
      
      return { token, handleSetToken };
    },
    template: `
      <div style="width: 400px;">
        <a-space direction="vertical" style="width: 100%;">
          <a-input 
            v-model:value="token" 
            placeholder="请输入Token"
            addonBefore="Token"
          />
          <a-button type="primary" @click="handleSetToken" block>
            设置Token
          </a-button>
          <p style="color: #666; font-size: 12px; margin: 0;">
            设置用户认证Token。Token将存储在localStorage中。
          </p>
        </a-space>
      </div>
    `
  })
};

export const GetTokenExample: Story = {
  name: '获取Token',
  parameters: {
    docs: {
      source: {
        code: `
import { getToken } from '@jetlinks-web/utils';
import { onlyMessage } from '@jetlinks-web/utils';

// 获取Token示例
const tokenResult = ref('');

const handleGetToken = () => {
  const token = getToken();
  
  if (token) {
    tokenResult.value = token;
    onlyMessage('Token获取成功！', 'success');
  } else {
    tokenResult.value = 'Token不存在';
    onlyMessage('Token不存在', 'error');
  }
};

// 在模板中使用
<template>
  <div>
    <a-button @click="handleGetToken">获取Token</a-button>
    <a-input v-model:value="tokenResult" readonly />
  </div>
</template>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const tokenResult = ref('');
      
      const handleGetToken = () => {
        const token = getToken();
        
        if (token) {
          tokenResult.value = token;
          onlyMessage('Token获取成功！', 'success');
        } else {
          tokenResult.value = 'Token不存在';
          onlyMessage('Token不存在', 'error');
        }
      };
      
      return { tokenResult, handleGetToken };
    },
    template: `
      <div style="width: 400px;">
        <a-space direction="vertical" style="width: 100%;">
          <a-button type="primary" @click="handleGetToken" block>
            获取Token
          </a-button>
          <a-input 
            v-model:value="tokenResult" 
            placeholder="获取的Token将显示在这里"
            readonly
          />
          <p style="color: #666; font-size: 12px; margin: 0;">
            先使用"设置Token"示例设置Token，然后在这里获取。
          </p>
        </a-space>
      </div>
    `
  })
};

export const RemoveTokenExample: Story = {
  name: '删除Token',
  parameters: {
    docs: {
      source: {
        code: `
import { removeToken, getToken } from '@jetlinks-web/utils';
import { onlyMessage } from '@jetlinks-web/utils';

// 删除Token示例
const handleRemoveToken = () => {
  const token = getToken();
  
  if (!token) {
    onlyMessage('Token不存在', 'error');
    return;
  }
  
  removeToken();
  onlyMessage('Token删除成功！', 'success');
};

// 在模板中使用
<template>
  <div>
    <a-button danger @click="handleRemoveToken">
      删除Token
    </a-button>
  </div>
</template>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const handleRemoveToken = () => {
        const token = getToken();
        
        if (!token) {
          onlyMessage('Token不存在', 'error');
          return;
        }
        
        removeToken();
        onlyMessage('Token删除成功！', 'success');
      };
      
      return { handleRemoveToken };
    },
    template: `
      <div style="width: 400px;">
        <a-space direction="vertical" style="width: 100%;" align="center">
          <a-button danger @click="handleRemoveToken" size="large">
            删除Token
          </a-button>
          <p style="color: #666; font-size: 12px; margin: 0; text-align: center;">
            删除存储的用户认证Token。通常用于用户退出登录时。
          </p>
        </a-space>
      </div>
    `
  })
};