import type { Meta, StoryObj } from '@storybook/vue3';
import { accessConfigTypeFilter } from '../../packages/utils/src/util';
import { ref } from 'vue';

/**
 * 工具函数
 * 
 * 这里展示了项目中常用的工具函数的使用方法和示例。
 */
const meta: Meta = {
  title: '工具函数/AccessConfigTypeFilter 配置数据转换',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
accessConfigTypeFilter 是一个数据转换函数，将配置数据转换为适合下拉选择器的格式。

### 主要特性
- 将原始配置数据转换为 label/value 格式
- 保留原始数据的所有属性
- 使用 name 作为 label，id 作为 value
- 处理空数据情况

### 使用场景
- 下拉选择器数据转换
- 权限配置选项处理
- 角色选择数据格式化
- API 数据适配

### 基本用法

\`\`\`javascript
import { accessConfigTypeFilter } from '@jetlinks-web/utils';

// 原始配置数据
const rawData = [
  { id: '1', name: '管理员', description: '系统管理员角色' },
  { id: '2', name: '普通用户', description: '普通用户角色' },
  { id: '3', name: '访客', description: '访客角色' }
];

// 转换后的数据
const options = accessConfigTypeFilter(rawData);
// 结果：
// [
//   { id: '1', name: '管理员', description: '系统管理员角色', label: '管理员', value: '1' },
//   { id: '2', name: '普通用户', description: '普通用户角色', label: '普通用户', value: '2' },
//   { id: '3', name: '访客', description: '访客角色', label: '访客', value: '3' }
// ]
\`\`\`

### 在 Vue 组件中使用

\`\`\`vue
<template>
  <div>
    <a-select 
      v-model:value="selectedRole" 
      :options="roleOptions"
      placeholder="请选择角色"
      style="width: 200px;"
    />
    <p v-if="selectedRole">已选择：{{ getSelectedRoleName() }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { accessConfigTypeFilter } from '@jetlinks-web/utils';

const selectedRole = ref();

// 原始角色数据
const rawRoles = [
  { id: '1', name: '管理员', description: '系统管理员' },
  { id: '2', name: '编辑者', description: '内容编辑者' },
  { id: '3', name: '查看者', description: '只读用户' }
];

// 转换为选择器选项
const roleOptions = computed(() => accessConfigTypeFilter(rawRoles));

const getSelectedRoleName = () => {
  const role = rawRoles.find(r => r.id === selectedRole.value);
  return role ? role.name : '';
};
</script>
\`\`\`
        `
      },
      source: {
        type: 'code'
      }
    }
  },
  argTypes: {
    dataType: {
      control: 'select',
      options: ['roles', 'permissions', 'departments'],
      description: '数据类型',
      defaultValue: 'roles'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicUsage: Story = {
  name: '基本用法',
  parameters: {
    docs: {
      source: {
        code: `
import { accessConfigTypeFilter } from '@jetlinks-web/utils';

// 原始数据
const rawData = [
  { id: '1', name: '管理员', description: '系统管理员角色' },
  { id: '2', name: '普通用户', description: '普通用户角色' },
  { id: '3', name: '访客', description: '访客角色' }
];

// 转换数据
const options = accessConfigTypeFilter(rawData);

// 在选择器中使用
<a-select 
  v-model:value="selected" 
  :options="options"
  placeholder="请选择角色"
/>
        `
      }
    }
  },
  render: (args) => ({
    setup() {
      const selected = ref();
      
      const rawData = [
        { id: '1', name: '管理员', description: '系统管理员角色' },
        { id: '2', name: '普通用户', description: '普通用户角色' },
        { id: '3', name: '访客', description: '访客角色' }
      ];
      
      const options = accessConfigTypeFilter(rawData);
      
      const getSelectedInfo = () => {
        const item = rawData.find(r => r.id === selected.value);
        return item ? `${item.name} - ${item.description}` : '未选择';
      };
      
      return { selected, options, rawData, getSelectedInfo };
    },
    template: `
      <div>
        <div style="margin-bottom: 16px;">
          <h4 style="margin: 0 0 8px 0;">选择角色：</h4>
          <a-select 
            v-model:value="selected" 
            :options="options"
            placeholder="请选择角色"
            style="width: 200px;"
          />
        </div>
        
        <div style="background: #f5f5f5; padding: 12px; border-radius: 4px;">
          <p style="margin: 0 0 8px 0; font-weight: bold;">已选择：</p>
          <p style="margin: 0; color: #1890ff;">{{ getSelectedInfo() }}</p>
        </div>
        
        <div style="margin-top: 16px; background: #fafafa; padding: 12px; border-radius: 4px;">
          <p style="margin: 0 0 8px 0; font-weight: bold;">转换后的数据结构：</p>
          <pre style="margin: 0; font-size: 12px; background: white; padding: 8px; border-radius: 4px; overflow: auto;">{{ JSON.stringify(options, null, 2) }}</pre>
        </div>
      </div>
    `
  })
};

export const RoleManagement: Story = {
  name: '角色管理示例',
  parameters: {
    docs: {
      source: {
        code: `
import { accessConfigTypeFilter } from '@jetlinks-web/utils';
import { ref } from 'vue';

// 角色数据
const roles = [
  { id: 'admin', name: '系统管理员', description: '拥有所有权限' },
  { id: 'editor', name: '内容编辑', description: '可编辑内容' },
  { id: 'viewer', name: '查看者', description: '只读权限' }
];

const selectedRole = ref();
const roleOptions = accessConfigTypeFilter(roles);

// 在表单中使用
<a-form-item label="用户角色">
  <a-select 
    v-model:value="selectedRole" 
    :options="roleOptions"
    placeholder="请选择用户角色"
  />
</a-form-item>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const selectedRole = ref();
      const userForm = ref({
        username: '',
        email: '',
        role: ''
      });
      
      const roles = [
        { id: 'admin', name: '系统管理员', description: '拥有所有权限', permissions: ['read', 'write', 'delete'] },
        { id: 'editor', name: '内容编辑', description: '可编辑内容', permissions: ['read', 'write'] },
        { id: 'viewer', name: '查看者', description: '只读权限', permissions: ['read'] }
      ];
      
      const roleOptions = accessConfigTypeFilter(roles);
      
      const getRoleDetails = () => {
        const role = roles.find(r => r.id === selectedRole.value);
        return role || null;
      };
      
      const resetForm = () => {
        selectedRole.value = undefined;
        userForm.value = { username: '', email: '', role: '' };
      };
      
      return { selectedRole, userForm, roleOptions, getRoleDetails, resetForm };
    },
    template: `
      <div>
        <a-form layout="vertical" style="max-width: 400px;">
          <a-form-item label="用户名">
            <a-input v-model:value="userForm.username" placeholder="请输入用户名" />
          </a-form-item>
          
          <a-form-item label="邮箱">
            <a-input v-model:value="userForm.email" placeholder="请输入邮箱" />
          </a-form-item>
          
          <a-form-item label="用户角色">
            <a-select 
              v-model:value="selectedRole" 
              :options="roleOptions"
              placeholder="请选择用户角色"
            />
          </a-form-item>
          
          <a-form-item>
            <a-space>
              <a-button type="primary">保存</a-button>
              <a-button @click="resetForm">重置</a-button>
            </a-space>
          </a-form-item>
        </a-form>
        
        <div v-if="getRoleDetails()" style="margin-top: 16px; padding: 12px; background: #e6f7ff; border: 1px solid #91d5ff; border-radius: 4px;">
          <h4 style="margin: 0 0 8px 0; color: #1890ff;">选择的角色信息：</h4>
          <p style="margin: 4px 0;"><strong>角色名称：</strong>{{ getRoleDetails().name }}</p>
          <p style="margin: 4px 0;"><strong>描述：</strong>{{ getRoleDetails().description }}</p>
          <p style="margin: 4px 0;"><strong>权限：</strong>{{ getRoleDetails().permissions.join(', ') }}</p>
        </div>
      </div>
    `
  })
};

export const DepartmentSelection: Story = {
  name: '部门选择示例',
  parameters: {
    docs: {
      source: {
        code: `
import { accessConfigTypeFilter } from '@jetlinks-web/utils';
import { ref } from 'vue';

// 部门数据
const departments = [
  { id: 'tech', name: '技术部', description: '负责技术开发' },
  { id: 'sales', name: '销售部', description: '负责产品销售' },
  { id: 'hr', name: '人事部', description: '负责人力资源' },
  { id: 'finance', name: '财务部', description: '负责财务管理' }
];

const selectedDept = ref();
const deptOptions = accessConfigTypeFilter(departments);

// 级联选择使用
<a-cascader 
  v-model:value="selectedDept" 
  :options="deptOptions"
  placeholder="请选择部门"
/>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const selectedDept = ref();
      const multipleSelection = ref([]);
      
      const departments = [
        { id: 'tech', name: '技术部', description: '负责技术开发', manager: '张三', memberCount: 25 },
        { id: 'sales', name: '销售部', description: '负责产品销售', manager: '李四', memberCount: 18 },
        { id: 'hr', name: '人事部', description: '负责人力资源', manager: '王五', memberCount: 8 },
        { id: 'finance', name: '财务部', description: '负责财务管理', manager: '赵六', memberCount: 12 },
        { id: 'marketing', name: '市场部', description: '负责市场推广', manager: '钱七', memberCount: 15 }
      ];
      
      const deptOptions = accessConfigTypeFilter(departments);
      
      const getDeptDetails = () => {
        const dept = departments.find(d => d.id === selectedDept.value);
        return dept || null;
      };
      
      const getSelectedDepts = () => {
        return departments.filter(d => multipleSelection.value.includes(d.id));
      };
      
      return { 
        selectedDept, 
        multipleSelection, 
        deptOptions, 
        getDeptDetails, 
        getSelectedDepts 
      };
    },
    template: `
      <div>
        <a-space direction="vertical" style="width: 100%;" size="large">
          <div>
            <h4 style="margin: 0 0 8px 0;">单选部门：</h4>
            <a-select 
              v-model:value="selectedDept" 
              :options="deptOptions"
              placeholder="请选择部门"
              style="width: 300px;"
            />
            
            <div v-if="getDeptDetails()" style="margin-top: 12px; padding: 12px; background: #f6ffed; border: 1px solid #b7eb8f; border-radius: 4px;">
              <h5 style="margin: 0 0 8px 0; color: #52c41a;">部门信息：</h5>
              <p style="margin: 2px 0;"><strong>部门名称：</strong>{{ getDeptDetails().name }}</p>
              <p style="margin: 2px 0;"><strong>部门描述：</strong>{{ getDeptDetails().description }}</p>
              <p style="margin: 2px 0;"><strong>部门经理：</strong>{{ getDeptDetails().manager }}</p>
              <p style="margin: 2px 0;"><strong>成员数量：</strong>{{ getDeptDetails().memberCount }}人</p>
            </div>
          </div>
          
          <div>
            <h4 style="margin: 0 0 8px 0;">多选部门：</h4>
            <a-select 
              v-model:value="multipleSelection" 
              :options="deptOptions"
              placeholder="请选择多个部门"
              mode="multiple"
              style="width: 300px;"
            />
            
            <div v-if="getSelectedDepts().length > 0" style="margin-top: 12px; padding: 12px; background: #fff7e6; border: 1px solid #ffd591; border-radius: 4px;">
              <h5 style="margin: 0 0 8px 0; color: #fa8c16;">已选择 {{ getSelectedDepts().length }} 个部门：</h5>
              <div v-for="dept in getSelectedDepts()" :key="dept.id" style="margin: 4px 0; padding: 8px; background: white; border-radius: 4px;">
                <strong>{{ dept.name }}</strong> - {{ dept.description }} ({{ dept.memberCount }}人)
              </div>
            </div>
          </div>
        </a-space>
      </div>
    `
  })
};

export const EmptyDataHandling: Story = {
  name: '空数据处理',
  parameters: {
    docs: {
      source: {
        code: `
import { accessConfigTypeFilter } from '@jetlinks-web/utils';

// 处理各种边界情况
const emptyArray = accessConfigTypeFilter([]);          // 返回 []
const nullData = accessConfigTypeFilter(null);          // 返回 []
const undefinedData = accessConfigTypeFilter(undefined);// 返回 []

// 在组件中安全使用
const options = accessConfigTypeFilter(apiData) || [];

// 防御性编程
<a-select 
  :options="options"
  :disabled="!options.length"
  placeholder="无可选项"
/>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const dataType = ref('empty');
      
      const testData = {
        empty: [],
        null: null,
        undefined: undefined,
        normal: [
          { id: '1', name: '选项1', description: '正常数据' },
          { id: '2', name: '选项2', description: '正常数据' }
        ]
      };
      
      const getProcessedData = () => {
        const data = testData[dataType.value];
        return accessConfigTypeFilter(data);
      };
      
      const getDataDescription = () => {
        switch (dataType.value) {
          case 'empty': return '空数组 []';
          case 'null': return 'null 值';
          case 'undefined': return 'undefined 值';
          case 'normal': return '正常数据';
          default: return '未知';
        }
      };
      
      return { dataType, getProcessedData, getDataDescription };
    },
    template: `
      <div>
        <div style="margin-bottom: 16px;">
          <h4 style="margin: 0 0 8px 0;">选择数据类型：</h4>
          <a-radio-group v-model:value="dataType">
            <a-radio value="empty">空数组</a-radio>
            <a-radio value="null">null</a-radio>
            <a-radio value="undefined">undefined</a-radio>
            <a-radio value="normal">正常数据</a-radio>
          </a-radio-group>
        </div>
        
        <div style="margin-bottom: 16px;">
          <h4 style="margin: 0 0 8px 0;">选择器效果：</h4>
          <a-select 
            :options="getProcessedData()"
            :disabled="!getProcessedData().length"
            :placeholder="getProcessedData().length ? '请选择' : '无可选项'"
            style="width: 200px;"
          />
        </div>
        
        <div style="background: #f5f5f5; padding: 12px; border-radius: 4px;">
          <p style="margin: 0 0 8px 0; font-weight: bold;">处理结果：</p>
          <p style="margin: 0 0 4px 0;"><strong>输入数据类型：</strong>{{ getDataDescription() }}</p>
          <p style="margin: 0 0 4px 0;"><strong>输出结果：</strong>{{ JSON.stringify(getProcessedData()) }}</p>
          <p style="margin: 0; color: #52c41a;"><strong>函数保证：</strong>总是返回数组类型，避免错误</p>
        </div>
      </div>
    `
  })
};