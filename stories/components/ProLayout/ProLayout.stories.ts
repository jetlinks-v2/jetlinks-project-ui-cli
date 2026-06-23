import type { Meta, StoryObj } from '@storybook/vue3';
import { computed, ref, watch } from 'vue';
import JProLayout from '../../../packages/components/src/ProLayout';

/**
 * ProLayout 管理后台布局组件
 *
 * ProLayout 提供 JetLinks 管理后台常用的应用布局能力，包含侧边菜单、顶部栏、历史标签、面包屑、折叠状态和菜单选中状态管理。
 *
 * ## 何时使用
 * - 需要搭建完整的后台应用框架时
 * - 需要侧边菜单、顶部栏和内容区联动时
 * - 需要支持菜单折叠、固定侧边栏或多布局模式时
 * - 需要通过插槽定制 logo、菜单内容、头部内容或底部操作区时
 */
const meta: Meta<typeof JProLayout> = {
  title: '组件库/ProLayout 应用布局',
  component: JProLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
ProLayout 是面向管理后台的应用布局组件，负责组织菜单、头部、内容区和历史标签等框架级结构。

### 主要特性
- 支持侧边布局、混合布局和卡片式布局
- 支持 light / dark 菜单明暗模式
- 支持菜单折叠、固定侧边栏和自定义侧边宽度
- 支持菜单、头部、历史标签、logo、折叠按钮等插槽扩展
- 支持菜单选中、展开、折叠状态的受控更新
- 与 Ant Design Vue 的布局和菜单体系保持一致

### 主题说明
ProLayout 的 \`theme\` 只控制菜单明暗模式，可选值为 \`light\` 或 \`dark\`。
品牌主色、组件 token 和额外主题色应通过外层 \`ConfigProvider.theme.token\` 配置，不应把业务主题名传给 ProLayout 的 \`theme\`。

### 基本用法
\`\`\`vue
<template>
  <JProLayout
    title="JetLinks"
    layout="mix"
    theme="dark"
    :menuData="menuData"
    v-model:collapsed="collapsed"
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
  >
    <RouterView />
  </JProLayout>
</template>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: '系统标题，显示在 logo 区域'
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: '菜单明暗模式，仅支持 light / dark'
    },
    layout: {
      control: 'select',
      options: ['side', 'top', 'mix', 'sider'],
      description: '整体布局模式'
    },
    layoutType: {
      control: 'select',
      options: ['list', 'pad', 'card'],
      description: 'JetLinks 扩展布局类型'
    },
    collapsed: {
      control: 'boolean',
      description: '侧边栏是否折叠'
    },
    siderWidth: {
      control: 'number',
      description: '侧边栏展开宽度'
    },
    collapsedWidth: {
      control: 'number',
      description: '侧边栏折叠宽度'
    },
    fixedHeader: {
      control: 'boolean',
      description: '是否固定头部'
    },
    fixSiderbar: {
      control: 'boolean',
      description: '是否固定侧边栏'
    },
    menuData: {
      control: 'object',
      description: '菜单数据，path 作为菜单 key，meta.title 作为菜单标题'
    }
  },
  args: {
    title: 'JetLinks',
    theme: 'dark',
    layout: 'mix',
    layoutType: 'list',
    collapsed: false,
    siderWidth: 208,
    collapsedWidth: 48,
    fixedHeader: true,
    fixSiderbar: true
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const menuData = [
  {
    path: 'https://example.com/dashboard',
    meta: {
      title: '工作台',
      icon: 'DashboardOutlined',
      target: '_self'
    }
  },
  {
    path: 'https://example.com/device',
    meta: {
      title: '设备管理',
      icon: 'AppstoreOutlined',
      target: '_self'
    },
    children: [
      {
        path: 'https://example.com/device/instance',
        meta: {
          title: '设备实例',
          target: '_self'
        }
      },
      {
        path: 'https://example.com/device/product',
        meta: {
          title: '产品管理',
          target: '_self'
        }
      }
    ]
  },
  {
    path: 'https://example.com/rule-engine',
    meta: {
      title: '规则引擎',
      icon: 'NodeIndexOutlined',
      target: '_self'
    },
    children: [
      {
        path: 'https://example.com/rule-engine/scene',
        meta: {
          title: '场景联动',
          target: '_self'
        }
      },
      {
        path: 'https://example.com/rule-engine/alarm',
        meta: {
          title: '告警配置',
          target: '_self'
        }
      }
    ]
  },
  {
    path: 'https://example.com/system',
    meta: {
      title: '系统管理',
      icon: 'SettingOutlined',
      target: '_self'
    }
  }
];

const historyRoutes = [
  { name: 'dashboard', label: '工作台' },
  { name: 'device-instance', label: '设备实例' },
  { name: 'rule-scene', label: '场景联动' }
];

const logo =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22 viewBox=%220 0 32 32%22%3E%3Crect width=%2232%22 height=%2232%22 rx=%226%22 fill=%22%231677ff%22/%3E%3Ctext x=%2216%22 y=%2221%22 text-anchor=%22middle%22 font-family=%22Arial%2C sans-serif%22 font-size=%2216%22 font-weight=%22700%22 fill=%22white%22%3EJ%3C/text%3E%3C/svg%3E';

const createLayoutState = () => {
  const openKeys = ref<string[]>(['https://example.com/device']);
  const selectedKeys = ref<string[]>(['https://example.com/dashboard']);
  const activeKey = ref('dashboard');

  const handleSelect = (keys: string[]) => {
    selectedKeys.value = keys;
  };

  return {
    openKeys,
    selectedKeys,
    activeKey,
    handleSelect
  };
};

const contentTemplate = `
  <div style="padding: 24px; min-height: 520px; background: #f5f7fa;">
    <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-bottom: 16px;">
      <a-card size="small" title="在线设备">
        <div style="font-size: 28px; font-weight: 600; color: #1677ff;">1,248</div>
        <div style="color: #6b7280; margin-top: 4px;">较昨日 +8.2%</div>
      </a-card>
      <a-card size="small" title="今日告警">
        <div style="font-size: 28px; font-weight: 600; color: #faad14;">32</div>
        <div style="color: #6b7280; margin-top: 4px;">待处理 6 条</div>
      </a-card>
      <a-card size="small" title="规则触发">
        <div style="font-size: 28px; font-weight: 600; color: #52c41a;">9,615</div>
        <div style="color: #6b7280; margin-top: 4px;">近 24 小时</div>
      </a-card>
    </div>
    <a-card title="运行概览">
      <a-table
        size="small"
        :pagination="false"
        :columns="columns"
        :dataSource="dataSource"
        rowKey="id"
      />
    </a-card>
  </div>
`;

const layoutSetup = (args: Record<string, unknown>, initialCollapsed?: boolean) => {
  const state = createLayoutState();
  const collapsed = ref(initialCollapsed ?? Boolean(args.collapsed));
  const columns = [
    { title: '模块', dataIndex: 'module', key: 'module' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { title: '更新时间', dataIndex: 'time', key: 'time' }
  ];
  const dataSource = [
    { id: 1, module: '设备接入', status: '运行中', time: '2026-05-13 09:30' },
    { id: 2, module: '规则引擎', status: '运行中', time: '2026-05-13 09:28' },
    { id: 3, module: '告警中心', status: '待处理', time: '2026-05-13 09:25' }
  ];

  watch(
    () => args.collapsed,
    (value) => {
      collapsed.value = Boolean(value);
    }
  );

  const layoutArgs = computed(() => ({
    ...args,
    menuData,
    historyRoutes,
    logo,
    collapsed: collapsed.value
  }));

  return {
    layoutArgs,
    ...state,
    collapsed,
    columns,
    dataSource
  };
};

/**
 * 基础布局
 * 深色侧边菜单 + 顶部栏 + 内容区，是后台系统最常用的框架形态。
 */
export const 基础布局: Story = {
  args: {
    theme: 'dark',
    layout: 'mix',
    layoutType: 'list',
    collapsed: false
  },
  render: (args) => ({
    setup() {
      return layoutSetup(args);
    },
    template: `
      <JProLayout
        v-bind="layoutArgs"
        v-model:collapsed="collapsed"
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        v-model:activeKey="activeKey"
        @select="handleSelect"
      >
        ${contentTemplate}
      </JProLayout>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JProLayout
    title="JetLinks"
    layout="mix"
    layoutType="list"
    theme="dark"
    :menuData="menuData"
    v-model:collapsed="collapsed"
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
  >
    <RouterView />
  </JProLayout>
</template>`
      }
    }
  }
};

/**
 * 浅色侧边栏
 * 展示 light 菜单模式，适合浅色后台框架。
 */
export const 浅色侧边栏: Story = {
  args: {
    theme: 'light',
    layout: 'mix',
    layoutType: 'list',
    collapsed: false
  },
  render: (args) => ({
    setup() {
      return layoutSetup(args);
    },
    template: `
      <JProLayout
        v-bind="layoutArgs"
        v-model:collapsed="collapsed"
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        v-model:activeKey="activeKey"
        @select="handleSelect"
      >
        ${contentTemplate}
      </JProLayout>
    `
  }),
  parameters: {
    backgrounds: {
      default: 'grey'
    }
  }
};

/**
 * 折叠状态
 * 展示侧边栏折叠后的菜单和底部折叠按钮位置。
 */
export const 折叠状态: Story = {
  args: {
    theme: 'dark',
    layout: 'mix',
    layoutType: 'list',
    collapsed: true
  },
  render: (args) => ({
    setup() {
      return layoutSetup(args, true);
    },
    template: `
      <JProLayout
        v-bind="layoutArgs"
        v-model:collapsed="collapsed"
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        v-model:activeKey="activeKey"
        @select="handleSelect"
      >
        ${contentTemplate}
      </JProLayout>
    `
  })
};

/**
 * 卡片式侧边栏
 * 展示 layoutType="card" 的窄侧边布局。
 */
export const 卡片式侧边栏: Story = {
  args: {
    theme: 'dark',
    layout: 'mix',
    layoutType: 'card',
    cardSiderWidth: 64,
    collapsed: false
  },
  render: (args) => ({
    setup() {
      return layoutSetup(args);
    },
    template: `
      <JProLayout
        v-bind="layoutArgs"
        v-model:collapsed="collapsed"
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        v-model:activeKey="activeKey"
        @select="handleSelect"
      >
        ${contentTemplate}
      </JProLayout>
    `
  })
};

/**
 * 插槽扩展
 * 展示 logo 区域、菜单底部链接和头部右侧内容的定制方式。
 */
export const 插槽扩展: Story = {
  args: {
    theme: 'dark',
    layout: 'mix',
    layoutType: 'list',
    collapsed: false
  },
  render: (args) => ({
    setup() {
      return layoutSetup(args);
    },
    template: `
      <JProLayout
        v-bind="layoutArgs"
        v-model:collapsed="collapsed"
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        v-model:activeKey="activeKey"
        @select="handleSelect"
      >
        <template #menuHeaderRender="{ logo, title }">
          <a style="display: flex; align-items: center;">
            <span style="width: 28px; height: 28px; border-radius: 6px; background: #1677ff; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-weight: 600;">J</span>
            <span v-if="!collapsed" style="margin-left: 10px; color: #fff; font-weight: 600;">JetLinks</span>
          </a>
        </template>

        <template #linksRender>
          <a-menu theme="dark" mode="inline" :selectedKeys="[]">
            <a-menu-item key="help">
              <AIcon type="QuestionCircleOutlined" />
              <span>帮助中心</span>
            </a-menu-item>
          </a-menu>
        </template>

        ${contentTemplate}
      </JProLayout>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JProLayout :menuData="menuData">
    <template #menuHeaderRender>
      <a>自定义 Logo</a>
    </template>

    <template #linksRender>
      <a-menu theme="dark" mode="inline">
        <a-menu-item key="help">帮助中心</a-menu-item>
      </a-menu>
    </template>

    <RouterView />
  </JProLayout>
</template>`
      }
    }
  }
};
