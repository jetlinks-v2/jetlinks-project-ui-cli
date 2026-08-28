### FullPage

全屏页面容器，自动测量容器顶部偏移并计算 `minHeight`，使内容区撑满剩余视口高度，背景使用主题容器色。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| reduceHeight | 视口高度缩减量（px），顶部还有固定工具条时设置 | `number` | 由 `ConfigProvider` 的 `FullPageConfig` 注入，默认 `24` |

#### 插槽

| 名称 | 说明 |
| --- | --- |
| default | 页面内容 |

#### 用法

```vue
<template>
  <JFullPage>
    <div>内容区自动撑满剩余高度</div>
  </JFullPage>
</template>
```

#### Rules

- 通过 `useElementBounding` 实时测量容器 `top`，滚动时高度自动跟随调整。
- `reduceHeight` 可在 `JConfigProvider` 的 `FullPageConfig` 中全局配置，组件 props 不直接暴露时优先使用全局注入值。
- 背景色取自 ant-design-vue 主题 token 的 `colorBgContainer`。
