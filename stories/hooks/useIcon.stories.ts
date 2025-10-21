import type { Meta, StoryObj } from '@storybook/vue3';
import { provide } from 'vue';
import { useIcon } from '../../packages/hooks/src/useIcon';
import { ComponentsEnum } from '@jetlinks-web/constants';

/**
 * Hook 函数
 * 
 * 这里展示了项目中图标配置相关 Hook 的使用方法和示例。
 */
const meta: Meta = {
  title: 'Hook函数/useIcon 图标配置获取',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
useIcon 是一个用于获取全局图标配置的 Vue 3 Hook，主要用于获取 iconfont 的脚本地址。

### 主要特性
- 获取全局配置的 iconfont 脚本地址
- 通过依赖注入的方式访问图标配置
- 与项目的 ConfigProvider 配置系统集成
- 支持动态图标字体加载

### 使用场景
- 动态加载 iconfont 字体文件
- 获取图标配置信息
- 在组件中访问全局图标设置
- 图标系统的初始化配置

### 基本用法

\`\`\`javascript
import { useIcon } from '@jetlinks-web/hooks';

// 获取图标配置
const iconConfig = useIcon();
console.log(iconConfig.scriptUrl); // 输出: //at.alicdn.com/t/c/font_4035907_e2upz5fi7ew.js
\`\`\`

### 在 Vue 组件中使用

\`\`\`vue
<template>
  <div>
    <p>当前 iconfont 地址: {{ iconConfig.scriptUrl }}</p>
    <script v-if="iconConfig.scriptUrl" :src="iconConfig.scriptUrl"></script>
  </div>
</template>

<script setup>
import { useIcon } from '@jetlinks-web/hooks';

const iconConfig = useIcon();
</script>
\`\`\`

### 在 ConfigProvider 中配置

\`\`\`vue
<template>
  <j-config-provider :icon-config="iconConfig">
    <your-app />
  </j-config-provider>
</template>

<script setup>
const iconConfig = {
  scriptUrl: '//at.alicdn.com/t/c/font_4035907_e2upz5fi7ew.js'
};
</script>
\`\`\`

### 注意事项

- 该 Hook 需要在 ConfigProvider 的上下文中使用
- 如果没有配置 IconConfig，会返回空对象
- scriptUrl 通常是 iconfont 平台生成的 JavaScript 文件地址
- 支持相对路径和绝对路径的 URL
        `
      },
      source: {
        type: 'code'
      }
    }
  },
  argTypes: {
    scriptUrl: {
      control: 'text',
      description: 'iconfont 脚本地址',
      defaultValue: '//at.alicdn.com/t/c/font_4035907_e2upz5fi7ew.js'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicUsage: Story = {
  name: '基本使用',
  parameters: {
    docs: {
      source: {
        code: `
import { useIcon } from '@jetlinks-web/hooks';

// 获取图标配置
const iconConfig = useIcon();

// 在模板中使用
<template>
  <div>
    <a-card title="图标配置信息">
      <p>iconfont 地址: {{ iconConfig.scriptUrl || '未配置' }}</p>
      
      <a-button v-if="iconConfig.scriptUrl" type="primary">
        配置已加载
      </a-button>
      <a-button v-else type="dashed" disabled>
        未配置图标地址
      </a-button>
    </a-card>
  </div>
</template>
        `
      }
    }
  },
  render: (args) => ({
    setup() {
      // 模拟提供图标配置
      const mockIconConfig = {
        scriptUrl: args.scriptUrl || '//at.alicdn.com/t/c/font_4035907_e2upz5fi7ew.js'
      };
      
      provide(ComponentsEnum.Icon, mockIconConfig);
      
      const iconConfig = useIcon();
      
      return { iconConfig };
    },
    template: `
      <div>
        <a-space direction="vertical" style="width: 100%;">
          <a-card title="图标配置信息" style="width: 400px;">
            <a-descriptions :column="1" size="small">
              <a-descriptions-item label="配置状态">
                <a-tag :color="iconConfig.scriptUrl ? 'green' : 'red'">
                  {{ iconConfig.scriptUrl ? '已配置' : '未配置' }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="脚本地址">
                <a-typography-text 
                  :copyable="iconConfig.scriptUrl ? { text: iconConfig.scriptUrl } : false"
                  style="font-family: monospace; font-size: 12px;"
                >
                  {{ iconConfig.scriptUrl || '未配置' }}
                </a-typography-text>
              </a-descriptions-item>
              <a-descriptions-item label="地址类型">
                {{ iconConfig.scriptUrl ? (iconConfig.scriptUrl.startsWith('//') ? '相对协议' : '绝对路径') : '-' }}
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
          
          <a-card title="使用示例" style="width: 400px;">
            <div>
              <a-typography-text code>
                const iconConfig = useIcon();
              </a-typography-text>
              <br/>
              <a-typography-text code style="margin-top: 8px; display: block;">
                console.log(iconConfig.scriptUrl);
              </a-typography-text>
            </div>
            
            <a-divider />
            
            <div>
              <strong>输出结果:</strong>
              <pre style="background: #f5f5f5; padding: 8px; margin-top: 8px; border-radius: 4px; font-size: 12px;">{{ iconConfig.scriptUrl || 'undefined' }}</pre>
            </div>
          </a-card>
          
          <a-alert
            v-if="!iconConfig.scriptUrl"
            message="配置提示"
            description="请在 ConfigProvider 中配置 IconConfig 来设置 iconfont 脚本地址"
            type="info"
            show-icon
          />
        </a-space>
      </div>
    `
  }),
  args: {
    scriptUrl: '//at.alicdn.com/t/c/font_4035907_e2upz5fi7ew.js'
  }
};

export const WithoutConfig: Story = {
  name: '未配置状态',
  parameters: {
    docs: {
      source: {
        code: `
import { useIcon } from '@jetlinks-web/hooks';

// 在没有 IconConfig 配置的情况下使用
const iconConfig = useIcon();

// iconConfig 将返回空对象 {}
console.log(iconConfig); // {}
console.log(iconConfig.scriptUrl); // undefined

// 在模板中安全地使用
<template>
  <div>
    <p v-if="iconConfig.scriptUrl">
      图标地址: {{ iconConfig.scriptUrl }}
    </p>
    <p v-else>
      未配置图标地址
    </p>
  </div>
</template>
        `
      }
    }
  },
  render: () => ({
    setup() {
      // 不提供图标配置，模拟未配置状态
      provide(ComponentsEnum.Icon, {});
      
      const iconConfig = useIcon();
      
      const configureIcon = () => {
        // 模拟配置图标
        const newConfig = {
          scriptUrl: '//at.alicdn.com/t/c/font_4035907_e2upz5fi7ew.js'
        };
        provide(ComponentsEnum.Icon, newConfig);
      };
      
      return { 
        iconConfig,
        configureIcon
      };
    },
    template: `
      <div>
        <a-space direction="vertical" style="width: 100%;">
          <a-card title="未配置状态演示" style="width: 400px;">
            <a-alert
              message="图标配置未找到"
              description="当前环境中没有配置 IconConfig，useIcon() 返回空对象"
              type="warning"
              show-icon
              style="margin-bottom: 16px;"
            />
            
            <a-descriptions :column="1" size="small">
              <a-descriptions-item label="配置对象">
                <a-typography-text code>
                  {{ JSON.stringify(iconConfig) }}
                </a-typography-text>
              </a-descriptions-item>
              <a-descriptions-item label="scriptUrl 值">
                <a-typography-text code>
                  {{ iconConfig.scriptUrl || 'undefined' }}
                </a-typography-text>
              </a-descriptions-item>
              <a-descriptions-item label="类型检查">
                <a-tag color="blue">
                  typeof scriptUrl: {{ typeof iconConfig.scriptUrl }}
                </a-tag>
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
          
          <a-card title="安全使用方式" style="width: 400px;">
            <div>
              <h4>推荐的条件判断:</h4>
              <pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; font-size: 12px; margin: 8px 0;">
if (iconConfig.scriptUrl) {
  // 使用图标配置
  loadIconFont(iconConfig.scriptUrl);
} else {
  // 处理未配置的情况
  console.warn('图标配置未找到');
}</pre>
            </div>
            
            <a-divider />
            
            <div>
              <strong>当前状态:</strong>
              <a-tag :color="iconConfig.scriptUrl ? 'green' : 'orange'">
                {{ iconConfig.scriptUrl ? '已配置' : '未配置' }}
              </a-tag>
            </div>
          </a-card>
          
          <a-typography-text type="secondary" style="font-size: 12px;">
            注意: 在实际项目中，请确保在 ConfigProvider 中正确配置 IconConfig
          </a-typography-text>
        </a-space>
      </div>
    `
  })
};