### PermissionButton

权限按钮组件，根据权限码自动控制按钮的可用性：无权限时禁用并提示，有确认需求时内置 Popconfirm / Modal 二次确认，并支持 Tooltip 与自定义确认组件。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| hasPermission | 权限码；`true` 或 `undefined` 视为有权限，支持字符串 / 数组（任一命中） | `string \| string[] \| boolean` | `undefined` |
| noPermissionTitle | 无权限时 Tooltip 文案 | `string` | 语言包（默认"暂无权限"） |
| popConfirm | 点击后的二次确认配置（ant-design-vue `PopconfirmProps`，可用 `onConfirm` / `onCancel`） | `object` | - |
| popConfirmBefore | 点击时先执行的异步函数，返回值合并进 `popConfirm`（可用于动态确认内容） | `Function` | - |
| tooltip | 按钮 Tooltip 配置（`TooltipProps`） | `object` | - |
| style | 按钮样式 | `CSSProperties` | - |
| 其余 | 透传 ant-design-vue `Button` props（`buttonProps()`，去除 `icon`） | - | - |

#### 插槽

| 名称 | 说明 |
| --- | --- |
| default | 按钮文字 / 内容 |
| icon | 按钮图标 |
| button | 完全自定义按钮节点（跳过内部 Button 渲染，仅保留权限逻辑） |

#### 用法

```vue
<template>
  <JPermissionButton has-permission="device:delete" danger :pop-confirm="{ title: '确认删除该设备？' }">
    删除设备
  </JPermissionButton>
</template>
```

#### Rules

- 权限判定基于 `usePermission`（来自 `@jetlinks-web/hooks`）；`hasPermission` 传 `true` 或省略时恒有权限。
- 有权限且配置 `popConfirm` 时：优先使用 `JConfigProvider` 中 `PermissionButtonConfig.components` 自定义确认组件，否则回退 `Modal.confirm`。
- 无权限时不渲染原始按钮逻辑，改为渲染带提示的禁用态（Tooltip 包裹）。
- `disabled` 透传自 Button props，与权限判定叠加。
