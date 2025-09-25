import type { Meta, StoryObj } from '@storybook/vue3';
import JTitle from '../../../packages/components/src/Title/title.vue';

/**
 * Title 标题组件
 * 
 * 这是一个用于显示标题的组件，支持自定义样式和额外内容插槽。
 * 适用于页面标题、模块标题、卡片标题等各种标题显示场景。
 * 
 * ## 何时使用
 * - 需要显示页面或模块标题时
 * - 需要统一标题样式时
 * - 标题需要配合其他元素（如按钮、图标等）显示时
 * - 需要自定义标题样式时
 */
const meta: Meta<typeof JTitle> = {
  title: '组件库/Title 标题',
  component: JTitle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Title 是一个标题组件，用于统一显示各种标题内容。

### 主要特性
- 支持文本标题显示
- 支持自定义样式
- 支持额外内容插槽
- 内置样式主题
- 响应式设计

### 基本用法
\`\`\`vue
<template>
  <JTitle data="页面标题" />
</template>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'text',
      description: '标题文本内容'
    },
    style: {
      control: 'object',
      description: '自定义样式对象'
    }
  },
  args: {
    data: '标题文本'
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基础标题
 * 最基本的标题显示
 */
export const 基础标题: Story = {
  args: {
    data: '这是一个基础标题'
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JTitle data="这是一个基础标题" />
</template>

<script setup lang="ts">
import JTitle from '@jetlinks/components'
</script>`
      }
    }
  }
};

/**
 * 大标题
 * 使用自定义样式的大标题
 */
export const 大标题: Story = {
  args: {
    data: '大标题样式',
    style: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#1890ff'
    }
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JTitle 
    data="大标题样式"
    :style="{
      fontSize: '24px',
      fontWeight: '600',
      color: '#1890ff'
    }"
  />
</template>

<script setup lang="ts">
import JTitle from '@jetlinks/components'
</script>`
      }
    }
  }
};

/**
 * 小标题
 * 使用自定义样式的小标题
 */
export const 小标题: Story = {
  args: {
    data: '小标题样式',
    style: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#666'
    }
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JTitle 
    data="小标题样式"
    :style="{
      fontSize: '14px',
      fontWeight: '500',
      color: '#666'
    }"
  />
</template>

<script setup lang="ts">
import JTitle from '@jetlinks/components'
</script>`
      }
    }
  }
};

/**
 * 彩色标题
 * 不同颜色的标题样式
 */
export const 彩色标题: Story = {
  render: () => ({
    components: { JTitle },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <JTitle data="主色调标题" :style="{ color: '#1890ff', fontSize: '18px', fontWeight: '600' }" />
        <JTitle data="成功色标题" :style="{ color: '#52c41a', fontSize: '18px', fontWeight: '600' }" />
        <JTitle data="警告色标题" :style="{ color: '#faad14', fontSize: '18px', fontWeight: '600' }" />
        <JTitle data="危险色标题" :style="{ color: '#ff4d4f', fontSize: '18px', fontWeight: '600' }" />
        <JTitle data="紫色标题" :style="{ color: '#722ed1', fontSize: '18px', fontWeight: '600' }" />
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="color-titles">
    <JTitle 
      data="主色调标题" 
      :style="{ color: '#1890ff', fontSize: '18px', fontWeight: '600' }" 
    />
    <JTitle 
      data="成功色标题" 
      :style="{ color: '#52c41a', fontSize: '18px', fontWeight: '600' }" 
    />
    <JTitle 
      data="警告色标题" 
      :style="{ color: '#faad14', fontSize: '18px', fontWeight: '600' }" 
    />
    <JTitle 
      data="危险色标题" 
      :style="{ color: '#ff4d4f', fontSize: '18px', fontWeight: '600' }" 
    />
    <JTitle 
      data="紫色标题" 
      :style="{ color: '#722ed1', fontSize: '18px', fontWeight: '600' }" 
    />
  </div>
</template>

<script setup lang="ts">
import JTitle from '@jetlinks/components'
</script>

<style scoped>
.color-titles {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>`
      }
    }
  }
};

/**
 * 带额外内容的标题
 * 使用插槽添加额外内容
 */
export const 带额外内容: Story = {
  render: () => ({
    components: { JTitle },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <JTitle data="用户管理" :style="{ fontSize: '18px', fontWeight: '600' }">
          <template #extra>
            <button style="padding: 4px 12px; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer;">
              新增用户
            </button>
          </template>
        </JTitle>
        
        <JTitle data="数据统计" :style="{ fontSize: '18px', fontWeight: '600' }">
          <template #extra>
            <div style="display: flex; gap: 8px; align-items: center;">
              <span style="font-size: 14px; color: #666;">最后更新: 10分钟前</span>
              <button style="padding: 4px 8px; background: #f0f0f0; color: #666; border: 1px solid #d9d9d9; border-radius: 4px; cursor: pointer;">
                刷新
              </button>
            </div>
          </template>
        </JTitle>
        
        <JTitle data="系统设置" :style="{ fontSize: '18px', fontWeight: '600' }">
          <template #extra>
            <div style="display: flex; gap: 4px;">
              <span style="width: 8px; height: 8px; background: #52c41a; border-radius: 50%; margin-top: 6px;"></span>
              <span style="font-size: 14px; color: #52c41a;">运行正常</span>
            </div>
          </template>
        </JTitle>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="title-with-extra">
    <!-- 带按钮的标题 -->
    <JTitle data="用户管理" :style="titleStyle">
      <template #extra>
        <button class="action-button primary">
          新增用户
        </button>
      </template>
    </JTitle>
    
    <!-- 带更新信息的标题 -->
    <JTitle data="数据统计" :style="titleStyle">
      <template #extra>
        <div class="extra-info">
          <span class="update-time">最后更新: 10分钟前</span>
          <button class="action-button secondary">刷新</button>
        </div>
      </template>
    </JTitle>
    
    <!-- 带状态指示的标题 -->
    <JTitle data="系统设置" :style="titleStyle">
      <template #extra>
        <div class="status-indicator">
          <span class="status-dot online"></span>
          <span class="status-text">运行正常</span>
        </div>
      </template>
    </JTitle>
  </div>
</template>

<script setup lang="ts">
import JTitle from '@jetlinks/components'

const titleStyle = {
  fontSize: '18px',
  fontWeight: '600'
}
</script>

<style scoped>
.title-with-extra {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.action-button {
  padding: 4px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.action-button.primary {
  background: #1890ff;
  color: white;
}

.action-button.secondary {
  padding: 4px 8px;
  background: #f0f0f0;
  color: #666;
  border: 1px solid #d9d9d9;
}

.extra-info {
  display: flex;
  gap: 8px;
  align-items: center;
}

.update-time {
  font-size: 14px;
  color: #666;
}

.status-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.online {
  background: #52c41a;
}

.status-text {
  font-size: 14px;
  color: #52c41a;
}
</style>`
      }
    }
  }
};

/**
 * 不同尺寸标题
 * 展示不同尺寸的标题层级
 */
export const 不同尺寸: Story = {
  render: () => ({
    components: { JTitle },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <JTitle data="特大标题 (H1)" :style="{ fontSize: '32px', fontWeight: '700', color: '#1890ff' }" />
        <JTitle data="大标题 (H2)" :style="{ fontSize: '24px', fontWeight: '600', color: '#262626' }" />
        <JTitle data="中等标题 (H3)" :style="{ fontSize: '20px', fontWeight: '600', color: '#434343' }" />
        <JTitle data="小标题 (H4)" :style="{ fontSize: '16px', fontWeight: '500', color: '#595959' }" />
        <JTitle data="最小标题 (H5)" :style="{ fontSize: '14px', fontWeight: '500', color: '#8c8c8c' }" />
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="title-sizes">
    <JTitle 
      data="特大标题 (H1)" 
      :style="h1Style" 
    />
    <JTitle 
      data="大标题 (H2)" 
      :style="h2Style" 
    />
    <JTitle 
      data="中等标题 (H3)" 
      :style="h3Style" 
    />
    <JTitle 
      data="小标题 (H4)" 
      :style="h4Style" 
    />
    <JTitle 
      data="最小标题 (H5)" 
      :style="h5Style" 
    />
  </div>
</template>

<script setup lang="ts">
import JTitle from '@jetlinks/components'

const h1Style = { 
  fontSize: '32px', 
  fontWeight: '700', 
  color: '#1890ff' 
}

const h2Style = { 
  fontSize: '24px', 
  fontWeight: '600', 
  color: '#262626' 
}

const h3Style = { 
  fontSize: '20px', 
  fontWeight: '600', 
  color: '#434343' 
}

const h4Style = { 
  fontSize: '16px', 
  fontWeight: '500', 
  color: '#595959' 
}

const h5Style = { 
  fontSize: '14px', 
  fontWeight: '500', 
  color: '#8c8c8c' 
}
</script>

<style scoped>
.title-sizes {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>`
      }
    }
  }
};

/**
 * 实际应用场景
 * 在页面布局中的应用示例
 */
export const 实际应用场景: Story = {
  render: () => ({
    components: { JTitle },
    template: `
      <div style="max-width: 800px;">
        <!-- 页面主标题 -->
        <JTitle 
          data="用户管理系统" 
          :style="{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#1890ff',
            marginBottom: '24px',
            borderBottom: '2px solid #1890ff',
            paddingBottom: '8px'
          }" 
        />
        
        <!-- 模块标题 -->
        <div style="margin-bottom: 24px;">
          <JTitle 
            data="用户列表" 
            :style="{ 
              fontSize: '20px', 
              fontWeight: '600', 
              color: '#262626',
              marginBottom: '16px'
            }" 
          >
            <template #extra>
              <div style="display: flex; gap: 8px;">
                <button style="padding: 6px 12px; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
                  新增用户
                </button>
                <button style="padding: 6px 12px; background: #f0f0f0; color: #666; border: 1px solid #d9d9d9; border-radius: 4px; cursor: pointer; font-size: 14px;">
                  导出数据
                </button>
              </div>
            </template>
          </JTitle>
          
          <!-- 模拟表格 -->
          <div style="border: 1px solid #e8e8e8; border-radius: 6px; overflow: hidden;">
            <div style="background: #fafafa; padding: 12px; font-weight: 600; border-bottom: 1px solid #e8e8e8;">
              用户信息表格
            </div>
            <div style="padding: 20px; color: #999; text-align: center;">
              这里是用户列表内容区域
            </div>
          </div>
        </div>
        
        <!-- 卡片标题 -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div style="border: 1px solid #e8e8e8; border-radius: 8px; padding: 16px;">
            <JTitle 
              data="统计概览" 
              :style="{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#434343',
                marginBottom: '12px'
              }" 
            >
              <template #extra>
                <span style="font-size: 12px; color: #999;">今日数据</span>
              </template>
            </JTitle>
            <div style="display: flex; justify-content: space-around; text-align: center;">
              <div>
                <div style="font-size: 24px; font-weight: 600; color: #1890ff;">1,234</div>
                <div style="font-size: 12px; color: #999;">总用户</div>
              </div>
              <div>
                <div style="font-size: 24px; font-weight: 600; color: #52c41a;">856</div>
                <div style="font-size: 12px; color: #999;">活跃用户</div>
              </div>
            </div>
          </div>
          
          <div style="border: 1px solid #e8e8e8; border-radius: 8px; padding: 16px;">
            <JTitle 
              data="系统状态" 
              :style="{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#434343',
                marginBottom: '12px'
              }" 
            >
              <template #extra>
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span style="width: 8px; height: 8px; background: #52c41a; border-radius: 50%;"></span>
                  <span style="font-size: 12px; color: #52c41a;">正常</span>
                </div>
              </template>
            </JTitle>
            <div style="color: #666; font-size: 14px; line-height: 1.6;">
              <div>CPU使用率: 45%</div>
              <div>内存使用率: 68%</div>
              <div>磁盘使用率: 32%</div>
            </div>
          </div>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="page-layout">
    <!-- 页面主标题 -->
    <JTitle 
      data="用户管理系统" 
      :style="pageHeaderStyle"
    />
    
    <!-- 模块标题 -->
    <div class="section">
      <JTitle 
        data="用户列表" 
        :style="sectionTitleStyle"
      >
        <template #extra>
          <div class="action-buttons">
            <button class="btn-primary">新增用户</button>
            <button class="btn-secondary">导出数据</button>
          </div>
        </template>
      </JTitle>
      
      <!-- 模拟表格 -->
      <div class="table-container">
        <div class="table-header">
          用户信息表格
        </div>
        <div class="table-content">
          这里是用户列表内容区域
        </div>
      </div>
    </div>
    
    <!-- 卡片标题 -->
    <div class="card-grid">
      <div class="card">
        <JTitle 
          data="统计概览" 
          :style="cardTitleStyle"
        >
          <template #extra>
            <span class="extra-text">今日数据</span>
          </template>
        </JTitle>
        <div class="stats">
          <div class="stat-item">
            <div class="stat-value primary">1,234</div>
            <div class="stat-label">总用户</div>
          </div>
          <div class="stat-item">
            <div class="stat-value success">856</div>
            <div class="stat-label">活跃用户</div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <JTitle 
          data="系统状态" 
          :style="cardTitleStyle"
        >
          <template #extra>
            <div class="status-indicator">
              <span class="status-dot"></span>
              <span class="status-text">正常</span>
            </div>
          </template>
        </JTitle>
        <div class="system-info">
          <div>CPU使用率: 45%</div>
          <div>内存使用率: 68%</div>
          <div>磁盘使用率: 32%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import JTitle from '@jetlinks/components'

const pageHeaderStyle = {
  fontSize: '28px',
  fontWeight: '700',
  color: '#1890ff',
  marginBottom: '24px',
  borderBottom: '2px solid #1890ff',
  paddingBottom: '8px'
}

const sectionTitleStyle = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#262626',
  marginBottom: '16px'
}

const cardTitleStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#434343',
  marginBottom: '12px'
}
</script>

<style scoped>
.page-layout {
  max-width: 800px;
}

.section {
  margin-bottom: 24px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-primary {
  padding: 6px 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-secondary {
  padding: 6px 12px;
  background: #f0f0f0;
  color: #666;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.table-container {
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  overflow: hidden;
}

.table-header {
  background: #fafafa;
  padding: 12px;
  font-weight: 600;
  border-bottom: 1px solid #e8e8e8;
}

.table-content {
  padding: 20px;
  color: #999;
  text-align: center;
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
}

.extra-text {
  font-size: 12px;
  color: #999;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #52c41a;
  border-radius: 50%;
}

.status-text {
  font-size: 12px;
  color: #52c41a;
}

.stats {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.stat-item {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
}

.stat-value.primary {
  color: #1890ff;
}

.stat-value.success {
  color: #52c41a;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.system-info {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}
</style>`
      }
    }
  }
};