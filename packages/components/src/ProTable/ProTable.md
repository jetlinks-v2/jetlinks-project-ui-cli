### ProTable

高级表格组件，封装搜索、请求、分页、卡片/列表双形态（网格）、行选择与插槽扩展，支持树形（`TREE`）与分页（`PAGE`）两种模式。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| request | 请求数据的 api（promise） | `promise` | - |
| loading | 控制 loading | `boolean` | `undefined` |
| columns | 表格列配置（ant-design-vue Table columns） | `array` | - |
| params | 搜索参数 | `object` | `{}` |
| type | 表格类型：`TREE` \| `PAGE` | `string` | `'PAGE'` |
| noPagination | 是否显示分页 | `boolean` | `true` |
| rowSelection | 行选择配置 | `object` | - |
| dataSource | 数据数组（本地数据模式） | `object[]` | - |
| gridColumns | 不同分辨率下每行卡片数量：`[0]` 1366~1440、`[1]` 1440~1600、`[2]` >1600 | `number[]` | - |
| gridColumn | 每行展示的卡片数量 | `number` | - |
| alertRender | 是否展示上方选择提示框 | `boolean` | `true` |
| defaultParams | 默认参数 | `object` | `{}` |
| bodyStyle | 内容区域自定义样式 | `object` | - |

#### Column 扩展

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| scopedSlots | 是否为插槽列 | `boolean` | `false` |
| hideInTable | 是否在表格中隐藏 | `boolean` | - |

#### 事件

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| cancelSelect | 取消选择 | `() => void` |

#### 插槽

| 名称 | 说明 |
| --- | --- |
| card | 卡片形态下的卡片渲染（`gridColumn` 模式） |
| headerTitle | `PAGE` / `TREE` 模式顶部左侧 |
| rightExtraRender | `PAGE` / `TREE` 模式顶部右侧 |
| paginationRender | 分页自定义 |
| 其余 | 透传 ant-design-vue Table 插槽 |

#### 用法

```vue
<template>
  <JProTable
    type="PAGE"
    :columns="columns"
    :request="fetchList"
    :params="searchParams"
    :row-selection="rowSelection"
  >
    <template #headerTitle>设备列表</template>
    <template #rightExtraRender>
      <a-button type="primary" @click="onAdd">新增</a-button>
    </template>
  </JProTable>
</template>
```

#### Rules

- 表格主体属性与 `Column` 均参考 ant-design-vue `Table`，其余扩展字段见上表。
- `request` 模式由组件内部管理 loading 与分页状态；`dataSource` 模式为受控本地数据。
- 卡片网格形态（`gridColumns` / `gridColumn`）下通过 `card` 插槽渲染卡片。
- 搜索联动：配合 `Search` 组件时，`params` 变化自动重新请求。
