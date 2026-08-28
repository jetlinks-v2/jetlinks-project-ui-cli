### Ellipsis

文本省略组件，支持单行 / 多行（`lineClamp`）省略，溢出时自动显示 Tooltip 完整内容，也可改为点击展开/收起。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| lineClamp | 多行省略行数；不传则单行省略 | `number \| string` | `1` |
| tooltip | 是否显示完整内容 Tooltip，`false` 关闭；传对象可配置 Tooltip props | `boolean \| object` | `true` |
| expandTrigger | 展开方式，`'click'` 时点击切换展开/收起 | `string` | - |

#### 插槽

| 名称 | 说明 |
| --- | --- |
| default | 需要省略的内容 |
| tooltip | Tooltip 内的自定义完整内容（默认复用内容本身） |

#### 用法

```vue
<template>
  <!-- 单行省略 + hover 显示完整内容 -->
  <JEllipsis>这是一段很长的描述文字，超出后显示省略号……</JEllipsis>

  <!-- 两行省略 + 点击展开 -->
  <JEllipsis :line-clamp="2" expand-trigger="click">
    多行内容，默认截断为两行，点击可在展开/收起间切换。
  </JEllipsis>

  <!-- 自定义 Tooltip 内容 -->
  <JEllipsis :tooltip="{ placement: 'bottom' }">
    <template #tooltip>完整内容详情</template>
    省略的内容
  </JEllipsis>
</template>
```

#### Rules

- 溢出判定基于 `scrollHeight > offsetHeight` 动态计算，未溢出时不弹 Tooltip、不出现省略号。
- `lineClamp` 使用 `-webkit-line-clamp` 实现，需要 WebKit/Blink 内核支持。
- `expandTrigger="click"` 时追加 pointer 光标样式；展开后不再触发 Tooltip。
- 其余属性（class / style 等）自动透传到内容容器。
