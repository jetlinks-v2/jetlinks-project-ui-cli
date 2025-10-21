import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, provide, inject } from 'vue';
import { useContext } from '../../packages/hooks/src/useContext';
import type { InjectionKey } from 'vue';

/**
 * Hook 函数
 * 
 * 这里展示了项目中上下文注入相关 Hook 的使用方法和示例。
 */
const meta: Meta = {
  title: 'Hook函数/useContext 上下文注入',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
useContext 是一个用于上下文数据注入的 Vue 3 Hook，基于 Vue 的 inject API 实现。

### 主要特性
- 支持字符串或 InjectionKey 作为注入键
- 可设置默认值，避免注入失败
- 类型安全的上下文数据获取
- 与 Vue 3 组合式 API 无缝集成

### 使用场景
- 跨组件数据传递
- 全局配置数据获取
- 主题、语言等上下文信息访问
- 依赖注入和服务获取

### 基本用法

\`\`\`javascript
import { useContext } from '@jetlinks-web/hooks';

// 使用字符串键注入
const theme = useContext('theme', 'light');

// 使用 InjectionKey 注入
const configKey: InjectionKey<Config> = Symbol('config');
const config = useContext(configKey, defaultConfig);

// 注入用户信息
interface UserInfo {
  name: string;
  role: string;
}
const userInfo = useContext<UserInfo>('userInfo', { name: 'Guest', role: 'visitor' });
\`\`\`

### 在 Vue 组件中使用

\`\`\`vue
<template>
  <div>
    <h3>当前主题: {{ theme }}</h3>
    <p>用户: {{ userInfo.name }} ({{ userInfo.role }})</p>
  </div>
</template>

<script setup>
import { useContext } from '@jetlinks-web/hooks';

// 注入主题信息
const theme = useContext('theme', 'light');

// 注入用户信息
const userInfo = useContext('userInfo', { 
  name: 'Guest', 
  role: 'visitor' 
});
</script>
\`\`\`

### 与 provide 配合使用

\`\`\`javascript
// 在父组件中提供数据
import { provide } from 'vue';

const parentComponent = {
  setup() {
    const theme = ref('dark');
    const userInfo = {
      name: 'John Doe',
      role: 'admin'
    };
    
    provide('theme', theme);
    provide('userInfo', userInfo);
  }
};

// 在子组件中注入数据
import { useContext } from '@jetlinks-web/hooks';

const childComponent = {
  setup() {
    const theme = useContext('theme', 'light');
    const userInfo = useContext('userInfo', { name: 'Guest', role: 'visitor' });
    
    return { theme, userInfo };
  }
};
\`\`\`
        `
      },
      source: {
        type: 'code'
      }
    }
  },
  argTypes: {
    contextKey: {
      control: 'text',
      description: '上下文键名',
      defaultValue: 'theme'
    },
    defaultValue: {
      control: 'text',
      description: '默认值',
      defaultValue: 'light'
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
import { provide } from 'vue';
import { useContext } from '@jetlinks-web/hooks';

// 父组件提供数据
const setup = () => {
  provide('theme', 'dark');
  provide('appName', 'JetLinks');
};

// 子组件注入数据
const childSetup = () => {
  const theme = useContext('theme', 'light');
  const appName = useContext('appName', 'Default App');
  
  return { theme, appName };
};

// 在模板中使用
<template>
  <div>
    <p>主题: {{ theme }}</p>
    <p>应用名称: {{ appName }}</p>
  </div>
</template>
        `
      }
    }
  },
  render: (args) => ({
    setup() {
      // 在父级提供数据
      provide('theme', args.defaultValue || 'dark');
      provide('appName', 'JetLinks UI');
      provide('version', '3.0.0');
      
      // 子组件注入数据
      const theme = useContext('theme', 'light');
      const appName = useContext('appName', 'Default App');
      const version = useContext('version', '1.0.0');
      
      return { theme, appName, version };
    },
    template: `
      <div>
        <a-space direction="vertical" style="width: 100%;">
          <a-card title="上下文数据注入示例" size="small">
            <div>
              <strong>主题:</strong> 
              <a-tag color="blue">{{ theme }}</a-tag>
            </div>
            <div style="margin-top: 8px;">
              <strong>应用名称:</strong> 
              <a-tag color="green">{{ appName }}</a-tag>
            </div>
            <div style="margin-top: 8px;">
              <strong>版本:</strong> 
              <a-tag color="orange">{{ version }}</a-tag>
            </div>
          </a-card>
          
          <a-alert 
            message="数据来源" 
            description="这些数据通过 provide/inject 机制从父组件传递到子组件，useContext Hook 简化了注入过程。"
            type="info" 
            show-icon 
          />
        </a-space>
      </div>
    `
  }),
  args: {
    contextKey: 'theme',
    defaultValue: 'dark'
  }
};

export const WithDefaultValue: Story = {
  name: '设置默认值',
  parameters: {
    docs: {
      source: {
        code: `
import { useContext } from '@jetlinks-web/hooks';

// 注入不存在的上下文，使用默认值
const userPreferences = useContext('userPreferences', {
  language: 'zh-CN',
  timezone: 'Asia/Shanghai',
  theme: 'light'
});

const apiConfig = useContext('apiConfig', {
  baseUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3
});

// 在模板中使用
<template>
  <div>
    <h4>用户偏好 (默认值)</h4>
    <p>语言: {{ userPreferences.language }}</p>
    <p>时区: {{ userPreferences.timezone }}</p>
    <p>主题: {{ userPreferences.theme }}</p>
    
    <h4>API 配置 (默认值)</h4>
    <p>基础URL: {{ apiConfig.baseUrl }}</p>
    <p>超时时间: {{ apiConfig.timeout }}ms</p>
  </div>
</template>
        `
      }
    }
  },
  render: () => ({
    setup() {
      // 注入不存在的上下文，使用默认值
      const userPreferences = useContext('userPreferences', {
        language: 'zh-CN',
        timezone: 'Asia/Shanghai',
        theme: 'light'
      });
      
      const apiConfig = useContext('apiConfig', {
        baseUrl: 'https://api.example.com',
        timeout: 5000,
        retries: 3
      });
      
      return { userPreferences, apiConfig };
    },
    template: `
      <div>
        <a-space direction="vertical" style="width: 100%;">
          <a-card title="默认值演示" size="small">
            <div>
              <h4 style="margin: 0 0 12px 0; color: #1890ff;">用户偏好 (使用默认值)</h4>
              <a-descriptions size="small" :column="1">
                <a-descriptions-item label="语言">{{ userPreferences.language }}</a-descriptions-item>
                <a-descriptions-item label="时区">{{ userPreferences.timezone }}</a-descriptions-item>
                <a-descriptions-item label="主题">{{ userPreferences.theme }}</a-descriptions-item>
              </a-descriptions>
            </div>
            
            <a-divider />
            
            <div>
              <h4 style="margin: 0 0 12px 0; color: #1890ff;">API 配置 (使用默认值)</h4>
              <a-descriptions size="small" :column="1">
                <a-descriptions-item label="基础URL">{{ apiConfig.baseUrl }}</a-descriptions-item>
                <a-descriptions-item label="超时时间">{{ apiConfig.timeout }}ms</a-descriptions-item>
                <a-descriptions-item label="重试次数">{{ apiConfig.retries }}</a-descriptions-item>
              </a-descriptions>
            </div>
          </a-card>
          
          <a-alert 
            message="注意" 
            description="由于父组件没有提供这些上下文数据，所以 useContext 返回了设置的默认值。这确保了组件在任何环境下都能正常工作。"
            type="warning" 
            show-icon 
          />
        </a-space>
      </div>
    `
  })
};

export const WithInjectionKey: Story = {
  name: '使用 InjectionKey',
  parameters: {
    docs: {
      source: {
        code: `
import type { InjectionKey } from 'vue';
import { provide } from 'vue';
import { useContext } from '@jetlinks-web/hooks';

// 定义类型安全的注入键
interface AppConfig {
  name: string;
  version: string;
  features: string[];
}

const AppConfigKey: InjectionKey<AppConfig> = Symbol('app-config');

// 父组件提供数据
const parentSetup = () => {
  const appConfig: AppConfig = {
    name: 'JetLinks',
    version: '3.0.0',
    features: ['权限管理', '设备管理', '数据可视化']
  };
  
  provide(AppConfigKey, appConfig);
};

// 子组件注入数据
const childSetup = () => {
  const config = useContext(AppConfigKey, {
    name: 'Unknown',
    version: '0.0.0',
    features: []
  });
  
  return { config };
};

// 在模板中使用
<template>
  <div>
    <h3>{{ config.name }} v{{ config.version }}</h3>
    <ul>
      <li v-for="feature in config.features" :key="feature">
        {{ feature }}
      </li>
    </ul>
  </div>
</template>
        `
      }
    }
  },
  render: () => ({
    setup() {
      // 定义类型安全的注入键
      interface AppConfig {
        name: string;
        version: string;
        features: string[];
      }
      
      const AppConfigKey: InjectionKey<AppConfig> = Symbol('app-config');
      
      // 提供应用配置数据
      const appConfig: AppConfig = {
        name: 'JetLinks',
        version: '3.0.0',
        features: ['权限管理', '设备管理', '数据可视化', '规则引擎', '数据报表']
      };
      
      provide(AppConfigKey, appConfig);
      
      // 注入配置数据
      const config = useContext(AppConfigKey, {
        name: 'Unknown',
        version: '0.0.0',
        features: []
      });
      
      return { config };
    },
    template: `
      <div>
        <a-space direction="vertical" style="width: 100%;">
          <a-card :title="config.name + ' v' + config.version" size="small">
            <div>
              <strong>功能特性:</strong>
            </div>
            <a-space wrap style="margin-top: 8px;">
              <a-tag 
                v-for="feature in config.features" 
                :key="feature" 
                color="processing"
              >
                {{ feature }}
              </a-tag>
            </a-space>
          </a-card>
          
          <a-alert 
            message="类型安全" 
            description="通过使用 InjectionKey，我们获得了完整的 TypeScript 类型支持，可以在编译时捕获类型错误。"
            type="success" 
            show-icon 
          />
        </a-space>
      </div>
    `
  })
};