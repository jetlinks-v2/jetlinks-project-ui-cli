import type { Meta, StoryObj } from '@storybook/vue3';
import JValueItem from '../../../packages/components/src/ValueItem/ValueItem.vue';

/**
 * ValueItem 值输入组件
 *
 * 这是一个通用的值输入组件，根据数据类型自动选择合适的输入控件。
 * 支持多种数据类型，如字符串、数字、日期、选择器等，适用于动态表单场景。
 *
 * ## 何时使用
 * - 需要根据数据类型动态渲染输入控件时
 * - 构建动态表单或配置界面时
 * - 需要统一处理不同类型数据输入时
 * - 开发参数配置、规则引擎等场景时
 */
const meta: Meta<typeof JValueItem> = {
  title: '组件库/ValueItem 值输入',
  component: JValueItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
ValueItem 是一个智能的值输入组件，能够根据数据类型自动选择合适的输入控件。

### 主要特性
- 支持多种数据类型
- 自动选择输入控件
- 统一的数据处理
- 支持自定义配置
- 适用于动态表单

### 支持的数据类型
- string: 文本输入框
- int/long: 整数输入框  
- float/double: 浮点数输入框
- select/enum/boolean: 下拉选择器
- date: 日期时间选择器
- time: 时间选择器
- password: 密码输入框
- file: 文件上传

### 基本用法
\`\`\`vue
<template>
  <JValueItem 
    v-model:modelValue="value" 
    :itemType="'string'" 
  />
</template>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'text',
      description: '绑定的值'
    },
    itemType: {
      control: 'select',
      options: ['string', 'int', 'long', 'float', 'double', 'select', 'date', 'time', 'password'],
      description: '数据类型'
    },
    placeholder: {
      control: 'text',
      description: '占位符文本'
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用'
    }
  },
  args: {
    itemType: 'string',
    placeholder: '请输入内容'
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 文本输入
 * 基础的文本输入框
 */
export const 文本输入: Story = {
  args: {
    modelValue: '',
    itemType: 'string',
    placeholder: '请输入文本'
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JValueItem 
    v-model:modelValue="textValue" 
    itemType="string"
    placeholder="请输入文本"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const textValue = ref('Hello World')
</script>`
      }
    }
  }
};

/**
 * 整数输入
 * 整数类型的输入框，支持最大最小值限制
 */
export const 整数输入: Story = {
  args: {
    modelValue: 42,
    itemType: 'int',
    placeholder: '请输入整数'
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JValueItem 
    v-model:modelValue="intValue" 
    itemType="int"
    placeholder="请输入整数"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const intValue = ref(42)
</script>`
      }
    }
  }
};

/**
 * 浮点数输入
 * 浮点数类型的输入框，支持小数
 */
export const 浮点数输入: Story = {
  args: {
    modelValue: 3.14,
    itemType: 'float',
    placeholder: '请输入浮点数'
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JValueItem 
    v-model:modelValue="floatValue" 
    itemType="float"
    placeholder="请输入浮点数"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const floatValue = ref(3.14)
</script>`
      }
    }
  }
};

/**
 * 下拉选择
 * 下拉选择器，支持单选和多选
 */
export const 下拉选择: Story = {
  args: {
    modelValue: 'vue',
    itemType: 'select',
    placeholder: '请选择框架',
    options: [
      { label: 'Vue.js', value: 'vue' },
      { label: 'React', value: 'react' },
      { label: 'Angular', value: 'angular' },
      { label: 'Svelte', value: 'svelte' }
    ]
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JValueItem 
    v-model:modelValue="selectedValue" 
    itemType="select"
    placeholder="请选择框架"
    :options="options"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedValue = ref('vue')

const options = [
  { label: 'Vue.js', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' }
]
</script>`
      }
    }
  }
};

/**
 * 密码输入
 * 密码输入框，自动隐藏内容
 */
export const 密码输入: Story = {
  args: {
    modelValue: 'password123',
    itemType: 'password',
    placeholder: '请输入密码'
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JValueItem 
    v-model:modelValue="passwordValue" 
    itemType="password"
    placeholder="请输入密码"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const passwordValue = ref('password123')
</script>`
      }
    }
  }
};

/**
 * 不同类型对比
 * 展示不同数据类型的输入控件
 */
export const 不同类型对比: Story = {
  render: () => ({
    components: { JValueItem },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 500px;">
        <div>
          <label style="display: block; margin-bottom: 4px; font-weight: 500;">文本类型:</label>
          <JValueItem 
            v-model:modelValue="stringValue" 
            itemType="string"
            placeholder="请输入文本"
          />
        </div>
        
        <div>
          <label style="display: block; margin-bottom: 4px; font-weight: 500;">整数类型:</label>
          <JValueItem 
            v-model:modelValue="intValue" 
            itemType="int"
            placeholder="请输入整数"
          />
        </div>
        
        <div>
          <label style="display: block; margin-bottom: 4px; font-weight: 500;">浮点数类型:</label>
          <JValueItem 
            v-model:modelValue="floatValue" 
            itemType="float"
            placeholder="请输入浮点数"
          />
        </div>
        
        <div>
          <label style="display: block; margin-bottom: 4px; font-weight: 500;">选择类型:</label>
          <JValueItem 
            v-model:modelValue="selectValue" 
            itemType="select"
            placeholder="请选择选项"
            :options="selectOptions"
          />
        </div>
        
        <div>
          <label style="display: block; margin-bottom: 4px; font-weight: 500;">密码类型:</label>
          <JValueItem 
            v-model:modelValue="passwordValue" 
            itemType="password"
            placeholder="请输入密码"
          />
        </div>
        
        <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <h4 style="margin: 0 0 8px 0;">当前值:</h4>
          <div style="font-size: 14px; color: #666; line-height: 1.6;">
            <div>文本: {{ stringValue }}</div>
            <div>整数: {{ intValue }}</div>
            <div>浮点数: {{ floatValue }}</div>
            <div>选择: {{ selectValue }}</div>
            <div>密码: {{ passwordValue ? '***' : '空' }}</div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        stringValue: '示例文本',
        intValue: 100,
        floatValue: 99.99,
        selectValue: 'option2',
        passwordValue: 'secret123',
        selectOptions: [
          { label: '选项1', value: 'option1' },
          { label: '选项2', value: 'option2' },
          { label: '选项3', value: 'option3' }
        ]
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="value-item-demo">
    <div class="form-item">
      <label>文本类型:</label>
      <JValueItem 
        v-model:modelValue="stringValue" 
        itemType="string"
        placeholder="请输入文本"
      />
    </div>
    
    <div class="form-item">
      <label>整数类型:</label>
      <JValueItem 
        v-model:modelValue="intValue" 
        itemType="int"
        placeholder="请输入整数"
      />
    </div>
    
    <div class="form-item">
      <label>浮点数类型:</label>
      <JValueItem 
        v-model:modelValue="floatValue" 
        itemType="float"
        placeholder="请输入浮点数"
      />
    </div>
    
    <div class="form-item">
      <label>选择类型:</label>
      <JValueItem 
        v-model:modelValue="selectValue" 
        itemType="select"
        placeholder="请选择选项"
        :options="selectOptions"
      />
    </div>
    
    <div class="form-item">
      <label>密码类型:</label>
      <JValueItem 
        v-model:modelValue="passwordValue" 
        itemType="password"
        placeholder="请输入密码"
      />
    </div>
    
    <div class="values-display">
      <h4>当前值:</h4>
      <div class="values-content">
        <div>文本: {{ stringValue }}</div>
        <div>整数: {{ intValue }}</div>
        <div>浮点数: {{ floatValue }}</div>
        <div>选择: {{ selectValue }}</div>
        <div>密码: {{ passwordValue ? '***' : '空' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const stringValue = ref('示例文本')
const intValue = ref(100)
const floatValue = ref(99.99)
const selectValue = ref('option2')
const passwordValue = ref('secret123')

const selectOptions = [
  { label: '选项1', value: 'option1' },
  { label: '选项2', value: 'option2' },
  { label: '选项3', value: 'option3' }
]
</script>

<style scoped>
.value-item-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 300px;
}

.form-item label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
}

.values-display {
  margin-top: 16px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
}

.values-display h4 {
  margin: 0 0 8px 0;
}

.values-content {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}
</style>`
      }
    }
  }
};

/**
 * 实际应用场景
 * 在动态配置表单中的应用示例
 */
export const 实际应用场景: Story = {
  render: () => ({
    components: { JValueItem },
    template: `
      <div style="min-width: 500px;">
        <h3 style="margin: 0 0 20px 0;">API接口配置</h3>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div v-for="(config, index) in configurations" :key="index" 
               style="padding: 16px; border: 1px solid #e8e8e8; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="font-weight: 500;">{{ config.label }}</span>
              <span style="font-size: 12px; color: #999; background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">
                {{ config.type }}
              </span>
            </div>
            
            <JValueItem 
              v-model:modelValue="config.value" 
              :itemType="config.type"
              :placeholder="config.placeholder"
              :options="config.options"
              @change="onConfigChange(index, $event)"
            />
            
            <div v-if="config.description" style="margin-top: 8px; font-size: 12px; color: #666;">
              {{ config.description }}
            </div>
          </div>
        </div>
        
        <div style="margin-top: 24px; padding: 16px; background: #f9f9f9; border-radius: 8px;">
          <h4 style="margin: 0 0 12px 0;">生成的配置:</h4>
          <pre style="margin: 0; font-size: 12px; color: #333; white-space: pre-wrap;">{{ JSON.stringify(getConfigResult(), null, 2) }}</pre>
        </div>
      </div>
    `,
    data() {
      return {
        configurations: [
          {
            label: '接口地址',
            type: 'string',
            value: 'https://api.example.com/users',
            placeholder: '请输入API接口地址',
            description: 'REST API的完整URL地址'
          },
          {
            label: '请求方法',
            type: 'select',
            value: 'GET',
            placeholder: '请选择请求方法',
            options: [
              { label: 'GET', value: 'GET' },
              { label: 'POST', value: 'POST' },
              { label: 'PUT', value: 'PUT' },
              { label: 'DELETE', value: 'DELETE' }
            ],
            description: 'HTTP请求方法类型'
          },
          {
            label: '超时时间(秒)',
            type: 'int',
            value: 30,
            placeholder: '请输入超时时间',
            description: '请求超时时间，单位为秒'
          },
          {
            label: '重试次数',
            type: 'int',
            value: 3,
            placeholder: '请输入重试次数',
            description: '请求失败后的重试次数'
          },
          {
            label: 'API密钥',
            type: 'password',
            value: 'sk-1234567890abcdef',
            placeholder: '请输入API密钥',
            description: '用于身份验证的API密钥'
          },
          {
            label: '启用缓存',
            type: 'select',
            value: 'true',
            placeholder: '请选择是否启用缓存',
            options: [
              { label: '是', value: 'true' },
              { label: '否', value: 'false' }
            ],
            description: '是否启用响应缓存功能'
          }
        ]
      }
    },
    methods: {
      onConfigChange(index, value) {
        console.log('配置项变更:', this.configurations[index].label, value)
      },
      getConfigResult() {
        const result = {}
        this.configurations.forEach(config => {
          const key = config.label.replace(/[^\w\s]/g, '').replace(/\s+/g, '_').toLowerCase()
          result[key] = config.value
        })
        return result
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="config-demo">
    <h3>API接口配置</h3>
    
    <div class="config-list">
      <div 
        v-for="(config, index) in configurations" 
        :key="index" 
        class="config-item"
      >
        <div class="config-header">
          <span class="config-label">{{ config.label }}</span>
          <span class="config-type">{{ config.type }}</span>
        </div>
        
        <JValueItem 
          v-model:modelValue="config.value" 
          :itemType="config.type"
          :placeholder="config.placeholder"
          :options="config.options"
          @change="onConfigChange(index, $event)"
        />
        
        <div v-if="config.description" class="config-description">
          {{ config.description }}
        </div>
      </div>
    </div>
    
    <div class="config-result">
      <h4>生成的配置:</h4>
      <pre>{{ JSON.stringify(getConfigResult(), null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const configurations = reactive([
  {
    label: '接口地址',
    type: 'string',
    value: 'https://api.example.com/users',
    placeholder: '请输入API接口地址',
    description: 'REST API的完整URL地址'
  },
  {
    label: '请求方法',
    type: 'select',
    value: 'GET',
    placeholder: '请选择请求方法',
    options: [
      { label: 'GET', value: 'GET' },
      { label: 'POST', value: 'POST' },
      { label: 'PUT', value: 'PUT' },
      { label: 'DELETE', value: 'DELETE' }
    ],
    description: 'HTTP请求方法类型'
  },
  {
    label: '超时时间(秒)',
    type: 'int',
    value: 30,
    placeholder: '请输入超时时间',
    description: '请求超时时间，单位为秒'
  },
  {
    label: '重试次数',
    type: 'int',
    value: 3,
    placeholder: '请输入重试次数',
    description: '请求失败后的重试次数'
  },
  {
    label: 'API密钥',
    type: 'password',
    value: 'sk-1234567890abcdef',
    placeholder: '请输入API密钥',
    description: '用于身份验证的API密钥'
  },
  {
    label: '启用缓存',
    type: 'select',
    value: 'true',
    placeholder: '请选择是否启用缓存',
    options: [
      { label: '是', value: 'true' },
      { label: '否', value: 'false' }
    ],
    description: '是否启用响应缓存功能'
  }
])

const onConfigChange = (index: number, value: any) => {
  console.log('配置项变更:', configurations[index].label, value)
}

const getConfigResult = () => {
  const result = {}
  configurations.forEach(config => {
    const key = config.label.replace(/[^\w\s]/g, '').replace(/\s+/g, '_').toLowerCase()
    result[key] = config.value
  })
  return result
}
</script>

<style scoped>
.config-demo {
  min-width: 500px;
}

.config-demo h3 {
  margin: 0 0 20px 0;
}

.config-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.config-item {
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.config-label {
  font-weight: 500;
}

.config-type {
  font-size: 12px;
  color: #999;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
}

.config-description {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

.config-result {
  margin-top: 24px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
}

.config-result h4 {
  margin: 0 0 12px 0;
}

.config-result pre {
  margin: 0;
  font-size: 12px;
  color: #333;
  white-space: pre-wrap;
}
</style>`
      }
    }
  }
};
