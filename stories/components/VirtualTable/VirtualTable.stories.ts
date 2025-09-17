import type { Meta, StoryObj } from '@storybook/vue3';

/**
 * VirtualTable 虚拟表格组件
 *
 * 这是一个支持虚拟滚动的高性能表格组件，特别适用于展示大量数据。
 * 支持树形结构、行选择、展开/收起等功能，在保持流畅滚动的同时处理成千上万条数据。
 *
 * ## 何时使用
 * - 需要展示大量数据（1000+ 条记录）时
 * - 需要保持表格滚动性能的场景
 * - 需要展示树形结构数据时
 * - 需要支持展开/收起功能的层级数据
 * - 对渲染性能有较高要求的数据表格
 */
const meta: Meta = {
  title: '组件库/VirtualTable 虚拟表格',
  component: 'JVirtualTable',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
VirtualTable 是一个高性能的虚拟滚动表格组件，专为大数据量场景设计。

### 主要特性
- 虚拟滚动，支持渲染成千上万条数据而不影响性能
- 支持树形结构数据的展示和操作
- 支持展开/收起功能，可处理多层级数据
- 支持行选择（单选/多选），包括级联选择
- 固定视口高度，滚动体验流畅
- 支持自定义单元格内容
- 基于 Ant Design Vue Table 样式风格

### 基本用法
\`\`\`vue
<template>
  <JVirtualTable
    :columns="columns"
    :dataSource="dataSource"
    :height="500"
    rowKey="id"
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
      description: '表格列的配置描述，基本与 Ant Design Vue Table columns 一致'
    },
    dataSource: {
      control: 'object', 
      description: '数据数组，支持树形结构数据'
    },
    height: {
      control: 'number',
      description: '虚拟表格的固定高度（像素），默认 500'
    },
    rowKey: {
      control: 'text',
      description: '表格行的唯一标识字段名，默认为 "id"'
    },
    expandedRowKeys: {
      control: 'object',
      description: '展开的行的key数组，用于控制树形数据的展开状态'
    },
    rowSelection: {
      control: 'object',
      description: '行选择配置，支持单选和多选，支持级联选择'
    }
  },
  args: {
    height: 500,
    rowKey: 'id'
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 生成大量模拟数据用于虚拟滚动测试
const generateMockData = (count = 1000) => {
  const departments = ['技术部', '产品部', '设计部', '运营部', '市场部'];
  const positions = ['工程师', '经理', '总监', '专员', '主管'];
  const statuses = ['active', 'inactive'];
  
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `员工${index + 1}`,
    age: Math.floor(Math.random() * 30) + 25,
    email: `user${index + 1}@example.com`,
    department: departments[Math.floor(Math.random() * departments.length)],
    position: positions[Math.floor(Math.random() * positions.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    joinDate: `2022-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    salary: Math.floor(Math.random() * 20000) + 10000
  }));
};

// 生成树形结构数据
const generateTreeData = () => {
  const treeData = [];
  
  // 创建部门数据（第一层）
  const departments = [
    { id: 1, name: '技术部', type: 'department', parentId: null },
    { id: 2, name: '产品部', type: 'department', parentId: null },
    { id: 3, name: '设计部', type: 'department', parentId: null }
  ];
  
  let currentId = 4;
  
  departments.forEach(dept => {
    treeData.push({
      ...dept,
      email: `${dept.name.replace('部', '')}@company.com`,
      hasChildren: true,
      children: []
    });
    
    // 为每个部门创建团队（第二层）
    const teamCount = Math.floor(Math.random() * 3) + 2; // 2-4个团队
    for (let i = 0; i < teamCount; i++) {
      const teamId = currentId++;
      const team = {
        id: teamId,
        name: `${dept.name}${i + 1}组`,
        type: 'team',
        parentId: dept.id,
        email: `team${teamId}@company.com`,
        hasChildren: true,
        children: []
      };
      
      // 为每个团队创建员工（第三层）
      const memberCount = Math.floor(Math.random() * 5) + 3; // 3-7个员工
      for (let j = 0; j < memberCount; j++) {
        const memberId = currentId++;
        team.children.push({
          id: memberId,
          name: `员工${memberId}`,
          type: 'member',
          parentId: teamId,
          age: Math.floor(Math.random() * 20) + 25,
          email: `user${memberId}@company.com`,
          position: j === 0 ? '组长' : '成员',
          status: Math.random() > 0.1 ? 'active' : 'inactive',
          joinDate: `2022-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
          salary: Math.floor(Math.random() * 15000) + 8000,
          hasChildren: false
        });
      }
      
      treeData.push(team);
      treeData.push(...team.children);
    }
  });
  
  return treeData;
};

// 基础列配置
const baseColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 150,
    fixed: 'left'
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
    width: 120
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

// 树形数据列配置
const treeColumns = [
  {
    title: '名称',
    dataIndex: 'name', 
    key: 'name',
    width: 200,
    fixed: 'left'
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 100
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email', 
    width: 200
  },
  {
    title: '职位',
    dataIndex: 'position',
    key: 'position',
    width: 120
  },
  {
    title: '状态',
    dataIndex: 'status', 
    key: 'status',
    width: 100
  }
];

/**
 * 基础虚拟滚动
 * 展示VirtualTable处理大量数据的虚拟滚动能力
 */
export const 基础虚拟滚动: Story = {
  render: () => ({
    template: `
      <div style="padding: 16px;">
        <div style="margin-bottom: 16px;">
          <span>数据总量: <strong>{{ dataSource.length }}</strong> 条</span>
          <span style="margin-left: 16px; color: #666;">虚拟滚动只渲染可视区域内的数据，保证流畅性能</span>
        </div>
        <JVirtualTable
          :columns="columns"
          :dataSource="dataSource"
          :height="400"
          rowKey="id"
        >
          <template #bodyCell="{ text, record, column }">
            <template v-if="column.key === 'status'">
              <a-tag :color="record.status === 'active' ? 'green' : 'red'">
                {{ record.status === 'active' ? '在职' : '离职' }}
              </a-tag>
            </template>
            <template v-else>
              {{ text }}
            </template>
          </template>
        </JVirtualTable>
      </div>
    `,
    data() {
      return {
        columns: baseColumns,
        dataSource: generateMockData(2000) // 生成2000条数据
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JVirtualTable
    :columns="columns"
    :dataSource="dataSource"
    :height="400"
    rowKey="id"
  >
    <template #bodyCell="{ text, record, column }">
      <template v-if="column.key === 'status'">
        <a-tag :color="record.status === 'active' ? 'green' : 'red'">
          {{ record.status === 'active' ? '在职' : '离职' }}
        </a-tag>
      </template>
      <template v-else>
        {{ text }}
      </template>
    </template>
  </JVirtualTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 150,
    fixed: 'left'
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
    width: 120
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
]

// 生成大量测试数据
const dataSource = Array.from({ length: 2000 }, (_, index) => ({
  id: index + 1,
  name: \`员工\${index + 1}\`,
  age: Math.floor(Math.random() * 30) + 25,
  email: \`user\${index + 1}@example.com\`,
  department: '技术部',
  position: '工程师',
  status: Math.random() > 0.5 ? 'active' : 'inactive',
  joinDate: '2022-01-15'
}))
</script>`
      }
    }
  }
};

/**
 * 树形数据展开
 * 展示树形结构数据的展开和收起功能
 */
export const 树形数据展开: Story = {
  render: () => ({
    template: `
      <div style="padding: 16px;">
        <div style="margin-bottom: 16px;">
          <span>支持多层级树形数据的展开/收起操作，点击行首的展开图标进行操作</span>
        </div>
        <JVirtualTable
          :columns="columns"
          :dataSource="dataSource"
          :height="500"
          :expandedRowKeys="expandedKeys"
          rowKey="id"
          @update:expandedRowKeys="onExpandedKeysChange"
        >
          <template #bodyCell="{ text, record, column }">
            <template v-if="column.key === 'type'">
              <a-tag :color="getTypeColor(record.type)">
                {{ getTypeText(record.type) }}
              </a-tag>
            </template>
            <template v-else-if="column.key === 'status' && record.status">
              <a-tag :color="record.status === 'active' ? 'green' : 'red'">
                {{ record.status === 'active' ? '在职' : '离职' }}
              </a-tag>
            </template>
            <template v-else>
              {{ text || '--' }}
            </template>
          </template>
        </JVirtualTable>
      </div>
    `,
    data() {
      return {
        columns: treeColumns,
        dataSource: generateTreeData(),
        expandedKeys: [1, 2] // 默认展开前两个部门
      }
    },
    methods: {
      onExpandedKeysChange(keys) {
        this.expandedKeys = keys
      },
      getTypeColor(type) {
        const colors = {
          department: 'blue',
          team: 'green', 
          member: 'default'
        }
        return colors[type] || 'default'
      },
      getTypeText(type) {
        const texts = {
          department: '部门',
          team: '团队',
          member: '员工'
        }
        return texts[type] || type
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JVirtualTable
    :columns="columns"
    :dataSource="treeData"
    :height="500"
    :expandedRowKeys="expandedKeys"
    rowKey="id"
    @update:expandedRowKeys="onExpandedKeysChange"
  >
    <template #bodyCell="{ text, record, column }">
      <template v-if="column.key === 'type'">
        <a-tag :color="getTypeColor(record.type)">
          {{ getTypeText(record.type) }}
        </a-tag>
      </template>
      <template v-else-if="column.key === 'status' && record.status">
        <a-tag :color="record.status === 'active' ? 'green' : 'red'">
          {{ record.status === 'active' ? '在职' : '离职' }}
        </a-tag>
      </template>
      <template v-else>
        {{ text || '--' }}
      </template>
    </template>
  </JVirtualTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    fixed: 'left'
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 100
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    width: 200
  },
  {
    title: '职位',
    dataIndex: 'position',
    key: 'position',
    width: 120
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100
  }
]

const expandedKeys = ref([1, 2]) // 默认展开的节点

// 树形数据结构
const treeData = [
  {
    id: 1,
    name: '技术部',
    type: 'department',
    email: 'tech@company.com',
    hasChildren: true,
    children: [
      {
        id: 4,
        name: '前端组',
        type: 'team',
        parentId: 1,
        email: 'frontend@company.com',
        hasChildren: true,
        children: [
          {
            id: 11,
            name: '张三',
            type: 'member',
            parentId: 4,
            email: 'zhangsan@company.com',
            position: '组长',
            status: 'active',
            hasChildren: false
          }
          // ... 更多员工
        ]
      }
      // ... 更多团队
    ]
  }
  // ... 更多部门
]

const onExpandedKeysChange = (keys) => {
  expandedKeys.value = keys
}

const getTypeColor = (type) => {
  const colors = {
    department: 'blue',
    team: 'green',
    member: 'default'
  }
  return colors[type] || 'default'
}
</script>`
      }
    }
  }
};

/**
 * 行选择功能
 * 展示虚拟表格的行选择能力，支持单选、多选和级联选择
 */
export const 行选择功能: Story = {
  render: () => ({
    template: `
      <div style="padding: 16px;">
        <div style="margin-bottom: 16px;">
          <span>当前选中: <strong>{{ selectedRowKeys.length }}</strong> 项</span>
          <a-button style="margin-left: 16px;" size="small" @click="clearSelection">清空选择</a-button>
        </div>
        <JVirtualTable
          :columns="columns"
          :dataSource="dataSource"
          :height="400"
          :rowSelection="rowSelection"
          rowKey="id"
        >
          <template #bodyCell="{ text, record, column }">
            <template v-if="column.key === 'status'">
              <a-tag :color="record.status === 'active' ? 'green' : 'red'">
                {{ record.status === 'active' ? '在职' : '离职' }}
              </a-tag>
            </template>
            <template v-else-if="column.key === 'action'">
              <a @click="handleView(record)">查看详情</a>
            </template>
            <template v-else>
              {{ text }}
            </template>
          </template>
        </JVirtualTable>
        
        <div style="margin-top: 16px;" v-if="selectedRowKeys.length > 0">
          <h4>已选择的数据:</h4>
          <div style="max-height: 150px; overflow-y: auto; background: #f5f5f5; padding: 8px; border-radius: 4px;">
            <div v-for="item in selectedRows" :key="item.id" style="margin-bottom: 4px; font-size: 12px;">
              {{ item.name }} ({{ item.email }})
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        columns: [
          ...baseColumns,
          {
            title: '操作',
            key: 'action',
            width: 100,
            fixed: 'right'
          }
        ],
        dataSource: generateMockData(500),
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    computed: {
      rowSelection() {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            this.selectedRowKeys = selectedRowKeys
            this.selectedRows = selectedRows
            console.log('选中变化:', selectedRowKeys, selectedRows)
          },
          onSelect: (record, selected, selectedRows) => {
            console.log('单行选择:', record, selected)
          },
          onSelectAll: (selected, selectedRows) => {
            console.log('全选:', selected, selectedRows)
          }
        }
      }
    },
    methods: {
      clearSelection() {
        this.selectedRowKeys = []
        this.selectedRows = []
      },
      handleView(record) {
        alert(`查看员工: ${record.name}`)
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JVirtualTable
    :columns="columns"
    :dataSource="dataSource"
    :height="400"
    :rowSelection="rowSelection"
    rowKey="id"
  >
    <template #bodyCell="{ text, record, column }">
      <template v-if="column.key === 'status'">
        <a-tag :color="record.status === 'active' ? 'green' : 'red'">
          {{ record.status === 'active' ? '在职' : '离职' }}
        </a-tag>
      </template>
      <template v-else-if="column.key === 'action'">
        <a @click="handleView(record)">查看详情</a>
      </template>
      <template v-else>
        {{ text }}
      </template>
    </template>
  </JVirtualTable>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const selectedRowKeys = ref([])
const selectedRows = ref([])

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys, rows) => {
    selectedRowKeys.value = keys
    selectedRows.value = rows
    console.log('选中变化:', keys, rows)
  },
  onSelect: (record, selected, rows) => {
    console.log('单行选择:', record, selected)
  },
  onSelectAll: (selected, rows) => {
    console.log('全选:', selected, rows)
  }
}))

const clearSelection = () => {
  selectedRowKeys.value = []
  selectedRows.value = []
}

const handleView = (record) => {
  alert(\`查看员工: \${record.name}\`)
}
</script>`
      }
    }
  }
};

/**
 * 大数据性能展示
 * 展示VirtualTable在处理超大数据量时的性能优势
 */
export const 大数据性能展示: Story = {
  render: () => ({
    template: `
      <div style="padding: 16px;">
        <div style="margin-bottom: 16px; display: flex; gap: 16px; align-items: center;">
          <span>数据量选择：</span>
          <a-select v-model:value="dataCount" style="width: 120px;" @change="generateData">
            <a-select-option :value="1000">1,000 条</a-select-option>
            <a-select-option :value="5000">5,000 条</a-select-option>
            <a-select-option :value="10000">10,000 条</a-select-option>
            <a-select-option :value="50000">50,000 条</a-select-option>
          </a-select>
          <span style="color: #666;">
            当前渲染: <strong>{{ dataSource.length }}</strong> 条数据
          </span>
          <span style="color: #52c41a;">
            实际DOM节点: 约 15-20 个 (虚拟滚动)
          </span>
        </div>
        
        <JVirtualTable
          :columns="columns"
          :dataSource="dataSource"
          :height="450"
          rowKey="id"
        >
          <template #bodyCell="{ text, record, column }">
            <template v-if="column.key === 'status'">
              <a-tag :color="record.status === 'active' ? 'green' : 'red'">
                {{ record.status === 'active' ? '在职' : '离职' }}
              </a-tag>
            </template>
            <template v-else-if="column.key === 'salary'">
              <span style="color: #ff6b35; font-weight: 600;">
                ¥{{ record.salary?.toLocaleString() }}
              </span>
            </template>
            <template v-else>
              {{ text }}
            </template>
          </template>
        </JVirtualTable>
        
        <div style="margin-top: 16px; padding: 12px; background: #f6f8fa; border-radius: 6px; font-size: 13px;">
          <div style="margin-bottom: 8px;"><strong>性能说明：</strong></div>
          <div>• 虚拟滚动技术确保只渲染可视区域内的数据行</div>
          <div>• 无论数据量多大，DOM节点数量保持恒定</div>
          <div>• 滚动性能始终保持流畅，不会因数据量增加而下降</div>
          <div>• 内存占用低，适合大数据量场景</div>
        </div>
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
        dataSource: generateMockData(1000),
        dataCount: 1000
      }
    },
    methods: {
      generateData() {
        console.time('数据生成时间')
        this.dataSource = generateMockData(this.dataCount)
        console.timeEnd('数据生成时间')
        console.log(`已生成 ${this.dataCount} 条数据`)
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JVirtualTable
    :columns="columns"
    :dataSource="largeDataSource"
    :height="450"
    rowKey="id"
  >
    <template #bodyCell="{ text, record, column }">
      <template v-if="column.key === 'status'">
        <a-tag :color="record.status === 'active' ? 'green' : 'red'">
          {{ record.status === 'active' ? '在职' : '离职' }}
        </a-tag>
      </template>
      <template v-else-if="column.key === 'salary'">
        <span style="color: #ff6b35; font-weight: 600;">
          ¥{{ record.salary?.toLocaleString() }}
        </span>
      </template>
      <template v-else>
        {{ text }}
      </template>
    </template>
  </JVirtualTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 生成大量数据
const generateLargeData = (count = 10000) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: \`员工\${index + 1}\`,
    age: Math.floor(Math.random() * 30) + 25,
    email: \`user\${index + 1}@example.com\`,
    department: ['技术部', '产品部', '设计部'][Math.floor(Math.random() * 3)],
    position: ['工程师', '经理', '总监'][Math.floor(Math.random() * 3)],
    status: Math.random() > 0.5 ? 'active' : 'inactive',
    joinDate: '2022-01-15',
    salary: Math.floor(Math.random() * 20000) + 10000
  }))
}

const largeDataSource = ref(generateLargeData(10000))

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 150,
    fixed: 'left'
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
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100
  },
  {
    title: '薪资',
    dataIndex: 'salary',
    key: 'salary',
    width: 120
  }
]
</script>`
      }
    }
  }
};

