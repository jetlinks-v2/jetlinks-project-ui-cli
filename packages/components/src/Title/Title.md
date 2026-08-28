### Title

标题组件，渲染区块标题文本，右侧可通过插槽放置操作区。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 标题文本 | `string` | `''` |
| style | 标题容器样式 | `object` | `{}` |

#### 插槽

| 名称 | 说明 |
| --- | --- |
| extra | 标题右侧操作区（如按钮 / 链接） |

#### 用法

```vue
<template>
  <JTitle data="设备列表">
    <template #extra>
      <a-button size="small" type="link">更多</a-button>
    </template>
  </JTitle>
</template>
```

#### Rules

- 用于区块 / 分区标题，视觉由 `j-title` 样式统一控制；标题与操作区左右布局。
- `data` 为纯文本，复杂标题可通过默认插槽替换（组件内部结构为 `.j-title-content` 加 `extra`）。
