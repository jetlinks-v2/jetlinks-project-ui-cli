### EditTable

可编辑表格组件，基于虚拟滚动大表（VirtualTable）实现单元格编辑、校验、分组、行内表单、右键菜单与全屏切换，适合大数据的参数/明细录入场景。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 列配置（ant-design-vue Table columns，支持编辑列） | `array` | `[]` |
| dataSource | 数据数组 | `array` | `[]` |
| rowKey | 行主键字段 | `string` | `'id'` |
| height | 表格高度（px） | `number` | `300` |
| cellHeight | 行高（px），虚拟滚动按此计算 | `number` | `65` |
| readonly | 只读模式，内容区覆盖遮罩禁止编辑 | `boolean` | `false` |
| serial | 序号列配置，`false` 关闭 | `object \| boolean` | `{ width: 70, title: '' }` |
| searchColumns | 搜索列配置（如 `[{ title: '标识', dataIndex: 'id' }]`） | `array` | 内置 `id` / `name` 两列 |
| openGroup | 开启分组（表头分组条） | `boolean` | `false` |
| rowSelection | 行选择配置 | `object` | - |
| validateRowKey | 是否按行校验 | `boolean` | `false` |
| disableMenu | 禁用右键菜单 | `boolean` | `true` |
| 其余 | 透传 ant-design-vue `Table` props（`tableProps()`） | - | - |

#### 事件

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| editChange | 单元格编辑变化 | - |
| scrollDown | 滚动到底部 | - |
| rightMenuClick | 右键菜单点击 | - |
| searchVisibleChange | 搜索可见性变化 | - |
| groupDelete / groupEdit | 分组删除 / 编辑 | - |

#### 插槽

| 名称 | 说明 | 作用域参数 |
| --- | --- | --- |
| extra | 工具栏扩展区 | `{ isFullscreen, fullScreenToggle }` |
| bodyExtra | 表格主体底部扩展 | - |
| `#列dataIndex` | 按列自定义单元格渲染 | `{ column, record, index, visibleIndex }` |
| 其他插槽 | 透传给内部 VirtualTable | - |

#### 用法

```vue
<template>
  <JEditTable
    v-model:dataSource="dataSource"
    :columns="columns"
    :height="400"
    :open-group="true"
    @editChange="onEditChange"
  />
</template>
```

#### Rules

- 编辑字段通过 `FormItem` 注册（与 `JEditTable` 同步安装），单元格渲染约定见 `CellRender.vue`。
- 校验错误按行/分组聚合，`fieldsErrMap` / `fieldsGroupError` 驱动行高亮与提示。
- 大数据量下基于虚拟滚动（`virtual.itemHeight = cellHeight`，`threshold = height / cellHeight`），请勿关闭。
- 分组功能需在 `openGroup` 时配合 `rowSelection` 使用，分组操作会同步更新 `dataSource` 的分组标记。
- 全屏切换通过工具栏 `extra` 插槽暴露的 `fullScreenToggle` 触发，全屏态表格占满可视区。
