### VirtualTable

虚拟滚动表格组件，基于 ant-design-vue `Table` 封装，仅渲染可视区行，支持大数据量高性能渲染、树形数据展开与自定义行高。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| 全部 Table props | 透传 ant-design-vue `Table` 全部属性 | `TableProps` | - |
| virtual | 虚拟滚动配置 | `boolean \| { itemHeight?, overscan?, threshold? }` | - |

#### virtual 配置

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| itemHeight | 行高，固定值或动态函数 | `number \| (index) => number` | `54` |
| overscan | 可视区外预渲染行数 | `number` | `5` |
| threshold | 数据量超过此值才启用虚拟滚动 | `number` | `100` |

#### 用法

```vue
<template>
  <VirtualTable
    :columns="columns"
    :data-source="dataSource"
    :scroll="{ y: 400 }"
    :virtual="{ itemHeight: 54, overscan: 5 }"
  >
    <template #bodyCell="{ column, record }">
      <span>{{ record[column.dataIndex] }}</span>
    </template>
  </VirtualTable>
</template>
```

#### Rules

- 数据量小于 `threshold`（默认 100）时不启用虚拟滚动，退化为普通 Table。
- 树形数据支持展开收起；行通过 Proxy 缓存池包装以提供 `__virtual_tree_node__` 元信息，展开状态与数据同步。
- 行高使用动态函数时由 `useVirtualScroll` 计算总高度，适合不定高行场景。
- 常用于 EditTable 的内部数据承载；滚动容器高度由 `scroll.y` 或外部约束提供。
