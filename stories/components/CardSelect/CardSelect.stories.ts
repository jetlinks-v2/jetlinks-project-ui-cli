import type { Meta, StoryObj } from '@storybook/vue3';
import JCardSelect from '../../../packages/components/src/CardSelect/CardSelect.vue';

/**
 * CardSelect 卡片选择组件
 * 
 * 这是一个用于多选项选择的卡片组件，支持单选和多选模式。
 * 适用于需要从多个选项中进行选择的场景，提供了比传统单选框/多选框更直观的视觉效果。
 * 
 * ## 何时使用
 * - 需要从多个选项中选择一个或多个
 * - 选项内容相对复杂，需要标题和描述
 * - 希望提供更好的视觉体验和交互效果
 * - 替代传统的 Radio Group 或 Checkbox Group
 */
const meta: Meta<typeof JCardSelect> = {
  title: '组件库/CardSelect 卡片选择',
  component: JCardSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
CardSelect 是一个卡片选择组件，用于选择一个或多个选项。

### 主要特性
- 支持单选和多选模式
- 支持水平和垂直布局
- 可自定义列数（水平布局时）
- 支持禁用状态
- 支持自定义渲染内容
- 响应式设计

### 基本用法
\`\`\`vue
<template>
  <JCardSelect :options="options" v-model:value="selectedValue" />
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
      description: '选项数据，包含 value、label、describe 等字段'
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
      description: '是否禁用'
    },
    layout: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: '布局方式'
    },
    column: {
      control: 'number',
      description: '水平布局时的列数'
    },
    itemLayout: {
      control: 'select', 
      options: ['horizontal', 'vertical'],
      description: '卡片内部布局方式'
    },
    onSelect: { action: 'select' },
    onChange: { action: 'change' },
    'onUpdate:value': { action: 'update:value' }
  },
  args: {
    options: [
      { value: 'option1', label: '选项1', describe: '这是选项1的描述' },
      { value: 'option2', label: '选项2', describe: '这是选项2的描述' },
      { value: 'option3', label: '选项3', describe: '这是选项3的描述' }
    ],
    multiple: false,
    disabled: false,
    layout: 'horizontal',
    column: 3
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基础单选
 * 最基本的用法，从多个选项中选择一个
 */
export const 基础单选: Story = {
  args: {
    options: [
      { value: 'basic', label: '基础版', describe: '包含基本功能，适合个人使用' },
      { value: 'pro', label: '专业版', describe: '包含高级功能，适合团队使用' },
      { value: 'enterprise', label: '企业版', describe: '包含所有功能，适合大型企业' }
    ],
    value: 'basic',
    multiple: false
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JCardSelect 
    :options="options" 
    v-model:value="selectedValue" 
    :multiple="false"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JCardSelect from '@jetlinks/components'

const selectedValue = ref('basic')

const options = [
  { value: 'basic', label: '基础版', describe: '包含基本功能，适合个人使用' },
  { value: 'pro', label: '专业版', describe: '包含高级功能，适合团队使用' },
  { value: 'enterprise', label: '企业版', describe: '包含所有功能，适合大型企业' }
]
</script>`
      }
    }
  }
};

/**
 * 多选模式
 * 支持同时选择多个选项
 */
export const 多选模式: Story = {
  args: {
    options: [
      { value: 'feature1', label: '功能模块A', describe: '数据分析和报表功能' },
      { value: 'feature2', label: '功能模块B', describe: '用户管理和权限控制' },
      { value: 'feature3', label: '功能模块C', describe: '消息通知和提醒' },
      { value: 'feature4', label: '功能模块D', describe: '文件存储和管理' }
    ],
    value: ['feature1', 'feature3'],
    multiple: true,
    column: 2
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JCardSelect 
    :options="options" 
    v-model:value="selectedValues" 
    :multiple="true"
    :column="2"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JCardSelect from '@jetlinks/components'

const selectedValues = ref(['feature1', 'feature3'])

const options = [
  { value: 'feature1', label: '功能模块A', describe: '数据分析和报表功能' },
  { value: 'feature2', label: '功能模块B', describe: '用户管理和权限控制' },
  { value: 'feature3', label: '功能模块C', describe: '消息通知和提醒' },
  { value: 'feature4', label: '功能模块D', describe: '文件存储和管理' }
]
</script>`
      }
    }
  }
};

/**
 * 垂直布局
 * 选项卡片垂直排列显示
 */
export const 垂直布局: Story = {
  args: {
    options: [
      { value: 'plan1', label: '月度计划', describe: '每月支付，灵活方便' },
      { value: 'plan2', label: '季度计划', describe: '每季度支付，享受9折优惠' },
      { value: 'plan3', label: '年度计划', describe: '每年支付，享受8折优惠' }
    ],
    value: 'plan2',
    layout: 'vertical',
    multiple: false
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JCardSelect 
    :options="options" 
    v-model:value="selectedValue" 
    layout="vertical"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JCardSelect from '@jetlinks/components'

const selectedValue = ref('plan2')

const options = [
  { value: 'plan1', label: '月度计划', describe: '每月支付，灵活方便' },
  { value: 'plan2', label: '季度计划', describe: '每季度支付，享受9折优惠' },
  { value: 'plan3', label: '年度计划', describe: '每年支付，享受8折优惠' }
]
</script>`
      }
    }
  }
};

/**
 * 禁用状态
 * 演示组件和单个选项的禁用状态
 */
export const 禁用状态: Story = {
  args: {
    options: [
      { value: 'available1', label: '可选项1', describe: '这个选项是可以选择的' },
      { value: 'disabled1', label: '禁用项1', describe: '这个选项被禁用了', disabled: true },
      { value: 'available2', label: '可选项2', describe: '这个选项也是可以选择的' },
      { value: 'disabled2', label: '禁用项2', describe: '这个选项也被禁用了', disabled: true }
    ],
    value: 'available1',
    multiple: false,
    column: 2
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JCardSelect 
    :options="options" 
    v-model:value="selectedValue"
    :column="2"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JCardSelect from '@jetlinks/components'

const selectedValue = ref('available1')

const options = [
  { value: 'available1', label: '可选项1', describe: '这个选项是可以选择的' },
  { value: 'disabled1', label: '禁用项1', describe: '这个选项被禁用了', disabled: true },
  { value: 'available2', label: '可选项2', describe: '这个选项也是可以选择的' },
  { value: 'disabled2', label: '禁用项2', describe: '这个选项也被禁用了', disabled: true }
]
</script>`
      }
    }
  }
};

/**
 * 全部禁用
 * 整个组件处于禁用状态
 */
export const 全部禁用: Story = {
  args: {
    options: [
      { value: 'option1', label: '选项1', describe: '选项1的描述' },
      { value: 'option2', label: '选项2', describe: '选项2的描述' },
      { value: 'option3', label: '选项3', describe: '选项3的描述' }
    ],
    value: 'option1',
    disabled: true,
    multiple: false
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JCardSelect 
    :options="options" 
    v-model:value="selectedValue"
    :disabled="true"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JCardSelect from '@jetlinks/components'

const selectedValue = ref('option1')

const options = [
  { value: 'option1', label: '选项1', describe: '选项1的描述' },
  { value: 'option2', label: '选项2', describe: '选项2的描述' },
  { value: 'option3', label: '选项3', describe: '选项3的描述' }
]
</script>`
      }
    }
  }
};

/**
 * 自定义列数
 * 演示不同的列数布局效果
 */
export const 自定义列数: Story = {
  render: () => ({
    components: { JCardSelect },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>4列布局</h4>
          <JCardSelect :options="options" :column="4" />
        </div>
        <div>
          <h4>2列布局</h4>
          <JCardSelect :options="options" :column="2" />
        </div>
        <div>
          <h4>1列布局</h4>
          <JCardSelect :options="options" :column="1" />
        </div>
      </div>
    `,
    data() {
      return {
        options: [
          { value: 'col1', label: '选项1', describe: '第一个选项' },
          { value: 'col2', label: '选项2', describe: '第二个选项' },
          { value: 'col3', label: '选项3', describe: '第三个选项' },
          { value: 'col4', label: '选项4', describe: '第四个选项' }
        ]
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="layout-demo">
    <div class="layout-section">
      <h4>4列布局</h4>
      <JCardSelect :options="options" :column="4" />
    </div>
    
    <div class="layout-section">
      <h4>2列布局</h4>
      <JCardSelect :options="options" :column="2" />
    </div>
    
    <div class="layout-section">
      <h4>1列布局</h4>
      <JCardSelect :options="options" :column="1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import JCardSelect from '@jetlinks/components'

const options = [
  { value: 'col1', label: '选项1', describe: '第一个选项' },
  { value: 'col2', label: '选项2', describe: '第二个选项' },
  { value: 'col3', label: '选项3', describe: '第三个选项' },
  { value: 'col4', label: '选项4', describe: '第四个选项' }
]
</script>

<style scoped>
.layout-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.layout-section h4 {
  margin-bottom: 12px;
  font-weight: 600;
}
</style>`
      }
    }
  }
};

/**
 * 事件处理
 * 演示如何处理选择事件
 */
export const 事件处理: Story = {
  render: () => ({
    components: { JCardSelect },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <JCardSelect 
          :options="options" 
          v-model:value="selectedValue"
          @select="onSelect"
          @change="onChange"
        />
        <div style="padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <div><strong>当前选中值:</strong> {{ selectedValue }}</div>
          <div><strong>最后选择:</strong> {{ lastSelected }}</div>
          <div><strong>选择次数:</strong> {{ selectCount }}</div>
        </div>
      </div>
    `,
    data() {
      return {
        selectedValue: 'event1',
        lastSelected: '暂无',
        selectCount: 0,
        options: [
          { value: 'event1', label: '事件类型A', describe: '点击我试试事件处理' },
          { value: 'event2', label: '事件类型B', describe: '事件回调演示' },
          { value: 'event3', label: '事件类型C', describe: '选择状态变化' }
        ]
      }
    },
    methods: {
      onSelect(value, node) {
        this.lastSelected = `${node.label} (${value})`
        this.selectCount++
        console.log('onSelect:', value, node)
      },
      onChange(value, node) {
        console.log('onChange:', value, node)
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="event-demo">
    <JCardSelect 
      :options="options" 
      v-model:value="selectedValue"
      @select="onSelect"
      @change="onChange"
    />
    
    <div class="event-info">
      <div><strong>当前选中值:</strong> {{ selectedValue }}</div>
      <div><strong>最后选择:</strong> {{ lastSelected }}</div>
      <div><strong>选择次数:</strong> {{ selectCount }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JCardSelect from '@jetlinks/components'

const selectedValue = ref('event1')
const lastSelected = ref('暂无')
const selectCount = ref(0)

const options = [
  { value: 'event1', label: '事件类型A', describe: '点击我试试事件处理' },
  { value: 'event2', label: '事件类型B', describe: '事件回调演示' },
  { value: 'event3', label: '事件类型C', describe: '选择状态变化' }
]

const onSelect = (value, node) => {
  lastSelected.value = \`\${node.label} (\${value})\`
  selectCount.value++
  console.log('onSelect:', value, node)
}

const onChange = (value, node) => {
  console.log('onChange:', value, node)
}
</script>

<style scoped>
.event-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.event-info {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>`
      }
    }
  }
};