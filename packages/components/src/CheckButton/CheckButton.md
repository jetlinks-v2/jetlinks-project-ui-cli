### CheckButton

选择按钮组，以按钮形式呈现多选选项，可单独使用或与 `a-checkbox-group` 组合使用。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| multiple | 多选 | `boolean` | `false` |
| disabled | 失效状态 | `boolean` | `false` |
| value | 与 CheckboxGroup 组合使用时的值 | `boolean \| string \| number` | - |
| options | 选择项 | `{ label: string; value: string; disabled?: boolean }[]` | `[]` |
| class | 类名 | `string` | - |
| style | CSS 样式 | `CSSProperties` | `{}` |

#### 事件

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 变化时回调 | `(keys: string \| string[], nodes: any[])` |

#### 用法

```vue
<template>
  <JCheckButton
    v-model:value="value"
    :options="[{ label: '在线', value: 'online' }, { label: '离线', value: 'offline' }]"
  />
</template>
```

#### Rules

- `options` 中的每项可单独设置 `disabled`。
- `multiple` 决定单选还是多选，单选时 `change` 返回单个值。
- 该组件数据录入语义为"选择"，与表单组件（CheckboxGroup）组合使用时通过 `value` 对接。
