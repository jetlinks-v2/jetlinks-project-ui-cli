import type { Meta, StoryObj } from '@storybook/vue3';

/**
 * Search 高级搜索组件
 *
 * 这是一个功能强大的搜索组件，可以根据配置动态生成搜索表单。
 * 支持多种数据类型的搜索条件，包括文本、数字、日期、选择器等。
 *
 * ## 何时使用
 * - 需要复杂的搜索功能时
 * - 需要支持多种数据类型搜索时
 * - 需要动态生成搜索表单时
 * - 需要灵活的搜索条件组合时
 */
const meta: Meta = {
  title: '组件库/Search 搜索组件',
  component: 'JSearch',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Search 是一个高级搜索组件，可以根据列配置动态生成搜索表单。

### 主要特性
- 动态生成搜索表单，支持多种数据类型
- 支持文本、数字、日期、选择器等多种搜索类型
- 灵活的搜索条件组合（等于、不等于、包含、大于等）
- 支持自定义搜索组件
- 响应式布局，自动适配不同屏幕尺寸
- 支持重置和提交功能

### 基本用法
\`\`\`vue
<template>
  <JSearch
    :columns="columns"
    type="terms"
    @search="handleSearch"
  />
</template>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: 'object',
      description: '搜索字段配置数组，定义搜索表单的结构'
    },
    type: {
      control: 'select',
      options: ['terms', 'object'],
      description: '搜索参数的格式类型，terms 为高级搜索格式，object 为简单对象格式'
    },
    column: {
      control: 'number',
      description: '每行显示的列数，默认为 4'
    },
    labelWidth: {
      control: 'number',
      description: '标签宽度，默认为 40px'
    },
    resetText: {
      control: 'text',
      description: '重置按钮文本'
    },
    submitText: {
      control: 'text',
      description: '提交按钮文本'
    },
    align: {
      control: 'select',
      options: ['value', 'label'],
      description: '对齐方式，默认为 value'
    }
  },
  args: {
    type: 'terms',
    column: 4,
    labelWidth: 40,
    align: 'value'
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础搜索列配置
const basicColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
    search: {
      title: '姓名',
      column: 'name',
      type: 'string',
      defaultTermType: 'like'
    }
  },
  {
    title: '年龄',
    dataIndex: 'age',
    search: {
      title: '年龄',
      column: 'age',
      type: 'inputNumber',
      defaultTermType: 'eq'
    }
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    search: {
      title: '邮箱',
      column: 'email',
      type: 'string',
      defaultTermType: 'like'
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    search: {
      title: '状态',
      column: 'status',
      type: 'select',
      defaultTermType: 'eq',
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    }
  }
];

// 高级搜索列配置
const advancedColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
    search: {
      title: '姓名',
      column: 'name',
      type: 'string',
      defaultTermType: 'like',
      termFilter: ['like', 'eq', 'not']
    }
  },
  {
    title: '年龄',
    dataIndex: 'age',
    search: {
      title: '年龄',
      column: 'age',
      type: 'inputNumber',
      defaultTermType: 'eq',
      termFilter: ['eq', 'gt', 'gte', 'lt', 'lte', 'btw']
    }
  },
  {
    title: '部门',
    dataIndex: 'department',
    search: {
      title: '部门',
      column: 'department',
      type: 'treeSelect',
      defaultTermType: 'eq',
      options: [
        {
          id: 1,
          name: '技术部',
          children: [
            { id: 11, name: '前端开发组' },
            { id: 12, name: '后端开发组' },
            { id: 13, name: '测试组' }
          ]
        },
        {
          id: 2,
          name: '产品部',
          children: [
            { id: 21, name: '产品设计组' },
            { id: 22, name: '用户研究组' }
          ]
        },
        {
          id: 3,
          name: '设计部',
          children: [
            { id: 31, name: 'UI设计组' },
            { id: 32, name: 'UX设计组' }
          ]
        }
      ]
    }
  },
  {
    title: '薪资',
    dataIndex: 'salary',
    search: {
      title: '薪资',
      column: 'salary',
      type: 'inputNumber',
      defaultTermType: 'btw',
      termFilter: ['eq', 'gt', 'gte', 'lt', 'lte', 'btw']
    }
  },
  {
    title: '入职日期',
    dataIndex: 'joinDate',
    search: {
      title: '入职日期',
      column: 'joinDate',
      type: 'rangePicker',
      defaultTermType: 'btw',
      termFilter: ['btw', 'gt', 'gte', 'lt', 'lte']
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    search: {
      title: '状态',
      column: 'status',
      type: 'select',
      defaultTermType: 'eq',
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    }
  }
];

// 日期时间搜索列配置
const dateTimeColumns = [
  {
    title: '创建日期',
    dataIndex: 'createDate',
    search: {
      title: '创建日期',
      column: 'createDate',
      type: 'date',
      defaultTermType: 'eq'
    }
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    search: {
      title: '更新时间',
      column: 'updateTime',
      type: 'rangePicker',
      defaultTermType: 'btw'
    }
  },
  {
    title: '工作时间',
    dataIndex: 'workTime',
    search: {
      title: '工作时间',
      column: 'workTime',
      type: 'time',
      defaultTermType: 'eq'
    }
  },
  {
    title: '值班时段',
    dataIndex: 'dutyTime',
    search: {
      title: '值班时段',
      column: 'dutyTime',
      type: 'timeRange',
      defaultTermType: 'btw'
    }
  }
];

/**
 * 基础搜索
 * 展示Search组件的基本用法，包含常见的搜索字段类型
 */
export const 基础搜索: Story = {
  render: () => ({
    template: `
      <div style="padding: 16px;">
        <div style="margin-bottom: 16px;">
          <h3>基础搜索示例</h3>
          <p>包含文本、数字、选择器等基础搜索字段</p>
        </div>
        <JSearch
          :columns="columns"
          type="terms"
          :column="4"
          @search="handleSearch"
        />
        
        <div v-if="searchResult" style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <h4>搜索结果:</h4>
          <pre>{{ JSON.stringify(searchResult, null, 2) }}</pre>
        </div>
      </div>
    `,
    data() {
      return {
        columns: basicColumns,
        searchResult: null
      }
    },
    methods: {
      handleSearch(params) {
        this.searchResult = params
        console.log('搜索参数:', params)
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JSearch
    :columns="columns"
    type="terms"
    :column="4"
    @search="handleSearch"
  />
</template>

<script setup lang="ts">
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    search: {
      title: '姓名',
      column: 'name',
      type: 'string',
      defaultTermType: 'like'
    }
  },
  {
    title: '年龄',
    dataIndex: 'age',
    search: {
      title: '年龄',
      column: 'age',
      type: 'inputNumber',
      defaultTermType: 'eq'
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    search: {
      title: '状态',
      column: 'status',
      type: 'select',
      defaultTermType: 'eq',
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    }
  }
]

const handleSearch = (params) => {
  console.log('搜索参数:', params)
}
</script>`
      }
    }
  }
};

/**
 * 高级搜索
 * 展示Search组件的高级功能，包含更多搜索字段类型和条件过滤
 */
export const 高级搜索: Story = {
  render: () => ({
    template: `
      <div style="padding: 16px;">
        <div style="margin-bottom: 16px;">
          <h3>高级搜索示例</h3>
          <p>支持树形选择、范围查询、条件筛选等高级搜索功能</p>
        </div>
        <JSearch
          :columns="columns"
          type="terms"
          :column="3"
          @search="handleSearch"
        />
        
        <div v-if="searchResult" style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <h4>搜索结果:</h4>
          <pre>{{ JSON.stringify(searchResult, null, 2) }}</pre>
        </div>
      </div>
    `,
    data() {
      return {
        columns: advancedColumns,
        searchResult: null
      }
    },
    methods: {
      handleSearch(params) {
        this.searchResult = params
        console.log('高级搜索参数:', params)
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JSearch
    :columns="columns"
    type="terms"
    :column="3"
    @search="handleSearch"
  />
</template>

<script setup lang="ts">
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    search: {
      title: '姓名',
      column: 'name',
      type: 'string',
      defaultTermType: 'like',
      termFilter: ['like', 'eq', 'not']
    }
  },
  {
    title: '部门',
    dataIndex: 'department',
    search: {
      title: '部门',
      column: 'department',
      type: 'treeSelect',
      defaultTermType: 'eq',
      options: [
        {
          id: 1,
          name: '技术部',
          children: [
            { id: 11, name: '前端开发组' },
            { id: 12, name: '后端开发组' }
          ]
        }
      ]
    }
  },
  {
    title: '薪资',
    dataIndex: 'salary',
    search: {
      title: '薪资',
      column: 'salary',
      type: 'inputNumber',
      defaultTermType: 'btw',
      termFilter: ['eq', 'gt', 'gte', 'lt', 'lte', 'btw']
    }
  }
]

const handleSearch = (params) => {
  console.log('搜索参数:', params)
}
</script>`
      }
    }
  }
};

/**
 * 日期时间搜索
 * 展示Search组件对日期时间类型字段的搜索支持
 */
export const 日期时间搜索: Story = {
  render: () => ({
    template: `
      <div style="padding: 16px;">
        <div style="margin-bottom: 16px;">
          <h3>日期时间搜索示例</h3>
          <p>支持日期、时间、日期范围、时间范围等时间相关搜索</p>
        </div>
        <JSearch
          :columns="columns"
          type="terms"
          :column="2"
          @search="handleSearch"
        />
        
        <div v-if="searchResult" style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <h4>搜索结果:</h4>
          <pre>{{ JSON.stringify(searchResult, null, 2) }}</pre>
        </div>
      </div>
    `,
    data() {
      return {
        columns: dateTimeColumns,
        searchResult: null
      }
    },
    methods: {
      handleSearch(params) {
        this.searchResult = params
        console.log('日期时间搜索参数:', params)
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JSearch
    :columns="columns"
    type="terms"
    :column="2"
    @search="handleSearch"
  />
</template>

<script setup lang="ts">
const columns = [
  {
    title: '创建日期',
    dataIndex: 'createDate',
    search: {
      title: '创建日期',
      column: 'createDate',
      type: 'date',
      defaultTermType: 'eq'
    }
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    search: {
      title: '更新时间',
      column: 'updateTime',
      type: 'rangePicker',
      defaultTermType: 'btw'
    }
  },
  {
    title: '工作时间',
    dataIndex: 'workTime',
    search: {
      title: '工作时间',
      column: 'workTime',
      type: 'time',
      defaultTermType: 'eq'
    }
  },
  {
    title: '值班时段',
    dataIndex: 'dutyTime',
    search: {
      title: '值班时段',
      column: 'dutyTime',
      type: 'timeRange',
      defaultTermType: 'btw'
    }
  }
]

const handleSearch = (params) => {
  console.log('搜索参数:', params)
}
</script>`
      }
    }
  }
};

/**
 * 自定义布局和样式
 * 展示Search组件的布局和样式自定义能力
 */
export const 自定义布局和样式: Story = {
  render: () => ({
    template: `
      <div style="padding: 16px;">
        <div style="margin-bottom: 16px;">
          <h3>自定义布局和样式示例</h3>
          <p>展示不同的列数、标签宽度、按钮文本等自定义选项</p>
        </div>
        
        <div style="margin-bottom: 24px;">
          <h4>2列布局，标签宽度80px</h4>
          <JSearch
            :columns="columns"
            type="terms"
            :column="2"
            :labelWidth="80"
            resetText="清空"
            submitText="查询"
            @search="handleSearch1"
          />
        </div>
        
        <div style="margin-bottom: 24px;">
          <h4>单列布局，标签宽度120px</h4>
          <JSearch
            :columns="columns"
            type="object"
            :column="1"
            :labelWidth="120"
            resetText="重置条件"
            submitText="开始搜索"
            @search="handleSearch2"
          />
        </div>
        
        <div v-if="searchResult1 || searchResult2" style="margin-top: 16px;">
          <div v-if="searchResult1" style="margin-bottom: 16px; padding: 12px; background: #e6f7ff; border-radius: 4px;">
            <h4>2列布局搜索结果 (terms格式):</h4>
            <pre>{{ JSON.stringify(searchResult1, null, 2) }}</pre>
          </div>
          <div v-if="searchResult2" style="padding: 12px; background: #f6ffed; border-radius: 4px;">
            <h4>单列布局搜索结果 (object格式):</h4>
            <pre>{{ JSON.stringify(searchResult2, null, 2) }}</pre>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        columns: basicColumns,
        searchResult1: null,
        searchResult2: null
      }
    },
    methods: {
      handleSearch1(params) {
        this.searchResult1 = params
        console.log('2列布局搜索参数:', params)
      },
      handleSearch2(params) {
        this.searchResult2 = params
        console.log('单列布局搜索参数:', params)
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <!-- 2列布局 -->
  <JSearch
    :columns="columns"
    type="terms"
    :column="2"
    :labelWidth="80"
    resetText="清空"
    submitText="查询"
    @search="handleSearch"
  />
  
  <!-- 单列布局 -->
  <JSearch
    :columns="columns"
    type="object"
    :column="1"
    :labelWidth="120"
    resetText="重置条件"
    submitText="开始搜索"
    @search="handleSearch"
  />
</template>

<script setup lang="ts">
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    search: {
      title: '姓名',
      column: 'name',
      type: 'string',
      defaultTermType: 'like'
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    search: {
      title: '状态',
      column: 'status',
      type: 'select',
      defaultTermType: 'eq',
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    }
  }
]

const handleSearch = (params) => {
  console.log('搜索参数:', params)
}
</script>`
      }
    }
  }
};

