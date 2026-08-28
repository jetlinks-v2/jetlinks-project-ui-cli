### CardSelect

卡片式选择组件，以网格布局渲染一组卡片供单选或多选，可自定义卡片内容。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前选中值，可用 `v-model:value` | `string \| string[]` | - |
| options | 选项列表 | `{ value, label, describe?, disabled? }[]` | `[]` |
| multiple | 是否多选 | `boolean` | `false` |
| disabled | 整体禁用 | `boolean` | `false` |
| column | 网格列数（仅 `layout="horizontal"` 生效） | `number` | `3` |
| layout | 布局方向：`horizontal` / `vertical` | `string` | `'horizontal'` |
| itemLayout | 卡片内部布局方向：`horizontal` / `vertical` | `string` | `'horizontal'` |

#### 事件

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| select | 选中时 | `(value, node)`；多选时为 `(values: string[], nodes)` |
| change | 值变化时 | 同上 |
| update:value | 值变化（v-model） | `(value)` |

#### 插槽

| 名称 | 说明 | 作用域参数 |
| --- | --- | --- |
| itemRender | 自定义卡片内容 | `{ node }` 当前选项 |

#### 用法

```vue
<template>
  <JCardSelect
    v-model:value="value"
    :options="options"
    :column="3"
    multiple
  />
</template>

<script setup lang="ts">
const options = [
  { value: '1', label: '基础版', describe: '适合小规模接入' },
  { value: '2', label: '专业版', describe: '适合中等规模接入' },
]
</script>
```

#### Rules

- 多选模式下通过 `multiple` 属性区分；单选时 `value` 为字符串，多选时为字符串数组。
- `vertical` 布局下 `column` 不生效（强制 1 列）。
- 选项项可单独设置 `disabled` 禁用，优先于全局 `disabled`。
- 选中变化会同步通知 Form 上下文（`Form.useInjectFormItemContext`），与表单校验联动。
