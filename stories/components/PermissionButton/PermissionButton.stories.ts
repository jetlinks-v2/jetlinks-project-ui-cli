import type { Meta, StoryObj } from '@storybook/vue3';
import { PermissionButton as JPermissionButton } from '../../../packages/components/src';

/**
 * PermissionButton 权限按钮组件
 *
 * 这是一个带权限控制的按钮组件，可以根据用户权限显示或禁用按钮。
 * 支持工具提示、确认弹窗等功能，适用于需要权限控制的操作场景。
 *
 * ## 何时使用
 * - 需要根据用户权限控制按钮状态时
 * - 需要在操作前进行确认提示时
 * - 需要为无权限用户显示友好提示时
 * - 需要统一的权限控制逻辑时
 */
const meta: Meta<typeof JPermissionButton> = {
  title: '组件库/PermissionButton 权限按钮',
  component: JPermissionButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
PermissionButton 是一个带权限控制的按钮组件，提供完整的权限管理功能。

### 主要特性
- 支持权限控制，可根据权限显示或禁用按钮
- 支持工具提示，可显示操作说明或无权限提示
- 支持确认弹窗，危险操作前进行二次确认
- 支持自定义无权限提示文案
- 继承 Ant Design Vue Button 的所有属性

### 基本用法
\`\`\`vue
<template>
  <JPermissionButton 
    :hasPermission="hasEditPermission"
    @click="handleEdit"
  >
    编辑
  </JPermissionButton>
</template>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    hasPermission: {
      control: 'select',
      options: [true, false, 'user:edit', ['user:edit', 'user:update']],
      description: '权限控制，支持布尔值、字符串或字符串数组'
    },
    tooltip: {
      control: 'object',
      description: '工具提示配置'
    },
    popConfirm: {
      control: 'object',
      description: '确认弹窗配置'
    },
    noPermissionTitle: {
      control: 'text',
      description: '无权限时的提示文案'
    },
    type: {
      control: 'select',
      options: ['primary', 'default', 'dashed', 'link', 'text'],
      description: '按钮类型'
    },
    size: {
      control: 'select',
      options: ['large', 'middle', 'small'],
      description: '按钮尺寸'
    },
    danger: {
      control: 'boolean',
      description: '是否为危险按钮'
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用'
    }
  },
  args: {
    hasPermission: true,
    type: 'primary'
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基础用法
 * 最基本的权限按钮使用方式
 */
export const 基础用法: Story = {
  render: (args) => ({
    components: { JPermissionButton },
    setup() {
      const handleClick = () => {
        console.log('按钮被点击')
      }
      return {
        ...args,
        handleClick
      }
    },
    template: `
      <JPermissionButton 
        :hasPermission="hasPermission"
        :type="type"
        @click="handleClick"
      >
        有权限按钮
      </JPermissionButton>
    `
  }),
  args: {
    hasPermission: true,
    type: 'primary'
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JPermissionButton 
    :hasPermission="true"
    @click="handleClick"
  >
    有权限按钮
  </JPermissionButton>
</template>

<script setup lang="ts">
const handleClick = () => {
  console.log('按钮被点击')
}
</script>`
      }
    }
  }
};

/**
 * 权限控制
 * 展示有权限和无权限的不同状态
 */
export const 权限控制: Story = {
  render: () => ({
    components: { JPermissionButton },
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <JPermissionButton 
          :hasPermission="true"
          type="primary"
          @click="handleClick"
        >
          有权限按钮
        </JPermissionButton>
        
        <JPermissionButton 
          :hasPermission="false"
          type="primary"
          @click="handleClick"
        >
          无权限按钮
        </JPermissionButton>
        
        <JPermissionButton 
          :hasPermission="'user:edit'"
          type="primary"
          @click="handleClick"
        >
          字符串权限
        </JPermissionButton>
        
        <JPermissionButton 
          :hasPermission="['user:edit', 'user:update']"
          type="primary"
          @click="handleClick"
        >
          数组权限
        </JPermissionButton>
      </div>
    `,
    methods: {
      handleClick() {
        console.log('按钮被点击')
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="permission-demo">
    <JPermissionButton 
      :hasPermission="true"
      type="primary"
      @click="handleClick"
    >
      有权限按钮
    </JPermissionButton>
    
    <JPermissionButton 
      :hasPermission="false"
      type="primary"
      @click="handleClick"
    >
      无权限按钮
    </JPermissionButton>
    
    <JPermissionButton 
      :hasPermission="'user:edit'"
      type="primary"
      @click="handleClick"
    >
      字符串权限
    </JPermissionButton>
    
    <JPermissionButton 
      :hasPermission="['user:edit', 'user:update']"
      type="primary"
      @click="handleClick"
    >
      数组权限
    </JPermissionButton>
  </div>
</template>

<script setup lang="ts">
const handleClick = () => {
  console.log('按钮被点击')
}
</script>

<style scoped>
.permission-demo {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
</style>`
      }
    }
  }
};

/**
 * 工具提示
 * 为按钮添加工具提示说明
 */
export const 工具提示: Story = {
  render: () => ({
    components: { JPermissionButton },
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <JPermissionButton 
          :hasPermission="true"
          :tooltip="{ title: '点击编辑用户信息' }"
          type="primary"
        >
          编辑用户
        </JPermissionButton>
        
        <JPermissionButton 
          :hasPermission="false"
          :tooltip="{ title: '此操作需要管理员权限' }"
          type="danger"
        >
          删除数据
        </JPermissionButton>
        
        <JPermissionButton 
          :hasPermission="true"
          :tooltip="{ title: '保存当前修改', placement: 'bottom' }"
          type="primary"
        >
          保存
        </JPermissionButton>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="tooltip-demo">
    <JPermissionButton 
      :hasPermission="true"
      :tooltip="{ title: '点击编辑用户信息' }"
      type="primary"
    >
      编辑用户
    </JPermissionButton>
    
    <JPermissionButton 
      :hasPermission="false"
      :tooltip="{ title: '此操作需要管理员权限' }"
      type="danger"
    >
      删除数据
    </JPermissionButton>
    
    <JPermissionButton 
      :hasPermission="true"
      :tooltip="{ title: '保存当前修改', placement: 'bottom' }"
      type="primary"
    >
      保存
    </JPermissionButton>
  </div>
</template>

<style scoped>
.tooltip-demo {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
</style>`
      }
    }
  }
};

/**
 * 确认弹窗
 * 危险操作前显示确认弹窗
 */
export const 确认弹窗: Story = {
  render: () => ({
    components: { JPermissionButton },
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <JPermissionButton 
          :hasPermission="true"
          :popConfirm="{
            title: '确定要删除这个用户吗？',
            content: '删除后将无法恢复，请谨慎操作。',
            onConfirm: handleDelete
          }"
          type="primary"
          danger
        >
          删除用户
        </JPermissionButton>
        
        <JPermissionButton 
          :hasPermission="true"
          :popConfirm="{
            title: '确定要重置密码吗？',
            content: '重置后用户需要重新设置密码。',
            onConfirm: handleReset
          }"
          type="default"
        >
          重置密码
        </JPermissionButton>
        
        <JPermissionButton 
          :hasPermission="true"
          :popConfirm="{
            title: '确定要清空数据吗？',
            content: '此操作将清空所有数据，请确认后操作。',
            onConfirm: handleClear
          }"
          type="primary"
          danger
        >
          清空数据
        </JPermissionButton>
      </div>
    `,
    methods: {
      handleDelete() {
        console.log('删除用户')
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log('删除成功')
            resolve(true)
          }, 1000)
        })
      },
      handleReset() {
        console.log('重置密码')
      },
      handleClear() {
        console.log('清空数据')
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="confirm-demo">
    <JPermissionButton 
      :hasPermission="true"
      :popConfirm="{
        title: '确定要删除这个用户吗？',
        content: '删除后将无法恢复，请谨慎操作。',
        onConfirm: handleDelete
      }"
      type="primary"
      danger
    >
      删除用户
    </JPermissionButton>
    
    <JPermissionButton 
      :hasPermission="true"
      :popConfirm="{
        title: '确定要重置密码吗？',
        content: '重置后用户需要重新设置密码。',
        onConfirm: handleReset
      }"
      type="default"
    >
      重置密码
    </JPermissionButton>
    
    <JPermissionButton 
      :hasPermission="true"
      :popConfirm="{
        title: '确定要清空数据吗？',
        content: '此操作将清空所有数据，请确认后操作。',
        onConfirm: handleClear
      }"
      type="primary"
      danger
    >
      清空数据
    </JPermissionButton>
  </div>
</template>

<script setup lang="ts">
const handleDelete = () => {
  console.log('删除用户')
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('删除成功')
      resolve(true)
    }, 1000)
  })
}

const handleReset = () => {
  console.log('重置密码')
}

const handleClear = () => {
  console.log('清空数据')
}
</script>

<style scoped>
.confirm-demo {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
</style>`
      }
    }
  }
};

/**
 * 自定义无权限提示
 * 自定义无权限时的提示文案
 */
export const 自定义无权限提示: Story = {
  render: () => ({
    components: { JPermissionButton },
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <JPermissionButton 
          :hasPermission="false"
          noPermissionTitle="您没有编辑权限，请联系管理员"
          type="primary"
        >
          编辑
        </JPermissionButton>
        
        <JPermissionButton 
          :hasPermission="false"
          noPermissionTitle="删除操作需要高级权限"
          type="danger"
        >
          删除
        </JPermissionButton>
        
        <JPermissionButton 
          :hasPermission="false"
          noPermissionTitle="此功能仅对VIP用户开放"
          type="primary"
        >
          高级功能
        </JPermissionButton>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="custom-tip-demo">
    <JPermissionButton 
      :hasPermission="false"
      noPermissionTitle="您没有编辑权限，请联系管理员"
      type="primary"
    >
      编辑
    </JPermissionButton>
    
    <JPermissionButton 
      :hasPermission="false"
      noPermissionTitle="删除操作需要高级权限"
      type="danger"
    >
      删除
    </JPermissionButton>
    
    <JPermissionButton 
      :hasPermission="false"
      noPermissionTitle="此功能仅对VIP用户开放"
      type="primary"
    >
      高级功能
    </JPermissionButton>
  </div>
</template>

<style scoped>
.custom-tip-demo {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
</style>`
      }
    }
  }
};

/**
 * 不同按钮类型
 * 展示不同类型和尺寸的权限按钮
 */
export const 不同按钮类型: Story = {
  render: () => ({
    components: { JPermissionButton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <!-- 按钮类型 -->
        <div>
          <h4 style="margin: 0 0 12px 0;">按钮类型</h4>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <JPermissionButton :hasPermission="true" type="primary">Primary</JPermissionButton>
            <JPermissionButton :hasPermission="true" type="default">Default</JPermissionButton>
            <JPermissionButton :hasPermission="true" type="dashed">Dashed</JPermissionButton>
            <JPermissionButton :hasPermission="true" type="text">Text</JPermissionButton>
            <JPermissionButton :hasPermission="true" type="link">Link</JPermissionButton>
          </div>
        </div>
        
        <!-- 按钮尺寸 -->
        <div>
          <h4 style="margin: 0 0 12px 0;">按钮尺寸</h4>
          <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
            <JPermissionButton :hasPermission="true" type="primary" size="large">Large</JPermissionButton>
            <JPermissionButton :hasPermission="true" type="primary" size="middle">Middle</JPermissionButton>
            <JPermissionButton :hasPermission="true" type="primary" size="small">Small</JPermissionButton>
          </div>
        </div>
        
        <!-- 危险按钮 -->
        <div>
          <h4 style="margin: 0 0 12px 0;">危险按钮</h4>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <JPermissionButton :hasPermission="true" type="primary" danger>Danger Primary</JPermissionButton>
            <JPermissionButton :hasPermission="true" type="default" danger>Danger Default</JPermissionButton>
            <JPermissionButton :hasPermission="true" type="text" danger>Danger Text</JPermissionButton>
          </div>
        </div>
        
        <!-- 禁用状态 -->
        <div>
          <h4 style="margin: 0 0 12px 0;">禁用状态</h4>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <JPermissionButton :hasPermission="true" type="primary" disabled>Disabled Primary</JPermissionButton>
            <JPermissionButton :hasPermission="true" type="default" disabled>Disabled Default</JPermissionButton>
            <JPermissionButton :hasPermission="false" type="primary">No Permission</JPermissionButton>
          </div>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="button-types-demo">
    <!-- 按钮类型 -->
    <div class="demo-section">
      <h4>按钮类型</h4>
      <div class="button-group">
        <JPermissionButton :hasPermission="true" type="primary">Primary</JPermissionButton>
        <JPermissionButton :hasPermission="true" type="default">Default</JPermissionButton>
        <JPermissionButton :hasPermission="true" type="dashed">Dashed</JPermissionButton>
        <JPermissionButton :hasPermission="true" type="text">Text</JPermissionButton>
        <JPermissionButton :hasPermission="true" type="link">Link</JPermissionButton>
      </div>
    </div>
    
    <!-- 按钮尺寸 -->
    <div class="demo-section">
      <h4>按钮尺寸</h4>
      <div class="button-group">
        <JPermissionButton :hasPermission="true" type="primary" size="large">Large</JPermissionButton>
        <JPermissionButton :hasPermission="true" type="primary" size="middle">Middle</JPermissionButton>
        <JPermissionButton :hasPermission="true" type="primary" size="small">Small</JPermissionButton>
      </div>
    </div>
    
    <!-- 危险按钮 -->
    <div class="demo-section">
      <h4>危险按钮</h4>
      <div class="button-group">
        <JPermissionButton :hasPermission="true" type="primary" danger>Danger Primary</JPermissionButton>
        <JPermissionButton :hasPermission="true" type="default" danger>Danger Default</JPermissionButton>
        <JPermissionButton :hasPermission="true" type="text" danger>Danger Text</JPermissionButton>
      </div>
    </div>
    
    <!-- 禁用状态 -->
    <div class="demo-section">
      <h4>禁用状态</h4>
      <div class="button-group">
        <JPermissionButton :hasPermission="true" type="primary" disabled>Disabled Primary</JPermissionButton>
        <JPermissionButton :hasPermission="true" type="default" disabled>Disabled Default</JPermissionButton>
        <JPermissionButton :hasPermission="false" type="primary">No Permission</JPermissionButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.button-types-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.demo-section h4 {
  margin: 0 0 12px 0;
}

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}
</style>`
      }
    }
  }
};

/**
 * 实际应用场景
 * 在数据管理界面中的应用示例
 */
export const 实际应用场景: Story = {
  render: () => ({
    components: { JPermissionButton },
    template: `
      <div style="min-width: 600px; padding: 16px; border: 1px solid #e8e8e8; border-radius: 8px;">
        <h3 style="margin: 0 0 16px 0;">用户管理</h3>
        
        <!-- 操作栏 -->
        <div style="margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
          <JPermissionButton 
            :hasPermission="permissions.create"
            type="primary"
            @click="handleCreate"
          >
            新建用户
          </JPermissionButton>
          
          <JPermissionButton 
            :hasPermission="permissions.batchDelete"
            :popConfirm="{
              title: '确定要批量删除选中的用户吗？',
              content: '此操作将删除 ' + selectedCount + ' 个用户，删除后无法恢复。',
              onConfirm: handleBatchDelete
            }"
            type="primary"
            danger
            :disabled="selectedCount === 0"
          >
            批量删除 ({{ selectedCount }})
          </JPermissionButton>
          
          <JPermissionButton 
            :hasPermission="permissions.export"
            :tooltip="{ title: '导出当前筛选结果' }"
            type="default"
            @click="handleExport"
          >
            导出数据
          </JPermissionButton>
        </div>
        
        <!-- 用户列表 -->
        <div style="border: 1px solid #f0f0f0; border-radius: 4px;">
          <div style="padding: 12px; background: #fafafa; border-bottom: 1px solid #f0f0f0; font-weight: 500;">
            用户列表
          </div>
          
          <div v-for="user in users" :key="user.id" 
               style="padding: 12px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 500;">{{ user.name }}</div>
              <div style="font-size: 14px; color: #666;">{{ user.email }}</div>
            </div>
            
            <div style="display: flex; gap: 8px;">
              <JPermissionButton 
                :hasPermission="permissions.edit"
                :tooltip="{ title: '编辑用户信息' }"
                type="link"
                size="small"
                @click="handleEdit(user)"
              >
                编辑
              </JPermissionButton>
              
              <JPermissionButton 
                :hasPermission="permissions.resetPassword"
                :popConfirm="{
                  title: '确定要重置密码吗？',
                  content: '重置后用户需要重新设置密码',
                  onConfirm: () => handleResetPassword(user)
                }"
                type="link"
                size="small"
              >
                重置密码
              </JPermissionButton>
              
              <JPermissionButton 
                :hasPermission="permissions.delete"
                :popConfirm="{
                  title: '确定要删除用户 ' + user.name + ' 吗？',
                  content: '删除后将无法恢复，请谨慎操作',
                  onConfirm: () => handleDelete(user)
                }"
                type="link"
                size="small"
                danger
              >
                删除
              </JPermissionButton>
            </div>
          </div>
        </div>
        
        <!-- 权限状态说明 -->
        <div style="margin-top: 16px; padding: 12px; background: #f6f6f6; border-radius: 4px;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px;">当前权限状态：</h4>
          <div style="font-size: 12px; color: #666; display: flex; gap: 16px; flex-wrap: wrap;">
            <span>创建: {{ permissions.create ? '✓' : '✗' }}</span>
            <span>编辑: {{ permissions.edit ? '✓' : '✗' }}</span>
            <span>删除: {{ permissions.delete ? '✓' : '✗' }}</span>
            <span>批量删除: {{ permissions.batchDelete ? '✓' : '✗' }}</span>
            <span>重置密码: {{ permissions.resetPassword ? '✓' : '✗' }}</span>
            <span>导出: {{ permissions.export ? '✓' : '✗' }}</span>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        selectedCount: 2,
        permissions: {
          create: true,
          edit: true,
          delete: false,
          batchDelete: false,
          resetPassword: true,
          export: true
        },
        users: [
          { id: 1, name: '张三', email: 'zhangsan@example.com' },
          { id: 2, name: '李四', email: 'lisi@example.com' },
          { id: 3, name: '王五', email: 'wangwu@example.com' }
        ]
      }
    },
    methods: {
      handleCreate() {
        console.log('创建用户')
      },
      handleEdit(user) {
        console.log('编辑用户:', user.name)
      },
      handleDelete(user) {
        console.log('删除用户:', user.name)
      },
      handleBatchDelete() {
        console.log('批量删除用户')
      },
      handleResetPassword(user) {
        console.log('重置密码:', user.name)
      },
      handleExport() {
        console.log('导出数据')
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="user-management">
    <h3>用户管理</h3>
    
    <!-- 操作栏 -->
    <div class="action-bar">
      <JPermissionButton 
        :hasPermission="permissions.create"
        type="primary"
        @click="handleCreate"
      >
        新建用户
      </JPermissionButton>
      
      <JPermissionButton 
        :hasPermission="permissions.batchDelete"
        :popConfirm="{
          title: '确定要批量删除选中的用户吗？',
          content: '此操作将删除 ' + selectedCount + ' 个用户，删除后无法恢复。',
          onConfirm: handleBatchDelete
        }"
        type="primary"
        danger
        :disabled="selectedCount === 0"
      >
        批量删除 ({{ selectedCount }})
      </JPermissionButton>
      
      <JPermissionButton 
        :hasPermission="permissions.export"
        :tooltip="{ title: '导出当前筛选结果' }"
        type="default"
        @click="handleExport"
      >
        导出数据
      </JPermissionButton>
    </div>
    
    <!-- 用户列表 -->
    <div class="user-list">
      <div class="list-header">
        用户列表
      </div>
      
      <div v-for="user in users" :key="user.id" class="user-item">
        <div class="user-info">
          <div class="user-name">{{ user.name }}</div>
          <div class="user-email">{{ user.email }}</div>
        </div>
        
        <div class="user-actions">
          <JPermissionButton 
            :hasPermission="permissions.edit"
            :tooltip="{ title: '编辑用户信息' }"
            type="link"
            size="small"
            @click="handleEdit(user)"
          >
            编辑
          </JPermissionButton>
          
          <JPermissionButton 
            :hasPermission="permissions.resetPassword"
            :popConfirm="{
              title: '确定要重置密码吗？',
              content: '重置后用户需要重新设置密码',
              onConfirm: () => handleResetPassword(user)
            }"
            type="link"
            size="small"
          >
            重置密码
          </JPermissionButton>
          
          <JPermissionButton 
            :hasPermission="permissions.delete"
            :popConfirm="{
              title: '确定要删除用户 ' + user.name + ' 吗？',
              content: '删除后将无法恢复，请谨慎操作',
              onConfirm: () => handleDelete(user)
            }"
            type="link"
            size="small"
            danger
          >
            删除
          </JPermissionButton>
        </div>
      </div>
    </div>
    
    <!-- 权限状态说明 -->
    <div class="permission-status">
      <h4>当前权限状态：</h4>
      <div class="permission-list">
        <span>创建: {{ permissions.create ? '✓' : '✗' }}</span>
        <span>编辑: {{ permissions.edit ? '✓' : '✗' }}</span>
        <span>删除: {{ permissions.delete ? '✓' : '✗' }}</span>
        <span>批量删除: {{ permissions.batchDelete ? '✓' : '✗' }}</span>
        <span>重置密码: {{ permissions.resetPassword ? '✓' : '✗' }}</span>
        <span>导出: {{ permissions.export ? '✓' : '✗' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedCount = ref(2)

const permissions = ref({
  create: true,
  edit: true,
  delete: false,
  batchDelete: false,
  resetPassword: true,
  export: true
})

const users = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
  { id: 3, name: '王五', email: 'wangwu@example.com' }
])

const handleCreate = () => {
  console.log('创建用户')
}

const handleEdit = (user) => {
  console.log('编辑用户:', user.name)
}

const handleDelete = (user) => {
  console.log('删除用户:', user.name)
}

const handleBatchDelete = () => {
  console.log('批量删除用户')
}

const handleResetPassword = (user) => {
  console.log('重置密码:', user.name)
}

const handleExport = () => {
  console.log('导出数据')
}
</script>

<style scoped>
.user-management {
  max-width: 800px;
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.user-management h3 {
  margin: 0 0 16px 0;
}

.action-bar {
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.user-list {
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}

.list-header {
  padding: 12px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 500;
}

.user-item {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-name {
  font-weight: 500;
}

.user-email {
  font-size: 14px;
  color: #666;
}

.user-actions {
  display: flex;
  gap: 8px;
}

.permission-status {
  margin-top: 16px;
  padding: 12px;
  background: #f6f6f6;
  border-radius: 4px;
}

.permission-status h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
}

.permission-list {
  font-size: 12px;
  color: #666;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
</style>`
      }
    }
  }
};
