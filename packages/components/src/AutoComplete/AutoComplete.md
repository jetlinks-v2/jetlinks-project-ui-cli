### AutoComplete

带搜索的输入选择组件，支持单选与多选（tags）两种模式；单选时可输入任意值并自动补全，未匹配的输入值会作为自定义选项回填。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值（可用 `v-model:value`） | `string \| string[]` | - |
| multiple | 多选模式，为 `true` 时渲染为 Select tags | `boolean` | `true` |
| searchKey | 选项匹配字段名，默认取 `options` 的 `label` 字段 | `string` | `'label'` |
| options | 候选项 | `DefaultOptionType[]` | `[]` |
| 其余 | 透传 ant-design-vue `Select` / `AutoComplete` 全部 props（`selectProps()`） | - | - |

#### 事件

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| select | 选中选项时 | `(value, option)` |
| change | 值变化时 | `(value)` |
| update:value | 值变化（v-model） | `(value: string \| string[] \| undefined)` |

#### 用法

```vue
<template>
  <JAutoComplete
    v-model:value="value"
    :options="[{ label: '设备A', value: 'device-a' }]"
    multiple
    placeholder="输入或选择"
  />
</template>
```

#### Rules

- 单选模式下输入框中未命中任何选项的值，会在 `select` / `blur` 时自动追加为自定义选项。
- 匹配逻辑同时支持 `value` 与 `searchKey` 命中的字段（含 `label`），默认大小写敏感、去除首尾空格后比较。
- `multiple` 模式下使用 `Select` 的 `tags` 模式，选项与自定义值合并展示、按值去重。
- 其余 props（如 `placeholder`、`disabled`、`allowClear`）直接透传给底层组件，`allowClear` 默认开启。
