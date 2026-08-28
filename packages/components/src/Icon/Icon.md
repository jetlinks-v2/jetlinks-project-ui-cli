### Icon

图标组件（注册名 `AIcon`），统一承载 ant-design-vue 图标与 iconfont 自定义图标；按 `type` 自动路由到对应图标源。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 图标名，优先匹配 `@ant-design/icons-vue` 导出；未匹配时走 iconfont | `string` | - |
| scriptUrl | iconfont 的 script 地址（含 `//at.alicdn.com/...` 前缀），优先级高于全局配置 | `string` | 全局 `IconConfig.scriptUrl` |
| class | 图标类名 | `string` | - |
| style | 图标样式（透传） | `CSSProperties` | - |

#### 事件

| 事件 | 说明 |
| --- | --- |
| click | 点击图标 |

#### 用法

```vue
<template>
  <AIcon type="CloseOutlined" />
  <AIcon type="icon-device" script-url="//at.alicdn.com/t/c/font_xxx.js" />
</template>
```

#### Rules

- `type` 命中 `@ant-design/icons-vue` 导出名时直接渲染 Ant 图标；否则渲染 iconfont 图标，因此两种图标体系可混用。
- `scriptUrl` 未在组件上传入时，回退到 `JConfigProvider` 的 `IconConfig.scriptUrl` 全局配置。
- 未配置任何 scriptUrl 且 type 不匹配时渲染空节点，不报错。
