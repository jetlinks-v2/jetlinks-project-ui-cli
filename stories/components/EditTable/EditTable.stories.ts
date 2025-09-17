import type { Meta, StoryObj } from '@storybook/vue3';
import { EditTable as JEditTable } from '../../../packages/components/src';

/**
 * JEditTable 可编辑表格组件
 *
 * 这是一个功能强大的可编辑表格组件，支持行内编辑、分组、搜索、排序等功能。
 * 适用于需要大量数据编辑和管理的业务场景。
 *
 * ## 何时使用
 * - 需要对表格数据进行批量编辑时
 * - 需要复杂的表格交互功能时
 * - 需要分组管理数据时
 * - 需要实时验证和错误提示时
 */
const meta: Meta<typeof JEditTable> = {
  title: '组件库/EditTable 可编辑表格',
  component: JEditTable,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
JEditTable 是一个功能强大的可编辑表格组件。

### 主要特性
- 支持行内编辑
- 支持数据验证
- 支持分组管理
- 支持搜索和排序
- 支持自定义单元格渲染
- 支持全屏模式
- 支持虚拟滚动

### 基本用法
\`\`\`vue
<template>
  <JEditTable 
    :columns="columns"
    :dataSource="dataSource"
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
      description: '表格列配置'
    },
    dataSource: {
      control: 'object',
      description: '表格数据源'
    },
    rowKey: {
      control: 'text',
      description: '行数据的唯一标识字段'
    },
    height: {
      control: 'number',
      description: '表格高度'
    },
    cellHeight: {
      control: 'number',
      description: '单元格高度'
    },
    readonly: {
      control: 'boolean',
      description: '是否只读模式'
    },
    openGroup: {
      control: 'boolean',
      description: '是否开启分组功能'
    }
  },
  args: {
    rowKey: 'id',
    height: 300,
    cellHeight: 65,
    readonly: false,
    openGroup: false
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基础表格
 * 最基本的可编辑表格
 */
export const 基础表格: Story = {
  render: (args) => ({
    components: { JEditTable },
    setup() {
      const columns = [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 80,
          readonly: true
        },
        {
          title: '姓名',
          dataIndex: 'name',
          width: 120,
          editType: 'input',
          required: true
        },
        {
          title: '年龄',
          dataIndex: 'age',
          width: 80,
          editType: 'number'
        },
        {
          title: '部门',
          dataIndex: 'department',
          width: 120,
          editType: 'select',
          options: [
            { label: '技术部', value: 'tech' },
            { label: '产品部', value: 'product' },
            { label: '运营部', value: 'operation' },
            { label: '市场部', value: 'marketing' }
          ]
        },
        {
          title: '入职日期',
          dataIndex: 'joinDate',
          width: 120,
          editType: 'date'
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 100,
          editType: 'select',
          options: [
            { label: '在职', value: 'active' },
            { label: '离职', value: 'inactive' },
            { label: '休假', value: 'vacation' }
          ]
        }
      ];

      const dataSource = [
        {
          id: 1,
          name: '张三',
          age: 28,
          department: 'tech',
          joinDate: '2022-01-15',
          status: 'active'
        },
        {
          id: 2,
          name: '李四',
          age: 32,
          department: 'product',
          joinDate: '2021-08-20',
          status: 'active'
        },
        {
          id: 3,
          name: '王五',
          age: 25,
          department: 'operation',
          joinDate: '2023-03-10',
          status: 'vacation'
        },
        {
          id: 4,
          name: '赵六',
          age: 30,
          department: 'marketing',
          joinDate: '2020-12-05',
          status: 'active'
        },
        {
          id: 5,
          name: '钱七',
          age: 27,
          department: 'tech',
          joinDate: '2022-06-18',
          status: 'inactive'
        }
      ];

      return {
        ...args,
        columns,
        dataSource
      };
    },
    template: `
      <div style="padding: 20px; height: 100vh; background: #f0f2f5;">
        <div style="margin-bottom: 16px;">
          <h3 style="margin: 0 0 8px 0;">员工信息管理</h3>
          <p style="margin: 0; color: #666; font-size: 14px;">
            点击单元格进行编辑，支持不同类型的编辑控件
          </p>
        </div>
        <JEditTable 
          :columns="columns"
          :dataSource="dataSource"
          :rowKey="rowKey"
          :height="height"
          :cellHeight="cellHeight"
          :readonly="readonly"
          :openGroup="openGroup"
        />
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div style="padding: 20px; height: 100vh; background: #f0f2f5;">
    <div style="margin-bottom: 16px;">
      <h3>员工信息管理</h3>
      <p>点击单元格进行编辑，支持不同类型的编辑控件</p>
    </div>
    <JEditTable 
      :columns="columns"
      :dataSource="dataSource"
      rowKey="id"
      :height="300"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JEditTable from '@jetlinks/components'

const columns = ref([
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
    readonly: true
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 120,
    editType: 'input',
    required: true
  },
  {
    title: '年龄',
    dataIndex: 'age',
    width: 80,
    editType: 'number'
  },
  {
    title: '部门',
    dataIndex: 'department',
    width: 120,
    editType: 'select',
    options: [
      { label: '技术部', value: 'tech' },
      { label: '产品部', value: 'product' },
      { label: '运营部', value: 'operation' },
      { label: '市场部', value: 'marketing' }
    ]
  },
  {
    title: '入职日期',
    dataIndex: 'joinDate',
    width: 120,
    editType: 'date'
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    editType: 'select',
    options: [
      { label: '在职', value: 'active' },
      { label: '离职', value: 'inactive' },
      { label: '休假', value: 'vacation' }
    ]
  }
])

const dataSource = ref([
  {
    id: 1,
    name: '张三',
    age: 28,
    department: 'tech',
    joinDate: '2022-01-15',
    status: 'active'
  },
  {
    id: 2,
    name: '李四',
    age: 32,
    department: 'product',
    joinDate: '2021-08-20',
    status: 'active'
  },
  {
    id: 3,
    name: '王五',
    age: 25,
    department: 'operation',
    joinDate: '2023-03-10',
    status: 'vacation'
  },
  {
    id: 4,
    name: '赵六',
    age: 30,
    department: 'marketing',
    joinDate: '2020-12-05',
    status: 'active'
  },
  {
    id: 5,
    name: '钱七',
    age: 27,
    department: 'tech',
    joinDate: '2022-06-18',
    status: 'inactive'
  }
])
</script>`
      }
    }
  }
};

/**
 * 只读模式
 * 设置readonly为true时，表格只能查看不能编辑
 */
export const 只读模式: Story = {
  render: () => ({
    components: { JEditTable },
    setup() {
      const columns = [
        {
          title: '产品名称',
          dataIndex: 'name',
          width: 150
        },
        {
          title: '价格',
          dataIndex: 'price',
          width: 100,
          render: (text) => `¥${text}`
        },
        {
          title: '库存',
          dataIndex: 'stock',
          width: 80
        },
        {
          title: '分类',
          dataIndex: 'category',
          width: 120
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 100,
          render: (text) => {
            const statusMap = {
              'in_stock': '有库存',
              'out_of_stock': '缺货',
              'discontinued': '停产'
            };
            return statusMap[text] || text;
          }
        }
      ];

      const dataSource = [
        {
          id: 1,
          name: 'iPhone 15 Pro',
          price: 7999,
          stock: 50,
          category: '手机',
          status: 'in_stock'
        },
        {
          id: 2,
          name: 'MacBook Pro',
          price: 12999,
          stock: 25,
          category: '电脑',
          status: 'in_stock'
        },
        {
          id: 3,
          name: 'iPad Air',
          price: 4399,
          stock: 0,
          category: '平板',
          status: 'out_of_stock'
        },
        {
          id: 4,
          name: 'Apple Watch',
          price: 2999,
          stock: 30,
          category: '智能手表',
          status: 'in_stock'
        },
        {
          id: 5,
          name: 'AirPods Pro',
          price: 1899,
          stock: 100,
          category: '耳机',
          status: 'discontinued'
        }
      ];

      return {
        columns,
        dataSource,
        readonly: true,
        height: 300
      };
    },
    template: `
      <div style="padding: 20px; height: 100vh; background: #f0f2f5;">
        <div style="margin-bottom: 16px;">
          <h3 style="margin: 0 0 8px 0;">产品信息查看（只读模式）</h3>
          <p style="margin: 0; color: #666; font-size: 14px;">
            只读模式下，表格数据仅供查看，无法编辑
          </p>
        </div>
        <JEditTable 
          :columns="columns"
          :dataSource="dataSource"
          row-key="id"
          :height="height"
          :readonly="readonly"
        />
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div style="padding: 20px; height: 100vh; background: #f0f2f5;">
    <div style="margin-bottom: 16px;">
      <h3>产品信息查看（只读模式）</h3>
      <p>只读模式下，表格数据仅供查看，无法编辑</p>
    </div>
    <JEditTable 
      :columns="columns"
      :dataSource="dataSource"
      rowKey="id"
      :readonly="true"
      :height="300"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JEditTable from '@jetlinks/components'

const columns = ref([
  {
    title: '产品名称',
    dataIndex: 'name',
    width: 150
  },
  {
    title: '价格',
    dataIndex: 'price',
    width: 100,
    render: (text) => \`¥\${text}\`
  },
  {
    title: '库存',
    dataIndex: 'stock',
    width: 80
  },
  {
    title: '分类',
    dataIndex: 'category',
    width: 120
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (text) => {
      const statusMap = {
        'in_stock': '有库存',
        'out_of_stock': '缺货',
        'discontinued': '停产'
      }
      return statusMap[text] || text
    }
  }
])

const dataSource = ref([
  {
    id: 1,
    name: 'iPhone 15 Pro',
    price: 7999,
    stock: 50,
    category: '手机',
    status: 'in_stock'
  },
  {
    id: 2,
    name: 'MacBook Pro',
    price: 12999,
    stock: 25,
    category: '电脑',
    status: 'in_stock'
  },
  {
    id: 3,
    name: 'iPad Air',
    price: 4399,
    stock: 0,
    category: '平板',
    status: 'out_of_stock'
  },
  {
    id: 4,
    name: 'Apple Watch',
    price: 2999,
    stock: 30,
    category: '智能手表',
    status: 'in_stock'
  },
  {
    id: 5,
    name: 'AirPods Pro',
    price: 1899,
    stock: 100,
    category: '耳机',
    status: 'discontinued'
  }
])
</script>`
      }
    }
  }
};

/**
 * 自定义高度
 * 可以设置不同的表格高度和单元格高度
 */
export const 自定义高度: Story = {
  render: () => ({
    components: { JEditTable },
    setup() {
      const columns = [
        {
          title: '任务ID',
          dataIndex: 'id',
          width: 80,
          readonly: true
        },
        {
          title: '任务名称',
          dataIndex: 'name',
          width: 200,
          editType: 'input'
        },
        {
          title: '优先级',
          dataIndex: 'priority',
          width: 100,
          editType: 'select',
          options: [
            { label: '高', value: 'high' },
            { label: '中', value: 'medium' },
            { label: '低', value: 'low' }
          ]
        },
        {
          title: '负责人',
          dataIndex: 'assignee',
          width: 120,
          editType: 'input'
        },
        {
          title: '截止日期',
          dataIndex: 'dueDate',
          width: 120,
          editType: 'date'
        },
        {
          title: '描述',
          dataIndex: 'description',
          width: 250,
          editType: 'textarea'
        }
      ];

      const dataSource = [];
      for (let i = 1; i <= 20; i++) {
        dataSource.push({
          id: i,
          name: `任务 ${i}`,
          priority: i % 3 === 0 ? 'high' : i % 2 === 0 ? 'medium' : 'low',
          assignee: `负责人${i}`,
          dueDate: `2024-0${(i % 9) + 1}-${String(i % 28 + 1).padStart(2, '0')}`,
          description: `这是任务 ${i} 的详细描述信息，包含了任务的具体要求和注意事项。`
        });
      }

      return {
        columns,
        dataSource,
        height: 500,
        cellHeight: 80,
        readonly: false
      };
    },
    template: `
      <div style="padding: 20px; height: 100vh; background: #f0f2f5;">
        <div style="margin-bottom: 16px;">
          <h3 style="margin: 0 0 8px 0;">任务管理（自定义高度）</h3>
          <p style="margin: 0; color: #666; font-size: 14px;">
            表格高度500px，单元格高度80px，适合显示更多内容
          </p>
        </div>
        <JEditTable 
          :columns="columns"
          :dataSource="dataSource"
          row-key="id"
          :height="height"
          :cellHeight="cellHeight"
          :readonly="readonly"
        />
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div style="padding: 20px; height: 100vh; background: #f0f2f5;">
    <div style="margin-bottom: 16px;">
      <h3>任务管理（自定义高度）</h3>
      <p>表格高度500px，单元格高度80px，适合显示更多内容</p>
    </div>
    <JEditTable 
      :columns="columns"
      :dataSource="dataSource"
      rowKey="id"
      :height="500"
      :cellHeight="80"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JEditTable from '@jetlinks/components'

const columns = ref([
  {
    title: '任务ID',
    dataIndex: 'id',
    width: 80,
    readonly: true
  },
  {
    title: '任务名称',
    dataIndex: 'name',
    width: 200,
    editType: 'input'
  },
  {
    title: '优先级',
    dataIndex: 'priority',
    width: 100,
    editType: 'select',
    options: [
      { label: '高', value: 'high' },
      { label: '中', value: 'medium' },
      { label: '低', value: 'low' }
    ]
  },
  {
    title: '负责人',
    dataIndex: 'assignee',
    width: 120,
    editType: 'input'
  },
  {
    title: '截止日期',
    dataIndex: 'dueDate',
    width: 120,
    editType: 'date'
  },
  {
    title: '描述',
    dataIndex: 'description',
    width: 250,
    editType: 'textarea'
  }
])

const dataSource = ref([])
// 生成20条模拟数据
for (let i = 1; i <= 20; i++) {
  dataSource.value.push({
    id: i,
    name: \`任务 \${i}\`,
    priority: i % 3 === 0 ? 'high' : i % 2 === 0 ? 'medium' : 'low',
    assignee: \`负责人\${i}\`,
    dueDate: \`2024-0\${(i % 9) + 1}-\${String(i % 28 + 1).padStart(2, '0')}\`,
    description: \`这是任务 \${i} 的详细描述信息，包含了任务的具体要求和注意事项。\`
  })
}
</script>`
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
    components: { JEditTable },
    setup() {
      const columns = [
        {
          title: '订单号',
          dataIndex: 'orderNo',
          width: 150,
          readonly: true
        },
        {
          title: '商品名称',
          dataIndex: 'productName',
          width: 180,
          editType: 'input',
          required: true
        },
        {
          title: '数量',
          dataIndex: 'quantity',
          width: 80,
          editType: 'number',
          required: true,
          min: 1
        },
        {
          title: '单价',
          dataIndex: 'price',
          width: 100,
          editType: 'number',
          precision: 2,
          render: (text) => `¥${Number(text).toFixed(2)}`
        },
        {
          title: '总价',
          dataIndex: 'total',
          width: 100,
          readonly: true,
          render: (text) => `¥${Number(text).toFixed(2)}`
        },
        {
          title: '客户',
          dataIndex: 'customer',
          width: 120,
          editType: 'select',
          options: [
            { label: '阿里巴巴', value: 'alibaba' },
            { label: '腾讯科技', value: 'tencent' },
            { label: '字节跳动', value: 'bytedance' },
            { label: '美团', value: 'meituan' },
            { label: '滴滴出行', value: 'didi' }
          ]
        },
        {
          title: '订单状态',
          dataIndex: 'status',
          width: 120,
          editType: 'select',
          options: [
            { label: '待确认', value: 'pending' },
            { label: '已确认', value: 'confirmed' },
            { label: '已发货', value: 'shipped' },
            { label: '已完成', value: 'completed' },
            { label: '已取消', value: 'cancelled' }
          ]
        },
        {
          title: '下单日期',
          dataIndex: 'orderDate',
          width: 120,
          editType: 'date'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 200,
          editType: 'textarea'
        }
      ];

      const dataSource = [
        {
          id: 1,
          orderNo: 'ORD-2024-001',
          productName: '企业级服务器',
          quantity: 2,
          price: 15000,
          total: 30000,
          customer: 'alibaba',
          status: 'confirmed',
          orderDate: '2024-01-15',
          remark: '需要加急处理'
        },
        {
          id: 2,
          orderNo: 'ORD-2024-002',
          productName: '高性能工作站',
          quantity: 5,
          price: 8000,
          total: 40000,
          customer: 'tencent',
          status: 'shipped',
          orderDate: '2024-01-16',
          remark: '按合同规定配置'
        },
        {
          id: 3,
          orderNo: 'ORD-2024-003',
          productName: '网络安全设备',
          quantity: 1,
          price: 25000,
          total: 25000,
          customer: 'bytedance',
          status: 'pending',
          orderDate: '2024-01-17',
          remark: ''
        },
        {
          id: 4,
          orderNo: 'ORD-2024-004',
          productName: '数据存储系统',
          quantity: 3,
          price: 12000,
          total: 36000,
          customer: 'meituan',
          status: 'completed',
          orderDate: '2024-01-18',
          remark: '客户要求定制化配置'
        },
        {
          id: 5,
          orderNo: 'ORD-2024-005',
          productName: '云计算平台',
          quantity: 1,
          price: 50000,
          total: 50000,
          customer: 'didi',
          status: 'confirmed',
          orderDate: '2024-01-19',
          remark: '分期付款'
        }
      ];

      return {
        columns,
        dataSource,
        height: 400,
        cellHeight: 70,
        readonly: false
      };
    },
    template: `
      <div style="padding: 20px; height: 100vh; background: #f0f2f5;">
        <div style="margin-bottom: 16px;">
          <h3 style="margin: 0 0 8px 0;">订单管理系统</h3>
          <p style="margin: 0; color: #666; font-size: 14px;">
            支持在线编辑订单信息，包含数量、价格、状态等字段的实时更新
          </p>
        </div>
        
        <div style="margin-bottom: 16px; display: flex; gap: 12px;">
          <button style="padding: 6px 16px; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            新增订单
          </button>
          <button style="padding: 6px 16px; background: #52c41a; color: white; border: none; border-radius: 4px; cursor: pointer;">
            批量导出
          </button>
          <button style="padding: 6px 16px; background: #faad14; color: white; border: none; border-radius: 4px; cursor: pointer;">
            数据统计
          </button>
        </div>
        
        <JEditTable 
          :columns="columns"
          :dataSource="dataSource"
          row-key="id"
          :height="height"
          :cellHeight="cellHeight"
          :readonly="readonly"
        />
        
        <div style="margin-top: 16px; padding: 12px; background: white; border-radius: 4px; font-size: 14px;">
          <strong>使用说明：</strong>
          <ul style="margin: 8px 0 0 20px; color: #666;">
            <li>点击单元格即可编辑对应内容</li>
            <li>支持输入框、数字、下拉选择、日期、文本域等多种编辑类型</li>
            <li>必填字段会有相应的验证提示</li>
            <li>总价字段为只读，根据数量和单价自动计算</li>
          </ul>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="order-management">
    <div class="header">
      <h3>订单管理系统</h3>
      <p>支持在线编辑订单信息，包含数量、价格、状态等字段的实时更新</p>
    </div>
    
    <div class="actions">
      <button class="btn-primary">新增订单</button>
      <button class="btn-success">批量导出</button>
      <button class="btn-warning">数据统计</button>
    </div>
    
    <JEditTable 
      :columns="columns"
      :dataSource="dataSource"
      rowKey="id"
      :height="400"
      :cellHeight="70"
    />
    
    <div class="instructions">
      <strong>使用说明：</strong>
      <ul>
        <li>点击单元格即可编辑对应内容</li>
        <li>支持输入框、数字、下拉选择、日期、文本域等多种编辑类型</li>
        <li>必填字段会有相应的验证提示</li>
        <li>总价字段为只读，根据数量和单价自动计算</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import JEditTable from '@jetlinks/components'

const columns = ref([
  {
    title: '订单号',
    dataIndex: 'orderNo',
    width: 150,
    readonly: true
  },
  {
    title: '商品名称',
    dataIndex: 'productName',
    width: 180,
    editType: 'input',
    required: true
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    width: 80,
    editType: 'number',
    required: true,
    min: 1
  },
  {
    title: '单价',
    dataIndex: 'price',
    width: 100,
    editType: 'number',
    precision: 2,
    render: (text) => \`¥\${Number(text).toFixed(2)}\`
  },
  {
    title: '总价',
    dataIndex: 'total',
    width: 100,
    readonly: true,
    render: (text) => \`¥\${Number(text).toFixed(2)}\`
  },
  {
    title: '客户',
    dataIndex: 'customer',
    width: 120,
    editType: 'select',
    options: [
      { label: '阿里巴巴', value: 'alibaba' },
      { label: '腾讯科技', value: 'tencent' },
      { label: '字节跳动', value: 'bytedance' },
      { label: '美团', value: 'meituan' },
      { label: '滴滴出行', value: 'didi' }
    ]
  },
  {
    title: '订单状态',
    dataIndex: 'status',
    width: 120,
    editType: 'select',
    options: [
      { label: '待确认', value: 'pending' },
      { label: '已确认', value: 'confirmed' },
      { label: '已发货', value: 'shipped' },
      { label: '已完成', value: 'completed' },
      { label: '已取消', value: 'cancelled' }
    ]
  },
  {
    title: '下单日期',
    dataIndex: 'orderDate',
    width: 120,
    editType: 'date'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 200,
    editType: 'textarea'
  }
])

const dataSource = ref([
  {
    id: 1,
    orderNo: 'ORD-2024-001',
    productName: '企业级服务器',
    quantity: 2,
    price: 15000,
    total: 30000,
    customer: 'alibaba',
    status: 'confirmed',
    orderDate: '2024-01-15',
    remark: '需要加急处理'
  },
  {
    id: 2,
    orderNo: 'ORD-2024-002',
    productName: '高性能工作站',
    quantity: 5,
    price: 8000,
    total: 40000,
    customer: 'tencent',
    status: 'shipped',
    orderDate: '2024-01-16',
    remark: '按合同规定配置'
  },
  // 更多数据...
])
</script>

<style scoped>
.order-management {
  padding: 20px;
  height: 100vh;
  background: #f0f2f5;
}

.header {
  margin-bottom: 16px;
}

.header h3 {
  margin: 0 0 8px 0;
}

.header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.actions {
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
}

.btn-primary {
  padding: 6px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-success {
  padding: 6px 16px;
  background: #52c41a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-warning {
  padding: 6px 16px;
  background: #faad14;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.instructions {
  margin-top: 16px;
  padding: 12px;
  background: white;
  border-radius: 4px;
  font-size: 14px;
}

.instructions ul {
  margin: 8px 0 0 20px;
  color: #666;
}
</style>`
      }
    }
  }
};
