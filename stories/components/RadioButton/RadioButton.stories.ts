import type { Meta, StoryObj } from '@storybook/vue3';
import JRadioButton from '../../../packages/components/src/RadioButton/RadioButton.vue';

/**
 * RadioButton 单选按钮组件
 *
 * 这是一个按钮样式的单选组件，类似于单选框但具有更好的视觉效果。
 * 支持网格布局和自定义列数，适用于单选场景且需要良好视觉效果的情况。
 *
 * ## 何时使用
 * - 需要从多个选项中选择一个时
 * - 希望提供比单选框更好的视觉体验时
 * - 选项数量较少且需要网格排列时
 * - 需要自定义列数布局时
 */
const meta: Meta<typeof JRadioButton> = {
  title: '组件库/RadioButton 单选按钮',
  component: JRadioButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
RadioButton 是一个按钮样式的单选组件，提供比传统单选框更好的视觉效果。

### 主要特性
- 按钮样式的单选器
- 支持网格布局
- 支持自定义列数
- 内置样式主题
- 响应式设计

### 基本用法
\`\`\`vue
<template>
  <JRadioButton :options="options" v-model:value="selectedValue" />
</template>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: 'object',
      description: '选项数组，包含 value、label 字段'
    },
    value: {
      control: 'text',
      description: '选中的值'
    },
    columns: {
      control: 'number',
      description: '网格列数，默认为3'
    }
  },
  args: {
    options: [
      { value: 'option1', label: '选项1' },
      { value: 'option2', label: '选项2' },
      { value: 'option3', label: '选项3' }
    ],
    columns: 3
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基础单选
 * 默认的单选按钮，3列网格布局
 */
export const 基础单选: Story = {
  args: {
    options: [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'python', label: 'Python' },
      { value: 'java', label: 'Java' },
      { value: 'golang', label: 'Go' },
      { value: 'rust', label: 'Rust' }
    ],
    value: 'javascript',
    columns: 3
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JRadioButton 
    :options="options" 
    v-model:value="selectedValue"
    :columns="3"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JRadioButton from '@jetlinks/components'

const selectedValue = ref('javascript')

const options = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'golang', label: 'Go' },
  { value: 'rust', label: 'Rust' }
]
</script>`
      }
    }
  }
};

/**
 * 单列布局
 * 设置为1列，垂直排列
 */
export const 单列布局: Story = {
  args: {
    options: [
      { value: 'beginner', label: '初学者 - 刚开始学习编程' },
      { value: 'intermediate', label: '中级 - 有一定编程基础' },
      { value: 'advanced', label: '高级 - 有丰富编程经验' },
      { value: 'expert', label: '专家 - 精通多种技术栈' }
    ],
    value: 'intermediate',
    columns: 1
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JRadioButton 
    :options="options" 
    v-model:value="selectedLevel"
    :columns="1"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JRadioButton from '@jetlinks/components'

const selectedLevel = ref('intermediate')

const options = [
  { value: 'beginner', label: '初学者 - 刚开始学习编程' },
  { value: 'intermediate', label: '中级 - 有一定编程基础' },
  { value: 'advanced', label: '高级 - 有丰富编程经验' },
  { value: 'expert', label: '专家 - 精通多种技术栈' }
]
</script>`
      }
    }
  }
};

/**
 * 双列布局
 * 设置为2列，适合较少选项
 */
export const 双列布局: Story = {
  args: {
    options: [
      { value: 'frontend', label: '前端开发' },
      { value: 'backend', label: '后端开发' },
      { value: 'fullstack', label: '全栈开发' },
      { value: 'mobile', label: '移动开发' }
    ],
    value: 'fullstack',
    columns: 2
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JRadioButton 
    :options="options" 
    v-model:value="selectedRole"
    :columns="2"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JRadioButton from '@jetlinks/components'

const selectedRole = ref('fullstack')

const options = [
  { value: 'frontend', label: '前端开发' },
  { value: 'backend', label: '后端开发' },
  { value: 'fullstack', label: '全栈开发' },
  { value: 'mobile', label: '移动开发' }
]
</script>`
      }
    }
  }
};

/**
 * 多列布局对比
 * 展示不同列数的布局效果
 */
export const 多列布局对比: Story = {
  render: () => ({
    components: { JRadioButton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; width: 500px;">
        <div>
          <h4 style="margin: 0 0 12px 0;">1列布局</h4>
          <JRadioButton 
            :options="options" 
            v-model:value="value1"
            :columns="1"
          />
        </div>
        
        <div>
          <h4 style="margin: 0 0 12px 0;">2列布局</h4>
          <JRadioButton 
            :options="options" 
            v-model:value="value2"
            :columns="2"
          />
        </div>
        
        <div>
          <h4 style="margin: 0 0 12px 0;">3列布局</h4>
          <JRadioButton 
            :options="options" 
            v-model:value="value3"
            :columns="3"
          />
        </div>
        
        <div>
          <h4 style="margin: 0 0 12px 0;">4列布局</h4>
          <JRadioButton 
            :options="options" 
            v-model:value="value4"
            :columns="4"
          />
        </div>
      </div>
    `,
    data() {
      return {
        value1: 'option1',
        value2: 'option2',
        value3: 'option3',
        value4: 'option4',
        options: [
          { value: 'option1', label: '选项1' },
          { value: 'option2', label: '选项2' },
          { value: 'option3', label: '选项3' },
          { value: 'option4', label: '选项4' },
          { value: 'option5', label: '选项5' },
          { value: 'option6', label: '选项6' }
        ]
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="layout-comparison">
    <div class="layout-section">
      <h4>1列布局</h4>
      <JRadioButton 
        :options="options" 
        v-model:value="value1"
        :columns="1"
      />
    </div>
    
    <div class="layout-section">
      <h4>2列布局</h4>
      <JRadioButton 
        :options="options" 
        v-model:value="value2"
        :columns="2"
      />
    </div>
    
    <div class="layout-section">
      <h4>3列布局</h4>
      <JRadioButton 
        :options="options" 
        v-model:value="value3"
        :columns="3"
      />
    </div>
    
    <div class="layout-section">
      <h4>4列布局</h4>
      <JRadioButton 
        :options="options" 
        v-model:value="value4"
        :columns="4"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JRadioButton from '@jetlinks/components'

const value1 = ref('option1')
const value2 = ref('option2')
const value3 = ref('option3')
const value4 = ref('option4')

const options = [
  { value: 'option1', label: '选项1' },
  { value: 'option2', label: '选项2' },
  { value: 'option3', label: '选项3' },
  { value: 'option4', label: '选项4' },
  { value: 'option5', label: '选项5' },
  { value: 'option6', label: '选项6' }
]
</script>

<style scoped>
.layout-comparison {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 500px;
}

.layout-section h4 {
  margin: 0 0 12px 0;
}
</style>`
      }
    }
  }
};

/**
 * 实际应用场景
 * 在表单和配置中的应用示例
 */
export const 实际应用场景: Story = {
  render: () => ({
    components: { JRadioButton },
    template: `
      <div style="min-width: 600px; display: flex; flex-direction: column; gap: 24px;">
        <!-- 主题选择 -->
        <div style="padding: 16px; border: 1px solid #e8e8e8; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0;">界面主题</h3>
          <JRadioButton 
            :options="themeOptions" 
            v-model:value="selectedTheme"
            :columns="3"
          />
          <div style="margin-top: 12px; font-size: 14px; color: #666;">
            当前主题: {{ getThemeText(selectedTheme) }}
          </div>
        </div>

        <!-- 通知频率 -->
        <div style="padding: 16px; border: 1px solid #e8e8e8; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0;">通知频率设置</h3>
          <JRadioButton 
            :options="notificationOptions" 
            v-model:value="selectedFrequency"
            :columns="1"
          />
          <div style="margin-top: 12px; font-size: 14px; color: #666;">
            {{ getFrequencyDescription(selectedFrequency) }}
          </div>
        </div>

        <!-- 数据展示方式 -->
        <div style="padding: 16px; border: 1px solid #e8e8e8; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0;">数据展示方式</h3>
          <JRadioButton 
            :options="displayOptions" 
            v-model:value="selectedDisplay"
            :columns="2"
          />
          <div style="margin-top: 12px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
            <div style="font-size: 14px; font-weight: 500; margin-bottom: 4px;">预览效果:</div>
            <div style="font-size: 14px; color: #666;">
              {{ getDisplayPreview(selectedDisplay) }}
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        selectedTheme: 'light',
        selectedFrequency: 'daily',
        selectedDisplay: 'table',
        themeOptions: [
          { value: 'light', label: '浅色' },
          { value: 'dark', label: '深色' },
          { value: 'auto', label: '跟随系统' }
        ],
        notificationOptions: [
          { value: 'realtime', label: '实时通知 - 立即接收所有通知' },
          { value: 'hourly', label: '每小时汇总 - 每小时汇总一次' },
          { value: 'daily', label: '每日摘要 - 每天发送一次摘要' },
          { value: 'weekly', label: '每周报告 - 每周发送汇总报告' },
          { value: 'never', label: '关闭通知 - 不接收任何通知' }
        ],
        displayOptions: [
          { value: 'table', label: '表格视图' },
          { value: 'card', label: '卡片视图' },
          { value: 'list', label: '列表视图' },
          { value: 'grid', label: '网格视图' }
        ]
      }
    },
    methods: {
      getThemeText(theme) {
        const themeMap = {
          light: '浅色主题',
          dark: '深色主题',
          auto: '自动切换'
        }
        return themeMap[theme] || theme
      },
      getFrequencyDescription(frequency) {
        const descriptions = {
          realtime: '您将立即收到所有通知消息',
          hourly: '通知将每小时汇总发送一次',
          daily: '每天晚上8点发送当日摘要',
          weekly: '每周一上午发送上周汇总',
          never: '已关闭所有通知消息'
        }
        return descriptions[frequency] || ''
      },
      getDisplayPreview(display) {
        const previews = {
          table: '数据以行列形式展示，便于查看详细信息',
          card: '数据以卡片形式展示，视觉效果更好',
          list: '数据以列表形式展示，简洁明了',
          grid: '数据以网格形式展示，适合图像内容'
        }
        return previews[display] || ''
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="settings-demo">
    <!-- 主题选择 -->
    <div class="setting-section">
      <h3>界面主题</h3>
      <JRadioButton 
        :options="themeOptions" 
        v-model:value="selectedTheme"
        :columns="3"
      />
      <div class="setting-info">
        当前主题: {{ getThemeText(selectedTheme) }}
      </div>
    </div>

    <!-- 通知频率 -->
    <div class="setting-section">
      <h3>通知频率设置</h3>
      <JRadioButton 
        :options="notificationOptions" 
        v-model:value="selectedFrequency"
        :columns="1"
      />
      <div class="setting-info">
        {{ getFrequencyDescription(selectedFrequency) }}
      </div>
    </div>

    <!-- 数据展示方式 -->
    <div class="setting-section">
      <h3>数据展示方式</h3>
      <JRadioButton 
        :options="displayOptions" 
        v-model:value="selectedDisplay"
        :columns="2"
      />
      <div class="preview-box">
        <div class="preview-title">预览效果:</div>
        <div class="preview-content">
          {{ getDisplayPreview(selectedDisplay) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JRadioButton from '@jetlinks/components'

const selectedTheme = ref('light')
const selectedFrequency = ref('daily')
const selectedDisplay = ref('table')

const themeOptions = [
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
  { value: 'auto', label: '跟随系统' }
]

const notificationOptions = [
  { value: 'realtime', label: '实时通知 - 立即接收所有通知' },
  { value: 'hourly', label: '每小时汇总 - 每小时汇总一次' },
  { value: 'daily', label: '每日摘要 - 每天发送一次摘要' },
  { value: 'weekly', label: '每周报告 - 每周发送汇总报告' },
  { value: 'never', label: '关闭通知 - 不接收任何通知' }
]

const displayOptions = [
  { value: 'table', label: '表格视图' },
  { value: 'card', label: '卡片视图' },
  { value: 'list', label: '列表视图' },
  { value: 'grid', label: '网格视图' }
]

const getThemeText = (theme: string) => {
  const themeMap = {
    light: '浅色主题',
    dark: '深色主题',
    auto: '自动切换'
  }
  return themeMap[theme] || theme
}

const getFrequencyDescription = (frequency: string) => {
  const descriptions = {
    realtime: '您将立即收到所有通知消息',
    hourly: '通知将每小时汇总发送一次',
    daily: '每天晚上8点发送当日摘要',
    weekly: '每周一上午发送上周汇总',
    never: '已关闭所有通知消息'
  }
  return descriptions[frequency] || ''
}

const getDisplayPreview = (display: string) => {
  const previews = {
    table: '数据以行列形式展示，便于查看详细信息',
    card: '数据以卡片形式展示，视觉效果更好',
    list: '数据以列表形式展示，简洁明了',
    grid: '数据以网格形式展示，适合图像内容'
  }
  return previews[display] || ''
}
</script>

<style scoped>
.settings-demo {
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.setting-section {
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.setting-section h3 {
  margin: 0 0 16px 0;
}

.setting-info {
  margin-top: 12px;
  font-size: 14px;
  color: #666;
}

.preview-box {
  margin-top: 12px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
}

.preview-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.preview-content {
  font-size: 14px;
  color: #666;
}
</style>`
      }
    }
  }
};
