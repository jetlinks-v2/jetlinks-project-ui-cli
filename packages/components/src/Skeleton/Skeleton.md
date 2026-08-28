### Skeleton

骨架屏组件，加载时展示占位骨架，加载完成后切换为真实内容；内置 9 种业务骨架（列表 / 卡片 / 树 / 详情 / 抽屉 / 仪表盘等）。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| active | 骨架是否带动态闪烁动画 | `boolean` | `true` |
| loading | 是否处于加载态；`false` 时渲染默认插槽内容 | `boolean` | `true` |

#### 插槽

| 名称 | 说明 |
| --- | --- |
| default | 加载完成后的真实内容 |

#### 内置骨架（具名导出）

| 导出名 | 场景 |
| --- | --- |
| JSkeletonListTable | 列表-表格骨架 |
| JSkeletonListCard | 列表-卡片骨架 |
| JSkeletonList | 通用列表骨架 |
| JSkeletonTree | 树形骨架 |
| JSkeletonDetail | 详情页骨架 |
| JSkeletonDrawer | 抽屉骨架 |
| JSkeletonDashboardCard | 仪表盘-卡片骨架 |
| JSkeletonDashboardChart | 仪表盘-图表骨架 |
| JSkeletonPage | 整页骨架 |

#### 用法

```vue
<template>
  <JSkeleton :loading="loading">
    <div>真实内容</div>
  </JSkeleton>

  <!-- 指定场景骨架 -->
  <JSkeletonListTable :active="true" />
  <JSkeletonDetail />
</template>
```

#### Rules

- 默认骨架为"40% + 3 行 + 80%"的段落布局，仅渲染 `default` 插槽内容的占位。
- 9 个具名骨架为独立组件，直接按需引入，无需包裹 `JSkeleton`。
- `active` 控制闪烁动画，`loading` 为 `false` 时立即渲染真实内容。
