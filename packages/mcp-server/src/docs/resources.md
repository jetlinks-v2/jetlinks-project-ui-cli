# JetLinks UI组件资源信息

## 组件信息
主要是根据平时的业务需求编写的一些常用的组件。

### 依赖包
`@jetlinks-web/components`通用业务组件在`main.ts`中已经全局注册，无需引入，直接使用。

### 主要组件
#### AutoComplete
下拉可输入可搜索选择框

```vue
<template>
  <j-auto-complete :options="options" />
</template>

<script setup>
  const options = [
      { label: 'Option 1', value: 'option1' },
      { label: '张三', value: 'zhangsan' },
      { label: '李四', value: 'lisi' },
    ]
</script>
```

+ API

| 属性  | 说明 | 类型 | 默认值   |
| --- | --- | --- | --- |
| searchKey | 搜索字段 | string | 'label' |
| options | options数据   | array | - |


#### BadgeStatus
```vue
<script setup>
const statusNames = {
  'success': 'success',
  'warning': 'warning',
  'error': 'error',
  'default': 'default',
}
const statusText = ref('正常')
const status = ref('default')
</script>

<template>
  <j-badge-status
    :status="status"
    :text="statusText"
    :statusNames="statusNames"
  />
</template>

```

+ API

| 属性  | 说明 | 类型 | 默认值   |
| --- | --- | --- | --- |
| text | 状态文案 | string | - |
| status | 状态值 | string | 'default' |
| statusNames | 自定义状态字段 | object | {<br/>  'success': 'success',<br/>  'warning': 'warning',<br/>  'error': 'error',<br/>  'default': 'default',<br/>} |


#### CardSelect
```vue
<template>
  <j-card-select :options="options" v-model:value="value" />
</template>

<script setup>
const options = [
  { label: 'Option 1', value: 'option1', disabled: true },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
]
const value = ref()
</script>
```

+ API

| 属性  | 说明 | 类型 | 默认值   |
| --- | --- | --- | --- |
| layout | 布局方式 | horizontal | vertical | grid | 'horizontal' |
| options | 选项数组 | array | [] |
| disabled | 按钮状态 | boolean | false |
| multiple | 支持多选 | boolean | false |
| column | 一行 CardSelectItem的数量 | number | 3 |
| value | 选中的值 | string | array | - |


#### CheckButton
```vue
<template>
  <j-check-button v-model:value="myValue" :options="options" :columns="4" />
</template>

<script setup>
import { ref } from "vue";
const options = [
  {label: "选项1", value: '1'},
  {label: "选项2", value: '2'},
  {label: "选项3", value: '3'},
  {label: "选项4", value: '4'},
  {label: "选项5", value: '5'}
]

const myValue = ref(['1', '4'])
</script>
```

+ API

| 属性  | 说明 | 类型 | 默认值   |
| --- | --- | --- | --- |
| options | 选项 | array | [] |
| multiple | 是否多选 | boolean | false |
| value | 值 | string | array | - |
| disabled | 是否禁用 | boolean | false |
| class | 样式class | string | - |
| style | 样式style | object | {} |


#### DragModal
```vue
<template>
  <div style="width: 100%; height: 500px;">
    <j-drag-modal :height="200" title="这是一段测试文字">
      <p>这是一个可拖动弹窗</p>
    </j-drag-modal>
  </div>
</template>
```

+ API

| 属性  | 说明 | 类型 | 默认值   |
| --- | --- | --- | --- |
| title | 标题 | boolean | strring | '' |
| height | 高度 | number | 100 |
| dragRang | 拖拽范围 | array | number | [400, 200] |
| width | 宽度 | number | 400 |
| bodyStyle | 内容样式 | object | {} |
| footer | 是否显示底部 | boolean | true |


#### EditTable
```vue
<script setup>
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 200,
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 200,
    form: {
      required: true,
      rules: [{ required: true, message: '请输入名称' }]
    }
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: 200,
  },
]
const typeMap = {
  0: 'object',
  1: 'string',
  2: 'number',
  3: 'date',
  4: 'boolean',
}
const dataSource = Array.from({ length: 10}).map((_, index) => {
  const type = index % 5
  return {
    id: index + 1,
    name: `名称 ${index + 1}`,
    type: `${typeMap[type]}`
  }
})
</script>

<template>
  <j-edit-table :columns="columns" :dataSource="dataSource">
    <template #name="{ record}">
      <a-input v-model:value="record.name" />
    </template>
    <template #type="{ record }">
      <a-select style="width: 120px" :options="types" v-model:value="record.type" />
    </template>
  </j-edit-table>
</template>
```

+ API

| 属性  | 说明 | 类型 | 默认值   |
| --- | --- | --- | --- |
| columns | 表格列的配置描述 | array | - |
| dataSource | 数据数组 | array | - |
| readonly | 是否只读 | boolean | false |


#### Ellipsis
内容超长显示省略号

```vue
<template>
  <j-ellipsis style="max-width: 240px">
    水是眼波横 山是眉峰聚 欲问行人去那边 眉眼盈盈处 才始送春归 又送君归去
    若到江南赶上春 千万和春住 水是眼波横 山是眉峰聚 欲问行人去那边
    眉眼盈盈处 才始送春归 又送君归去 若到江南赶上春 千万和春住 水是眼波横
    山是眉峰聚 欲问行人去那边 眉眼盈盈处 才始送春归 又送君归去
  </j-ellipsis>
  <j-ellipsis> 水是眼波横 山是眉峰聚 欲问行人去那边 眉眼盈盈处</j-ellipsis>
</template>
```

+ API

| 属性  | 说明 | 类型 | 默认值   |
| --- | --- | --- | --- |
| tooltip | Tooltip 的属性或内容 | boolean | TooltipProps | Slot | true |
| line-clamp | 最大行数   | number | string | 1 |
| expand-trigger | 展开的触发方式  | click | - |


#### Empty
空状态时的展示占位图

```vue
<template>
  <j-empty />
</template>
```

+ API

| 属性  | 说明 | 类型 | 默认值   |
| --- | --- | --- | --- |
| description | 自定义描述内容 | string | v-slot | - |
| image | 设置显示图片，为 string 时表示自定义图片地址 | string | v-slot | false |
| imageStyle | 图片样式 | CSSProperties | - |


#### Icon
```vue
<template>
  <AIcon type="icon-paiduizhong" />
</template>
```

+ API

| 属性  | 说明 | 类型 | 默认值   |
| --- | --- | --- | --- |
| type | Tooltip 的属性或内容 | string | - |
| scriptUrl | iconfont.cn 项目在线生成的 js 地址 | string | - |
| class | 样式class  | string | - |


#### Markdown
```vue
<template>
  <j-markdown :source="_source"/>
</template>
<script setup>
const _source = `# 示例 Markdown 文档

这是一个简单的 Markdown 示例，展示基本语法：

## 标题样式
### 三级标题
#### 四级标题

## 文本格式
- **加粗文本**  
- *斜体文本*  
- ~~删除线文本~~  
- \`行内代码\`

## 列表
### 无序列表
- 项目一
- 项目二
  - 子项目
  - 子项目

### 有序列表
1. 第一项
2. 第二项
3. 第三项

## 代码块
\`\`\`javascript
// JavaScript 示例
function greet(name) {
  return \`Hello, ${name}!\`;
}`
</script>
```

+ API

| 属性  | 说明 | 类型 | 默认值   |
| --- | --- | --- | --- |
| breaks | 转换段落里的 '\\n' 到 <br>" | boolean | false |
| highlight | 高亮函数，会返回转义的HTML | object | {} |
| html | 在源码中启用 HTML 标签 | boolean | false |
| langPrefix | 给围栏代码块的 CSS 语言前缀。对于额外的高亮代码非常有用 | string | 'language-' |
| linkify | 将类似 URL 的文本自动转换为链接 | boolean | false |
| plugins | 插件 | array | [] |
| quotes | 双 + 单引号替换对，当 typographer 启用时。或者智能引号等，可以是 String 或 Array | string | '“”‘’' |
| typographer | 启用一些语言中立的替换 + 引号美化 | boolean | false |
| xhtmlOut | 使用 '/' 来闭合单标签 （比如 <br />） | boolean | false |
| source | 值 | string | '' |


#### PermissionButton
```vue
<template>
  <j-permission-button
    :hasPermission="hasPermission"
    :popConfirm="{
      title: '确认删除？',
      onConfirm: () => {
        console.log('确认')
      },
      cancel: () => {
        console.log('取消')
      }
    }"
  >
    {{ hasPermission ? '有权限': '无权限' }}
  </j-permission-button>
</template>

<script setup>
  const hasPermission = ref(true)
</script>
```

+ API

| 属性  | 说明 | 类型 | 默认值   |
| --- | --- | --- | --- |
| hasPermission | 是否有权限或者权限标识 | boolean | - |
| tooltip | 文字提示 | object | - |
| popConfirm | 二次确认 | object | - |
| style | 样式style | object | - |
| noPermissionTitle | 无权限时的提示信息 | string | - |


#### ProTable
```vue
<template>
    <j-pro-table
      :columns="columns"
      :dataSource="dataSource"
      :noPagination="true"
      :gridColumns="[3]"
  >
    <template #headerLeftRender>
      <a-button type="primary">新增</a-button>
    </template>
    <template #headerRightRender>
      <a-button>批量操作</a-button>
    </template>
    <template #card="slotProps">
      <a-card style="width: 100%">
        <h4>名称： {{ slotProps?.name }}</h4>
        <p>年龄： {{ slotProps?.age }}</p>
      </a-card>
    </template>
    <template #address="slotProps">
      <a>{{ slotProps?.address }}</a>
    </template>
  </j-pro-table>
</template>
<script setup>
  const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        ellipsis: true
    },
    {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        scopedSlots: true,
    },
    {
        title: '状态',
        dataIndex: 'status.text',
        key: 'status.text',
    },
]

const dataSource = Array(1000)
  .fill(1)
  .map((item, index) => {
      return {
          id: index + item,
          name: 'John Brown' + index,
          age: (Math.random() * 100).toFixed(0),
          address: 'New York No. 1 Lake Park',
      };
  });
</script>
```

+ API

| 属性  | 说明 | 类型 | 默认值   |
| --- | --- | --- | --- |
| columns | 表格列的配置描述 | array | [] |
| dataSource | 数据数组 | array | [] |
| noPagination | 是否分页 | boolean | false |
| mode | 模式，只为表格或者卡片 | TABLE | CARD | undefined | undefined |
| modeValue | 控制模式，当mode为undefined时生效 | TABLE | CARD | 'TABLE' |
| rowSelection | 列表项是否可选择，参数参考ant design vue的表格的rowSelection | object | undefined |
| alertShow | 是否显示选择多少项提示 | boolean | true |
| cardBodyClass | 卡片class | string | '' |
| gridColumns | 每行展示的卡片个数 | array | [1, 2, 3, 4] |
| scroll | 表格是否可滚动，也可以指定滚动区域的宽、高 | object | {} |
| rowKey | 表格行 key 的取值，可以是字符串或一个函数 | string | 'id' |
| bodyStyle | 表格外框style | object | {padding: '16px 24px 24px'} |
| request | 数据请求 | (e, option) => Promise | undefined |
| defaultParams | 默认参数 | object | {} |
| params | 请求参数 | object | {} |
| type | 表格类型 | 'TREE', 'PAGE' | 'PAGE' |
| pagination | 分页器,参数参考ant design vue的pagination | object | - |


#### RadioButton
```vue
<template>
  <j-radio-button v-model:value="myValue" :options="options" :columns="4" />
</template>

<script setup>
import { ref } from "vue";
const options = [
  {label: "选项1", value: '1'},
  {label: "选项2", value: '2'},
  {label: "选项3", value: '3'},
  {label: "选项4", value: '4'},
  {label: "选项5", value: '5'}
]

const myValue = ref('1')
</script>
```

+ API

| 属性  | 说明 | 类型 | 默认值   |
| --- | --- | --- | --- |
| options | 选项 | array | [] |
| columns | 每行的个数 | number | 3 |
| value | 值 | number | string | - |


### Scrollbar
```vue
<template>
  <j-scrollbar :height="300">
    <div style="height: 400px; width: 110%; background-color: #999999">
      这是一个容器框,可以横向滚动，也可以纵向滚动，不信你可以试试
    </div>
  </j-scrollbar>
</template>
```

+ API

| 属性  | 说明 | 类型 | 默认值   |
| --- | --- | --- | --- |
| height | 高度 | number | string | - |


#### Search
```vue
<template>
    <a-radio-group v-model:value="value">
        <a-radio-button value="object">object</a-radio-button>
        <a-radio-button value="terms">terms</a-radio-button>
    </a-radio-group>
    <j-search :columns="columns" @search="onSearch" :type="value" />
    <div>
        查询结果:
        <br />
        {{ paramsStr }}
    </div>
</template>

<script setup>
import { ref } from 'vue';

const paramsStr = ref();
const value = ref('object');
const columns = [
  {
    title: '名称名称名称1',
    dataIndex: 'name',
    search: {
      type: 'string',
      componentProps: {
        placeholder: '请输入名称',
      },
      defaultValue: '111111111',
    },
  },
  {
    title: '年龄',
    dataIndex: 'age',
    search: {
      type: 'number',
      componentProps: {
        placeholder: '请输入真实年龄',
      },
    },
  },
  {
    title: '类型',
    dataIndex: 'type',
    search: {
      type: 'select',
      options: [
        { label: '类型1', value: 1 },
        { label: '类型2', value: 2 },
      ],
      componentProps: {
        placeholder: '请选择类型',
      },
    },
  },
  {
    title: '测试地址长度',
    dataIndex: 'address',
    search: {
      type: 'string',
    },
  },
  {
    title: '时间',
    dataIndex: 'treeSelect',
    search: {
      type: 'treeSelect',
      componentProps: {
        treeNodeFilterProp: 'title',
        fieldNames: { label: 'title' },
        filterTreeNode: (v, node) => {
          return true;
        },
      },
      options: [
        { title: '1', value: 1 },
        { title: '12', value: 12 },
        { title: '13', value: 13 },
        { title: '14', value: 14 },
        { title: '15', value: 15 },
      ],
    },
  },
];

const onSearch = (e) => {
  paramsStr.value = JSON.stringify(e);
};
</script>
```

+ API

| 属性  | 说明 | 类型 | 默认值   |
| --- | --- | --- | --- |
| columns | 搜索项，包含配置 | array | [] |
| type | 返回值的类型 | string | 'terms' |
| column | 每一排搜索项的个数 | number | 4 |
| style | 样式style | string | object | - |
| class | 样式class | string | - |
| labelWidth | label 标签的宽度 | number | 40 |
| resetText | 重置按钮的文本 | string | - |
| submitText | 提交按钮的文本 | string | - |
| align | 操作按钮对齐 | string | 'value' |


#### Title
```vue
<template>
  <j-title data="这是一段测试文字">
    <template #extra>
      <a-button type="link"><AIcon type="EditOutlined" /></a-button>
    </template>
  </j-title>
</template>
```

+ API

| 属性  | 说明 | 类型 | 默认值   |
| --- | --- | --- | --- |
| data | 数据 | string | '' |
| style | 样式style | object | {} |


#### ValueItem
```vue
<template>
  <a-form :model="formData" ref="formRef" layout="vertical">
    <a-form-item :label="item.name" v-for="item in schema" :key="item.key">
      <j-value-item style="width: 100%" v-model="formData[item.key]" v-bind="item" :itemType="item.type" />
    </a-form-item>
  </a-form>
  {{ formData}}
</template>

<script setup>
import { reactive, ref } from 'vue'
const schema = [
  {
    key: 'a',
    name: 'int',
    type: 'int',
    placeholder: '请输入1~100的数字',
    extraProps: {
      min: 1,
      max: 100,
      precision: 0
    }
  },
  {
    key: 'b',
    type: 'double',
    name: 'double',
    placeholder: '请输入数字'
  },
  {
    key: 'c',
    type: 'string',
    name: 'string',
    placeholder: '请输入'
  },
  {
    key: 'd',
    type: 'password',
    name: 'password',
    placeholder: '请输入密码'
  },
  {
    key: 'e',
    type: 'enum',
    name: 'enum',
    placeholder: '请选择',
    options: [
      {label: "选项1", value: '1'},
      {label: "选项2", value: '2'},
      {label: "选项3", value: '3'},
      {label: "选项4", value: '4'},
      {label: "选项5", value: '5'}
    ]
  },
  {
    key: 'f',
    type: 'boolean',
    name: 'boolean',
    placeholder: '请选择',
    options: [
      {label: "是", value: 'true'},
      {label: "否", value: 'false'},
    ]
  },
  {
    key: 'g',
    type: 'date',
    name: 'date',
    placeholder: '请输入'
  },
]
const formRef = ref()
const formData = reactive({
  b: 123
})
</script>
```

+ API

| 属性  | 说明 | 类型 | 默认值   |
| --- | --- | --- | --- |
| modelValue | 值 | string | - |
| itemType | 组件类型, 默认为string | string | 'string' |
| mode | 设置 Select 的模式为多选或标签 | 'multiple | tags | combobox | '' | - |
| placeholder | 默认文字 | string | - |
| options | 选项数据 | array | - |
| style | 样式style | object | - |
| class | 样式class | string | - |
| valueFormat | 类型为日期组件时，绑定值的格式，对 value、defaultValue、defaultPickerValue 起作用。不指定则绑定值为 dayjs 对象 | string | - |
| action | 上传的地址 | string | - |
| headers | 设置上传的请求头部 | object | - |
| disabled | 是否禁用 | boolean | - |
| extraProps | 额外的参数 | object | {} |
| handleFileChange | 处理上传组件的值的方法 | object | - |

## 工具函数
### 概述
本工具库是针对前端开发场景封装的高效实用工具集，聚焦解决日常开发中的高频需求。

### 引入
```javascript
// 按需引入
import { XXX } from '@jetlinks-web/utils';
```

### 工具函数与示例
#### LocalStorage
##### `LocalStore`
###### `LocalStore.set(key, value)`
+ **功能**‌：设置 localStorage的值。
+ **参数**‌：
    - `key: string` (必填) - 存储键名。
    - `value: any` (必填) - 存储值。
+ **示例**‌：

```typescript
import { LocalStore } from '@jetlinks-web/utils';

LocalStore.set('version_code', '这是一段测试数据');
```

###### `LocalStore.get(key)`
+ **功能**‌：获取 localStorage的值。
+ **参数**‌：
    - `key: string` (必填) - 存储键名。
+ **返回：**返回存入localStorage的值。
+ **示例**‌：

```typescript
import { LocalStore } from '@jetlinks-web/utils';

const version = LocalStore.get('version_code');
```

###### `LocalStore.remove(key)`
+ **功能**‌：删除 localStorage的值。
+ **参数**‌：
    - `key: string` (必填) - 存储键名。
+ **示例**‌：

```typescript
import { LocalStore } from '@jetlinks-web/utils';

LocalStore.remove('version_code');
```

###### `LocalStore.removeAll()`
+ **功能**‌：清空所有localStorage的值。
+ **示例**‌：

```typescript
import { LocalStore } from '@jetlinks-web/utils';

LocalStore.removeAll();
```

#### `getToken`
+ **功能**‌：获取token。
+ **返回：**返回token的值。
+ **示例**‌：

```typescript
import { getToken } from '@jetlinks-web/utils';

const token = getToken()
```

#### `setToken`
+ **功能**‌：设置token的值。
+ **参数**‌：
    - `value: string` (必填) - token的值。
+ **示例**‌：

```typescript
import { setToken } from '@jetlinks-web/utils';

setToken('新的token值')
```

#### `removeToken`
+ **功能**‌：删除token的值。
+ **示例**‌：

```typescript
import { removeToken } from '@jetlinks-web/utils';

// 删除toekn
removeToken()
```

### 正则表达式
### `regular`
+ **功能**‌：主要包含一些常用的正则表达式，例如：IP地址的校验、密码的校验。
+ **返回：**true/false
+ **‌示例‌：**

```typescript
import {regular} from '@jetlinks-web/utils';

// 一、用于校验url
const urlReg = regular.urlReg // 这是是否为url的正则表达式

if(isUrl(str)){ // str为需要判断的字符串
  // 是url后的操作
}

// 二、只允许英文或者数字的字符串
const englishOrNumberReg = regular.englishOrNumber // 这是只允许英文或者数字的正则表达式

if(isEnglishOrNumber(str)){ // str为需要判断的字符串
  // true后的操作
}

// 三、cron表达式
const cronReg = regular.cronReg // cron表达式的正则表达式

if(isCronReg(str)){ // str为需要判断的字符串
  // true后的操作
}

// 四、只允许英文的字符串
const english = regular.english // 这是只允许英文的正则表达式

if(isEnglish(str)){ // str为需要判断的字符串
  // true后的操作
}

// 五、只允许中文的字符串
const chinese = regular.chinese // 这是只允许中文的正则表达式

if(isChinese(str)){ // str为需要判断的字符串
  // true后的操作
}

// 六、座机号验证
const telephoneReg = regular.telephoneReg // 这是只允许英文或者数字的正则表达式

if(isTelephone(str)){ // str为需要判断的字符串
  // true后的操作
}

//七、手机号码验证
const cellphoneReg = regular.cellphoneReg // 获取正则表达式

if(isCellphone(str)){ // str为需要判断的字符串
  // true后的操作
}

// 八、ip地址校验
const ipReg = regular.ipReg // 获取正则表达式

if(isIpReg(str)){ // str为需要判断的字符串
  // true后的操作
}


// 九、ipv6验证
const ipv6Reg = regular.ipv6Reg // 获取正则表达式

if(isIpv6(str)){ // str为需要判断的字符串
  // true后的操作
}


// 十、域名验证
const domainReg = regular.domainReg // 获取正则表达式

if(isDomain(str)){ // str为需要判断的字符串
  // true后的操作
}


// 十一、邮箱地址验证
const emailReg = regular.emailReg // 获取正则表达式

if(isEmail(str)){ // str为需要判断的字符串
  // true后的操作
}


// 十二、密码强度校验 必须至少包含大小写英文和数字
const passwordReg = regular.passwordReg // 获取正则表达式

if(isPassword(str)){ // str为需要判断的字符串
  // true后的操作
}


// 十三、数字字母，小写字母开头
const inputReg = regular.inputReg // 获取正则表达式

if(isInputReg(str)){ // str为需要判断的字符串
  // true后的操作
}


// 十四、数字字母下划线，字母开头
const modalReg = regular.modalReg // 获取正则表达式

if(isModalReg(str)){ // str为需要判断的字符串
  // true后的操作
}


// 十五、中文验证
const textReg = regular.textReg // 获取正则表达式

if(isTextReg(str)){ // str为需要判断的字符串
  // true后的操作
}

// 十六、颜色验证
const colorReg = regular.colorReg // 获取正则表达式

if(isColorReg(str)){ // str为需要判断的字符串
  // true后的操作
}

// 十七、sql验证
const sqlReg = regular.sqlReg // 获取正则表达式

if(isSql(str)){ // str为需要判断的字符串
  // true后的操作
}

// 十八、图片验证
const imgReg = regular.imgReg // 获取正则表达式

if(isImg(str)){ // str为需要判断的字符串
  // true后的操作
}

```

### 常用工具方法
#### `onlyMessage(msg,type)`
+ **功能**‌：单个message提示，根据类型只提示一次。
+ **参数**‌：
    - `msg: string` (必填) - 需要提示的信息。
    - `type: ['success' | 'error' | 'warning']` (非必填，默认为success) - 类型。
+ **示例**‌：

```typescript
import { onlyMessage } from '@jetlinks-web/utils';

// 不传类型，默认为success
onlyMessage('操作成功！');
// 失败时使用例子
onlyMessage('操作失败！', 'error');
// 警告时使用例子
onlyMessage('这是一段警告', 'warning');
```

#### `randomString(length)`
+ **功能**‌：生成随机字符串。
+ **参数**‌：
    - `length: number` (非必填，默认为32) - 需要生成的字符串的长度。
+ **返回：**生成的字符串。
+ **示例**‌：

```typescript
import { randomString } from '@jetlinks-web/utils';

const a = randomString();
const b = randomString(10); // 生成长度为10的随机数
```

#### `randomNumber()`
+ **功能**‌：生成随机数数字。
+ **返回：**生成的随机数数字。
+ **示例**‌：

```typescript
import { randomNumber } from '@jetlinks-web/utils';

const num = randomNumber();
```

### 文件下载
#### `downloadFileByUrl(url: string,name: string, type?: string)`
+ **功能**‌：通过url下载文件。
+ **参数**‌：
    - `url: string` (必填) - 下载文件的url。
    - `name: string` (必填) - 下载文件的名称。
    - `type: string` (非必填) - 下载文件的类型。
+ **示例**‌：

```typescript
import { downloadFileByUrl } from '@jetlinks-web/utils';

const downFile = async (type: string) => {
  // templateDownload是后端接口
  const res: any = await templateDownload(productId, type);
  if (res) {
    const blob = new Blob([res], { type: type });
    const url = URL.createObjectURL(blob);
    downloadFileByUrl(url, '文件名称', type);
  }
};
```

#### `downloadJson(record: Record<string, any>, fileName: string)`
+ **功能**‌：下载json。
+ **参数**‌：
    - `record: Record<string, any>` (必填) - 下载的数据。
    - `fileName: string` (必填) - 下载文件的名称。
+ **示例**‌：

```typescript
import { downloadJson } from '@jetlinks-web/utils';

const obj = {
  a: 1,
  b: 2,
  c: 3,
  d: {
    d1: '哈哈哈哈哈哈'
  }
}
downloadJson(obj, '我要下载的文件‘)
```

### 发布/订阅
#### `EvetEmitter`
+ **功能**‌：发布/订阅。
+ **参数**‌：
+ **示例**‌：

```typescript
import { EventEmitter } from '@jetlinks-web/utils';

// 发布
EventEmitter.emit('MetadataTabs', () => {
    
});
// 订阅
EventEmitter.subscribe(["MetadataTabs"], （) => {
  
});
// 取消订阅
EventEmitter.unSubscribe(["MetadataTabs"], （) => {
  
});
```

#### `encrypt(txt: string, publicKey: string)`
+ **功能**‌：RSA 加密。
+ **参数**‌：
    - `txt: string` (必填) - 下载文件的url。
    - `publicKey: string` (必填) - 下载文件的名称。
+ **示例**‌：

```typescript
import { encrypt } from '@jetlinks-web/utils';

const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1K4QpJisW7TP6uVoKyTirEe07
...（公钥内容）...
-----END PUBLIC KEY-----`;
const plainText = 'Hello, secure world!';

const encrypted = encrypt(plainText, publicKey);

console.log('加密结果:', encrypted);
```

### 类型判断
#### `isUndefined(val:any)`
+ **功能**‌：判断是否为undefined。
+ **返回：**true/false。
+ **参数**‌：
    - `val: any` (必填) - 需要判断的值。
+ **示例**‌：

```typescript
import { isUndefined } from '@jetlinks-web/utils';

const a = isUndefined(undefined) // true
const b = isUndefined(0) // false
const c = isUndefined(1) // false
```

#### `isBoolean(val:any)`
+ **功能**‌：判断是否为Boolean。
+ **返回：**true/false。
+ **参数**‌：
    - `val: any` (必填) - 需要判断的值。
+ **示例**‌：

```typescript
import { isBoolean } from '@jetlinks-web/utils';

const a = isBoolean(true) // true
const b = isBoolean(false) // true
const c = isBoolean(1) // false
const d = isBoolean(0) // false
```

#### `isNumber(val:any)`
+ **功能**‌：判断是否为数字。
+ **返回：**true/false。
+ **参数**‌：
    - `val: any` (必填) - 需要判断的值。
+ **示例**‌：

```typescript
import { isNumber } from '@jetlinks-web/utils';

const a = isNumber('1') // false
const b = isNumber(1) // true
const c = isNumber(3.14) // true
const d = isNumber(Math.PI) // true
const e = isNumber([2023]) // false
```

#### `isEmpty(val:unknown)`
+ **功能**‌：判断值是否为空，当对象属性为空的时候或者数组的长度为0和当 `val` 是假值但不是 `0` 时。
+ **返回：**true/false。
+ **参数**‌：
    - `val: any` (必填) - 需要判断的值。
+ **示例**‌：

```typescript
import { isEmpty } from '@jetlinks-web/utils';


console.log(isEmpty(null));         // true 
console.log(isEmpty(undefined));    // true 
console.log(isEmpty(0));             // false 0被视为非空
console.log(isEmpty(''));            // true 
console.log(isEmpty(false));         // true 
console.log(isEmpty(true));          // false 
console.log(isEmpty(42));            // false 
console.log(isEmpty('hello'));       // false 
console.log(isEmpty([]));            // true 
console.log(isEmpty([1, 2]));        // false 
console.log(isEmpty(new Array()));   // true 
console.log(isEmpty({}));            // true
console.log(isEmpty(new Object()));  // true 
```

#### `isElement(val:unknown)`
+ **功能**‌：判断值是否为Element。
+ **返回：**true/false。
+ **参数**‌：
    - `val: any` (必填) - 需要判断的值。
+ **示例**‌：

```typescript
import { isElement } from '@jetlinks-web/utils';

const div = document.createElement('div')
const textNode = document.createTextNode('text')
const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

console.log(isElement(div))              // true 
console.log(isElement(document.body))    // true 
console.log(isElement(svg))              // true 
console.log(isElement(textNode))         // false 
console.log(isElement({ tagName: 'DIV' })) // false 
console.log(isElement(null))             // false 
console.log(isElement(undefined))        // false 
```

#### `isPropAbsent(val:unknown)`
+ **功能**‌：检查 `value` 是否是 `null` 或者 `undefined`。
+ **返回：** 如果 `value` 为`null` 或 `undefined`，那么返回 `true`，否则返回 `false`
+ **参数**‌：
    - `val: any` (必填) - 需要判断的值。
+ **示例**‌：

```typescript
import { isPropAbsent } from '@jetlinks-web/utils';
console.log(isPropAbsent(null)) // true 
console.log(isPropAbsent(NaN))  // false
```

#### `isStringNumber(val:string)`
+ **功能**‌：判断是否为字符串数字。
+ **返回：** true/false。
+ **参数**‌：
    - `val: any` (必填) - 需要判断的值。
+ **示例**‌：

```typescript
import { isStringNumber } from '@jetlinks-web/utils';

console.log(isStringNumber(1111)) // false 
console.log(isStringNumber('1111'))  // true
```

#### `isWindow(val:unknown)`
+ **功能**‌：判断是否为window。
+ **返回：** true/false。
+ **参数**‌：
    - `val: any` (必填) - 需要判断的值。
+ ‌**示例**‌：

```typescript
import { isWindow } from '@jetlinks-web/utils';

console.log(isWindow(window))          // true 
console.log(isWindow(document))        // false 
console.log(isWindow(location))        // false 
console.log(isWindow({}))              // false 
```

## 网络请求
`@jetlinks-web/core`此包包含了项目的核心功能，如 Axios 请求、Fetch 请求、WebSocket 连接等。

### 常见的http请求
```typescript
import { request } from '@jetlinks-web/core';

type LoginRequest = {
  password: string
  username: string
  expires: number
  verifyCode?: string
  verifyKey?: string
  encryptId?: string
}

type LoginRespone = {
  token: string
  userId: string
  user: {
    username:string
  }
  roles: Array<{ id: string, name: string, type: string}>
}

/**
* 登录
@param data
@returns
**/
export const login = (data: LoginRequest) => request.post<LoginRespone>('/authorize/login', data)
```

### 模块请求
```typescript
import { Request } from '@jetlinks-web/core';

// 之前的写法，
// // 获取用户列表
export const getUserList_api = (data: any) => request.post(`/user/detail/_query`, data);
// 获取用户信息
export const getUser_api = (id: string) => request.get(`/user/detail/${id}`);
// 添加用户
export const addUser_api = (data: any) => request.post(`/user/detail/_create`, data);
// 更新用户
export const updateUser_api = (data: any) => request.put(`/user/detail/${data.id}/_update`, data);

// 现在的写法
const request = new Request('/user/detail')
// 分页
export const page = (data) => request.page(data)
// 不分页
export const noPage = (data) => request.noPage(data)
// 详情
export const detail = (id) => request.detail(id)
// 保存
export const save = (data) => request.save(data)
// 更新
export const update = (data) => request.update(data)
// 删除
export const remove = (id) => request.delete(id)
// 其它接口,和常见http请求使用一样，唯一变化是url的值
export const types = (id) => request.get('/types')

// 如果保存的url不是 /_create,比如设备实例保存
const request2 = new Request('/device-instance')
export const save2 = (data) => request2.save(data, { url: ''})
```

### useRequest用法
导入@jetlinks-web/hooks，引入useRequest函数。
使用useRequest可以直接创建接口返回的数据变量，减少开发中的变量赋值步骤

+ data: 接口返回的数据 
+ loading: 加载状态，在某些需要使用loading状态的地方使用 
+ run: 调用接口

```vue
<template>
  <a-input-search @search="handleSearch" :loading="loading"></a-input-search>
  <a-select
    :options="data"
  ></a-select>
</template>
<script setup>
import { useRequest } from "@jetlinks-web/hooks";
import { xx } from "@/api/xx.ts"

const { loading, data, run } = useRequest(xx, {
  defaultParams: {
    paging: false,
    sorts: [{ name: 'sortIndex', order: 'asc' }, { name: 'name', order: 'asc' }],
    terms: []
  }, //默认参数
  immediate: true, //是否立即执行, 为false时只有在调用run方法时才执行
  onSuccess: (res) => {
    //处理数据，或者其他的一些额外操作
    //比如当接口返回数据不满足使用，需要前端过滤一下
    return res.result.filter(item => {
      return ['COLLECTOR_GATEWAY', 'MODBUS_RTU'].includes(item.id)
    })
  }
})

const handleSearch = (val: string) => {
  const params = {
    terms: [
      {
        column: 'name',
        value: `%${val}%`,
        termType: 'like'
      }
    ]
  }
  run(params); //调用接口
}
</script>
```

使用方式2，需要根据某个条件来使用指定接口时

```vue
<template>
  <a-input-search @search="handleSearch" :loading="loading"></a-input-search>
  <a-select
    :options="data"
  ></a-select>
</template>
<script setup>
import { useRequest } from "@jetlinks-web/hooks";
import { save, edit } from "@/api/xx.ts"

const props = defineProps({
  data: Object
})

const { loading, data, run } = useRequest(
  async (formData) => {
    return props.data?.id ? edit(formData) : save(formData)
  },
  {
    immediate: true, //是否立即执行, 为false时只有在调用run方法时才执行
  }
)

const handleSearch = (val: string) => {
  const params = {
    terms: [
      {
        column: 'name',
        value: `%${val}%`,
        termType: 'like'
      }
    ]
  }
  run(params); //调用接口
}
</script>
```

### WebSocket
使用的是`rxjs/websocket`中的`WebSocket`，内置心跳，断网重连，消息缓存，连接失败进行重连等功能

#### 全局websocket
wsClient 是全局唯一的websocket，常用订阅取值，使用它即可

```typescript
import {getToken, LocalStore, setToken} from "@jetlinks-web/utils";
import {BASE_API, TOKEN_KEY_URL} from "@jetlinks-web/constants";
import {wsClient} from '@jetlinks-web/core'

// 初始化说明
const initWs = () => {
  const token = getToken(); // 获取token

  if (!token) return

  // 处理wss，https下无法使用ws协议
  const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
  const host = document.location.host;
  // TOKEN_KEY_URL 由系统变量提供，即.env.development文件内的TOKEN_KEY_URL值
  const url = `${protocol}${host}${BASE_API}/messaging/${token}?${TOKEN_KEY_URL}=${token}`;

  wsClient.initWebSocket(url); // 初始化websocket的url
  wsClient.connect()// 创建ws链接
}

initWs()
```

vue中如何使用

```vue
<scrip setup>
import { wsClient } from '@jetlinks-web/core';

// getWebSocket(id, topic, parameter)
const ws = wsClient.getWebSocket(
        `instance-editor-info-status-${id}`,
        `/dashboard/device/status/change/realTime`,
        {
            deviceId: id,
        },
  ).subscribe((message) => {
        // 处理后端返回的数据
  });
  
onUnmounted(() => {
    ws.unsubscribe(); // 取消订阅
});
</script>
```

#### 创建新的websocket
如果需要建立新的websocket，比如连接网关的远程控制，使用WebSocketClient创建，使用方式和全局websocket一样

```typescript
import {getToken, LocalStore, setToken} from "@jetlinks-web/utils";
import {BASE_API, TOKEN_KEY_URL} from "@jetlinks-web/constants";
import {WebSocketClient} from '@jetlinks-web/core'

export const wsClient = new WebSocketClient()

const initWs = () => {
  const token = getToken(); // 获取token

  if (!token) return

  // 处理wss，https下无法使用ws协议
  const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
  const host = document.location.host;
  // TOKEN_KEY_URL 由系统变量提供，即.env.development文件内的TOKEN_KEY_URL值
  const url = `${protocol}${host}${BASE_API}/messaging/${token}?${TOKEN_KEY_URL}=${token}`;

  wsClient.initWebSocket(url); // 初始化websocket的url
  wsClient.connect()// 创建ws链接
}

initWs()
```

### ndJson
为了使用方便，ndJson使用方式和request使用方式保持一致

```typescript
import { ndJson } from '@jetlinks-web/core'

export const realTime = (data) => ndJson.post('/system/monitor/jfr/realtime', data)

```

使用方式

```typescript
// 订阅
const time = realTime(data).subscribe({
  next: data => {
    // 处理数据
    console.log('Received data:', data)
  },
  error: err => console.error('Error:', err),
  complete: () => console.log('Stream complete')
});

// 取消订阅
time.unsubscribe()
```

## 数据管理
### 概述
实现了对系统核心模块的轻量级、响应式数据管理封装，尤其针对 ‌系统基础设置、权限管理、菜单管理和用户信息提供标准化数据流与业务逻辑抽象。

### 常用store
#### useSystemStore
+ **功能**‌：主要是系统设置相关的变量和方法
+ **变量：**

```typescript
{
  systemInfo: { // 系统信息
    background, // 登录背景图片
    recordNumber, // 备案号
    showRecordNumber, // 是否展示备案号
    apiKey, // 高德地图 JSapi
    secretKey, // 高德地图 密钥
    webKey, // 高德地图 web服务api
    base-path, // 系统后台访问的url
  },
  theme,//主题色
  ico,//浏览器页签
  layout: { // 布局相关变量
    siderWidth: 208, // 菜单宽度
    headerHeight: 48, // 顶部高度
    title: '物联网平台', // 系统名称
    logo, // 系统logo
  },
  calendarTagColor, // 日历标签颜色
  showThreshold, // 物模型其他配置是否展示阈值
  language, // 系统语言
  relogin, //重定向登录
}
```

+ **方法：**

```typescript
changeTheme,//设置主题 ['light', 'dark']
changeIco, // 设置浏览器页签
changeTitle,//改变标题
queryInfo, // 查询系统信息
querySingleInfo, // 查询单个系信息参数 ['front'| 'amap'| 'paths']
queryTagsColor, // 查询日历标签颜色
queryVersion, // 查询系统版本
setRelogin // 设置是否重新登录
```

+ **示例：**

```typescript
import { useSystemStore } from '@/store';
const systemStore = useSystemStore();

// 变量
console.log(systemStore.systemInfo.recordNumber) // 获取系统的备案号
console.log(systemStore.theme) // 获取系统的主题色
console.log(systemStore.layout.title) // 获取系统名称
console.log(systemStore.layout.logo) // 获取系统logo
console.log(systemStore.language) // 获取系统的语言

// 方法
systemStore.changeTheme('dark') // 设为暗黑模式
systemStore.changeIco('favicon.ico') // 设置浏览器页签
systemStore.changeTitle('新的系统标题') // 改变标题
systemStore.queryInfo() // 查询系统信息
systemStore.queryVersion() // 查询系统版本
```

#### useAuthStore
+ **概述：**权限相关的变量和方法
+ **变量：**

```typescript
{
  permissions // 按钮权限对象
}
```

+ **方法：**

```typescript
getPermission, // 获取某个权限的权限按钮
setPermission,// 设置某个权限的权限按钮
cleanPermission,// 清空权限
handlePermission,// 重新设置权限
hasPermission, // 判断是否有某个按钮权限
```

+ **示例：**

```typescript
import { useAuthStore } from '@/store';

const { hasPermission } = useAuthStore();

// 判断是否有产品新增权限
const isAddPermission = hasPermission(ref(`device/Product:add`); // true / false

// 判断是否有设备接入新增权限
const isPermission = useAuthStore().hasPermission(
    ref('link/AccessConfig:add')
); // true / false
```

#### useMenuStore
+ **概述：**菜单相关的变量和方法
+ **变量：**

```typescript
{
  menu, // 所有菜单数据
  siderMenus, // 左侧展示的菜单数据
  menusMap, // 菜单数据map,菜单数据平铺
}
```

+ **方法：**

```typescript
hasMenu, // 判断是否有某一个菜单
jumpPage, // 跳转到某个页面，并判断权限，没权限跳转失败
routerPush,// 跳转到某个页面，没有权限跳转到404
queryMenus, // 查询权限数据
```

+ **示例：**

```typescript
import { useMenuStore } from '@/store';

const menuStore = useMenuStore();
// 判断是否有设备管理菜单
const hasMenu = menuStore.hasMenu('device/Instance')

// 跳转到设备详情页面
const handleView = (id: string) => {
    menuStore.jumpPage('device/Instance/Detail', { params: { id } });
};
```

#### useUserStore
+ **概述：**登录用户相关的变量和方法
+ **变量：**

```typescript
{
  tabKey, // 个人中心的tabKe
  userInfo, // 用户信息
  alarmUpdateCount, // 告警数量
  isAdmin, // 是否是超级管理员
}
```

+ **方法：**

```typescript
getUserInfo, // 查询后端接口，获取用户信息
setUserInfo, // 设置用户信息
updateAlarm // 更新告警数量
```

+ **示例：**

```typescript
import { useUserStore } from '@/store';

const userInfoStore = useUserStore()

// 获取用户信息
console.log(userInfoStore.userInfo)
// 获取用户username
console.log(userInfoStore.userInfo.username)


// 判断用户是否是超级管理员
console.log(userInfoStore.isAdmin)

```
