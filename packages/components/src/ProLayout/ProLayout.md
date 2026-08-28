### ProLayout

高级布局组件（兼容 `@ant-design-vue/pro-layout` 布局体系），提供侧栏 / 顶栏 / 混合（mix）三种布局与页面容器 `PageContainer`，适配 PC 与移动端。

#### ProLayout Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| layout | 布局模式：`side` / `top` / `mix` | `string` | `'side'` |
| menuData | 菜单数据（含 `path` / `name` / `icon` / `children` 等） | `MenuDataItem[]` | - |
| title | 站点标题 | `string` | - |
| logo | Logo | `string \| slot` | - |
| fixedHeader | 固定顶栏 | `boolean` | - |
| fixSiderbar | 固定侧栏 | `boolean` | - |
| collapsed / collapsedWidth / siderWidth | 侧栏折叠状态与宽度 | - | - |
| splitMenus | 混合布局下分离菜单 | `boolean` | - |
| breadcrumb | 面包屑数据或渲染函数 | `object \| Function` | - |
| pure | 纯布局（不渲染页头等） | `boolean` | - |
| loading | 布局加载态 | `boolean` | - |
| disableMobile | 禁用移动端模式 | `boolean` | - |
| disableContentMargin | 禁用内容区 margin | `boolean` | - |
| contentStyle | 内容区样式 | `CSSProperties` | - |
| headerRender / headerContentRender | 自定义顶栏渲染 | `Function \| boolean` | - |
| collapsedButtonRender | 自定义折叠按钮 | `Function \| boolean` | - |
| classNames | 各区域自定义类名 | `object` | `{}` |
| 其余 | 透传 defaultSettingProps / siderMenuProps / headerViewProps 等 | - | - |

#### PageContainer Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 页头标题 | `string \| Render` | - |
| subTitle | 副标题 | `string \| Render` | - |
| content | 页头内容区 | `string \| Render` | - |
| extra / extraContent | 页头右侧操作区 | `string \| Render` | - |
| header | 自定义页头（传 `false` 隐藏） | `Render \| boolean` | - |
| pageHeaderRender | 自定义整个页头渲染 | `Function` | - |
| breadcrumb | 面包屑 | `object` | - |
| tabList / onTabChange | 页头页签与切换 | - | - |
| fixedHeader | 固定页头 | `boolean` | - |
| pure | 纯内容模式 | `boolean` | - |

#### 用法

```vue
<template>
  <ProLayout v-model:collapsed="collapsed" :menu-data="menuData" layout="side" :fixed-header="true">
    <template #headerContentRender="{ collapsed }">
      <div>自定义顶栏</div>
    </template>
    <PageContainer title="设备管理">
      <router-view />
    </PageContainer>
  </ProLayout>
</template>
```

#### Rules

- 布局切换由 `layoutType`（`LayoutType.PC / PAD`）与 `layout` 共同驱动：PAD 模式下侧栏自动收起为图标。
- 菜单数据项遵循 `MenuDataItem` 结构；菜单 / 路由联动由外部路由系统提供 `selectedKeys` 等控制。
- 折叠状态受控（`v-model:collapsed`），内部默认提供折叠按钮。
- 移动端默认开启响应式模式，可通过 `disableMobile` 关闭。
