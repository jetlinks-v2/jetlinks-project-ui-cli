### RadioButton

单选按钮组件，以网格布局渲染一组按钮，点击切换选中值（受控）。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前选中值，可用 `v-model:value` | `string \| number` | - |
| options | 选项列表 | `{ label: string; value: string \| number }[]` | `[]` |
| columns | 网格列数 | `number` | `3` |

#### 事件

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 值变化（v-model） | `(value)` |
| select | 选中时 | `(value)` |

#### 用法

```vue
<template>
  <JRadioButton v-model:value="value" :options="options" :columns="4" />
</template>
```

#### Rules

- 纯单选，点击已选中项不触发重复事件。
- 列数通过 `grid-template-columns: repeat(columns, 1fr)` 实现，`columns` 控制每行按钮数量。
- `value` 为受控属性，外部变化会同步到内部状态。
