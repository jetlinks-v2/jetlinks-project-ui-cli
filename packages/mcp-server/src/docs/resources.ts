// 自动生成的资源数据文件
// 请勿手动修改此文件，它由工具函数自动生成

export interface ComponentAPI {
    name: string;
    description: string;
    type: string;
    default?: string;
}

export interface Component {
    name: string;
    description: string;
    code: string;
    api: ComponentAPI[];
}

export interface UtilFunction {
    name: string;
    description: string;
    params?: Array<{
        name: string;
        type: string;
        required: boolean;
        default?: string;
        description: string;
    }>;
    returnType?: string;
    returnDescription?: string;
    example: string;
}

export interface ResourceData {
    components: Component[];
    utilFunctions: UtilFunction[];
    description: string;
}

export const resourceData: ResourceData = {
    "components": [
        {
            "name": "AutoComplete",
            "description": "下拉可输入可搜索选择框",
            "code": "<template>\n  <j-auto-complete :options=\"options\" />\n</template>\n\n<script setup>\n  const options = [\n      { label: 'Option 1', value: 'option1' },\n      { label: '张三', value: 'zhangsan' },\n      { label: '李四', value: 'lisi' },\n    ]\n</script>",
            "api": [
                {
                    "name": "searchKey",
                    "description": "搜索字段",
                    "type": "string",
                    "default": "'label'"
                },
                {
                    "name": "options",
                    "description": "options数据",
                    "type": "array",
                    "default": "-"
                }
            ]
        },
        {
            "name": "BadgeStatus",
            "description": "状态徽章组件",
            "code": "<script setup>\nconst statusNames = {\n  'success': 'success',\n  'warning': 'warning',\n  'error': 'error',\n  'default': 'default',\n}\nconst statusText = ref('正常')\nconst status = ref('default')\n</script>\n\n<template>\n  <j-badge-status\n    :status=\"status\"\n    :text=\"statusText\"\n    :statusNames=\"statusNames\"\n  />\n</template>",
            "api": [
                {
                    "name": "text",
                    "description": "状态文案",
                    "type": "string",
                    "default": "-"
                },
                {
                    "name": "status",
                    "description": "状态值",
                    "type": "string",
                    "default": "'default'"
                },
                {
                    "name": "statusNames",
                    "description": "自定义状态字段",
                    "type": "object",
                    "default": "{'success': 'success','warning': 'warning','error': 'error','default': 'default'}"
                }
            ]
        },
        {
            "name": "CardSelect",
            "description": "卡片选择器",
            "code": "<template>\n  <j-card-select :options=\"options\" v-model:value=\"value\" />\n</template>\n\n<script setup>\nconst options = [\n  { label: 'Option 1', value: 'option1', disabled: true },\n  { label: 'Option 2', value: 'option2' },\n  { label: 'Option 3', value: 'option3' },\n]\nconst value = ref()\n</script>",
            "api": [
                {
                    "name": "layout",
                    "description": "布局方式",
                    "type": "string",
                    "default": "'horizontal'"
                },
                {
                    "name": "options",
                    "description": "选项数组",
                    "type": "array",
                    "default": "[]"
                },
                {
                    "name": "disabled",
                    "description": "按钮状态",
                    "type": "boolean",
                    "default": "false"
                },
                {
                    "name": "multiple",
                    "description": "支持多选",
                    "type": "boolean",
                    "default": "false"
                },
                {
                    "name": "column",
                    "description": "一行 CardSelectItem的数量",
                    "type": "number",
                    "default": "3"
                },
                {
                    "name": "value",
                    "description": "选中的值",
                    "type": "string | array",
                    "default": "-"
                }
            ]
        },
        {
            "name": "CheckButton",
            "description": "多选按钮组",
            "code": "<template>\n  <j-check-button v-model:value=\"myValue\" :options=\"options\" :columns=\"4\" />\n</template>\n\n<script setup>\nimport { ref } from \"vue\";\nconst options = [\n  {label: \"选项1\", value: '1'},\n  {label: \"选项2\", value: '2'},\n  {label: \"选项3\", value: '3'},\n  {label: \"选项4\", value: '4'},\n  {label: \"选项5\", value: '5'}\n]\n\nconst myValue = ref(['1', '4'])\n</script>",
            "api": [
                {
                    "name": "options",
                    "description": "选项",
                    "type": "array",
                    "default": "[]"
                },
                {
                    "name": "multiple",
                    "description": "是否多选",
                    "type": "boolean",
                    "default": "false"
                },
                {
                    "name": "value",
                    "description": "值",
                    "type": "string | array",
                    "default": "-"
                },
                {
                    "name": "disabled",
                    "description": "是否禁用",
                    "type": "boolean",
                    "default": "false"
                },
                {
                    "name": "class",
                    "description": "样式class",
                    "type": "string",
                    "default": "-"
                },
                {
                    "name": "style",
                    "description": "样式style",
                    "type": "object",
                    "default": "{}"
                }
            ]
        },
        {
            "name": "DragModal",
            "description": "可拖动弹窗",
            "code": "<template>\n  <div style=\"width: 100%; height: 500px;\">\n    <j-drag-modal :height=\"200\" title=\"这是一段测试文字\">\n      <p>这是一个可拖动弹窗</p>\n    </j-drag-modal>\n  </div>\n</template>",
            "api": [
                {
                    "name": "title",
                    "description": "标题",
                    "type": "boolean | string",
                    "default": "''"
                },
                {
                    "name": "height",
                    "description": "高度",
                    "type": "number",
                    "default": "100"
                },
                {
                    "name": "dragRang",
                    "description": "拖拽范围",
                    "type": "array | number",
                    "default": "[400, 200]"
                },
                {
                    "name": "width",
                    "description": "宽度",
                    "type": "number",
                    "default": "400"
                },
                {
                    "name": "bodyStyle",
                    "description": "内容样式",
                    "type": "object",
                    "default": "{}"
                },
                {
                    "name": "footer",
                    "description": "是否显示底部",
                    "type": "boolean",
                    "default": "true"
                }
            ]
        },
        {
            "name": "EditTable",
            "description": "可编辑表格",
            "code": "<script setup>\nconst columns = [\n  {\n    title: 'ID',\n    dataIndex: 'id',\n    width: 200,\n  },\n  {\n    title: '名称',\n    dataIndex: 'name',\n    width: 200,\n    form: {\n      required: true,\n      rules: [{ required: true, message: '请输入名称' }]\n    }\n  },\n  {\n    title: '类型',\n    dataIndex: 'type',\n    width: 200,\n  },\n]\nconst typeMap = {\n  0: 'object',\n  1: 'string',\n  2: 'number',\n  3: 'date',\n  4: 'boolean',\n}\nconst dataSource = Array.from({ length: 10}).map((_, index) => {\n  const type = index % 5\n  return {\n    id: index + 1,\n    name: `名称 ${index + 1}`,\n    type: `${typeMap[type]}`\n  }\n})\n</script>\n\n<template>\n  <j-edit-table :columns=\"columns\" :dataSource=\"dataSource\">\n    <template #name=\"{ record}\">\n      <a-input v-model:value=\"record.name\" />\n    </template>\n    <template #type=\"{ record }\">\n      <a-select style=\"width: 120px\" :options=\"types\" v-model:value=\"record.type\" />\n    </template>\n  </j-edit-table>\n</template>",
            "api": [
                {
                    "name": "columns",
                    "description": "表格列的配置描述",
                    "type": "array",
                    "default": "-"
                },
                {
                    "name": "dataSource",
                    "description": "数据数组",
                    "type": "array",
                    "default": "-"
                },
                {
                    "name": "readonly",
                    "description": "是否只读",
                    "type": "boolean",
                    "default": "false"
                }
            ]
        },
        {
            "name": "Ellipsis",
            "description": "内容超长显示省略号",
            "code": "<template>\n  <j-ellipsis style=\"max-width: 240px\">\n    水是眼波横 山是眉峰聚 欲问行人去那边 眉眼盈盈处 才始送春归 又送君归去\n    若到江南赶上春 千万和春住 水是眼波横 山是眉峰聚 欲问行人去那边\n    眉眼盈盈处 才始送春归 又送君归去 若到江南赶上春 千万和春住 水是眼波横\n    山是眉峰聚 欲问行人去那边 眉眼盈盈处 才始送春归 又送君归去\n  </j-ellipsis>\n  <j-ellipsis> 水是眼波横 山是眉峰聚 欲问行人去那边 眉眼盈盈处</j-ellipsis>\n</template>",
            "api": [
                {
                    "name": "tooltip",
                    "description": "Tooltip 的属性或内容",
                    "type": "boolean | TooltipProps | Slot",
                    "default": "true"
                },
                {
                    "name": "line-clamp",
                    "description": "最大行数",
                    "type": "number | string",
                    "default": "1"
                },
                {
                    "name": "expand-trigger",
                    "description": "展开的触发方式",
                    "type": "string",
                    "default": "click"
                }
            ]
        },
        {
            "name": "Empty",
            "description": "空状态时的展示占位图",
            "code": "<template>\n  <j-empty />\n</template>",
            "api": [
                {
                    "name": "description",
                    "description": "自定义描述内容",
                    "type": "string | v-slot",
                    "default": "-"
                },
                {
                    "name": "image",
                    "description": "设置显示图片，为 string 时表示自定义图片地址",
                    "type": "string | v-slot",
                    "default": "false"
                },
                {
                    "name": "imageStyle",
                    "description": "图片样式",
                    "type": "CSSProperties",
                    "default": "-"
                }
            ]
        },
        {
            "name": "Icon",
            "description": "🚫【强制使用AIcon】图标组件。❌ 绝对禁止使用 <Icon />、<a-icon /> 或任何ant-design-vue的图标组件。✅ 必须使用 <AIcon type=\"icon-name\" />。这是项目封装的图标组件,支持iconfont图标库。任何需要显示图标的场景(按钮图标、装饰图标、状态图标等),都必须使用AIcon。",
            "code": "<template>\n  <!-- ✅ 正确: 使用AIcon -->\n  <AIcon type=\"icon-paiduizhong\" />\n  \n  <!-- ✅ 正确: 带样式的图标 -->\n  <AIcon type=\"icon-setting\" class=\"icon-class\" />\n  \n  <!-- ✅ 正确: 在按钮中使用图标 -->\n  <a-button>\n    <AIcon type=\"icon-plus\" />\n    新增\n  </a-button>\n\n  <!-- ❌ 错误 - 绝对禁止! -->\n  <!-- <Icon /> -->\n  <!-- <a-icon /> -->\n</template>\n\n<script setup>\n// ✅ 正确: 直接使用ref,无需import\nconst iconType = ref('icon-setting')\n\n// ❌ 错误 - 绝对禁止!\n// import { ref } from 'vue'\n</script>",
            "api": [
                {
                    "name": "type",
                    "description": "图标类型,对应iconfont图标名称(必填参数)",
                    "type": "string",
                    "default": "-"
                },
                {
                    "name": "scriptUrl",
                    "description": "iconfont.cn 项目在线生成的 js 地址(可选)",
                    "type": "string",
                    "default": "-"
                },
                {
                    "name": "class",
                    "description": "自定义样式class(可选)",
                    "type": "string",
                    "default": "-"
                }
            ]
        },
        {
            "name": "Markdown",
            "description": "Markdown 渲染组件",
            "code": "<template>\n  <j-markdown :source=\"_source\"/>\n</template>\n<script setup>\nconst _source = `# 示例 Markdown 文档\n\n这是一个简单的 Markdown 示例，展示基本语法：\n\n## 标题样式\n### 三级标题\n#### 四级标题\n\n## 文本格式\n- **加粗文本**  \n- *斜体文本*  \n- ~~删除线文本~~  \n- \\`行内代码\\`\n\n## 列表\n### 无序列表\n- 项目一\n- 项目二\n  - 子项目\n  - 子项目\n\n### 有序列表\n1. 第一项\n2. 第二项\n3. 第三项\n\n## 代码块\n\\`\\`\\`javascript\n// JavaScript 示例\nfunction greet(name) {\n  return \\`Hello, ${name}!\\`;\n}`\n</script>",
            "api": [
                {
                    "name": "breaks",
                    "description": "转换段落里的 '\\n' 到 <br>",
                    "type": "boolean",
                    "default": "false"
                },
                {
                    "name": "highlight",
                    "description": "高亮函数，会返回转义的HTML",
                    "type": "object",
                    "default": "{}"
                },
                {
                    "name": "html",
                    "description": "在源码中启用 HTML 标签",
                    "type": "boolean",
                    "default": "false"
                },
                {
                    "name": "langPrefix",
                    "description": "给围栏代码块的 CSS 语言前缀。对于额外的高亮代码非常有用",
                    "type": "string",
                    "default": "'language-'"
                },
                {
                    "name": "linkify",
                    "description": "将类似 URL 的文本自动转换为链接",
                    "type": "boolean",
                    "default": "false"
                },
                {
                    "name": "plugins",
                    "description": "插件",
                    "type": "array",
                    "default": "[]"
                },
                {
                    "name": "quotes",
                    "description": "双 + 单引号替换对，当 typographer 启用时。或者智能引号等，可以是 String 或 Array",
                    "type": "string",
                    "default": "'\"\"''\""
                },
                {
                    "name": "typographer",
                    "description": "启用一些语言中立的替换 + 引号美化",
                    "type": "boolean",
                    "default": "false"
                },
                {
                    "name": "xhtmlOut",
                    "description": "使用 '/' 来闭合单标签 （比如 <br />）",
                    "type": "boolean",
                    "default": "false"
                },
                {
                    "name": "source",
                    "description": "值",
                    "type": "string",
                    "default": "''"
                }
            ]
        },
        {
            "name": "PermissionButton",
            "description": "权限按钮",
            "code": "<template>\n  <j-permission-button\n    :hasPermission=\"hasPermission\"\n    :popConfirm=\"{\n      title: '确认删除？',\n      onConfirm: () => {\n        console.log('确认')\n      },\n      cancel: () => {\n        console.log('取消')\n      }\n    }\"\n  >\n    {{ hasPermission ? '有权限': '无权限' }}\n  </j-permission-button>\n</template>\n\n<script setup>\n  const hasPermission = ref(true)\n</script>",
            "api": [
                {
                    "name": "hasPermission",
                    "description": "是否有权限或者权限标识",
                    "type": "boolean",
                    "default": "-"
                },
                {
                    "name": "tooltip",
                    "description": "文字提示",
                    "type": "object",
                    "default": "-"
                },
                {
                    "name": "popConfirm",
                    "description": "二次确认",
                    "type": "object",
                    "default": "-"
                },
                {
                    "name": "style",
                    "description": "样式style",
                    "type": "object",
                    "default": "-"
                },
                {
                    "name": "noPermissionTitle",
                    "description": "无权限时的提示信息",
                    "type": "string",
                    "default": "-"
                }
            ]
        },
        {
            "name": "ProTable",
            "description": "高级表格组件",
            "code": "<template>\n    <j-pro-table\n      :columns=\"columns\"\n      :dataSource=\"dataSource\"\n      :noPagination=\"true\"\n      :gridColumns=\"[3]\"\n  >\n    <template #headerLeftRender>\n      <a-button type=\"primary\">新增</a-button>\n    </template>\n    <template #headerRightRender>\n      <a-button>批量操作</a-button>\n    </template>\n    <template #card=\"slotProps\">\n      <a-card style=\"width: 100%\">\n        <h4>名称： {{ slotProps?.name }}</h4>\n        <p>年龄： {{ slotProps?.age }}</p>\n      </a-card>\n    </template>\n    <template #address=\"slotProps\">\n      <a>{{ slotProps?.address }}</a>\n    </template>\n  </j-pro-table>\n</template>\n<script setup>\n  const columns = [\n    {\n        title: '名称',\n        dataIndex: 'name',\n        key: 'name',\n        width: 100,\n        ellipsis: true\n    },\n    {\n        title: '年龄',\n        dataIndex: 'age',\n        key: 'age',\n    },\n    {\n        title: '地址',\n        dataIndex: 'address',\n        key: 'address',\n        scopedSlots: true,\n    },\n    {\n        title: '状态',\n        dataIndex: 'status.text',\n        key: 'status.text',\n    },\n]\n\nconst dataSource = Array(1000)\n  .fill(1)\n  .map((item, index) => {\n      return {\n          id: index + item,\n          name: 'John Brown' + index,\n          age: (Math.random() * 100).toFixed(0),\n          address: 'New York No. 1 Lake Park',\n      };\n  });\n</script>",
            "api": [
                {
                    "name": "columns",
                    "description": "表格列的配置描述",
                    "type": "array",
                    "default": "[]"
                },
                {
                    "name": "dataSource",
                    "description": "数据数组",
                    "type": "array",
                    "default": "[]"
                },
                {
                    "name": "noPagination",
                    "description": "是否分页",
                    "type": "boolean",
                    "default": "false"
                },
                {
                    "name": "mode",
                    "description": "模式，只为表格或者卡片",
                    "type": "string",
                    "default": "undefined"
                },
                {
                    "name": "modeValue",
                    "description": "控制模式，当mode为undefined时生效",
                    "type": "string",
                    "default": "'TABLE'"
                },
                {
                    "name": "rowSelection",
                    "description": "列表项是否可选择，参数参考ant design vue的表格的rowSelection",
                    "type": "object",
                    "default": "undefined"
                },
                {
                    "name": "alertShow",
                    "description": "是否显示选择多少项提示",
                    "type": "boolean",
                    "default": "true"
                },
                {
                    "name": "cardBodyClass",
                    "description": "卡片class",
                    "type": "string",
                    "default": "''"
                },
                {
                    "name": "gridColumns",
                    "description": "每行展示的卡片个数",
                    "type": "array",
                    "default": "[1, 2, 3, 4]"
                },
                {
                    "name": "scroll",
                    "description": "表格是否可滚动，也可以指定滚动区域的宽、高",
                    "type": "object",
                    "default": "{}"
                },
                {
                    "name": "rowKey",
                    "description": "表格行 key 的取值，可以是字符串或一个函数",
                    "type": "string",
                    "default": "'id'"
                },
                {
                    "name": "bodyStyle",
                    "description": "表格外框style",
                    "type": "object",
                    "default": "{padding: '16px 24px 24px'}"
                },
                {
                    "name": "request",
                    "description": "数据请求",
                    "type": "function",
                    "default": "undefined"
                },
                {
                    "name": "defaultParams",
                    "description": "默认参数",
                    "type": "object",
                    "default": "{}"
                },
                {
                    "name": "params",
                    "description": "请求参数",
                    "type": "object",
                    "default": "{}"
                },
                {
                    "name": "type",
                    "description": "表格类型",
                    "type": "string",
                    "default": "'PAGE'"
                },
                {
                    "name": "pagination",
                    "description": "分页器,参数参考ant design vue的pagination",
                    "type": "object",
                    "default": "-"
                }
            ]
        },
        {
            "name": "RadioButton",
            "description": "单选按钮组",
            "code": "<template>\n  <j-radio-button v-model:value=\"myValue\" :options=\"options\" :columns=\"4\" />\n</template>\n\n<script setup>\nimport { ref } from \"vue\";\nconst options = [\n  {label: \"选项1\", value: '1'},\n  {label: \"选项2\", value: '2'},\n  {label: \"选项3\", value: '3'},\n  {label: \"选项4\", value: '4'},\n  {label: \"选项5\", value: '5'}\n]\n\nconst myValue = ref('1')\n</script>",
            "api": [
                {
                    "name": "options",
                    "description": "选项",
                    "type": "array",
                    "default": "[]"
                },
                {
                    "name": "columns",
                    "description": "每行的个数",
                    "type": "number",
                    "default": "3"
                },
                {
                    "name": "value",
                    "description": "值",
                    "type": "number | string",
                    "default": "-"
                }
            ]
        },
        {
            "name": "Scrollbar",
            "description": "滚动条组件",
            "code": "<template>\n  <j-scrollbar :height=\"300\">\n    <div style=\"height: 400px; width: 110%; background-color: #999999\">\n      这是一个容器框,可以横向滚动，也可以纵向滚动，不信你可以试试\n    </div>\n  </j-scrollbar>\n</template>",
            "api": [
                {
                    "name": "height",
                    "description": "高度",
                    "type": "number | string",
                    "default": "-"
                }
            ]
        },
        {
            "name": "Search",
            "description": "搜索组件",
            "code": "<template>\n    <a-radio-group v-model:value=\"value\">\n        <a-radio-button value=\"object\">object</a-radio-button>\n        <a-radio-button value=\"terms\">terms</a-radio-button>\n    </a-radio-group>\n    <j-search :columns=\"columns\" @search=\"onSearch\" :type=\"value\" />\n    <div>\n        查询结果:\n        <br />\n        {{ paramsStr }}\n    </div>\n</template>\n\n<script setup>\nimport { ref } from 'vue';\n\nconst paramsStr = ref();\nconst value = ref('object');\nconst columns = [\n  {\n    title: '名称名称名称1',\n    dataIndex: 'name',\n    search: {\n      type: 'string',\n      componentProps: {\n        placeholder: '请输入名称',\n      },\n      defaultValue: '111111111',\n    },\n  },\n  {\n    title: '年龄',\n    dataIndex: 'age',\n    search: {\n      type: 'number',\n      componentProps: {\n        placeholder: '请输入真实年龄',\n      },\n    },\n  },\n  {\n    title: '类型',\n    dataIndex: 'type',\n    search: {\n      type: 'select',\n      options: [\n        { label: '类型1', value: 1 },\n        { label: '类型2', value: 2 },\n      ],\n      componentProps: {\n        placeholder: '请选择类型',\n      },\n    },\n  },\n  {\n    title: '测试地址长度',\n    dataIndex: 'address',\n    search: {\n      type: 'string',\n    },\n  },\n  {\n    title: '时间',\n    dataIndex: 'treeSelect',\n    search: {\n      type: 'treeSelect',\n      componentProps: {\n        treeNodeFilterProp: 'title',\n        fieldNames: { label: 'title' },\n        filterTreeNode: (v, node) => {\n          return true;\n        },\n      },\n      options: [\n        { title: '1', value: 1 },\n        { title: '12', value: 12 },\n        { title: '13', value: 13 },\n        { title: '14', value: 14 },\n        { title: '15', value: 15 },\n      ],\n    },\n  },\n];\n\nconst onSearch = (e) => {\n  paramsStr.value = JSON.stringify(e);\n};\n</script>",
            "api": [
                {
                    "name": "columns",
                    "description": "搜索项，包含配置",
                    "type": "array",
                    "default": "[]"
                },
                {
                    "name": "type",
                    "description": "返回值的类型",
                    "type": "string",
                    "default": "'terms'"
                },
                {
                    "name": "column",
                    "description": "每一排搜索项的个数",
                    "type": "number",
                    "default": "4"
                },
                {
                    "name": "style",
                    "description": "样式style",
                    "type": "string | object",
                    "default": "-"
                },
                {
                    "name": "class",
                    "description": "样式class",
                    "type": "string",
                    "default": "-"
                },
                {
                    "name": "labelWidth",
                    "description": "label 标签的宽度",
                    "type": "number",
                    "default": "40"
                },
                {
                    "name": "resetText",
                    "description": "重置按钮的文本",
                    "type": "string",
                    "default": "-"
                },
                {
                    "name": "submitText",
                    "description": "提交按钮的文本",
                    "type": "string",
                    "default": "-"
                },
                {
                    "name": "align",
                    "description": "操作按钮对齐",
                    "type": "string",
                    "default": "'value'"
                }
            ]
        },
        {
            "name": "Title",
            "description": "标题组件",
            "code": "<template>\n  <j-title data=\"这是一段测试文字\">\n    <template #extra>\n      <a-button type=\"link\"><AIcon type=\"EditOutlined\" /></a-button>\n    </template>\n  </j-title>\n</template>",
            "api": [
                {
                    "name": "data",
                    "description": "数据",
                    "type": "string",
                    "default": "''"
                },
                {
                    "name": "style",
                    "description": "样式style",
                    "type": "object",
                    "default": "{}"
                }
            ]
        },
        {
            "name": "ValueItem",
            "description": "值项组件",
            "code": "<template>\n  <a-form :model=\"formData\" ref=\"formRef\" layout=\"vertical\">\n    <a-form-item :label=\"item.name\" v-for=\"item in schema\" :key=\"item.key\">\n      <j-value-item style=\"width: 100%\" v-model=\"formData[item.key]\" v-bind=\"item\" :itemType=\"item.type\" />\n    </a-form-item>\n  </a-form>\n  {{ formData}}\n</template>\n\n<script setup>\nimport { reactive, ref } from 'vue'\nconst schema = [\n  {\n    key: 'a',\n    name: 'int',\n    type: 'int',\n    placeholder: '请输入1~100的数字',\n    extraProps: {\n      min: 1,\n      max: 100,\n      precision: 0\n    }\n  },\n  {\n    key: 'b',\n    type: 'double',\n    name: 'double',\n    placeholder: '请输入数字'\n  },\n  {\n    key: 'c',\n    type: 'string',\n    name: 'string',\n    placeholder: '请输入'\n  },\n  {\n    key: 'd',\n    type: 'password',\n    name: 'password',\n    placeholder: '请输入密码'\n  },\n  {\n    key: 'e',\n    type: 'enum',\n    name: 'enum',\n    placeholder: '请选择',\n    options: [\n      {label: \"选项1\", value: '1'},\n      {label: \"选项2\", value: '2'},\n      {label: \"选项3\", value: '3'},\n      {label: \"选项4\", value: '4'},\n      {label: \"选项5\", value: '5'}\n    ]\n  },\n  {\n    key: 'f',\n    type: 'boolean',\n    name: 'boolean',\n    placeholder: '请选择',\n    options: [\n      {label: \"是\", value: 'true'},\n      {label: \"否\", value: 'false'},\n    ]\n  },\n  {\n    key: 'g',\n    type: 'date',\n    name: 'date',\n    placeholder: '请输入'\n  },\n]\nconst formRef = ref()\nconst formData = reactive({\n  b: 123\n})\n</script>",
            "api": [
                {
                    "name": "modelValue",
                    "description": "值",
                    "type": "string",
                    "default": "-"
                },
                {
                    "name": "itemType",
                    "description": "组件类型, 默认为string",
                    "type": "string",
                    "default": "'string'"
                },
                {
                    "name": "mode",
                    "description": "设置 Select 的模式为多选或标签",
                    "type": "string",
                    "default": "-"
                },
                {
                    "name": "placeholder",
                    "description": "默认文字",
                    "type": "string",
                    "default": "-"
                },
                {
                    "name": "options",
                    "description": "选项数据",
                    "type": "array",
                    "default": "-"
                },
                {
                    "name": "style",
                    "description": "样式style",
                    "type": "object",
                    "default": "-"
                },
                {
                    "name": "class",
                    "description": "样式class",
                    "type": "string",
                    "default": "-"
                },
                {
                    "name": "valueFormat",
                    "description": "类型为日期组件时，绑定值的格式，对 value、defaultValue、defaultPickerValue 起作用。不指定则绑定值为 dayjs 对象",
                    "type": "string",
                    "default": "-"
                },
                {
                    "name": "action",
                    "description": "上传的地址",
                    "type": "string",
                    "default": "-"
                },
                {
                    "name": "headers",
                    "description": "设置上传的请求头部",
                    "type": "object",
                    "default": "-"
                },
                {
                    "name": "disabled",
                    "description": "是否禁用",
                    "type": "boolean",
                    "default": "-"
                },
                {
                    "name": "extraProps",
                    "description": "额外的参数",
                    "type": "object",
                    "default": "{}"
                },
                {
                    "name": "handleFileChange",
                    "description": "处理上传组件的值的方法",
                    "type": "object",
                    "default": "-"
                }
            ]
        }
    ],
    "utilFunctions": [
        {
            "name": "LocalStore.set",
            "description": "设置 localStorage的值",
            "params": [
                {
                    "name": "key",
                    "type": "string",
                    "required": true,
                    "description": "存储键名"
                },
                {
                    "name": "value",
                    "type": "any",
                    "required": true,
                    "description": "存储值"
                }
            ],
            "example": "LocalStore.set('version_code', '这是一段测试数据');"
        },
        {
            "name": "LocalStore.get",
            "description": "获取 localStorage的值",
            "params": [
                {
                    "name": "key",
                    "type": "string",
                    "required": true,
                    "description": "存储键名"
                }
            ],
            "returnType": "any",
            "returnDescription": "存入localStorage的值",
            "example": "const version = LocalStore.get('version_code');"
        },
        {
            "name": "LocalStore.remove",
            "description": "删除 localStorage的值",
            "params": [
                {
                    "name": "key",
                    "type": "string",
                    "required": true,
                    "description": "存储键名"
                }
            ],
            "example": "LocalStore.remove('version_code');"
        },
        {
            "name": "LocalStore.removeAll",
            "description": "清空所有localStorage的值",
            "example": "LocalStore.removeAll();"
        },
        {
            "name": "getToken",
            "description": "获取token",
            "returnType": "string",
            "returnDescription": "token的值",
            "example": "const token = getToken()"
        },
        {
            "name": "setToken",
            "description": "设置token的值",
            "params": [
                {
                    "name": "value",
                    "type": "string",
                    "required": true,
                    "description": "token的值"
                }
            ],
            "example": "setToken('新的token值')"
        },
        {
            "name": "removeToken",
            "description": "删除token的值",
            "example": "removeToken()"
        },
        {
            "name": "onlyMessage",
            "description": "🚫【强制使用】消息提示方法。❌ 绝对禁止使用 message.success()、message.error()、message.warning() 等ant-design-vue的message API。✅ 必须使用 onlyMessage('提示内容', 'success')。根据类型只提示一次,避免重复提示,提供更好的用户体验。任何需要显示消息提示的场景(成功提示、错误提示、警告提示等),都必须使用onlyMessage。",
            "params": [
                {
                    "name": "msg",
                    "type": "string",
                    "required": true,
                    "description": "需要提示的信息内容"
                },
                {
                    "name": "type",
                    "type": "string",
                    "required": false,
                    "default": "'success'",
                    "description": "提示类型: 'success' | 'error' | 'warning' | 'info'"
                }
            ],
            "example": "// ✅ 正确写法 - 必须使用onlyMessage\nonlyMessage('操作成功！', 'success');\nonlyMessage('操作失败！', 'error');\nonlyMessage('警告信息！', 'warning');\n\n// ❌ 错误写法 - 绝对禁止!\n// message.success('操作成功！');\n// message.error('操作失败！');"
        },
        {
            "name": "randomString",
            "description": "生成随机字符串",
            "params": [
                {
                    "name": "length",
                    "type": "number",
                    "required": false,
                    "default": "32",
                    "description": "需要生成的字符串的长度"
                }
            ],
            "returnType": "string",
            "returnDescription": "生成的字符串",
            "example": "const a = randomString();"
        },
        {
            "name": "randomNumber",
            "description": "生成随机数数字",
            "returnType": "number",
            "returnDescription": "生成的随机数数字",
            "example": "const num = randomNumber();"
        },
        {
            "name": "downloadFileByUrl",
            "description": "通过url下载文件",
            "params": [
                {
                    "name": "url",
                    "type": "string",
                    "required": true,
                    "description": "下载文件的url"
                },
                {
                    "name": "name",
                    "type": "string",
                    "required": true,
                    "description": "下载文件的名称"
                },
                {
                    "name": "type",
                    "type": "string",
                    "required": false,
                    "description": "下载文件的类型"
                }
            ],
            "example": "downloadFileByUrl(url, '文件名称', type);"
        },
        {
            "name": "downloadJson",
            "description": "下载json",
            "params": [
                {
                    "name": "record",
                    "type": "Record<string, any>",
                    "required": true,
                    "description": "下载的数据"
                },
                {
                    "name": "fileName",
                    "type": "string",
                    "required": true,
                    "description": "下载文件的名称"
                }
            ],
            "example": "downloadJson(obj, '我要下载的文件');"
        },
        {
            "name": "EventEmitter.emit",
            "description": "发布事件",
            "params": [
                {
                    "name": "eventName",
                    "type": "string",
                    "required": true,
                    "description": "事件名称"
                },
                {
                    "name": "callback",
                    "type": "function",
                    "required": true,
                    "description": "回调函数"
                }
            ],
            "example": "EventEmitter.emit('MetadataTabs', () => {});"
        },
        {
            "name": "EventEmitter.subscribe",
            "description": "订阅事件",
            "params": [
                {
                    "name": "eventNames",
                    "type": "array",
                    "required": true,
                    "description": "事件名称数组"
                },
                {
                    "name": "callback",
                    "type": "function",
                    "required": true,
                    "description": "回调函数"
                }
            ],
            "example": "EventEmitter.subscribe(['MetadataTabs'], () => {});"
        },
        {
            "name": "EventEmitter.unSubscribe",
            "description": "取消订阅事件",
            "params": [
                {
                    "name": "eventNames",
                    "type": "array",
                    "required": true,
                    "description": "事件名称数组"
                },
                {
                    "name": "callback",
                    "type": "function",
                    "required": true,
                    "description": "回调函数"
                }
            ],
            "example": "EventEmitter.unSubscribe(['MetadataTabs'], () => {});"
        },
        {
            "name": "encrypt",
            "description": "RSA 加密",
            "params": [
                {
                    "name": "txt",
                    "type": "string",
                    "required": true,
                    "description": "需要加密的文本"
                },
                {
                    "name": "publicKey",
                    "type": "string",
                    "required": true,
                    "description": "公钥"
                }
            ],
            "returnType": "string",
            "returnDescription": "加密后的文本",
            "example": "const encrypted = encrypt(plainText, publicKey);"
        },
        {
            "name": "isUndefined",
            "description": "判断是否为undefined",
            "params": [
                {
                    "name": "val",
                    "type": "any",
                    "required": true,
                    "description": "需要判断的值"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "true/false",
            "example": "const a = isUndefined(undefined) // true"
        },
        {
            "name": "isBoolean",
            "description": "判断是否为Boolean",
            "params": [
                {
                    "name": "val",
                    "type": "any",
                    "required": true,
                    "description": "需要判断的值"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "true/false",
            "example": "const a = isBoolean(true) // true"
        },
        {
            "name": "isNumber",
            "description": "判断是否为数字",
            "params": [
                {
                    "name": "val",
                    "type": "any",
                    "required": true,
                    "description": "需要判断的值"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "true/false",
            "example": "const a = isNumber('1') // false"
        },
        {
            "name": "isEmpty",
            "description": "判断值是否为空，当对象属性为空的时候或者数组的长度为0和当 `val` 是假值但不是 `0` 时",
            "params": [
                {
                    "name": "val",
                    "type": "any",
                    "required": true,
                    "description": "需要判断的值"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "true/false",
            "example": "console.log(isEmpty(null)); // true"
        },
        {
            "name": "isElement",
            "description": "判断值是否为Element",
            "params": [
                {
                    "name": "val",
                    "type": "any",
                    "required": true,
                    "description": "需要判断的值"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "true/false",
            "example": "console.log(isElement(div)) // true"
        },
        {
            "name": "isPropAbsent",
            "description": "检查 `value` 是否是 `null` 或者 `undefined`",
            "params": [
                {
                    "name": "val",
                    "type": "any",
                    "required": true,
                    "description": "需要判断的值"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "如果 `value` 为`null` 或 `undefined`，那么返回 `true`，否则返回 `false`",
            "example": "console.log(isPropAbsent(null)) // true"
        },
        {
            "name": "isStringNumber",
            "description": "判断是否为字符串数字",
            "params": [
                {
                    "name": "val",
                    "type": "string",
                    "required": true,
                    "description": "需要判断的值"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "true/false",
            "example": "console.log(isStringNumber('1111')) // true"
        },
        {
            "name": "isWindow",
            "description": "判断是否为window",
            "params": [
                {
                    "name": "val",
                    "type": "any",
                    "required": true,
                    "description": "需要判断的值"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "true/false",
            "example": "console.log(isWindow(window)) // true"
        },
        {
            "name": "regular.urlReg",
            "description": "URL验证正则表达式",
            "params": [
                {
                    "name": "str",
                    "type": "string",
                    "required": true,
                    "description": "需要验证的字符串"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "是否为URL",
            "example": "if(isUrl(str)) { // 是url后的操作 }"
        },
        {
            "name": "regular.englishOrNumber",
            "description": "英文或数字验证正则表达式",
            "params": [
                {
                    "name": "str",
                    "type": "string",
                    "required": true,
                    "description": "需要验证的字符串"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "是否为英文或数字",
            "example": "if(isEnglishOrNumber(str)) { // true后的操作 }"
        },
        {
            "name": "regular.cronReg",
            "description": "cron表达式验证正则表达式",
            "params": [
                {
                    "name": "str",
                    "type": "string",
                    "required": true,
                    "description": "需要验证的字符串"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "是否为cron表达式",
            "example": "if(isCronReg(str)) { // true后的操作 }"
        },
        {
            "name": "regular.english",
            "description": "英文验证正则表达式",
            "params": [
                {
                    "name": "str",
                    "type": "string",
                    "required": true,
                    "description": "需要验证的字符串"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "是否为英文",
            "example": "if(isEnglish(str)) { // true后的操作 }"
        },
        {
            "name": "regular.chinese",
            "description": "中文验证正则表达式",
            "params": [
                {
                    "name": "str",
                    "type": "string",
                    "required": true,
                    "description": "需要验证的字符串"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "是否为中文",
            "example": "if(isChinese(str)) { // true后的操作 }"
        },
        {
            "name": "regular.telephoneReg",
            "description": "座机号验证正则表达式",
            "params": [
                {
                    "name": "str",
                    "type": "string",
                    "required": true,
                    "description": "需要验证的字符串"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "是否为座机号",
            "example": "if(isTelephone(str)) { // true后的操作 }"
        },
        {
            "name": "regular.cellphoneReg",
            "description": "手机号码验证正则表达式",
            "params": [
                {
                    "name": "str",
                    "type": "string",
                    "required": true,
                    "description": "需要验证的字符串"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "是否为手机号码",
            "example": "if(isCellphone(str)) { // true后的操作 }"
        },
        {
            "name": "regular.ipReg",
            "description": "IP地址验证正则表达式",
            "params": [
                {
                    "name": "str",
                    "type": "string",
                    "required": true,
                    "description": "需要验证的字符串"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "是否为IP地址",
            "example": "if(isIpReg(str)) { // true后的操作 }"
        },
        {
            "name": "regular.ipv6Reg",
            "description": "IPv6地址验证正则表达式",
            "params": [
                {
                    "name": "str",
                    "type": "string",
                    "required": true,
                    "description": "需要验证的字符串"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "是否为IPv6地址",
            "example": "if(isIpv6(str)) { // true后的操作 }"
        },
        {
            "name": "regular.domainReg",
            "description": "域名验证正则表达式",
            "params": [
                {
                    "name": "str",
                    "type": "string",
                    "required": true,
                    "description": "需要验证的字符串"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "是否为域名",
            "example": "if(isDomain(str)) { // true后的操作 }"
        },
        {
            "name": "regular.emailReg",
            "description": "邮箱地址验证正则表达式",
            "params": [
                {
                    "name": "str",
                    "type": "string",
                    "required": true,
                    "description": "需要验证的字符串"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "是否为邮箱地址",
            "example": "if(isEmail(str)) { // true后的操作 }"
        },
        {
            "name": "regular.passwordReg",
            "description": "密码强度验证正则表达式（必须至少包含大小写英文和数字）",
            "params": [
                {
                    "name": "str",
                    "type": "string",
                    "required": true,
                    "description": "需要验证的字符串"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "是否为强密码",
            "example": "if(isPassword(str)) { // true后的操作 }"
        },
        {
            "name": "regular.inputReg",
            "description": "数字字母，小写字母开头验证正则表达式",
            "params": [
                {
                    "name": "str",
                    "type": "string",
                    "required": true,
                    "description": "需要验证的字符串"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "是否符合格式",
            "example": "if(isInputReg(str)) { // true后的操作 }"
        },
        {
            "name": "regular.modalReg",
            "description": "数字字母下划线，字母开头验证正则表达式",
            "params": [
                {
                    "name": "str",
                    "type": "string",
                    "required": true,
                    "description": "需要验证的字符串"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "是否符合格式",
            "example": "if(isModalReg(str)) { // true后的操作 }"
        },
        {
            "name": "regular.textReg",
            "description": "中文验证正则表达式",
            "params": [
                {
                    "name": "str",
                    "type": "string",
                    "required": true,
                    "description": "需要验证的字符串"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "是否为中文",
            "example": "if(isTextReg(str)) { // true后的操作 }"
        },
        {
            "name": "regular.colorReg",
            "description": "颜色验证正则表达式",
            "params": [
                {
                    "name": "str",
                    "type": "string",
                    "required": true,
                    "description": "需要验证的字符串"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "是否为颜色值",
            "example": "if(isColorReg(str)) { // true后的操作 }"
        },
        {
            "name": "regular.sqlReg",
            "description": "SQL验证正则表达式",
            "params": [
                {
                    "name": "str",
                    "type": "string",
                    "required": true,
                    "description": "需要验证的字符串"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "是否为SQL语句",
            "example": "if(isSql(str)) { // true后的操作 }"
        },
        {
            "name": "regular.imgReg",
            "description": "图片验证正则表达式",
            "params": [
                {
                    "name": "str",
                    "type": "string",
                    "required": true,
                    "description": "需要验证的字符串"
                }
            ],
            "returnType": "boolean",
            "returnDescription": "是否为图片",
            "example": "if(isImg(str)) { // true后的操作 }"
        }
    ],
    "description": "JetLinks UI组件库和工具函数集合，包含常用的UI组件和实用工具函数"
}


export default resourceData;
