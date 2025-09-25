import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { usePermission, usePermissionContext } from '../../packages/hooks/src/usePermission';

/**
 * Hook 函数
 * 
 * 这里展示了项目中权限相关 Hook 的使用方法和示例。
 */
const meta: Meta = {
  title: 'Hook函数/usePermission 权限检查',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
usePermission 是一个用于权限检查的 Vue 3 Hook，提供了灵活的权限验证功能。

### 主要特性
- 支持字符串、字符串数组、布尔值多种权限代码类型
- 响应式权限状态，权限变化时自动更新
- 支持权限上下文注入和提供
- 与现有权限系统无缝集成

### 使用场景
- 按钮、菜单的权限控制
- 页面访问权限验证
- 功能模块的动态显示/隐藏
- 角色基于的权限管理

### 基本用法

\`\`\`javascript
import { usePermission, usePermissionContext } from '@jetlinks-web/hooks';

// 检查单个权限
const { hasPerm } = usePermission('user:create');

// 检查多个权限
const { hasPerm } = usePermission(['user:create', 'user:update']);

// 响应式权限检查
const permissionCode = ref('user:delete');
const { hasPerm } = usePermission(permissionCode);

// 直接设置权限状态
const { hasPerm } = usePermission(true);
\`\`\`

### 在 Vue 组件中使用

\`\`\`vue
<template>
  <div>
    <a-button v-if="hasPerm" type="primary">
      有权限的按钮
    </a-button>
    <a-button v-else disabled>
      无权限的按钮
    </a-button>
  </div>
</template>

<script setup>
import { usePermission } from '@jetlinks-web/hooks';

const { hasPerm } = usePermission('user:create');
</script>
\`\`\`

### 权限上下文

\`\`\`javascript
// 在应用根组件中提供权限上下文
import { usePermissionContext } from '@jetlinks-web/hooks';

const permissionContext = {
  hasPermission: (code) => {
    // 实现权限检查逻辑
    return userPermissions.includes(code);
  }
};

usePermissionContext(permissionContext);
\`\`\`
        `
      },
      source: {
        type: 'code'
      }
    }
  },
  argTypes: {
    permissionCode: {
      control: 'text',
      description: '权限代码',
      defaultValue: 'user:create'
    },
    hasPermissionResult: {
      control: 'boolean',
      description: '权限检查结果',
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
import { usePermission } from '@jetlinks-web/hooks';

// 检查单个权限
const { hasPerm } = usePermission('user:create');

// 在模板中使用
<template>
  <div>
    <a-button v-if="hasPerm" type="primary">
      有权限的按钮
    </a-button>
    <a-button v-else disabled>
      无权限的按钮
    </a-button>
  </div>
</template>
        `
      }
    }
  },
  render: (args) => ({
    setup() {
      // 模拟权限上下文
      const mockPermissionContext = {
        hasPermission: (code: string) => {
          return args.hasPermissionResult || false;
        }
      };
      
      usePermissionContext(mockPermissionContext);
      
      const { hasPerm } = usePermission(args.permissionCode || 'user:create');
      
      return { hasPerm };
    },
    template: `
      <div>
        <a-space direction="vertical" style="width: 100%;">
          <div>
            <strong>权限代码:</strong> {{ '${args.permissionCode || 'user:create'}' }}
          </div>
          <div>
            <strong>权限状态:</strong> 
            <a-tag :color="hasPerm ? 'green' : 'red'">
              {{ hasPerm ? '有权限' : '无权限' }}
            </a-tag>
          </div>
          <div>
            <a-button v-if="hasPerm" type="primary">
              有权限的按钮
            </a-button>
            <a-button v-else disabled>
              无权限的按钮
            </a-button>
          </div>
        </a-space>
      </div>
    `
  }),
  args: {
    permissionCode: 'user:create',
    hasPermissionResult: true
  }
};

export const ReactivePermission: Story = {
  name: '响应式权限检查',
  parameters: {
    docs: {
      source: {
        code: `
import { ref } from 'vue';
import { usePermission } from '@jetlinks-web/hooks';

// 响应式权限代码
const permissionCode = ref('user:create');
const { hasPerm } = usePermission(permissionCode);

// 动态改变权限代码
const changePermission = (newCode) => {
  permissionCode.value = newCode;
};

// 在模板中使用
<template>
  <div>
    <a-select v-model:value="permissionCode" style="width: 200px">
      <a-select-option value="user:create">用户创建</a-select-option>
      <a-select-option value="user:update">用户更新</a-select-option>
      <a-select-option value="user:delete">用户删除</a-select-option>
    </a-select>
    
    <a-button v-if="hasPerm" type="primary">
      执行操作
    </a-button>
  </div>
</template>
        `
      }
    }
  },
  render: () => ({
    setup() {
      // 模拟权限数据
      const userPermissions = ['user:create', 'user:update'];
      
      // 模拟权限上下文
      const mockPermissionContext = {
        hasPermission: (code: string) => {
          return userPermissions.includes(code);
        }
      };
      
      usePermissionContext(mockPermissionContext);
      
      const permissionCode = ref('user:create');
      const { hasPerm } = usePermission(permissionCode);
      
      return { 
        permissionCode, 
        hasPerm,
        userPermissions
      };
    },
    template: `
      <div>
        <a-space direction="vertical" style="width: 100%;">
          <div>
            <strong>当前用户权限:</strong> 
            <a-tag v-for="perm in userPermissions" :key="perm" color="blue">
              {{ perm }}
            </a-tag>
          </div>
          
          <div>
            <strong>选择权限代码:</strong>
            <a-select v-model:value="permissionCode" style="width: 200px; margin-left: 8px;">
              <a-select-option value="user:create">user:create</a-select-option>
              <a-select-option value="user:update">user:update</a-select-option>
              <a-select-option value="user:delete">user:delete</a-select-option>
            </a-select>
          </div>
          
          <div>
            <strong>权限检查结果:</strong> 
            <a-tag :color="hasPerm ? 'green' : 'red'">
              {{ hasPerm ? '有权限' : '无权限' }}
            </a-tag>
          </div>
          
          <div>
            <a-button v-if="hasPerm" type="primary">
              执行操作
            </a-button>
            <a-button v-else disabled>
              无权限执行
            </a-button>
          </div>
        </a-space>
      </div>
    `
  })
};