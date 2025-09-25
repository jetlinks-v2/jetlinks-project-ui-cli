import type { Meta, StoryObj } from '@storybook/vue3';
import JEllipsis from '../../../packages/components/src/Ellipsis/Ellipsis.vue';

/**
 * Ellipsis 文本省略组件
 * 
 * 这是一个用于文本内容过长时进行省略显示的组件，支持单行和多行省略。
 * 当文本被省略时，鼠标悬停可以显示完整内容的提示框。
 * 
 * ## 何时使用
 * - 文本内容过长需要截断显示时
 * - 需要在有限空间内展示文本时
 * - 希望保持界面整洁，避免文本换行时
 * - 需要显示完整内容的悬停提示时
 */
const meta: Meta<typeof JEllipsis> = {
  title: '组件库/Ellipsis 文本省略',
  component: JEllipsis,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Ellipsis 是一个文本省略组件，用于处理过长的文本内容。

### 主要特性
- 支持单行和多行省略
- 支持悬停显示完整内容
- 支持点击展开/收起
- 自动检测是否需要省略
- 可自定义省略行数
- 响应式设计

### 基本用法
\`\`\`vue
<template>
  <JEllipsis>这是一段很长的文本内容</JEllipsis>
</template>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    lineClamp: {
      control: 'number',
      description: '最大显示行数，1为单行省略，大于1为多行省略'
    },
    tooltip: {
      control: 'boolean',
      description: '是否显示悬停提示框'
    },
    expandTrigger: {
      control: 'select',
      options: [undefined, 'click'],
      description: '展开触发方式，click表示点击展开'
    }
  },
  args: {
    lineClamp: 1,
    tooltip: true
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 单行省略
 * 最基本的用法，文本超出容器宽度时显示省略号
 */
export const 单行省略: Story = {
  render: () => ({
    components: { JEllipsis },
    template: `
      <div style="width: 200px; border: 1px solid #ddd; padding: 12px;">
        <JEllipsis>这是一段很长的文本内容，当它超出容器宽度时会显示省略号</JEllipsis>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="text-container">
    <JEllipsis>
      这是一段很长的文本内容，当它超出容器宽度时会显示省略号
    </JEllipsis>
  </div>
</template>

<script setup lang="ts">
import JEllipsis from '@jetlinks/components'
</script>

<style scoped>
.text-container {
  width: 200px;
  border: 1px solid #ddd;
  padding: 12px;
}
</style>`
      }
    }
  }
};

/**
 * 多行省略
 * 设置最大显示行数，超出后显示省略号
 */
export const 多行省略: Story = {
  render: () => ({
    components: { JEllipsis },
    template: `
      <div style="width: 300px; border: 1px solid #ddd; padding: 12px;">
        <JEllipsis :line-clamp="3">
          这是一段很长的文本内容，包含了很多文字信息。当文本内容超出指定的行数限制时，
          会自动截断并显示省略号。用户可以通过鼠标悬停查看完整内容。这个功能在展示
          新闻摘要、商品描述、用户评论等场景中非常实用。通过合理设置行数限制，
          可以在保持界面整洁的同时，为用户提供必要的信息预览。
        </JEllipsis>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="text-container">
    <JEllipsis :line-clamp="3">
      这是一段很长的文本内容，包含了很多文字信息。当文本内容超出指定的行数限制时，
      会自动截断并显示省略号。用户可以通过鼠标悬停查看完整内容。这个功能在展示
      新闻摘要、商品描述、用户评论等场景中非常实用。通过合理设置行数限制，
      可以在保持界面整洁的同时，为用户提供必要的信息预览。
    </JEllipsis>
  </div>
</template>

<script setup lang="ts">
import JEllipsis from '@jetlinks/components'
</script>

<style scoped>
.text-container {
  width: 300px;
  border: 1px solid #ddd;
  padding: 12px;
}
</style>`
      }
    }
  }
};

/**
 * 点击展开
 * 点击文本可以展开/收起完整内容
 */
export const 点击展开: Story = {
  render: () => ({
    components: { JEllipsis },
    template: `
      <div style="width: 300px; border: 1px solid #ddd; padding: 12px;">
        <JEllipsis :line-clamp="2" expand-trigger="click">
          这是一个支持点击展开的文本省略组件示例。当你点击这段文本时，它会展开显示完整内容。
          再次点击可以收起文本，恢复省略状态。这个功能特别适用于需要用户主动查看详情的场景，
          比如文章摘要、产品介绍、用户评论等。通过点击交互，用户可以按需查看详细信息，
          既节省了页面空间，又提供了良好的用户体验。
        </JEllipsis>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="text-container">
    <JEllipsis :line-clamp="2" expand-trigger="click">
      这是一个支持点击展开的文本省略组件示例。当你点击这段文本时，它会展开显示完整内容。
      再次点击可以收起文本，恢复省略状态。这个功能特别适用于需要用户主动查看详情的场景，
      比如文章摘要、产品介绍、用户评论等。通过点击交互，用户可以按需查看详细信息，
      既节省了页面空间，又提供了良好的用户体验。
    </JEllipsis>
  </div>
</template>

<script setup lang="ts">
import JEllipsis from '@jetlinks/components'
</script>

<style scoped>
.text-container {
  width: 300px;
  border: 1px solid #ddd;
  padding: 12px;
}
</style>`
      }
    }
  }
};

/**
 * 禁用提示框
 * 关闭悬停提示功能，只显示省略效果
 */
export const 禁用提示框: Story = {
  render: () => ({
    components: { JEllipsis },
    template: `
      <div style="width: 250px; border: 1px solid #ddd; padding: 12px;">
        <JEllipsis :tooltip="false">
          这段文本被省略了，但不会显示悬停提示框，适用于不需要查看完整内容的场景
        </JEllipsis>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="text-container">
    <JEllipsis :tooltip="false">
      这段文本被省略了，但不会显示悬停提示框，适用于不需要查看完整内容的场景
    </JEllipsis>
  </div>
</template>

<script setup lang="ts">
import JEllipsis from '@jetlinks/components'
</script>

<style scoped>
.text-container {
  width: 250px;
  border: 1px solid #ddd;
  padding: 12px;
}
</style>`
      }
    }
  }
};

/**
 * 不同行数对比
 * 展示不同行数限制的效果对比
 */
export const 不同行数对比: Story = {
  render: () => ({
    components: { JEllipsis },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 400px;">
        <div>
          <h4 style="margin: 0 0 8px 0;">单行省略 (line-clamp: 1)</h4>
          <div style="border: 1px solid #ddd; padding: 12px;">
            <JEllipsis :line-clamp="1">
              这是一个很长的文本内容示例，用于演示不同行数限制下的省略效果。
              可以看到单行省略会在第一行结束时显示省略号。
            </JEllipsis>
          </div>
        </div>
        
        <div>
          <h4 style="margin: 0 0 8px 0;">两行省略 (line-clamp: 2)</h4>
          <div style="border: 1px solid #ddd; padding: 12px;">
            <JEllipsis :line-clamp="2">
              这是一个很长的文本内容示例，用于演示不同行数限制下的省略效果。
              可以看到两行省略会在第二行结束时显示省略号，相比单行可以显示更多内容。
            </JEllipsis>
          </div>
        </div>
        
        <div>
          <h4 style="margin: 0 0 8px 0;">三行省略 (line-clamp: 3)</h4>
          <div style="border: 1px solid #ddd; padding: 12px;">
            <JEllipsis :line-clamp="3">
              这是一个很长的文本内容示例，用于演示不同行数限制下的省略效果。
              可以看到三行省略会在第三行结束时显示省略号，可以显示更多的文本信息，
              但仍然保持界面的整洁性。适合需要显示更多内容预览的场景。
            </JEllipsis>
          </div>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="comparison-demo">
    <div class="demo-section">
      <h4>单行省略 (line-clamp: 1)</h4>
      <div class="text-box">
        <JEllipsis :line-clamp="1">
          这是一个很长的文本内容示例，用于演示不同行数限制下的省略效果。
          可以看到单行省略会在第一行结束时显示省略号。
        </JEllipsis>
      </div>
    </div>
    
    <div class="demo-section">
      <h4>两行省略 (line-clamp: 2)</h4>
      <div class="text-box">
        <JEllipsis :line-clamp="2">
          这是一个很长的文本内容示例，用于演示不同行数限制下的省略效果。
          可以看到两行省略会在第二行结束时显示省略号，相比单行可以显示更多内容。
        </JEllipsis>
      </div>
    </div>
    
    <div class="demo-section">
      <h4>三行省略 (line-clamp: 3)</h4>
      <div class="text-box">
        <JEllipsis :line-clamp="3">
          这是一个很长的文本内容示例，用于演示不同行数限制下的省略效果。
          可以看到三行省略会在第三行结束时显示省略号，可以显示更多的文本信息，
          但仍然保持界面的整洁性。适合需要显示更多内容预览的场景。
        </JEllipsis>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import JEllipsis from '@jetlinks/components'
</script>

<style scoped>
.comparison-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 400px;
}

.demo-section h4 {
  margin: 0 0 8px 0;
}

.text-box {
  border: 1px solid #ddd;
  padding: 12px;
}
</style>`
      }
    }
  }
};

/**
 * 实际应用场景
 * 在文章列表中的应用示例
 */
export const 实际应用场景: Story = {
  render: () => ({
    components: { JEllipsis },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 500px;">
        <div style="border: 1px solid #e8e8e8; border-radius: 8px; padding: 16px; background: #fff;">
          <div style="display: flex; gap: 12px;">
            <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;" />
            <div style="flex: 1; min-width: 0;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">
                <JEllipsis :line-clamp="1">Vue 3组合式API开发指南：从入门到实践</JEllipsis>
              </h3>
              <div style="margin-bottom: 8px; color: #666;">
                <JEllipsis :line-clamp="2">
                  本文详细介绍了Vue 3中组合式API的核心概念和使用方法，
                  包括响应式数据、计算属性、监听器等重要特性。通过实际案例演示，
                  帮助开发者更好地理解和应用这些新特性，提升开发效率和代码质量。
                </JEllipsis>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; color: #999; font-size: 14px;">
                <span>作者：前端开发者</span>
                <span>2024-01-15</span>
              </div>
            </div>
          </div>
        </div>

        <div style="border: 1px solid #e8e8e8; border-radius: 8px; padding: 16px; background: #fff;">
          <div style="display: flex; gap: 12px;">
            <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;" />
            <div style="flex: 1; min-width: 0;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">
                <JEllipsis :line-clamp="1">TypeScript在大型项目中的最佳实践</JEllipsis>
              </h3>
              <div style="margin-bottom: 8px; color: #666;">
                <JEllipsis :line-clamp="2" expand-trigger="click">
                  在大型前端项目开发中，TypeScript能够提供强类型支持，减少运行时错误。
                  本文分享了在实际项目中使用TypeScript的经验和技巧，包括类型定义、
                  接口设计、泛型使用等方面的最佳实践，帮助团队提升代码质量。
                </JEllipsis>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; color: #999; font-size: 14px;">
                <span>作者：技术专家</span>
                <span>2024-01-10</span>
              </div>
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
  <div class="article-list">
    <div class="article-card">
      <div class="article-content">
        <img 
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" 
          class="article-image" 
        />
        <div class="article-info">
          <h3 class="article-title">
            <JEllipsis :line-clamp="1">
              Vue 3组合式API开发指南：从入门到实践
            </JEllipsis>
          </h3>
          <div class="article-summary">
            <JEllipsis :line-clamp="2">
              本文详细介绍了Vue 3中组合式API的核心概念和使用方法，
              包括响应式数据、计算属性、监听器等重要特性。通过实际案例演示，
              帮助开发者更好地理解和应用这些新特性，提升开发效率和代码质量。
            </JEllipsis>
          </div>
          <div class="article-footer">
            <span>作者：前端开发者</span>
            <span>2024-01-15</span>
          </div>
        </div>
      </div>
    </div>

    <div class="article-card">
      <div class="article-content">
        <img 
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" 
          class="article-image" 
        />
        <div class="article-info">
          <h3 class="article-title">
            <JEllipsis :line-clamp="1">
              TypeScript在大型项目中的最佳实践
            </JEllipsis>
          </h3>
          <div class="article-summary">
            <JEllipsis :line-clamp="2" expand-trigger="click">
              在大型前端项目开发中，TypeScript能够提供强类型支持，减少运行时错误。
              本文分享了在实际项目中使用TypeScript的经验和技巧，包括类型定义、
              接口设计、泛型使用等方面的最佳实践，帮助团队提升代码质量。
            </JEllipsis>
          </div>
          <div class="article-footer">
            <span>作者：技术专家</span>
            <span>2024-01-10</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import JEllipsis from '@jetlinks/components'
</script>

<style scoped>
.article-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 500px;
}

.article-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
}

.article-content {
  display: flex;
  gap: 12px;
}

.article-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.article-info {
  flex: 1;
  min-width: 0;
}

.article-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.article-summary {
  margin-bottom: 8px;
  color: #666;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999;
  font-size: 14px;
}
</style>`
      }
    }
  }
};