### BadgeStatus

状态徽标组件，将业务状态值（如 `success` / `error` / 数字）映射为 Ant Design `Badge` 的颜色徽标。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| text | 徽标文本 | `string` | - |
| status | 状态值，作为 `statusNames` 的键 | `string \| number` | `'default'` |
| statusNames | 状态值 → 语义色映射表，支持自定义任意业务状态 | `Record<string, string>` | `{ success, warning, error, default }` |

#### 用法

```vue
<template>
  <JBadgeStatus :status="row.status" :text="row.statusText" />
</template>
```

自定义状态映射：

```vue
<template>
  <JBadgeStatus
    status="1"
    text="启用"
    :status-names="{ 1: 'success', 0: 'error' }"
  />
</template>
```

#### Rules

- 颜色取自内置语义色板：`success`(绿) / `warning`(橙) / `error`(红) / `processing`(蓝) / `default`(灰)，未命中的状态回退为 `default`。
- `statusNames` 中的值使用语义色名，组件内部通过 `getHexColor` 转为带透明度的 `rgba` 色（默认透明度 0.1）。
- `text` 为空时仅显示色点，不渲染文字。
