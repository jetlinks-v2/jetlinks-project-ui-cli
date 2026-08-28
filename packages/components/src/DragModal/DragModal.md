### DragModal

可拖拽、可缩放的模态弹窗，替代固定尺寸弹窗用于需要调整视口的场景；支持右下角手柄缩放、标题栏拖拽。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题；传 `false` 隐藏标题栏 | `string \| boolean` | `''` |
| width | 初始宽度（px） | `number` | `400` |
| height | 初始高度（px） | `number` | `100` |
| dragRang | 最小缩放尺寸 `[最小宽, 最小高]`（px） | `number[] \| number` | `[400, 200]` |
| bodyStyle | 内容区自定义样式 | `object` | `{}` |
| footer | 是否显示底部按钮区；传 `false` 隐藏 | `boolean` | `true` |

#### 事件

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| cancel | 点击取消 / 关闭按钮 | - |
| ok | 点击确认按钮 | - |
| visibleChange | 可见状态变化 | `(visible: boolean)` |
| heightChange | 拖动改变高度时 | `(height: number)` |

#### 插槽

| 名称 | 说明 |
| --- | --- |
| default | 弹窗内容 |
| footer | 自定义底部按钮区 |

#### 用法

```vue
<template>
  <JDragModal v-model:visible="visible" title="高级筛选" :width="640" :drag-rang="[400, 200]">
    <div>弹窗内容</div>
  </JDragModal>
</template>
```

#### Rules

- 挂载时自动居中于视口；默认位置 `(right - width) / 2, top + 200`。
- 拖拽/缩放边界以 `dragRang` 为最小宽高，无法缩小到更小。
- 高度变化通过 `heightChange` 事件实时上报，便于外部记录位置。
- 底部默认渲染"取消 / 确认"按钮，文案随 `LocaleProvider` 国际化；关闭与取消均触发 `cancel` + `visibleChange(false)`。
