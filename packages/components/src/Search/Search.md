### Search

搜索组件，根据列配置自动生成查询表单，支持高级（多组 `and` / `or`）搜索，输出 Terms 供后端查询；可与 ProTable 配合使用。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 同 `Table` `columns` | `Columns[]` | `[]` |
| labelWidth | label 最小宽度 | `number` | `40` |

#### Columns 扩展

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| dataIndex | 同 `Table` `columns` 中的 dataIndex | - |
| title | 同 `Table` `columns` 中的 title | - |
| search | 查询属性，不传则不出现在查询组件中 | `Search[]` |

#### Search 字段配置

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| first | 是否提升为第一个查询字段 | `boolean` | `''` |
| rename | 重命名查询字段，可覆盖 `Terms.column` 的值 | `string` | - |
| type | 组件类型 | `select` \| `number` \| `treeSelect` \| `date` \| `time` | `'string'` |
| componentProps | 组件的 props | `object` | `{}` |
| format | `date` / `time` 时生效 | `string` | `'YYYY-MM-DD HH:mm:ss'` |
| options | `treeSelect` / `select` 时生效 | `Option[]` \| `Promise` | `[]` |
| defaultTermType | 修改 `Terms.termType` 的默认值 | `string` | `'eq'` |
| handleValue | 处理 `Terms.value` | `Function` | `Function(item)` |

#### Terms

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| column | 查询字段 | `string` |
| type | 两组查询间的关系 | `and` \| `or` |
| termType | 查询条件 | `eq` \| `like` \| `btw` 等 |
| value | 查询值 | `string` \| `number` \| `object` |

#### 事件

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| search | 搜索事件 | `AdvancedSearch`: `Function({ terms: [{ terms: Terms[] }] })`；`Search`: `Function(Terms[])` |

#### 用法

```vue
<template>
  <JSearch :columns="columns" @search="onSearch" />
</template>
```

#### Rules

- 每个可查询列需在 `columns[].search` 中配置查询属性，未配置的列不参与查询表单。
- `AdvancedSearch` 支持多组条件组合（组内关系与组间 `and` / `or`），默认导出 `Search` 与 `AdvancedSearch` 两个形态。
- 与 `ProTable` 配合时，`search` 事件输出的 Terms 作为表格 `params` 触发重新请求。
