### ConfigProvider

全局配置 Provider，为 JetLinks 组件体系提供统一的应用级配置与国际化上下文，同时透传 ant-design-vue `ConfigProvider` 的能力。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| IconConfig | 全局 Icon 配置（如 iconfont `scriptUrl`） | `object` | `{}` |
| MapConfig | 全局地图配置 | `object` | `{}` |
| SearchConfig | 全局搜索组件配置 | `object` | `{}` |
| PermissionButtonConfig | 全局权限按钮配置（如自定义 `components`） | `object` | `{}` |
| FullPageConfig | 全屏页面容器配置（如 `reduceHeight`） | `object` | `{}` |
| TableConfig | ProTable 全局配置 | `object` | `{}` |
| componentsLocale | 组件文案语言包 | `object` | 内置 `zh-CN` |
| 其余 | 透传 ant-design-vue `ConfigProvider` props（如 `locale`、`theme`） | - | - |

#### 插槽

| 名称 | 说明 |
| --- | --- |
| default | 应用内容 |
| renderEmpty | 自定义全局空状态渲染（默认使用 `JEmpty`） |

#### 用法

```vue
<template>
  <JConfigProvider :locale="zhCN" :theme="{ token: { colorPrimary: '#1677ff' } }">
    <router-view />
  </JConfigProvider>
</template>
```

#### Rules

- 通过 Vue `provide` 注入以下配置，供全组件体系消费：Icon / Map / Search / PermissionButton / FullPage / ProTable（Table）。
- 空状态统一由内置 `JEmpty` 兜底，可通过 `renderEmpty` 插槽覆盖。
- 内部自动包装 `JLocaleProvider`，`componentsLocale` 缺省使用内置中文语言包。
- 兼容 `ConfigProvider.config()` 静态方法（如 `Message` 主题配置）。
