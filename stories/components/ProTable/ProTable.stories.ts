import type { Meta, StoryObj } from '@storybook/vue3';

/**
 * ProTable 高级表格组件
 *
 * 这是一个基于 Ant Design Vue Table 封装的高级表格组件，提供了更强大的功能。
 * 支持数据请求、分页、选择、模式切换(表格/卡片)等功能，适用于复杂的数据展示场景。
 *
 * ## 何时使用
 * - 需要展示大量结构化数据时
 * - 需要对数据进行排序、筛选、分页等操作时
 * - 需要表格和卡片两种展示模式时
 * - 需要批量操作数据时
 * - 需要自动请求数据的表格时
 */
const meta: Meta = {
  title: '组件库/ProTable 高级表格',
  component: 'JProTable',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
ProTable 是一个功能强大的高级表格组件，基于 Ant Design Vue Table 进行封装。

### 主要特性
- 支持自动数据请求和分页
- 支持表格和卡片两种展示模式
- 支持行选择和批量操作
- 支持响应式布局，自动适配不同屏幕尺寸
- 支持自定义头部、尾部和内容区域
- 支持搜索参数和默认参数
- 继承 Ant Design Vue Table 的所有功能

### 基本用法
\`\`\`vue
<template>
  <JProTable
    :columns="columns"
    :request="fetchData"
    :params="searchParams"
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
      description: '表格列的配置描述，继承 Ant Design Vue Table columns'
    },
    request: {
      control: false,
      description: '请求数据的方法，返回 Promise'
    },
    dataSource: {
      control: 'object',
      description: '数据数组，当不使用 request 时直接提供数据'
    },
    params: {
      control: 'object',
      description: '搜索参数，会传递给 request 方法'
    },
    defaultParams: {
      control: 'object',
      description: '默认参数，会与 params 合并'
    },
    type: {
      control: 'select',
      options: ['PAGE', 'TREE'],
      description: '表格类型，PAGE 支持分页，TREE 支持树形结构'
    },
    mode: {
      control: 'select',
      options: ['TABLE', 'CARD'],
      description: '显示模式，TABLE 表格模式，CARD 卡片模式'
    },
    rowSelection: {
      control: 'object',
      description: '行选择配置'
    },
    noPagination: {
      control: 'boolean',
      description: '是否禁用分页'
    },
    alertShow: {
      control: 'boolean',
      description: '是否显示选择提示框'
    },
    gridColumns: {
      control: 'object',
      description: '响应式网格列数配置 [小屏, 中屏, 大屏, 超大屏]'
    }
  },
  args: {
    type: 'PAGE',
    mode: 'TABLE',
    alertShow: true,
    noPagination: false,
    gridColumns: [1, 2, 3, 4]
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 模拟数据
const mockData = [
  {
    id: 1,
    name: '张三',
    age: 32,
    email: 'zhangsan@example.com',
    department: '技术部',
    position: '前端工程师',
    status: 'active',
    joinDate: '2022-01-15',
    salary: 15000
  },
  {
    id: 2,
    name: '李四',
    age: 28,
    email: 'lisi@example.com',
    department: '技术部',
    position: '后端工程师',
    status: 'active',
    joinDate: '2022-03-20',
    salary: 16000
  },
  {
    id: 3,
    name: '王五',
    age: 35,
    email: 'wangwu@example.com',
    department: '产品部',
    position: '产品经理',
    status: 'inactive',
    joinDate: '2021-08-10',
    salary: 18000
  },
  {
    id: 4,
    name: '赵六',
    age: 29,
    email: 'zhaoliu@example.com',
    department: '设计部',
    position: 'UI设计师',
    status: 'active',
    joinDate: '2022-05-12',
    salary: 12000
  },
  {
    id: 5,
    name: '钱七',
    age: 31,
    email: 'qianqi@example.com',
    department: '技术部',
    position: '全栈工程师',
    status: 'active',
    joinDate: '2021-12-08',
    salary: 17000
  }
];

// 基础列配置
const baseColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 100
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: 80
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    width: 200
  },
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
    width: 120
  },
  {
    title: '职位',
    dataIndex: 'position',
    key: 'position',
    width: 150
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100
  },
  {
    title: '入职日期',
    dataIndex: 'joinDate',
    key: 'joinDate',
    width: 120
  }
];

/**
 * 基础用法
 * 使用静态数据的基本表格
 */
export const 基础用法: Story = {
  render: () => ({
    template: `
      <div style="padding: 16px;">
        <JProTable
          :columns="columns"
          :dataSource="dataSource"
          :noPagination="true"
          rowKey="id"
        />
      </div>
    `,
    data() {
      return {
        columns: baseColumns,
        dataSource: mockData
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JProTable
    :columns="columns"
    :dataSource="dataSource"
    :noPagination="true"
    rowKey="id"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 100
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: 80
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    width: 200
  },
  // ... 更多列配置
]

const dataSource = [
  {
    id: 1,
    name: '张三',
    age: 32,
    email: 'zhangsan@example.com',
    // ... 更多数据
  },
  // ... 更多数据
]
</script>`
      }
    }
  }
};

/**
 * 异步请求数据
 * 使用 request 方法异步获取数据，支持分页
 */
export const 异步请求数据: Story = {
  render: () => ({
    template: `
      <div style="padding: 16px;">
        <JProTable
          :columns="columns"
          :request="fetchData"
          :params="searchParams"
          rowKey="id"
          type="PAGE"
        />
      </div>
    `,
    data() {
      return {
        columns: [
          ...baseColumns,
          {
            title: '薪资',
            dataIndex: 'salary',
            key: 'salary',
            width: 120
          }
        ],
        searchParams: {}
      }
    },
    methods: {
      async fetchData(params) {
        console.log('请求参数:', params)

        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000))

        const { pageIndex = 0, pageSize = 12 } = params

        // 模拟分页数据
        const start = pageIndex * pageSize
        const end = start + pageSize
        const pageData = mockData.concat(mockData).concat(mockData).slice(start, end)

        return {
          success: true,
          result: {
            data: pageData,
            total: 15, // 模拟总数
            pageIndex,
            pageSize
          }
        }
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JProTable
    :columns="columns"
    :request="fetchData"
    :params="searchParams"
    rowKey="id"
    type="PAGE"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchParams = ref({})

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 100
  },
  // ... 更多列配置
]

const fetchData = async (params) => {
  console.log('请求参数:', params)
  
  // 调用实际API
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })
  
  const result = await response.json()
  
  return {
    success: true,
    result: {
      data: result.data,
      total: result.total,
      pageIndex: result.pageIndex,
      pageSize: result.pageSize
    }
  }
}
</script>`
      }
    }
  }
};

/**
 * 行选择功能
 * 支持单选、多选，显示选择提示框
 */
export const 行选择功能: Story = {
  render: () => ({
    template: `
      <div style="padding: 16px;">
        <JProTable
          :columns="columns"
          :dataSource="dataSource"
          :rowSelection="rowSelection"
          :alertShow="true"
          :noPagination="true"
          rowKey="id"
        >
          <template #alertRender="{ rowSelection, onClose }">
            <div style="display: flex; align-items: center; gap: 16px;">
              <span>已选择 <strong>{{ rowSelection.selectedRowKeys.length }}</strong> 项</span>
              <a @click="handleBatchDelete">批量删除</a>
              <a @click="handleBatchExport">批量导出</a>
              <a @click="onClose">取消选择</a>
            </div>
          </template>
        </JProTable>
      </div>
    `,
    data() {
      return {
        columns: baseColumns,
        dataSource: mockData,
        rowSelection: {
          selectedRowKeys: [],
          onChange: (selectedRowKeys, selectedRows) => {
            console.log('选中的行键:', selectedRowKeys)
            console.log('选中的行数据:', selectedRows)
          },
          onSelect: (record, selected, selectedRows) => {
            console.log('单行选择:', record, selected)
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
            console.log('全选:', selected, selectedRows, changeRows)
          }
        }
      }
    },
    methods: {
      handleBatchDelete() {
        console.log('批量删除:', this.rowSelection.selectedRowKeys)
      },
      handleBatchExport() {
        console.log('批量导出:', this.rowSelection.selectedRowKeys)
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JProTable
    :columns="columns"
    :dataSource="dataSource"
    :rowSelection="rowSelection"
    :alertShow="true"
    rowKey="id"
  >
    <template #alertRender="{ rowSelection, onClose }">
      <div class="selection-alert">
        <span>已选择 <strong>{{ rowSelection.selectedRowKeys.length }}</strong> 项</span>
        <a @click="handleBatchDelete">批量删除</a>
        <a @click="handleBatchExport">批量导出</a>
        <a @click="onClose">取消选择</a>
      </div>
    </template>
  </JProTable>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const rowSelection = reactive({
  selectedRowKeys: [],
  onChange: (selectedRowKeys, selectedRows) => {
    rowSelection.selectedRowKeys = selectedRowKeys
    console.log('选中的行键:', selectedRowKeys)
    console.log('选中的行数据:', selectedRows)
  },
  onSelect: (record, selected, selectedRows) => {
    rowSelection.selectedRowKeys = selectedRows
    console.log('单行选择:', record, selected)
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    rowSelection.selectedRowKeys = selectedRows
    console.log('全选:', selected, selectedRows, changeRows)
  }
})

const handleBatchDelete = () => {
  console.log('批量删除:', rowSelection.value.selectedRowKeys)
}

const handleBatchExport = () => {
  console.log('批量导出:', rowSelection.value.selectedRowKeys)
}
</script>

<style scoped>
.selection-alert {
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>`
      }
    }
  }
};

/**
 * 表格和卡片模式
 * 支持表格和卡片两种显示模式切换
 */
export const 表格和卡片模式: Story = {
  render: () => ({
    template: `
      <div style="padding: 16px;">
        <JProTable
          :columns="columns"
          :dataSource="dataSource"
          :mode="undefined"
          :modeValue="'TABLE'"
          :noPagination="true"
          :gridColumns="[1, 2, 2, 3]"
          rowKey="id"
        >
          <template #card="{ record }">
            <div style="border: 1px solid #f0f0f0; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <div>
                  <h4 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">{{ record.name }}</h4>
                  <p style="margin: 0; color: #666; font-size: 14px;">{{ record.position }}</p>
                </div>
                <span :style="{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  backgroundColor: record.status === 'active' ? '#f6ffed' : '#fff2f0',
                  color: record.status === 'active' ? '#52c41a' : '#ff4d4f',
                  border: record.status === 'active' ? '1px solid #b7eb8f' : '1px solid #ffccc7'
                }">
                  {{ record.status === 'active' ? '在职' : '离职' }}
                </span>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px;">
                <div><span style="color: #666;">部门:</span> {{ record.department }}</div>
                <div><span style="color: #666;">年龄:</span> {{ record.age }}</div>
                <div style="grid-column: 1 / -1;"><span style="color: #666;">邮箱:</span> {{ record.email }}</div>
                <div><span style="color: #666;">入职:</span> {{ record.joinDate }}</div>
                <div><span style="color: #666;">薪资:</span> ¥{{ record.salary?.toLocaleString() }}</div>
              </div>
              
              <div style="margin-top: 12px; display: flex; gap: 8px;">
                <a style="font-size: 12px;">编辑</a>
                <a style="font-size: 12px;">查看详情</a>
                <a style="font-size: 12px; color: #ff4d4f;">删除</a>
              </div>
            </div>
          </template>
        </JProTable>
      </div>
    `,
    data() {
      return {
        columns: [
          ...baseColumns,
          {
            title: '薪资',
            dataIndex: 'salary',
            key: 'salary',
            width: 120
          }
        ],
        dataSource: mockData
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JProTable
    :columns="columns"
    :dataSource="dataSource"
    :mode="undefined"
    :modeValue="'TABLE'"
    :gridColumns="[1, 2, 2, 3]"
    rowKey="id"
  >
    <template #card="{ record }">
      <div class="user-card">
        <div class="card-header">
          <div class="user-info">
            <h4 class="user-name">{{ record.name }}</h4>
            <p class="user-position">{{ record.position }}</p>
          </div>
          <span class="status-badge" :class="record.status">
            {{ record.status === 'active' ? '在职' : '离职' }}
          </span>
        </div>
        
        <div class="card-content">
          <div class="info-item"><span>部门:</span> {{ record.department }}</div>
          <div class="info-item"><span>年龄:</span> {{ record.age }}</div>
          <div class="info-item full-width"><span>邮箱:</span> {{ record.email }}</div>
          <div class="info-item"><span>入职:</span> {{ record.joinDate }}</div>
          <div class="info-item"><span>薪资:</span> ¥{{ record.salary?.toLocaleString() }}</div>
        </div>
        
        <div class="card-actions">
          <a>编辑</a>
          <a>查看详情</a>
          <a class="danger">删除</a>
        </div>
      </div>
    </template>
  </JProTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  // 列配置
]

const dataSource = [
  // 数据
]
</script>

<style scoped>
.user-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.user-name {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
}

.user-position {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-badge.active {
  background-color: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status-badge.inactive {
  background-color: #fff2f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}

.card-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  font-size: 14px;
}

.info-item span {
  color: #666;
}

.full-width {
  grid-column: 1 / -1;
}

.card-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

.card-actions a {
  font-size: 12px;
}

.card-actions a.danger {
  color: #ff4d4f;
}
</style>`
      }
    }
  }
};

/**
 * 自定义头部和操作
 * 自定义表格头部左右区域，添加搜索、筛选、操作按钮等
 */
export const 自定义头部和操作: Story = {
  render: () => ({
    template: `
      <div style="padding: 16px;">
        <JProTable
          :columns="columns"
          :dataSource="filteredData"
          :noPagination="true"
          rowKey="id"
        >
          <template #headerLeftRender>
            <div style="display: flex; align-items: center; gap: 12px;">
              <h3 style="margin: 0;">员工管理</h3>
              <span style="color: #666; font-size: 14px;">共 {{ dataSource.length }} 条记录</span>
            </div>
          </template>
          
          <template #headerRightRender>
            <div style="display: flex; align-items: center; gap: 12px;">
              <a-input-search
                v-model:value="searchText"
                placeholder="搜索姓名或邮箱"
                style="width: 200px;"
                @search="handleSearch"
              />
              <a-select
                v-model:value="departmentFilter"
                placeholder="筛选部门"
                style="width: 120px;"
                allowClear
                @change="handleDepartmentChange"
              >
                <a-select-option value="技术部">技术部</a-select-option>
                <a-select-option value="产品部">产品部</a-select-option>
                <a-select-option value="设计部">设计部</a-select-option>
              </a-select>
              <a-button type="primary" @click="handleAdd">
                <template #icon>+</template>
                新建员工
              </a-button>
              <a-button @click="handleExport">导出</a-button>
            </div>
          </template>
        </JProTable>
      </div>
    `,
    data() {
      return {
        columns: [
          ...baseColumns,
          {
            title: '操作',
            key: 'action',
            width: 150,
            scopedSlots: true
          }
        ],
        dataSource: mockData,
        searchText: '',
        departmentFilter: undefined,
        filteredData: mockData
      }
    },
    methods: {
      handleSearch() {
        this.filterData()
      },
      handleDepartmentChange() {
        this.filterData()
      },
      filterData() {
        let data = this.dataSource

        if (this.searchText) {
          data = data.filter(item =>
            item.name.includes(this.searchText) ||
            item.email.includes(this.searchText)
          )
        }

        if (this.departmentFilter) {
          data = data.filter(item => item.department === this.departmentFilter)
        }

        this.filteredData = data
      },
      handleAdd() {
        console.log('新建员工')
      },
      handleExport() {
        console.log('导出数据')
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JProTable
    :columns="columns"
    :dataSource="filteredData"
    rowKey="id"
  >
    <template #headerLeftRender>
      <div class="header-left">
        <h3>员工管理</h3>
        <span class="record-count">共 {{ dataSource.length }} 条记录</span>
      </div>
    </template>
    
    <template #headerRightRender>
      <div class="header-right">
        <a-input-search
          v-model:value="searchText"
          placeholder="搜索姓名或邮箱"
          @search="handleSearch"
        />
        <a-select
          v-model:value="departmentFilter"
          placeholder="筛选部门"
          allowClear
          @change="handleDepartmentChange"
        >
          <a-select-option value="技术部">技术部</a-select-option>
          <a-select-option value="产品部">产品部</a-select-option>
          <a-select-option value="设计部">设计部</a-select-option>
        </a-select>
        <a-button type="primary" @click="handleAdd">
          新建员工
        </a-button>
        <a-button @click="handleExport">导出</a-button>
      </div>
    </template>
  </JProTable>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchText = ref('')
const departmentFilter = ref()
const dataSource = ref([...])

const filteredData = computed(() => {
  let data = dataSource.value
  
  if (searchText.value) {
    data = data.filter(item => 
      item.name.includes(searchText.value) || 
      item.email.includes(searchText.value)
    )
  }
  
  if (departmentFilter.value) {
    data = data.filter(item => item.department === departmentFilter.value)
  }
  
  return data
})

const handleAdd = () => {
  console.log('新建员工')
}

const handleExport = () => {
  console.log('导出数据')
}
</script>

<style scoped>
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h3 {
  margin: 0;
}

.record-count {
  color: #666;
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>`
      }
    }
  }
};

/**
 * 完整示例
 * 展示 ProTable 在实际项目中的完整应用
 */
export const 完整示例: Story = {
  render: () => ({
    template: `
      <div style="padding: 16px;">
        <JProTable
          :columns="columns"
          :request="fetchData"
          :params="searchParams"
          :rowSelection="rowSelection"
          :alertShow="true"
          rowKey="id"
          type="PAGE"
        >
          <template #headerLeftRender>
            <div style="display: flex; align-items: center; gap: 12px;">
              <h3 style="margin: 0;">员工管理系统</h3>
              <a-badge :count="dataSource.length" style="background-color: #52c41a;" />
            </div>
          </template>
          
          <template #headerRightRender>
            <div style="display: flex; align-items: center; gap: 12px;">
              <a-input-search
                v-model:value="searchParams.name"
                placeholder="搜索员工姓名"
                style="width: 200px;"
                @search="handleSearch"
                allowClear
              />
              <a-select
                v-model:value="searchParams.department"
                placeholder="部门筛选"
                style="width: 120px;"
                allowClear
                @change="handleSearch"
              >
                <a-select-option value="技术部">技术部</a-select-option>
                <a-select-option value="产品部">产品部</a-select-option>
                <a-select-option value="设计部">设计部</a-select-option>
              </a-select>
              <a-select
                v-model:value="searchParams.status"
                placeholder="状态筛选"
                style="width: 100px;"
                allowClear
                @change="handleSearch"
              >
                <a-select-option value="active">在职</a-select-option>
                <a-select-option value="inactive">离职</a-select-option>
              </a-select>
              <a-button type="primary" @click="handleAdd">
                <template #icon>+</template>
                新建
              </a-button>
              <a-button @click="handleRefresh">刷新</a-button>
            </div>
          </template>
          
          <template #alertRender="{ rowSelection, onClose }">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 16px;">
                <span>已选择 <strong style="color: #1890ff;">{{ rowSelection.selectedRowKeys.length }}</strong> 项</span>
                <a @click="handleBatchEdit">批量编辑</a>
                <a @click="handleBatchDelete" style="color: #ff4d4f;">批量删除</a>
                <a @click="handleBatchExport">导出选中</a>
              </div>
              <a @click="onClose">取消选择</a>
            </div>
          </template>
          
          <template #action="{ record }">
            <div style="display: flex; gap: 8px;">
              <a @click="handleEdit(record)" style="color: #1890ff;">编辑</a>
              <a @click="handleView(record)">查看</a>
              <a-popconfirm
                title="确定要删除这个员工吗？"
                @confirm="handleDelete(record)"
              >
                <a style="color: #ff4d4f;">删除</a>
              </a-popconfirm>
            </div>
          </template>
          
          <template #status="{ record }">
            <a-tag :color="record.status === 'active' ? 'green' : 'red'">
              {{ record.status === 'active' ? '在职' : '离职' }}
            </a-tag>
          </template>
          
          <template #salary="{ record }">
            <span style="font-weight: 600; color: #ff6b35;">
              ¥{{ record.salary?.toLocaleString() }}
            </span>
          </template>
        </JProTable>
      </div>
    `,
    data() {
      return {
        columns: [
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width: 100
          },
          {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
            width: 80
          },
          {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            width: 200,
            ellipsis: true
          },
          {
            title: '部门',
            dataIndex: 'department',
            key: 'department',
            width: 120
          },
          {
            title: '职位',
            dataIndex: 'position',
            key: 'position',
            width: 150
          },
          {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            scopedSlots: true
          },
          {
            title: '薪资',
            dataIndex: 'salary',
            key: 'salary',
            width: 120,
            scopedSlots: true
          },
          {
            title: '入职日期',
            dataIndex: 'joinDate',
            key: 'joinDate',
            width: 120
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            fixed: 'right',
            scopedSlots: true
          }
        ],
        searchParams: {},
        dataSource: mockData,
        rowSelection: {
          selectedRowKeys: [],
          onChange: (selectedRowKeys, selectedRows) => {
            console.log('选中变化:', selectedRowKeys, selectedRows)
          }
        },
        tableRef: null
      }
    },
    methods: {
      async fetchData(params) {
        console.log('请求参数:', params)

        await new Promise(resolve => setTimeout(resolve, 800))

        let data = [...this.dataSource, ...this.dataSource, ...this.dataSource]

        // 模拟搜索过滤
        if (params.name) {
          data = data.filter(item => item.name.includes(params.name))
        }
        if (params.department) {
          data = data.filter(item => item.department === params.department)
        }
        if (params.status) {
          data = data.filter(item => item.status === params.status)
        }

        const { pageIndex = 0, pageSize = 12 } = params
        const start = pageIndex * pageSize
        const end = start + pageSize

        return {
          success: true,
          result: {
            data: data.slice(start, end),
            total: data.length,
            pageIndex,
            pageSize
          }
        }
      },
      handleSearch() {
        // 触发重新请求
        this.searchParams = { ...this.searchParams }
      },
      handleAdd() {
        console.log('新建员工')
      },
      handleRefresh() {
        this.searchParams = {}
        console.log('刷新数据')
      },
      handleEdit(record) {
        console.log('编辑员工:', record)
      },
      handleView(record) {
        console.log('查看员工:', record)
      },
      handleDelete(record) {
        console.log('删除员工:', record)
      },
      handleBatchEdit() {
        console.log('批量编辑:', this.rowSelection.selectedRowKeys)
      },
      handleBatchDelete() {
        console.log('批量删除:', this.rowSelection.selectedRowKeys)
      },
      handleBatchExport() {
        console.log('批量导出:', this.rowSelection.selectedRowKeys)
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JProTable
    :columns="columns"
    :request="fetchData"
    :params="searchParams"
    :rowSelection="rowSelection"
    :alertShow="true"
    rowKey="id"
    type="PAGE"
  >
    <!-- 头部左侧 -->
    <template #headerLeftRender>
      <div class="header-left">
        <h3>员工管理系统</h3>
        <a-badge :count="dataSource.length" />
      </div>
    </template>
    
    <!-- 头部右侧 -->
    <template #headerRightRender>
      <div class="header-right">
        <a-input-search
          v-model:value="searchParams.name"
          placeholder="搜索员工姓名"
          @search="handleSearch"
          allowClear
        />
        <a-select
          v-model:value="searchParams.department"
          placeholder="部门筛选"
          allowClear
          @change="handleSearch"
        >
          <a-select-option value="技术部">技术部</a-select-option>
          <a-select-option value="产品部">产品部</a-select-option>
          <a-select-option value="设计部">设计部</a-select-option>
        </a-select>
        <a-button type="primary" @click="handleAdd">新建</a-button>
        <a-button @click="handleRefresh">刷新</a-button>
      </div>
    </template>
    
    <!-- 选择提示框 -->
    <template #alertRender="{ rowSelection, onClose }">
      <div class="selection-alert">
        <div class="alert-actions">
          <span>已选择 <strong>{{ rowSelection.selectedRowKeys.length }}</strong> 项</span>
          <a @click="handleBatchEdit">批量编辑</a>
          <a @click="handleBatchDelete">批量删除</a>
          <a @click="handleBatchExport">导出选中</a>
        </div>
        <a @click="onClose">取消选择</a>
      </div>
    </template>
    
    <!-- 操作列 -->
    <template #action="{ record }">
      <div class="action-buttons">
        <a @click="handleEdit(record)">编辑</a>
        <a @click="handleView(record)">查看</a>
        <a-popconfirm
          title="确定要删除这个员工吗？"
          @confirm="handleDelete(record)"
        >
          <a class="danger">删除</a>
        </a-popconfirm>
      </div>
    </template>
    
    <!-- 状态列 -->
    <template #status="{ record }">
      <a-tag :color="record.status === 'active' ? 'green' : 'red'">
        {{ record.status === 'active' ? '在职' : '离职' }}
      </a-tag>
    </template>
    
    <!-- 薪资列 -->
    <template #salary="{ record }">
      <span class="salary">
        ¥{{ record.salary?.toLocaleString() }}
      </span>
    </template>
  </JProTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchParams = ref({})
const rowSelection = ref({
  selectedRowKeys: [],
  onChange: (selectedRowKeys, selectedRows) => {
    console.log('选中变化:', selectedRowKeys, selectedRows)
  }
})

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 100
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    scopedSlots: true
  },
  {
    title: '薪资',
    dataIndex: 'salary',
    key: 'salary',
    width: 120,
    scopedSlots: true
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right',
    scopedSlots: true
  }
  // ... 更多列配置
]

const fetchData = async (params) => {
  console.log('请求参数:', params)
  
  // 模拟API请求
  const response = await fetch('/api/employees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  
  const result = await response.json()
  
  return {
    success: true,
    result: {
      data: result.data,
      total: result.total,
      pageIndex: result.pageIndex,
      pageSize: result.pageSize
    }
  }
}

const handleSearch = () => {
  searchParams.value = { ...searchParams.value }
}

const handleAdd = () => {
  console.log('新建员工')
}

const handleEdit = (record) => {
  console.log('编辑员工:', record)
}

const handleDelete = (record) => {
  console.log('删除员工:', record)
}

const handleBatchEdit = () => {
  console.log('批量编辑:', rowSelection.value.selectedRowKeys)
}
</script>

<style scoped>
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selection-alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.alert-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-buttons a.danger {
  color: #ff4d4f;
}

.salary {
  font-weight: 600;
  color: #ff6b35;
}
</style>`
      }
    }
  }
};
