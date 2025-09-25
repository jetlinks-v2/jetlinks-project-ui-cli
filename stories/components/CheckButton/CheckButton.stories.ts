import type { Meta, StoryObj } from '@storybook/vue3';
import JCheckButton from '../../../packages/components/src/CheckButton/CheckButton.vue';

/**
 * CheckButton 多选按钮组件
 * 
 * 这是一个按钮样式的多选组件，类似于复选框但具有更好的视觉效果。
 * 支持单选和多选模式，适用于选项较少且需要良好视觉效果的场景。
 * 
 * ## 何时使用
 * - 需要从多个选项中选择一个或多个时
 * - 希望提供比复选框更好的视觉体验时
 * - 选项数量较少（通常不超过8个）时
 * - 需要水平排列选项时
 */
const meta: Meta<typeof JCheckButton> = {
  title: '组件库/CheckButton 多选按钮',
  component: JCheckButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
CheckButton 是一个按钮样式的选择组件，提供比传统复选框更好的视觉效果。

### 主要特性
- 支持单选和多选模式
- 按钮样式的选择器
- 支持禁用状态
- 支持自定义样式
- 响应式设计

### 基本用法
\`\`\`vue
<template>
  <JCheckButton :options="options" v-model:value="selectedValue" />
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
      description: '选项数组，包含 value、label、disabled 字段'
    },
    value: {
      control: 'text',
      description: '选中的值，单选时为字符串，多选时为数组'
    },
    multiple: {
      control: 'boolean',
      description: '是否支持多选'
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用所有选项'
    }
  },
  args: {
    options: [
      { value: 'option1', label: '选项1' },
      { value: 'option2', label: '选项2' },
      { value: 'option3', label: '选项3' }
    ],
    multiple: false
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 单选模式
 * 默认的单选模式，只能选择一个选项
 */
export const 单选模式: Story = {
  args: {
    options: [
      { value: 'frontend', label: '前端开发' },
      { value: 'backend', label: '后端开发' },
      { value: 'fullstack', label: '全栈开发' },
      { value: 'mobile', label: '移动开发' }
    ],
    value: 'frontend',
    multiple: false
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JCheckButton 
    :options="options" 
    v-model:value="selectedValue"
    :multiple="false"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JCheckButton from '@jetlinks/components'

const selectedValue = ref('frontend')

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
 * 多选模式
 * 支持选择多个选项
 */
export const 多选模式: Story = {
  args: {
    options: [
      { value: 'vue', label: 'Vue.js' },
      { value: 'react', label: 'React' },
      { value: 'angular', label: 'Angular' },
      { value: 'svelte', label: 'Svelte' }
    ],
    value: ['vue', 'react'],
    multiple: true
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JCheckButton 
    :options="options" 
    v-model:value="selectedValues"
    :multiple="true"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JCheckButton from '@jetlinks/components'

const selectedValues = ref(['vue', 'react'])

const options = [
  { value: 'vue', label: 'Vue.js' },
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' }
]
</script>`
      }
    }
  }
};

/**
 * 禁用状态
 * 部分选项禁用和全部禁用的效果
 */
export const 禁用状态: Story = {
  render: () => ({
    components: { JCheckButton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <h4 style="margin: 0 0 8px 0;">部分选项禁用</h4>
          <JCheckButton 
            :options="partialDisabledOptions" 
            v-model:value="value1"
            :multiple="true"
          />
        </div>
        
        <div>
          <h4 style="margin: 0 0 8px 0;">全部禁用</h4>
          <JCheckButton 
            :options="normalOptions" 
            v-model:value="value2"
            :disabled="true"
            :multiple="true"
          />
        </div>
      </div>
    `,
    data() {
      return {
        value1: ['html'],
        value2: ['js'],
        partialDisabledOptions: [
          { value: 'html', label: 'HTML' },
          { value: 'css', label: 'CSS', disabled: true },
          { value: 'js', label: 'JavaScript' },
          { value: 'ts', label: 'TypeScript', disabled: true }
        ],
        normalOptions: [
          { value: 'vue', label: 'Vue' },
          { value: 'react', label: 'React' },
          { value: 'angular', label: 'Angular' }
        ]
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="disabled-demo">
    <div class="demo-section">
      <h4>部分选项禁用</h4>
      <JCheckButton 
        :options="partialDisabledOptions" 
        v-model:value="value1"
        :multiple="true"
      />
    </div>
    
    <div class="demo-section">
      <h4>全部禁用</h4>
      <JCheckButton 
        :options="normalOptions" 
        v-model:value="value2"
        :disabled="true"
        :multiple="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JCheckButton from '@jetlinks/components'

const value1 = ref(['html'])
const value2 = ref(['js'])

const partialDisabledOptions = [
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS', disabled: true },
  { value: 'js', label: 'JavaScript' },
  { value: 'ts', label: 'TypeScript', disabled: true }
]

const normalOptions = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular' }
]
</script>

<style scoped>
.disabled-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-section h4 {
  margin: 0 0 8px 0;
}
</style>`
      }
    }
  }
};

/**
 * 实际应用场景
 * 在筛选和配置中的应用示例
 */
export const 实际应用场景: Story = {
  render: () => ({
    components: { JCheckButton },
    template: `
      <div style="max-width: 600px; display: flex; flex-direction: column; gap: 24px;">
        <!-- 文章筛选 -->
        <div style="padding: 16px; border: 1px solid #e8e8e8; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0;">文章类型筛选</h3>
          <JCheckButton 
            :options="articleTypes" 
            v-model:value="selectedTypes"
            :multiple="true"
            style="margin-bottom: 12px;"
          />
          <div style="font-size: 14px; color: #666;">
            已选择: {{ selectedTypesText }}
          </div>
        </div>

        <!-- 难度选择 -->
        <div style="padding: 16px; border: 1px solid #e8e8e8; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0;">学习难度</h3>
          <JCheckButton 
            :options="difficultyLevels" 
            v-model:value="selectedDifficulty"
            :multiple="false"
          />
          <div style="font-size: 14px; color: #666;">
            当前难度: {{ getDifficultyText(selectedDifficulty) }}
          </div>
        </div>

        <!-- 权限配置 -->
        <div style="padding: 16px; border: 1px solid #e8e8e8; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0;">用户权限配置</h3>
          <JCheckButton 
            :options="permissions" 
            v-model:value="selectedPermissions"
            :multiple="true"
          />
          <div style="margin-top: 12px; font-size: 14px; color: #666;">
            已授权: {{ selectedPermissions.length }} 项权限
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        selectedTypes: ['tutorial', 'news'],
        selectedDifficulty: 'intermediate',
        selectedPermissions: ['read', 'write'],
        articleTypes: [
          { value: 'tutorial', label: '教程' },
          { value: 'news', label: '资讯' },
          { value: 'blog', label: '博客' },
          { value: 'docs', label: '文档' }
        ],
        difficultyLevels: [
          { value: 'beginner', label: '初级' },
          { value: 'intermediate', label: '中级' },
          { value: 'advanced', label: '高级' },
          { value: 'expert', label: '专家级' }
        ],
        permissions: [
          { value: 'read', label: '查看' },
          { value: 'write', label: '编辑' },
          { value: 'delete', label: '删除' },
          { value: 'admin', label: '管理', disabled: true }
        ]
      }
    },
    computed: {
      selectedTypesText() {
        if (this.selectedTypes.length === 0) return '无'
        const typeMap = {
          tutorial: '教程',
          news: '资讯', 
          blog: '博客',
          docs: '文档'
        }
        return this.selectedTypes.map(type => typeMap[type]).join(', ')
      }
    },
    methods: {
      getDifficultyText(difficulty) {
        const difficultyMap = {
          beginner: '初级',
          intermediate: '中级',
          advanced: '高级',
          expert: '专家级'
        }
        return difficultyMap[difficulty] || '未选择'
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="application-demo">
    <!-- 文章筛选 -->
    <div class="filter-section">
      <h3>文章类型筛选</h3>
      <JCheckButton 
        :options="articleTypes" 
        v-model:value="selectedTypes"
        :multiple="true"
      />
      <div class="selected-info">
        已选择: {{ selectedTypesText }}
      </div>
    </div>

    <!-- 难度选择 -->
    <div class="filter-section">
      <h3>学习难度</h3>
      <JCheckButton 
        :options="difficultyLevels" 
        v-model:value="selectedDifficulty"
        :multiple="false"
      />
      <div class="selected-info">
        当前难度: {{ getDifficultyText(selectedDifficulty) }}
      </div>
    </div>

    <!-- 权限配置 -->
    <div class="filter-section">
      <h3>用户权限配置</h3>
      <JCheckButton 
        :options="permissions" 
        v-model:value="selectedPermissions"
        :multiple="true"
      />
      <div class="selected-info">
        已授权: {{ selectedPermissions.length }} 项权限
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import JCheckButton from '@jetlinks/components'

const selectedTypes = ref(['tutorial', 'news'])
const selectedDifficulty = ref('intermediate')
const selectedPermissions = ref(['read', 'write'])

const articleTypes = [
  { value: 'tutorial', label: '教程' },
  { value: 'news', label: '资讯' },
  { value: 'blog', label: '博客' },
  { value: 'docs', label: '文档' }
]

const difficultyLevels = [
  { value: 'beginner', label: '初级' },
  { value: 'intermediate', label: '中级' },
  { value: 'advanced', label: '高级' },
  { value: 'expert', label: '专家级' }
]

const permissions = [
  { value: 'read', label: '查看' },
  { value: 'write', label: '编辑' },
  { value: 'delete', label: '删除' },
  { value: 'admin', label: '管理', disabled: true }
]

const selectedTypesText = computed(() => {
  if (selectedTypes.value.length === 0) return '无'
  const typeMap = {
    tutorial: '教程',
    news: '资讯', 
    blog: '博客',
    docs: '文档'
  }
  return selectedTypes.value.map(type => typeMap[type]).join(', ')
})

const getDifficultyText = (difficulty: string) => {
  const difficultyMap = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
    expert: '专家级'
  }
  return difficultyMap[difficulty] || '未选择'
}
</script>

<style scoped>
.application-demo {
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.filter-section {
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.filter-section h3 {
  margin: 0 0 16px 0;
}

.selected-info {
  margin-top: 12px;
  font-size: 14px;
  color: #666;
}
</style>`
      }
    }
  }
};