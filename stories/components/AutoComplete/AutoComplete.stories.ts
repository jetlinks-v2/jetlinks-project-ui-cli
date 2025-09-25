import type { Meta, StoryObj } from '@storybook/vue3';
import JAutoComplete from '../../../packages/components/src/AutoComplete/AutoComplete.vue';

/**
 * JAutoComplete 自动完成组件
 *
 * 这是一个增强版的自动完成输入组件，基于Ant Design Vue的AutoComplete组件。
 * 支持根据输入内容自动筛选选项，提供更好的用户输入体验。
 *
 * ## 何时使用
 * - 需要根据输入内容提示相关选项时
 * - 需要输入建议和自动完成功能时
 * - 数据量较大需要筛选时
 * - 提升用户输入效率时
 */
const meta: Meta<typeof JAutoComplete> = {
  title: '组件库/AutoComplete 自动完成',
  component: JAutoComplete,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
JAutoComplete 是一个增强版的自动完成输入组件，基于Ant Design Vue的AutoComplete组件。

### 主要特性
- 支持自动筛选选项
- 支持自定义搜索字段
- 支持自定义选项模板
- 自动添加输入值作为选项
- 支持下拉状态控制

### 基本用法
\`\`\`vue
<template>
  <JAutoComplete 
    :options="options"
    style="width: 200px"
    placeholder="请输入内容"
  />
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
      description: '自动完成的数据源'
    },
    placeholder: {
      control: 'text',
      description: '占位符'
    },
    searchKey: {
      control: 'text',
      description: '搜索的字段名，默认为label'
    },
    value: {
      control: 'text',
      description: '输入框的值'
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用'
    },
    onSelect: {
      action: 'select'
    }
  },
  args: {
    placeholder: '请输入内容',
    searchKey: 'label'
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基础使用
 * 最基本的自动完成功能
 */
export const 基础使用: Story = {
  args: {
    options: [
      { label: 'JavaScript', value: 'javascript' },
      { label: 'TypeScript', value: 'typescript' },
      { label: 'Java', value: 'java' },
      { label: 'Python', value: 'python' },
      { label: 'Go', value: 'go' },
      { label: 'Rust', value: 'rust' },
      { label: 'C++', value: 'cpp' },
      { label: 'C#', value: 'csharp' }
    ],
    placeholder: '请输入编程语言',
    style: { width: '300px' }
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div style="width: 300px">
    <JAutoComplete 
      :options="options"
      placeholder="请输入编程语言"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const options = ref([
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Java', value: 'java' },
  { label: 'Python', value: 'python' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'C++', value: 'cpp' },
  { label: 'C#', value: 'csharp' }
])
</script>`
      }
    }
  }
};

/**
 * 城市搜索
 * 搜索城市名称的示例
 */
export const 城市搜索: Story = {
  render: () => ({
    components: { JAutoComplete },
    template: `
      <div style="width: 200px">
        <JAutoComplete 
          :options="cityOptions"
          placeholder="请输入城市名称"
        />
      </div>
    `,
    data() {
      return {
        cityOptions: [
          { label: '北京市', value: 'beijing' },
          { label: '上海市', value: 'shanghai' },
          { label: '广州市', value: 'guangzhou' },
          { label: '深圳市', value: 'shenzhen' },
          { label: '杭州市', value: 'hangzhou' },
          { label: '南京市', value: 'nanjing' },
          { label: '武汉市', value: 'wuhan' },
          { label: '成都市', value: 'chengdu' },
          { label: '西安市', value: 'xian' },
          { label: '重庆市', value: 'chongqing' }
        ]
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
<div style="width: 200px">
  <JAutoComplete 
    :options="cityOptions"
    placeholder="请输入城市名称"
  />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JAutoComplete from '@jetlinks/components'

const cityOptions = ref([
  { label: '北京市', value: 'beijing' },
  { label: '上海市', value: 'shanghai' },
  { label: '广州市', value: 'guangzhou' },
  { label: '深圳市', value: 'shenzhen' },
  { label: '杭州市', value: 'hangzhou' },
  { label: '南京市', value: 'nanjing' },
  { label: '武汉市', value: 'wuhan' },
  { label: '成都市', value: 'chengdu' },
  { label: '西安市', value: 'xian' },
  { label: '重庆市', value: 'chongqing' }
])
</script>`
      }
    }
  }
};

/**
 * 邮箱输入
 * 常用邮箱域名自动补全
 */
export const 邮箱输入: Story = {
  render: () => ({
    components: { JAutoComplete },
    template: `
      <div style="width: 300px;">
        <JAutoComplete 
          :options="emailOptions"
          placeholder="请输入邮箱地址"
          :searchKey="'label'"
          @search="handleEmailSearch"
        />
      </div>
    `,
    data() {
      return {
        emailOptions: [
          { label: 'user@gmail.com', value: 'user@gmail.com' },
          { label: 'user@163.com', value: 'user@163.com' },
          { label: 'user@qq.com', value: 'user@qq.com' },
          { label: 'user@sina.com', value: 'user@sina.com' },
          { label: 'user@hotmail.com', value: 'user@hotmail.com' },
          { label: 'user@outlook.com', value: 'user@outlook.com' }
        ]
      }
    },
    methods: {
      handleEmailSearch(value) {
        if (value && value.includes('@')) {
          // 如果已经包含@符号，不做处理
          return;
        }

        const domains = [
          '@gmail.com',
          '@163.com',
          '@qq.com',
          '@sina.com',
          '@hotmail.com',
          '@outlook.com'
        ];

        this.emailOptions = domains.map(domain => ({
          label: value + domain,
          value: value + domain
        }));
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div style="width: 300px;">
    <JAutoComplete 
      :options="emailOptions"
      placeholder="请输入邮箱地址"
      @search="handleEmailSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JAutoComplete from '@jetlinks/components'

const emailOptions = ref([
  { label: 'user@gmail.com', value: 'user@gmail.com' },
  { label: 'user@163.com', value: 'user@163.com' },
  { label: 'user@qq.com', value: 'user@qq.com' },
  { label: 'user@sina.com', value: 'user@sina.com' },
  { label: 'user@hotmail.com', value: 'user@hotmail.com' },
  { label: 'user@outlook.com', value: 'user@outlook.com' }
])

const handleEmailSearch = (value: string) => {
  if (value && value.includes('@')) {
    return;
  }
  
  const domains = [
    '@gmail.com',
    '@163.com', 
    '@qq.com',
    '@sina.com',
    '@hotmail.com',
    '@outlook.com'
  ];
  
  emailOptions.value = domains.map(domain => ({
    label: value + domain,
    value: value + domain
  }));
}
</script>`
      }
    }
  }
};

/**
 * 用户搜索
 * 搜索用户信息的示例
 */
export const 用户搜索: Story = {
  render: () => ({
    components: { JAutoComplete },
    template: `
      <div style="width: 300px;">
        <JAutoComplete 
          :options="userOptions"
          placeholder="请输入用户名或邮箱"
          style="width: 200px"
          :searchKey="'label'"
        >
          <template #option="{ value }">
            <div style="display: flex; align-items: center; gap: 8px;">
              <img 
                :src="getUserAvatar(value)" 
                style="width: 24px; height: 24px; border-radius: 50%;"
                alt="avatar"
              />
              <div>
                <div style="font-weight: 500;">{{ getUserName(value) }}</div>
                <div style="font-size: 12px; color: #999;">{{ getUserEmail(value) }}</div>
              </div>
            </div>
          </template>
        </JAutoComplete>
      </div>
    `,
    data() {
      return {
        userOptions: [
          {
            label: '张三 zhang.san@company.com',
            value: 'zhangsan',
            name: '张三',
            email: 'zhang.san@company.com'
          },
          {
            label: '李四 li.si@company.com',
            value: 'lisi',
            name: '李四',
            email: 'li.si@company.com'
          },
          {
            label: '王五 wang.wu@company.com',
            value: 'wangwu',
            name: '王五',
            email: 'wang.wu@company.com'
          },
          {
            label: '赵六 zhao.liu@company.com',
            value: 'zhaoliu',
            name: '赵六',
            email: 'zhao.liu@company.com'
          },
          {
            label: '钱七 qian.qi@company.com',
            value: 'qianqi',
            name: '钱七',
            email: 'qian.qi@company.com'
          }
        ]
      }
    },
    methods: {
      getUserAvatar(value) {
        return 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
      },
      getUserName(value) {
        const user = this.userOptions.find(u => u.value === value);
        return user?.name || value;
      },
      getUserEmail(value) {
        const user = this.userOptions.find(u => u.value === value);
        return user?.email || '';
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div style="width: 300px;">
    <JAutoComplete 
      :options="userOptions"
      placeholder="请输入用户名或邮箱"
      style="width: 200px"
      :searchKey="'label'"
    >
      <template #option="{ value }">
        <div class="user-option">
          <img 
            :src="getUserAvatar(value)" 
            class="user-avatar"
            alt="avatar"
          />
          <div class="user-info">
            <div class="user-name">{{ getUserName(value) }}</div>
            <div class="user-email">{{ getUserEmail(value) }}</div>
          </div>
        </div>
      </template>
    </JAutoComplete>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JAutoComplete from '@jetlinks/components'

const userOptions = ref([
  { 
    label: '张三 zhang.san@company.com', 
    value: 'zhangsan',
    name: '张三',
    email: 'zhang.san@company.com'
  },
  { 
    label: '李四 li.si@company.com', 
    value: 'lisi',
    name: '李四',
    email: 'li.si@company.com'
  },
  { 
    label: '王五 wang.wu@company.com', 
    value: 'wangwu',
    name: '王五',
    email: 'wang.wu@company.com'
  },
  { 
    label: '赵六 zhao.liu@company.com', 
    value: 'zhaoliu',
    name: '赵六',
    email: 'zhao.liu@company.com'
  },
  { 
    label: '钱七 qian.qi@company.com', 
    value: 'qianqi',
    name: '钱七',
    email: 'qian.qi@company.com'
  }
])

const getUserAvatar = (value: string) => {
  return 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
}

const getUserName = (value: string) => {
  const user = userOptions.value.find(u => u.value === value)
  return user?.name || value
}

const getUserEmail = (value: string) => {
  const user = userOptions.value.find(u => u.value === value)
  return user?.email || ''
}
</script>

<style scoped>
.user-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 500;
}

.user-email {
  font-size: 12px;
  color: #999;
}
</style>`
      }
    }
  }
};

/**
 * 不同状态
 * 展示组件的不同状态
 */
export const 不同状态: Story = {
  render: () => ({
    components: { JAutoComplete },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 300px;">
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">默认状态</label>
          <JAutoComplete 
            :options="options"
            placeholder="请输入内容"
            style="width: 200px"
          />
        </div>
        
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">禁用状态</label>
          <JAutoComplete 
            :options="options"
            placeholder="已禁用"
            disabled
            style="width: 200px"
          />
        </div>
        
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">带默认值</label>
          <JAutoComplete 
            :options="options"
            :value="'JavaScript'"
            style="width: 200px"
          />
        </div>
      </div>
    `,
    data() {
      return {
        options: [
          { label: 'JavaScript', value: 'javascript' },
          { label: 'TypeScript', value: 'typescript' },
          { label: 'Java', value: 'java' },
          { label: 'Python', value: 'python' }
        ]
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="status-demo">
    <div class="demo-item">
      <label>默认状态</label>
      <JAutoComplete 
        :options="options"
        placeholder="请输入内容"
      />
    </div>
    
    <div class="demo-item">
      <label>禁用状态</label>
      <JAutoComplete 
        :options="options"
        placeholder="已禁用"
        disabled
      />
    </div>
    
    <div class="demo-item">
      <label>带默认值</label>
      <JAutoComplete 
        :options="options"
        :value="'JavaScript'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JAutoComplete from '@jetlinks/components'

const options = ref([
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Java', value: 'java' },
  { label: 'Python', value: 'python' }
])
</script>

<style scoped>
.status-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 300px;
}

.demo-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}
</style>`
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
    components: { JAutoComplete },
    template: `
      <div style="min-width: 600px; display: flex; flex-direction: column; gap: 24px;">
        <!-- 搜索框 -->
        <div style="padding: 20px; border: 1px solid #e8e8e8; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0;">全局搜索</h3>
          <JAutoComplete 
            :options="searchOptions"
            placeholder="搜索文档、用户、项目..."
            :searchKey="'label'"
            style="margin-bottom: 16px;"
          >
            <template #option="{ value }">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span 
                  style="padding: 2px 6px; border-radius: 3px; font-size: 12px; background: #f0f0f0;"
                >
                  {{ getSearchType(value) }}
                </span>
                <span>{{ getSearchTitle(value) }}</span>
              </div>
            </template>
          </JAutoComplete>
          <div style="font-size: 12px; color: #999;">
            支持搜索文档、用户和项目，输入关键词即可快速找到相关内容
          </div>
        </div>

        <!-- 标签输入 -->
        <div style="padding: 20px; border: 1px solid #e8e8e8; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0;">技能标签</h3>
          <JAutoComplete 
            :options="skillOptions"
            placeholder="添加技能标签"
            :searchKey="'label'"
            style="width: 200px"
          />
          <div style="margin-top: 12px; display: flex; flex-wrap: gap: 8px;">
            <span 
              v-for="tag in selectedTags" 
              :key="tag"
              style="padding: 4px 8px; background: #e6f7ff; color: #1890ff; border: 1px solid #91d5ff; border-radius: 4px; font-size: 12px;"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- 联系人选择 -->
        <div style="padding: 20px; border: 1px solid #e8e8e8; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0;">添加协作者</h3>
          <JAutoComplete 
            :options="contactOptions"
            placeholder="输入姓名或邮箱"
            :searchKey="'label'"
            style="width: 200px"
          >
            <template #option="{ value }">
              <div style="display: flex; align-items: center; gap: 12px;">
                <img 
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  style="width: 32px; height: 32px; border-radius: 50%;"
                  alt="avatar"
                />
                <div>
                  <div style="font-weight: 500;">{{ getContactName(value) }}</div>
                  <div style="font-size: 12px; color: #999;">{{ getContactEmail(value) }}</div>
                </div>
              </div>
            </template>
          </JAutoComplete>
        </div>
      </div>
    `,
    data() {
      return {
        selectedTags: ['JavaScript', 'Vue.js', 'Node.js'],
        searchOptions: [
          { label: '用户管理文档', value: 'doc-user', type: '文档', title: '用户管理文档' },
          { label: 'API接口文档', value: 'doc-api', type: '文档', title: 'API接口文档' },
          { label: '张三用户', value: 'user-zhangsan', type: '用户', title: '张三' },
          { label: '项目管理系统', value: 'project-management', type: '项目', title: '项目管理系统' },
          { label: '数据分析平台', value: 'project-analytics', type: '项目', title: '数据分析平台' }
        ],
        skillOptions: [
          { label: 'JavaScript', value: 'javascript' },
          { label: 'TypeScript', value: 'typescript' },
          { label: 'Vue.js', value: 'vue' },
          { label: 'React', value: 'react' },
          { label: 'Node.js', value: 'nodejs' },
          { label: 'Python', value: 'python' },
          { label: 'Java', value: 'java' },
          { label: 'Go', value: 'go' }
        ],
        contactOptions: [
          {
            label: '张三 zhang.san@company.com',
            value: 'zhangsan',
            name: '张三',
            email: 'zhang.san@company.com'
          },
          {
            label: '李四 li.si@company.com',
            value: 'lisi',
            name: '李四',
            email: 'li.si@company.com'
          },
          {
            label: '王五 wang.wu@company.com',
            value: 'wangwu',
            name: '王五',
            email: 'wang.wu@company.com'
          }
        ]
      }
    },
    methods: {
      getSearchType(value) {
        const item = this.searchOptions.find(opt => opt.value === value);
        return item?.type || '其他';
      },
      getSearchTitle(value) {
        const item = this.searchOptions.find(opt => opt.value === value);
        return item?.title || value;
      },
      getContactName(value) {
        const contact = this.contactOptions.find(c => c.value === value);
        return contact?.name || value;
      },
      getContactEmail(value) {
        const contact = this.contactOptions.find(c => c.value === value);
        return contact?.email || '';
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="application-demo">
    <!-- 搜索框 -->
    <div class="search-section">
      <h3>全局搜索</h3>
      <JAutoComplete 
        :options="searchOptions"
        placeholder="搜索文档、用户、项目..."
        :searchKey="'label'"
        style="width: 200px"
      >
        <template #option="{ value }">
          <div class="search-option">
            <span class="search-type">{{ getSearchType(value) }}</span>
            <span>{{ getSearchTitle(value) }}</span>
          </div>
        </template>
      </JAutoComplete>
      <div class="search-hint">
        支持搜索文档、用户和项目，输入关键词即可快速找到相关内容
      </div>
    </div>

    <!-- 标签输入 -->
    <div class="tags-section">
      <h3>技能标签</h3>
      <JAutoComplete 
        :options="skillOptions"
        placeholder="添加技能标签"
        :searchKey="'label'"
        style="width: 200px"
      />
      <div class="selected-tags">
        <span 
          v-for="tag in selectedTags" 
          :key="tag"
          class="tag"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- 联系人选择 -->
    <div class="contact-section">
      <h3>添加协作者</h3>
      <JAutoComplete 
        :options="contactOptions"
        placeholder="输入姓名或邮箱"
        :searchKey="'label'"
        style="width: 200px"
      >
        <template #option="{ value }">
          <div class="contact-option">
            <img 
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              class="contact-avatar"
              alt="avatar"
            />
            <div class="contact-info">
              <div class="contact-name">{{ getContactName(value) }}</div>
              <div class="contact-email">{{ getContactEmail(value) }}</div>
            </div>
          </div>
        </template>
      </JAutoComplete>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JAutoComplete from '@jetlinks/components'

const selectedTags = ref(['JavaScript', 'Vue.js', 'Node.js'])

const searchOptions = ref([
  { label: '用户管理文档', value: 'doc-user', type: '文档', title: '用户管理文档' },
  { label: 'API接口文档', value: 'doc-api', type: '文档', title: 'API接口文档' },
  { label: '张三用户', value: 'user-zhangsan', type: '用户', title: '张三' },
  { label: '项目管理系统', value: 'project-management', type: '项目', title: '项目管理系统' },
  { label: '数据分析平台', value: 'project-analytics', type: '项目', title: '数据分析平台' }
])

const skillOptions = ref([
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Vue.js', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Node.js', value: 'nodejs' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'Go', value: 'go' }
])

const contactOptions = ref([
  { 
    label: '张三 zhang.san@company.com', 
    value: 'zhangsan',
    name: '张三',
    email: 'zhang.san@company.com'
  },
  { 
    label: '李四 li.si@company.com', 
    value: 'lisi',
    name: '李四',
    email: 'li.si@company.com'
  },
  { 
    label: '王五 wang.wu@company.com', 
    value: 'wangwu',
    name: '王五',
    email: 'wang.wu@company.com'
  }
])

const getSearchType = (value: string) => {
  const item = searchOptions.value.find(opt => opt.value === value)
  return item?.type || '其他'
}

const getSearchTitle = (value: string) => {
  const item = searchOptions.value.find(opt => opt.value === value)
  return item?.title || value
}

const getContactName = (value: string) => {
  const contact = contactOptions.value.find(c => c.value === value)
  return contact?.name || value
}

const getContactEmail = (value: string) => {
  const contact = contactOptions.value.find(c => c.value === value)
  return contact?.email || ''
}
</script>

<style scoped>
.application-demo {
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.search-section,
.tags-section,
.contact-section {
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.search-section h3,
.tags-section h3,
.contact-section h3 {
  margin: 0 0 16px 0;
}

.search-hint {
  margin-top: 12px;
  font-size: 12px;
  color: #999;
}

.search-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-type {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  background: #f0f0f0;
}

.selected-tags {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 4px 8px;
  background: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  font-size: 12px;
}

.contact-option {
  display: flex;
  align-items: center;
  gap: 12px;
}

.contact-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.contact-info {
  flex: 1;
}

.contact-name {
  font-weight: 500;
}

.contact-email {
  font-size: 12px;
  color: #999;
}
</style>`
      }
    }
  }
};
