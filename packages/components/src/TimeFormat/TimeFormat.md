### TimeFormat

时间格式化组件，将时间戳（毫秒）或字符串按指定格式渲染为文本；非数字输入原样返回。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| time | 时间值：数字时间戳（毫秒）或字符串 | `string \| number` | - |
| format | 输出格式（dayjs 格式串） | `string` | `'YYYY-MM-DD HH:mm:ss'` |

#### 用法

```vue
<template>
  <JTimeFormat :time="row.createTime" />
  <JTimeFormat :time="1693200000000" format="YYYY-MM-DD" />
</template>
```

#### Rules

- 数字字符串（如 `"1693200000000"`）也会被识别为时间戳处理；无法转换为数字时原样展示。
- 内部使用 dayjs，`format` 支持全部 dayjs 格式令牌。
- `time` 为空时渲染为空字符串。
