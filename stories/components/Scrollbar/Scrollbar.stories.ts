import type { Meta, StoryObj } from '@storybook/vue3';
import JScrollbar from '../../../packages/components/src/Scrollbar/Scrollbar.vue';

/**
 * JScrollbar 自定义滚动条组件
 *
 * 这是一个自定义滚动条组件，提供美观的滚动条样式和更好的用户体验。
 * 支持垂直和水平滚动，可以替代浏览器原生滚动条。
 *
 * ## 何时使用
 * - 需要美观的滚动条样式时
 * - 需要更好的滚动体验时
 * - 需要统一的滚动条外观时
 * - 在容器中显示大量内容时
 */
const meta: Meta<typeof JScrollbar> = {
  title: '组件库/Scrollbar 滚动条',
  component: JScrollbar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
JScrollbar 是一个自定义滚动条组件，提供优雅的滚动体验。

### 主要特性
- 美观的自定义滚动条
- 支持垂直和水平滚动
- 响应式设计
- 支持高度和最大高度限制
- 支持原生滚动条模式
- 支持滚动事件监听

### 基本用法
\`\`\`vue
<template>
  <JScrollbar height="200">
    <!-- 你的内容 -->
  </JScrollbar>
</template>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    height: {
      control: 'number',
      description: '滚动条高度'
    },
    maxHeight: {
      control: 'number',
      description: '滚动条最大高度'
    },
    native: {
      control: 'boolean',
      description: '是否使用原生滚动条'
    },
    always: {
      control: 'boolean',
      description: '是否总是显示滚动条'
    },
    minSize: {
      control: 'number',
      description: '滚动条最小尺寸'
    }
  },
  args: {
    height: 200,
    native: false,
    always: false,
    minSize: 20
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基础滚动
 * 最基本的滚动容器
 */
export const 基础滚动: Story = {
  args: {
    height: 200
  },
  render: (args) => ({
    components: { JScrollbar },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 300px;">
        <JScrollbar v-bind="args">
          <div style="padding: 16px;">
            <p v-for="i in 20" :key="i" style="margin: 8px 0; line-height: 1.6;">
              第 {{ i }} 行内容 - 这是一段较长的文本内容，用于演示滚动条的基本功能。当内容超出容器高度时，会自动显示滚动条。
            </p>
          </div>
        </JScrollbar>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div style="width: 300px;">
    <JScrollbar :height="200">
      <div style="padding: 16px;">
        <p v-for="i in 20" :key="i" style="margin: 8px 0; line-height: 1.6;">
          第 {{ i }} 行内容 - 这是一段较长的文本内容，用于演示滚动条的基本功能。
        </p>
      </div>
    </JScrollbar>
  </div>
</template>

<script setup lang="ts">
import JScrollbar from '@jetlinks/components'
</script>`
      }
    }
  }
};

/**
 * 最大高度限制
 * 使用最大高度而不是固定高度
 */
export const 最大高度限制: Story = {
  render: () => ({
    components: { JScrollbar },
    template: `
      <div style="width: 400px; display: flex; gap: 20px;">
        <div style="flex: 1;">
          <h4 style="margin: 0 0 12px 0;">较少内容（不滚动）</h4>
          <JScrollbar :maxHeight="200" style="border: 1px solid #e8e8e8; border-radius: 4px;">
            <div style="padding: 16px;">
              <p v-for="i in 3" :key="i" style="margin: 8px 0; line-height: 1.6;">
                第 {{ i }} 行内容 - 内容较少时不会超过最大高度。
              </p>
            </div>
          </JScrollbar>
        </div>
        
        <div style="flex: 1;">
          <h4 style="margin: 0 0 12px 0;">较多内容（显示滚动条）</h4>
          <JScrollbar :maxHeight="200" style="border: 1px solid #e8e8e8; border-radius: 4px;">
            <div style="padding: 16px;">
              <p v-for="i in 15" :key="i" style="margin: 8px 0; line-height: 1.6;">
                第 {{ i }} 行内容 - 内容超过最大高度时会显示滚动条。
              </p>
            </div>
          </JScrollbar>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="max-height-demo">
    <div class="demo-section">
      <h4>较少内容（不滚动）</h4>
      <JScrollbar 
        :maxHeight="200" 
        style="border: 1px solid #e8e8e8; border-radius: 4px;"
      >
        <div style="padding: 16px;">
          <p v-for="i in 3" :key="i">
            第 {{ i }} 行内容 - 内容较少时不会超过最大高度。
          </p>
        </div>
      </JScrollbar>
    </div>
    
    <div class="demo-section">
      <h4>较多内容（显示滚动条）</h4>
      <JScrollbar 
        :maxHeight="200" 
        style="border: 1px solid #e8e8e8; border-radius: 4px;"
      >
        <div style="padding: 16px;">
          <p v-for="i in 15" :key="i">
            第 {{ i }} 行内容 - 内容超过最大高度时会显示滚动条。
          </p>
        </div>
      </JScrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import JScrollbar from '@jetlinks/components'
</script>

<style scoped>
.max-height-demo {
  width: 400px;
  display: flex;
  gap: 20px;
}

.demo-section {
  flex: 1;
}

.demo-section h4 {
  margin: 0 0 12px 0;
}

.demo-section p {
  margin: 8px 0;
  line-height: 1.6;
}
</style>`
      }
    }
  }
};

/**
 * 水平滚动
 * 展示水平方向的滚动
 */
export const 水平滚动: Story = {
  render: () => ({
    components: { JScrollbar },
    template: `
      <div style="width: 400px;">
        <JScrollbar :height="100" style="border: 1px solid #e8e8e8; border-radius: 4px;">
          <div style="width: 800px; padding: 16px; background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7);">
            <h3 style="margin: 0 0 12px 0; color: white;">这是一个很宽的内容区域</h3>
            <p style="margin: 0; color: white;">
              当内容宽度超过容器宽度时，会显示水平滚动条。这里的内容比容器宽，所以可以水平滚动查看完整内容。
            </p>
          </div>
        </JScrollbar>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div style="width: 400px;">
    <JScrollbar 
      :height="100" 
      style="border: 1px solid #e8e8e8; border-radius: 4px;"
    >
      <div style="width: 800px; padding: 16px; background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7);">
        <h3 style="color: white;">这是一个很宽的内容区域</h3>
        <p style="color: white;">
          当内容宽度超过容器宽度时，会显示水平滚动条。
        </p>
      </div>
    </JScrollbar>
  </div>
</template>

<script setup lang="ts">
import JScrollbar from '@jetlinks/components'
</script>`
      }
    }
  }
};

/**
 * 总是显示滚动条
 * 设置always属性使滚动条始终可见
 */
export const 总是显示滚动条: Story = {
  render: () => ({
    components: { JScrollbar },
    template: `
      <div style="width: 400px; display: flex; gap: 20px;">
        <div style="flex: 1;">
          <h4 style="margin: 0 0 12px 0;">默认（悬停显示）</h4>
          <JScrollbar :height="150" style="border: 1px solid #e8e8e8; border-radius: 4px;">
            <div style="padding: 16px;">
              <p v-for="i in 10" :key="i" style="margin: 8px 0;">
                第 {{ i }} 行内容
              </p>
            </div>
          </JScrollbar>
        </div>
        
        <div style="flex: 1;">
          <h4 style="margin: 0 0 12px 0;">总是显示</h4>
          <JScrollbar :height="150" :always="true" style="border: 1px solid #e8e8e8; border-radius: 4px;">
            <div style="padding: 16px;">
              <p v-for="i in 10" :key="i" style="margin: 8px 0;">
                第 {{ i }} 行内容
              </p>
            </div>
          </JScrollbar>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="always-show-demo">
    <div class="demo-section">
      <h4>默认（悬停显示）</h4>
      <JScrollbar 
        :height="150" 
        style="border: 1px solid #e8e8e8; border-radius: 4px;"
      >
        <div style="padding: 16px;">
          <p v-for="i in 10" :key="i">第 {{ i }} 行内容</p>
        </div>
      </JScrollbar>
    </div>
    
    <div class="demo-section">
      <h4>总是显示</h4>
      <JScrollbar 
        :height="150" 
        :always="true" 
        style="border: 1px solid #e8e8e8; border-radius: 4px;"
      >
        <div style="padding: 16px;">
          <p v-for="i in 10" :key="i">第 {{ i }} 行内容</p>
        </div>
      </JScrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import JScrollbar from '@jetlinks/components'
</script>

<style scoped>
.always-show-demo {
  width: 400px;
  display: flex;
  gap: 20px;
}

.demo-section {
  flex: 1;
}

.demo-section h4 {
  margin: 0 0 12px 0;
}

.demo-section p {
  margin: 8px 0;
}
</style>`
      }
    }
  }
};

/**
 * 原生滚动条对比
 * 对比自定义滚动条和原生滚动条
 */
export const 原生滚动条对比: Story = {
  render: () => ({
    components: { JScrollbar },
    template: `
      <div style="width: 500px; display: flex; gap: 20px;">
        <div style="flex: 1;">
          <h4 style="margin: 0 0 12px 0;">自定义滚动条</h4>
          <JScrollbar :height="200" style="border: 1px solid #e8e8e8; border-radius: 4px;">
            <div style="padding: 16px;">
              <p v-for="i in 15" :key="i" style="margin: 8px 0; line-height: 1.6;">
                第 {{ i }} 行内容 - 使用自定义滚动条，样式更美观统一。
              </p>
            </div>
          </JScrollbar>
        </div>
        
        <div style="flex: 1;">
          <h4 style="margin: 0 0 12px 0;">原生滚动条</h4>
          <JScrollbar :height="200" :native="true" style="border: 1px solid #e8e8e8; border-radius: 4px;">
            <div style="padding: 16px;">
              <p v-for="i in 15" :key="i" style="margin: 8px 0; line-height: 1.6;">
                第 {{ i }} 行内容 - 使用浏览器原生滚动条，性能更好。
              </p>
            </div>
          </JScrollbar>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="native-comparison">
    <div class="demo-section">
      <h4>自定义滚动条</h4>
      <JScrollbar 
        :height="200" 
        style="border: 1px solid #e8e8e8; border-radius: 4px;"
      >
        <div style="padding: 16px;">
          <p v-for="i in 15" :key="i">
            第 {{ i }} 行内容 - 使用自定义滚动条，样式更美观统一。
          </p>
        </div>
      </JScrollbar>
    </div>
    
    <div class="demo-section">
      <h4>原生滚动条</h4>
      <JScrollbar 
        :height="200" 
        :native="true" 
        style="border: 1px solid #e8e8e8; border-radius: 4px;"
      >
        <div style="padding: 16px;">
          <p v-for="i in 15" :key="i">
            第 {{ i }} 行内容 - 使用浏览器原生滚动条，性能更好。
          </p>
        </div>
      </JScrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import JScrollbar from '@jetlinks/components'
</script>

<style scoped>
.native-comparison {
  width: 500px;
  display: flex;
  gap: 20px;
}

.demo-section {
  flex: 1;
}

.demo-section h4 {
  margin: 0 0 12px 0;
}

.demo-section p {
  margin: 8px 0;
  line-height: 1.6;
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
    components: { JScrollbar },
    template: `
      <div style="max-width: 800px; display: flex; flex-direction: column; gap: 24px;">
        <!-- 聊天消息框 -->
        <div style="border: 1px solid #e8e8e8; border-radius: 8px; overflow: hidden;">
          <div style="padding: 16px; background: #fafafa; border-bottom: 1px solid #e8e8e8;">
            <h3 style="margin: 0; font-size: 16px;">聊天消息</h3>
          </div>
          <JScrollbar :height="250" :always="true">
            <div style="padding: 16px;">
              <div 
                v-for="i in 20" 
                :key="i" 
                style="display: flex; margin-bottom: 12px;"
                :style="{ justifyContent: i % 3 === 0 ? 'flex-end' : 'flex-start' }"
              >
                <div 
                  style="max-width: 70%; padding: 8px 12px; border-radius: 12px;"
                  :style="{ 
                    backgroundColor: i % 3 === 0 ? '#1890ff' : '#f0f0f0',
                    color: i % 3 === 0 ? 'white' : '#333'
                  }"
                >
                  这是第 {{ i }} 条消息，展示聊天界面中的滚动效果。
                </div>
              </div>
            </div>
          </JScrollbar>
        </div>

        <!-- 代码编辑器 -->
        <div style="border: 1px solid #e8e8e8; border-radius: 8px; overflow: hidden;">
          <div style="padding: 12px 16px; background: #2d2d2d; color: #fff; display: flex; align-items: center; gap: 8px;">
            <span style="width: 12px; height: 12px; background: #ff5f57; border-radius: 50%;"></span>
            <span style="width: 12px; height: 12px; background: #ffbd2e; border-radius: 50%;"></span>
            <span style="width: 12px; height: 12px; background: #28ca42; border-radius: 50%;"></span>
            <span style="margin-left: 12px; font-size: 14px;">example.js</span>
          </div>
          <JScrollbar :height="200">
            <div style="background: #1e1e1e; color: #d4d4d4; font-family: 'Consolas', monospace; font-size: 14px; line-height: 1.6;">
              <div style="padding: 16px;">
                <div><span style="color: #569cd6;">function</span> <span style="color: #dcdcaa;">example</span>() {</div>
                <div style="margin-left: 20px;"><span style="color: #9cdcfe;">console</span>.<span style="color: #dcdcaa;">log</span>(<span style="color: #ce9178;">'Hello World'</span>);</div>
                <div style="margin-left: 20px;"><span style="color: #c586c0;">const</span> <span style="color: #9cdcfe;">data</span> = {</div>
                <div style="margin-left: 40px;"><span style="color: #9cdcfe;">name</span>: <span style="color: #ce9178;">'JScrollbar'</span>,</div>
                <div style="margin-left: 40px;"><span style="color: #9cdcfe;">version</span>: <span style="color: #ce9178;">'1.0.0'</span>,</div>
                <div style="margin-left: 40px;"><span style="color: #9cdcfe;">description</span>: <span style="color: #ce9178;">'自定义滚动条组件'</span></div>
                <div style="margin-left: 20px;">};</div>
                <div style="margin-left: 20px;"><span style="color: #c586c0;">return</span> <span style="color: #9cdcfe;">data</span>;</div>
                <div v-for="i in 15" :key="i" style="margin-left: 20px;">
                  <span style="color: #6a9955;">// 第 {{ i }} 行注释</span>
                </div>
                <div>}</div>
              </div>
            </div>
          </JScrollbar>
        </div>

        <!-- 数据表格 -->
        <div style="border: 1px solid #e8e8e8; border-radius: 8px; overflow: hidden;">
          <div style="padding: 16px; background: #fafafa; border-bottom: 1px solid #e8e8e8;">
            <h3 style="margin: 0; font-size: 16px;">用户列表</h3>
          </div>
          <JScrollbar :maxHeight="300">
            <table style="width: 100%; border-collapse: collapse;">
              <thead style="background: #f9f9f9;">
                <tr>
                  <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e8e8e8;">ID</th>
                  <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e8e8e8;">用户名</th>
                  <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e8e8e8;">邮箱</th>
                  <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e8e8e8;">状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in 50" :key="i" style="border-bottom: 1px solid #f0f0f0;">
                  <td style="padding: 12px;">{{ i }}</td>
                  <td style="padding: 12px;">用户{{ i }}</td>
                  <td style="padding: 12px;">user{{ i }}@example.com</td>
                  <td style="padding: 12px;">
                    <span 
                      style="padding: 2px 6px; border-radius: 3px; font-size: 12px;"
                      :style="{ 
                        backgroundColor: i % 3 === 0 ? '#f6ffed' : '#fff2e8',
                        color: i % 3 === 0 ? '#52c41a' : '#fa8c16',
                        border: i % 3 === 0 ? '1px solid #b7eb8f' : '1px solid #ffd591'
                      }"
                    >
                      {{ i % 3 === 0 ? '在线' : '离线' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </JScrollbar>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="application-demo">
    <!-- 聊天消息框 -->
    <div class="chat-container">
      <div class="chat-header">
        <h3>聊天消息</h3>
      </div>
      <JScrollbar :height="250" :always="true">
        <div class="chat-content">
          <div 
            v-for="i in 20" 
            :key="i" 
            class="message"
            :class="{ 'message-right': i % 3 === 0 }"
          >
            <div class="message-bubble" :class="{ 'own-message': i % 3 === 0 }">
              这是第 {{ i }} 条消息，展示聊天界面中的滚动效果。
            </div>
          </div>
        </div>
      </JScrollbar>
    </div>

    <!-- 代码编辑器 -->
    <div class="editor-container">
      <div class="editor-header">
        <span class="editor-dot red"></span>
        <span class="editor-dot yellow"></span>
        <span class="editor-dot green"></span>
        <span class="editor-title">example.js</span>
      </div>
      <JScrollbar :height="200">
        <div class="code-content">
          <!-- 代码内容 -->
          <div class="code-line">
            <span class="keyword">function</span> 
            <span class="function-name">example</span>() {
          </div>
          <!-- 更多代码行... -->
        </div>
      </JScrollbar>
    </div>

    <!-- 数据表格 -->
    <div class="table-container">
      <div class="table-header">
        <h3>用户列表</h3>
      </div>
      <JScrollbar :maxHeight="300">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>用户名</th>
              <th>邮箱</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 50" :key="i">
              <td>{{ i }}</td>
              <td>用户{{ i }}</td>
              <td>user{{ i }}@example.com</td>
              <td>
                <span class="status" :class="i % 3 === 0 ? 'online' : 'offline'">
                  {{ i % 3 === 0 ? '在线' : '离线' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </JScrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import JScrollbar from '@jetlinks/components'
</script>

<style scoped>
.application-demo {
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.chat-container,
.editor-container,
.table-container {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.chat-header,
.table-header {
  padding: 16px;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
}

.chat-header h3,
.table-header h3 {
  margin: 0;
  font-size: 16px;
}

.chat-content {
  padding: 16px;
}

.message {
  display: flex;
  margin-bottom: 12px;
}

.message-right {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 12px;
  background: #f0f0f0;
  color: #333;
}

.own-message {
  background: #1890ff;
  color: white;
}

.editor-header {
  padding: 12px 16px;
  background: #2d2d2d;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.editor-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.editor-dot.red {
  background: #ff5f57;
}

.editor-dot.yellow {
  background: #ffbd2e;
}

.editor-dot.green {
  background: #28ca42;
}

.editor-title {
  margin-left: 12px;
  font-size: 14px;
}

.code-content {
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
  padding: 16px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #f9f9f9;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e8e8e8;
}

.data-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
}

.status {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.status.online {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status.offline {
  background: #fff2e8;
  color: #fa8c16;
  border: 1px solid #ffd591;
}
</style>`
      }
    }
  }
};
