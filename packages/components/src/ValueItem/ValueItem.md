### ValueItem

参数类型输入组件，按 `itemType`（数据类型）自动渲染对应输入控件：文本、数字（int/long/float/double）、下拉、日期、时间、密码、文件上传等；常用于参数 / 属性动态录入场景。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 双向绑定值（`v-model`） | `number \| string` | `''` |
| itemType | 数据类型，决定渲染控件 | `string` | `'string'` |
| mode | 下拉选择模式：`multiple` \| `tags` \| `combobox` | `string` | - |
| placeholder | 输入占位符 | `string` | - |
| options | 下拉选项（`select` / `enum` / `boolean` 类型用） | `array` | - |
| style | 容器样式 | `CSSProperties` | - |
| class | 容器类名 | `string` | - |
| valueFormat | 日期 / 时间输出格式 | `string` | 日期 `'YYYY-MM-DD HH:mm:ss'`，时间 `'HH:mm:ss'` |
| action | 上传地址（`file` 类型用），支持字符串或返回 Promise | `string \| Promise` | - |
| headers | 上传请求头 | `object` | - |
| disabled | 禁用 | `boolean` | - |
| extraProps | 附加 props，合并覆盖到底层控件 | `object` | `{}` |
| handleFileChange | 文件上传完成回调，返回值作为最终值 | `Function` | - |

#### 事件

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 值变化（v-model） | `(data: string \| number \| boolean)` |
| change | 值变化 | `(data, item?)` |

#### 类型映射

| itemType | 渲染控件 |
| --- | --- |
| `int` / `long` / `float` / `double` | `a-input-number`（int/long 精度 0） |
| `string` / `array` | `a-input` |
| `password` | `a-input-password` |
| `enum` / `select` / `boolean` | `a-select`（boolean 为 true/false 选项） |
| `date` | `a-date-picker`（含时间） |
| `time` | `a-time-picker` |
| `file` | `a-input` + 上传按钮（地址回填） |
| `object` / `geoPoint` | 保留为对象字符串（内部处理） |

#### 用法

```vue
<template>
  <JValueItem v-model="value" item-type="select" :options="options" />
  <JValueItem v-model="timeValue" item-type="date" />
  <JValueItem v-model="fileUrl" item-type="file" :action="uploadUrl" />
</template>
```

#### Rules

- `extraProps` 会合并到底层控件 props 并覆盖同名属性。
- `file` 类型上传成功后取响应 `result.accessUrl` 回填；配置 `handleFileChange` 时可转换返回值。
- `int` 类型取值限制在 `[-2147483648, 2147483647]`，`long` / 浮点限制在 `±999999999999999`。
- `mode` 仅对 `select` 类控件生效。
