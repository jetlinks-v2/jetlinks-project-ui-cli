### LocaleProvider

语言包 Provider，向组件树提供统一的文案语言包（默认中文），供 `useLocaleReceiver` 消费。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| locale | 组件文案语言包对象，按组件名分组 | `Record<string, any>` | 内置 `zh-CN` |

#### 用法

```vue
<template>
  <JLocaleProvider :locale="enUS">
    <app-content />
  </JLocaleProvider>
</template>
```

#### Rules

- 通过 provide `componentLocaleData` 向下注入；子组件用 `useLocaleReceiver('组件名')` 获取对应分组的文案。
- `locale` 变化时深监听并重新注入。
- 通常无需单独使用：`JConfigProvider` 内部已包含本组件，直接配 `componentsLocale` 即可。
