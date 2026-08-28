### Scrollbar

自定义滚动条组件，替换浏览器原生滚动条，提供统一样式与横向/纵向滚动监听。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| height | 容器高度 | `string \| number` | `''` |
| maxHeight | 容器最大高度 | `string \| number` | `''` |
| native | 是否使用原生滚动条 | `boolean` | `false` |
| wrapStyle | 外层 wrap 样式 | `StyleValue` | `''` |
| wrapClass | 外层 wrap 类名 | `string \| array` | `''` |
| viewClass | 内容 view 类名 | `string \| array` | `''` |
| viewStyle | 内容 view 样式 | `StyleValue` | `''` |
| tag | 内容容器标签 | `string` | `'div'` |
| noresize | 不响应容器尺寸变化（容器不变时开启可优化性能） | `boolean` | `false` |
| always | 始终显示滚动条 | `boolean` | `false` |
| minSize | 滚动条最小尺寸（px） | `number` | `20` |
| id | 内容容器 id | `string` | - |
| role / ariaLabel / ariaOrientation | 无障碍属性 | - | - |

#### 事件

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| scroll | 滚动时 | `({ scrollTop, scrollLeft })` |

#### 用法

```vue
<template>
  <Scrollbar :height="300" always @scroll="onScroll">
    <div style="height: 1000px">超长内容</div>
  </Scrollbar>
</template>
```

#### Rules

- 默认隐藏原生滚动条，渲染自定义细滚动条；`native` 为 `true` 时保留原生样式。
- `scroll` 事件仅在 `scrollTop` / `scrollLeft` 均为数字时触发。
- 容器尺寸固定且不变化时建议设置 `noresize`，避免多余监听开销。
