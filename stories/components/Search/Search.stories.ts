import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import {useTermOptions} from "@jetlinks-web/components/src/Search/hooks";

/**
 * Search 高级搜索组件
 *
 * 这是一个功能强大的搜索组件，可以根据配置动态生成搜索表单。
 * 支持多种数据类型的搜索条件，包括文本、数字、日期、选择器等。
 *
 * ## 组件说明
 * - **JSearch**: 基础搜索组件，适用于简单的搜索场景
 * - **JAdvancedSearch**: 高级搜索组件，支持搜索历史、复杂条件组合等高级功能
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

### JSearch 基础用法
\`\`\`vue
<template>
  <JSearch
    :columns="columns"
    type="terms"
    @search="handleSearch"
  />
</template>
\`\`\`

### JAdvancedSearch 高级用法
JAdvancedSearch 是高级搜索组件，提供更丰富的功能：

#### Props
- **columns**: 搜索字段配置数组，定义搜索表单的结构
- **type**: 搜索类型，固定为 'advanced'
- **target**: 搜索目标标识符，用于区分不同的搜索场景（必填）
- **request**: 搜索请求函数，\`(data: any, target: string) => Promise<any>\`
- **historyRequest**: 获取搜索历史的请求函数，\`(target: string) => Promise<any>\`
- **deleteRequest**: 删除搜索历史的请求函数，\`(target: string, id: string) => Promise<any>\`
- **deleteKey**: 删除历史记录时使用的key字段名，默认为 'key'
- **defaultValues**: 默认搜索值

#### Events
- **search**: 搜索事件，参数为搜索条件对象

\`\`\`vue
<template>
  <JAdvancedSearch
    :columns="columns"
    type="advanced"
    target="user-search"
    :request="searchRequest"
    :historyRequest="getSearchHistory"
    :deleteRequest="deleteSearchHistory"
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
    },
    onSearch: { action: 'search' }
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
    }
  },
  {
    title: '年龄',
    dataIndex: 'age',
    search: {
      title: '年龄',
      column: 'age',
      type: 'inputNumber'
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
    }
  },
  {
    title: '入职日期',
    dataIndex: 'joinDate',
    search: {
      title: '入职日期',
      column: 'joinDate',
      type: 'rangePicker',
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
  render: (args) => ({
    setup() {
      const searchResult = ref(null)

      const handleSearch = (params) => {
        searchResult.value = params
        console.log('搜索参数:', params)
        if (args.onSearch) {
          args.onSearch(params)
        }
      }

      return {
        ...args,
        columns: basicColumns,
        searchResult,
        handleSearch
      }
    },
    template: `
      <div style="padding: 16px;">
        <div style="margin-bottom: 16px;">
          <h3>基础搜索示例</h3>
          <p>包含文本、数字、选择器等基础搜索字段</p>
        </div>
        <JSearch
          :columns="columns"
          :type="type"
          :column="column"
          @search="handleSearch"
        />
        
        <div v-if="searchResult" style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <h4>搜索结果:</h4>
          <pre>{{ JSON.stringify(searchResult, null, 2) }}</pre>
        </div>
      </div>
    `
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
 * 展示JAdvancedSearch组件的高级功能，包含更多搜索字段类型和条件过滤
 */
export const 高级搜索: Story = {
  render: (args) => ({
    setup() {
      const searchResult = ref(null)

      const handleSearch = (params) => {
        searchResult.value = params
        console.log('高级搜索参数:', params)
        if (args.onSearch) {
          args.onSearch(params)
        }
      }

      // 模拟请求函数
      const mockRequest = async (data: any, target: string) => {
        console.log('模拟搜索请求:', { data, target })
        return Promise.resolve({ success: true, data: [] })
      }

      const mockHistoryRequest = async (target: string) => {
        console.log('模拟历史记录请求:', target)
        return Promise.resolve([
          { key: '1', name: '搜索历史1', terms: [] },
          { key: '2', name: '搜索历史2', terms: [] }
        ])
      }

      const mockDeleteRequest = async (target: string, id: string) => {
        console.log('模拟删除历史记录:', { target, id })
        return Promise.resolve({ success: true })
      }

      return {
        ...args,
        columns: advancedColumns,
        searchResult,
        handleSearch,
        mockRequest,
        mockHistoryRequest,
        mockDeleteRequest
      }
    },
    template: `
      <div style="padding: 16px;">
        <div style="margin-bottom: 16px;">
          <h3>高级搜索示例</h3>
          <p>支持树形选择、范围查询、条件筛选、搜索历史等高级搜索功能</p>
        </div>
        <JAdvancedSearch
          :columns="columns"
          type="advanced"
          target="demo-search"
          :request="mockRequest"
          :historyRequest="mockHistoryRequest"
          :deleteRequest="mockDeleteRequest"
          deleteKey="key"
          @search="handleSearch"
        />
        
        <div v-if="searchResult" style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <h4>搜索结果:</h4>
          <pre>{{ JSON.stringify(searchResult, null, 2) }}</pre>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JAdvancedSearch
    :columns="columns"
    type="advanced"
    target="demo-search"
    :request="mockRequest"
    :historyRequest="mockHistoryRequest"
    :deleteRequest="mockDeleteRequest"
    deleteKey="key"
    @search="handleSearch"
  />
</template>

<script setup lang="ts">
import { useTermOptions } from '@jetlinks-web/components/lib/Search/hooks'


const { termOptions } = useTermOptions({ pick: ['eq']}) // 根据条件获取指定下拉列表

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    search: {
      type: 'string',
    }
  },
  {
    title: '部门',
    dataIndex: 'department',
    search: {
      type: 'treeSelect',
      defaultTermType: 'not',
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
      column: 'salary',
      type: 'inputNumber'
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    search: {
      type: 'string',
      termOptions: termOptions
    }
  }
]

// 模拟请求函数
const mockRequest = async (data: any, target: string) => {
  console.log('搜索请求:', { data, target })
  return Promise.resolve({ success: true, data: [] })
}

const mockHistoryRequest = async (target: string) => {
  console.log('历史记录请求:', target)
  return Promise.resolve([
    { key: '1', name: '搜索历史1', terms: [] },
    { key: '2', name: '搜索历史2', terms: [] }
  ])
}

const mockDeleteRequest = async (target: string, id: string) => {
  console.log('删除历史记录:', { target, id })
  return Promise.resolve({ success: true })
}

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
  render: (args) => ({
    setup() {
      const searchResult = ref(null)

      const handleSearch = (params) => {
        searchResult.value = params
        console.log('日期时间搜索参数:', params)
        if (args.onSearch) {
          args.onSearch(params)
        }
      }

      return {
        ...args,
        columns: dateTimeColumns,
        searchResult,
        handleSearch
      }
    },
    template: `
      <div style="padding: 16px;">
        <div style="margin-bottom: 16px;">
          <h3>日期时间搜索示例</h3>
          <p>支持日期、时间、日期范围、时间范围等时间相关搜索</p>
        </div>
        <JSearch
          :columns="columns"
          :type="type"
          :column="2"
          @search="handleSearch"
        />
        
        <div v-if="searchResult" style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <h4>搜索结果:</h4>
          <pre>{{ JSON.stringify(searchResult, null, 2) }}</pre>
        </div>
      </div>
    `
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
  render: (args) => ({
    setup() {
      const searchResult1 = ref(null)
      const searchResult2 = ref(null)

      const handleSearch1 = (params) => {
        searchResult1.value = params
        console.log('2列布局搜索参数:', params)
        if (args.onSearch) {
          args.onSearch(params)
        }
      }

      const handleSearch2 = (params) => {
        searchResult2.value = params
        console.log('单列布局搜索参数:', params)
        if (args.onSearch) {
          args.onSearch(params)
        }
      }

      return {
        ...args,
        columns: basicColumns,
        searchResult1,
        searchResult2,
        handleSearch1,
        handleSearch2
      }
    },
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
    `
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

