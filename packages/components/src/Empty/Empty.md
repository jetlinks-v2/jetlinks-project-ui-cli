### Empty

空状态组件，内置 JetLinks 空数据插画与默认文案（可国际化），透传 ant-design-vue `Empty` 全部能力。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| description | 空状态描述文案 | `string` | 语言包默认（如"暂无数据"） |
| image | 插画图片地址或自定义插画 | `string` | 内置 NoData 插画 |
| imageStyle | 插画样式 | `CSSProperties` | `{ height: '60px' }` |
| 其余 | 透传 ant-design-vue `Empty` props | - | - |

#### 插槽

| 名称 | 说明 |
| --- | --- |
| default | 自定义空状态内容（替代插画 + 文案） |
| 其他具名插槽 | 透传给 ant-design-vue `Empty` |

#### 用法

```vue
<template>
  <JEmpty description="暂未接入设备，先创建一个产品再添加设备" />
</template>
```

#### Rules

- 未传 `description` 时取 `LocaleProvider` 语言包中的默认文案。
- 组件自带包裹 `LocaleProvider`，可独立使用。
- 默认 `imageStyle` 高度 60px，自定义插画时按需覆盖。
- 描述文案颜色为 `#b3b3b3`、14px，由组件内联样式控制。
