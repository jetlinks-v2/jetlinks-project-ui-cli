import type { Meta, StoryObj } from '@storybook/vue3';
import JEmpty from '../../../packages/components/src/Empty/Empty.vue';

/**
 * Empty 空状态组件
 * 
 * 这是一个空状态展示组件，用于在页面或组件没有数据时提供友好的视觉反馈。
 * 支持自定义描述文本、图片和样式，适用于各种空数据场景。
 * 
 * ## 何时使用
 * - 当页面或组件没有数据时
 * - 需要给用户明确的空状态提示时
 * - 搜索结果为空时
 * - 列表、表格等容器组件无内容时
 */
const meta: Meta<typeof JEmpty> = {
  title: '组件库/Empty 空状态',
  component: JEmpty,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Empty 是一个空状态展示组件，为用户提供友好的空数据提示。

### 主要特性
- 支持自定义描述文本
- 支持自定义图片
- 支持自定义图片样式
- 内置国际化支持
- 响应式设计

### 基本用法
\`\`\`vue
<template>
  <JEmpty />
</template>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    description: {
      control: 'text',
      description: '空状态描述文本'
    },
    image: {
      control: 'text',
      description: '自定义图片路径'
    },
    imageStyle: {
      control: 'object',
      description: '图片样式配置'
    }
  },
  args: {
    description: '暂无数据'
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 默认空状态
 * 最基础的空状态展示
 */
export const 默认空状态: Story = {
  args: {},
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JEmpty />
</template>

<script setup lang="ts">
import JEmpty from '@jetlinks/components'
</script>`
      }
    }
  }
};

/**
 * 自定义描述文本
 * 使用自定义的描述文本
 */
export const 自定义描述文本: Story = {
  args: {
    description: '没有找到相关内容'
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JEmpty description="没有找到相关内容" />
</template>

<script setup lang="ts">
import JEmpty from '@jetlinks/components'
</script>`
      }
    }
  }
};

/**
 * 自定义图片
 * 使用自定义图片替换默认空状态图片
 */
export const 自定义图片: Story = {
  args: {
    image: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    description: '自定义空状态图片'
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JEmpty 
    image="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    description="自定义空状态图片"
  />
</template>

<script setup lang="ts">
import JEmpty from '@jetlinks/components'
</script>`
      }
    }
  }
};

/**
 * 自定义图片样式
 * 调整图片的尺寸和样式
 */
export const 自定义图片样式: Story = {
  args: {
    description: '大尺寸空状态',
    imageStyle: { 
      height: '120px',
      width: '120px' 
    }
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JEmpty 
    description="大尺寸空状态"
    :imageStyle="{ 
      height: '120px',
      width: '120px' 
    }"
  />
</template>

<script setup lang="ts">
import JEmpty from '@jetlinks/components'
</script>`
      }
    }
  }
};

/**
 * 不同场景对比
 * 展示不同使用场景的空状态
 */
export const 不同场景对比: Story = {
  render: () => ({
    components: { JEmpty },
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; width: 600px;">
        <div style="padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h4 style="margin: 0 0 16px 0; text-align: center;">搜索结果</h4>
          <JEmpty description="未找到搜索结果" />
        </div>
        
        <div style="padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h4 style="margin: 0 0 16px 0; text-align: center;">数据列表</h4>
          <JEmpty description="暂无数据" />
        </div>
        
        <div style="padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h4 style="margin: 0 0 16px 0; text-align: center;">收藏夹</h4>
          <JEmpty 
            description="还没有收藏任何内容"
            :imageStyle="{ height: '80px' }"
          />
        </div>
        
        <div style="padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h4 style="margin: 0 0 16px 0; text-align: center;">购物车</h4>
          <JEmpty 
            description="购物车是空的"
            :imageStyle="{ height: '80px' }"
          />
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="empty-scenarios">
    <div class="scenario-card">
      <h4>搜索结果</h4>
      <JEmpty description="未找到搜索结果" />
    </div>
    
    <div class="scenario-card">
      <h4>数据列表</h4>
      <JEmpty description="暂无数据" />
    </div>
    
    <div class="scenario-card">
      <h4>收藏夹</h4>
      <JEmpty 
        description="还没有收藏任何内容"
        :imageStyle="{ height: '80px' }"
      />
    </div>
    
    <div class="scenario-card">
      <h4>购物车</h4>
      <JEmpty 
        description="购物车是空的"
        :imageStyle="{ height: '80px' }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import JEmpty from '@jetlinks/components'
</script>

<style scoped>
.empty-scenarios {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  width: 600px;
}

.scenario-card {
  padding: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.scenario-card h4 {
  margin: 0 0 16px 0;
  text-align: center;
}
</style>`
      }
    }
  }
};

/**
 * 实际应用场景
 * 在实际业务场景中的应用示例
 */
export const 实际应用场景: Story = {
  render: () => ({
    components: { JEmpty },
    template: `
      <div style="max-width: 800px; display: flex; flex-direction: column; gap: 24px;">
        <!-- 表格空状态 -->
        <div style="border: 1px solid #f0f0f0; border-radius: 8px; overflow: hidden;">
          <div style="padding: 16px; background: #fafafa; border-bottom: 1px solid #f0f0f0;">
            <h3 style="margin: 0; font-size: 16px;">用户列表</h3>
          </div>
          <div style="padding: 40px 20px;">
            <JEmpty 
              description="暂无用户数据，点击上方按钮添加用户"
              :imageStyle="{ height: '80px' }"
            />
          </div>
        </div>

        <!-- 卡片列表空状态 -->
        <div style="border: 1px solid #f0f0f0; border-radius: 8px; overflow: hidden;">
          <div style="padding: 16px; background: #fafafa; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-size: 16px;">我的项目</h3>
            <button style="padding: 6px 12px; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer;">
              新建项目
            </button>
          </div>
          <div style="padding: 60px 20px;">
            <JEmpty 
              description="还没有创建任何项目，立即创建你的第一个项目吧"
              :imageStyle="{ height: '100px' }"
            />
          </div>
        </div>

        <!-- 搜索结果空状态 -->
        <div style="border: 1px solid #f0f0f0; border-radius: 8px; overflow: hidden;">
          <div style="padding: 16px; background: #fafafa; border-bottom: 1px solid #f0f0f0;">
            <div style="display: flex; gap: 12px; align-items: center;">
              <input 
                placeholder="搜索文档、项目、用户..."
                style="flex: 1; padding: 8px 12px; border: 1px solid #d9d9d9; border-radius: 4px;"
                value="测试搜索关键词"
                readonly
              />
              <button style="padding: 8px 16px; background: #1890ff; color: white; border: none; border-radius: 4px;">
                搜索
              </button>
            </div>
          </div>
          <div style="padding: 40px 20px;">
            <JEmpty 
              description='没有找到与"测试搜索关键词"相关的结果，请尝试其他关键词'
              :imageStyle="{ height: '80px' }"
            />
          </div>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="application-demo">
    <!-- 表格空状态 -->
    <div class="table-container">
      <div class="table-header">
        <h3>用户列表</h3>
      </div>
      <div class="table-body">
        <JEmpty 
          description="暂无用户数据，点击上方按钮添加用户"
          :imageStyle="{ height: '80px' }"
        />
      </div>
    </div>

    <!-- 卡片列表空状态 -->
    <div class="card-container">
      <div class="card-header">
        <h3>我的项目</h3>
        <button class="create-btn">新建项目</button>
      </div>
      <div class="card-body">
        <JEmpty 
          description="还没有创建任何项目，立即创建你的第一个项目吧"
          :imageStyle="{ height: '100px' }"
        />
      </div>
    </div>

    <!-- 搜索结果空状态 -->
    <div class="search-container">
      <div class="search-header">
        <div class="search-box">
          <input 
            placeholder="搜索文档、项目、用户..."
            v-model="searchKeyword"
          />
          <button class="search-btn">搜索</button>
        </div>
      </div>
      <div class="search-results">
        <JEmpty 
          :description="\`没有找到与"\${searchKeyword}"相关的结果，请尝试其他关键词\`"
          :imageStyle="{ height: '80px' }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JEmpty from '@jetlinks/components'

const searchKeyword = ref('测试搜索关键词')
</script>

<style scoped>
.application-demo {
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.table-container,
.card-container,
.search-container {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.table-header,
.card-header,
.search-header {
  padding: 16px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h3,
.card-header h3 {
  margin: 0;
  font-size: 16px;
}

.create-btn {
  padding: 6px 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-box {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-box input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.search-btn {
  padding: 8px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.table-body {
  padding: 40px 20px;
}

.card-body {
  padding: 60px 20px;
}

.search-results {
  padding: 40px 20px;
}
</style>`
      }
    }
  }
};