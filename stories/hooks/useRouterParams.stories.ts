import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { useRouterParams, setParamsValue } from '../../packages/hooks/src/useRouterParams';

/**
 * Hook 函数
 * 
 * 这里展示了项目中路由参数相关 Hook 的使用方法和示例。
 */
const meta: Meta = {
  title: 'Hook函数/useRouterParams 路由参数管理',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
useRouterParams 是一个用于管理路由参数的 Vue 3 Hook，提供了路由参数的设置、获取和清除功能。

### 主要特性
- 支持设置和获取路由参数
- 路由切换时自动清除参数
- 响应式参数状态管理
- 简单易用的 API 接口

### 使用场景
- 页面间参数传递
- 表单数据的临时存储
- 路由状态管理
- 页面刷新后的数据恢复

### 基本用法

\`\`\`javascript
import { useRouterParams, setParamsValue } from '@jetlinks-web/hooks';

// 设置路由参数
setParamsValue('routeName', { id: 1, name: 'test' });

// 在组件中获取参数
const { params, clear } = useRouterParams();

// 手动清除参数
clear();
\`\`\`

### 在 Vue 组件中使用

\`\`\`vue
<template>
  <div>
    <div v-if="Object.keys(params).length">
      接收到的参数: {{ params }}
    </div>
    <div v-else>
      暂无参数
    </div>
    <a-button @click="clear">清除参数</a-button>
  </div>
</template>

<script setup>
import { useRouterParams } from '@jetlinks-web/hooks';

const { params, clear } = useRouterParams();
</script>
\`\`\`

### 参数设置和传递

\`\`\`javascript
// 在页面A中设置参数
import { setParamsValue } from '@jetlinks-web/hooks';

const goToPageB = () => {
  setParamsValue('pageB', {
    userId: 123,
    action: 'edit',
    formData: { name: '张三', age: 25 }
  });
  
  router.push({ name: 'pageB' });
};

// 在页面B中接收参数
import { useRouterParams } from '@jetlinks-web/hooks';

const { params, clear } = useRouterParams();
// params.value 包含从页面A传递过来的数据
\`\`\`
        `
      },
      source: {
        type: 'code'
      }
    }
  },
  argTypes: {
    routeName: {
      control: 'text',
      description: '路由名称',
      defaultValue: 'demo-route'
    },
    paramValue: {
      control: 'object',
      description: '参数值',
      defaultValue: { id: 1, name: 'test' }
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SetParamsValue: Story = {
  name: 'setParamsValue 设置参数',
  parameters: {
    docs: {
      source: {
        code: `
import { setParamsValue } from '@jetlinks-web/hooks';

// 设置路由参数
const setParams = () => {
  setParamsValue('demo-route', {
    id: 1,
    name: 'test',
    data: { message: 'Hello World' }
  });
  
  console.log('参数已设置');
};

// 调用函数设置参数
setParams();
        `
      }
    }
  },
  render: (args) => ({
    setup() {
      const currentParams = ref({});
      
      const setParams = () => {
        const params = {
          id: Math.floor(Math.random() * 100),
          name: 'test-' + Date.now(),
          data: { message: 'Hello World', timestamp: new Date().toISOString() }
        };
        
        setParamsValue((args as any).routeName || 'demo-route', params);
        currentParams.value = params;
      };
      
      const clearParams = () => {
        setParamsValue((args as any).routeName || 'demo-route', {});
        currentParams.value = {};
      };
      
      return { 
        setParams,
        clearParams,
        currentParams,
        routeName: (args as any).routeName || 'demo-route'
      };
    },
    template: `
      <div>
        <a-space direction="vertical" style="width: 100%;">
          <div>
            <strong>目标路由:</strong> {{ routeName }}
          </div>
          
          <div>
            <strong>当前设置的参数:</strong>
            <pre v-if="Object.keys(currentParams).length" style="background: #f5f5f5; padding: 8px; border-radius: 4px; margin-top: 8px;">{{ JSON.stringify(currentParams, null, 2) }}</pre>
            <span v-else style="color: #999;">暂无参数</span>
          </div>
          
          <a-space>
            <a-button type="primary" @click="setParams">
              设置路由参数
            </a-button>
            <a-button @click="clearParams">
              清除参数
            </a-button>
          </a-space>
          
          <a-alert 
            message="提示" 
            description="点击 '设置路由参数' 按钮会为指定路由设置参数值，这些参数可以在对应的路由组件中通过 useRouterParams 获取。"
            type="info" 
            show-icon 
          />
        </a-space>
      </div>
    `
  }),
  args: {
    routeName: 'demo-route',
    paramValue: { id: 1, name: 'test' }
  }
};

export const UseRouterParamsHook: Story = {
  name: 'useRouterParams 获取参数',
  parameters: {
    docs: {
      source: {
        code: `
import { useRouterParams, setParamsValue } from '@jetlinks-web/hooks';

// 在组件中使用
const { params, clear } = useRouterParams();

// params 是响应式的参数对象
console.log('当前参数:', params.value);

// 手动清除参数
const clearParams = () => {
  clear();
};

// 在模板中使用
<template>
  <div>
    <div v-if="Object.keys(params).length">
      接收到的参数: {{ params }}
    </div>
    <div v-else>
      暂无参数
    </div>
    <a-button @click="clear">清除参数</a-button>
  </div>
</template>
        `
      }
    }
  },
  render: (args) => ({
    setup() {
      // 模拟路由参数状态
      const mockParams = ref<Record<string, any>>({
        userId: 123,
        action: 'edit',
        formData: {
          name: '张三',
          age: 25,
          email: 'zhangsan@example.com'
        },
        timestamp: new Date().toISOString()
      });
      
      // 模拟 clear 函数
      const clear = () => {
        mockParams.value = {};
      };
      
      const addMoreParams = () => {
        const newParams = {
          ...mockParams.value,
          newField: 'New Value ' + Date.now(),
          counter: (mockParams.value.counter || 0) + 1
        };
        mockParams.value = newParams;
      };
      
      return { 
        params: mockParams, 
        clear,
        addMoreParams
      };
    },
    template: `
      <div>
        <a-space direction="vertical" style="width: 100%;">
          <div>
            <strong>获取到的参数:</strong>
            <pre v-if="Object.keys(params).length" style="background: #f5f5f5; padding: 8px; border-radius: 4px; margin-top: 8px;">{{ JSON.stringify(params, null, 2) }}</pre>
            <span v-else style="color: #999;">暂无参数</span>
          </div>
          
          <div>
            <strong>参数状态:</strong>
            <a-tag :color="Object.keys(params).length ? 'green' : 'orange'">
              {{ Object.keys(params).length ? '有参数 (' + Object.keys(params).length + ' 个)' : '无参数' }}
            </a-tag>
          </div>
          
          <a-space>
            <a-button type="primary" @click="addMoreParams">
              添加更多参数
            </a-button>
            <a-button @click="clear" :disabled="!Object.keys(params).length">
              清除所有参数
            </a-button>
          </a-space>
          
          <a-alert 
            message="说明" 
            description="useRouterParams hook 会自动获取当前路由的参数，并提供 clear 方法用于清除参数。当路由切换时，参数会自动清除。此示例模拟了 hook 的返回值结构。"
            type="info" 
            show-icon 
          />
        </a-space>
      </div>
    `
  })
};