import type { Meta, StoryObj } from '@storybook/vue3';
import Markdown from '../../packages/components/src/Markdown/Markdown';

// 定义元数据
const meta: Meta<typeof Markdown> = {
    title: '示例/Markdown',
    component: Markdown,
    tags: ['autodocs'],
    argTypes: {
        anchor: {control: 'object', description: ""},
        breaks: {control: 'boolean', description: "转换段落里的 '\\n' 到 <br>"},
        emoji: {control: 'object', description: ""},
        highlight: {control: 'object', description: "高亮函数，会返回转义的HTML"},
        html: {control: 'boolean', description: "在源码中启用 HTML 标签"},
        langPrefix: {control: 'text', description: "给围栏代码块的 CSS 语言前缀。对于额外的高亮代码非常有用"},
        linkify: {control: 'boolean', description: "将类似 URL 的文本自动转换为链接。"},
        plugins: {control: 'object', description: "插件"},
        quotes: {control: 'text', description: "双 + 单引号替换对，当 typographer 启用时。或者智能引号等，可以是 String 或 Array"},
        source: {control: 'text', description: "值"},
        tasklists: {control: 'object', description: ""},
        toc: {control: 'object', description: ""},
        typographer: {control: 'boolean', description: "启用一些语言中立的替换 + 引号美化"},
        xhtmlOut: {control: 'boolean', description: "使用 '/' 来闭合单标签 （比如 <br />）"},
    }
};
export default meta;
type Story = StoryObj<typeof meta>;


export const 基础使用: Story = {
    args: {
        source: `# 示例 Markdown 文档

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
    },
    render: ({...args }) => ({
        components: { Markdown },
        setup() {
            return { args };
        },
        template: `
          <Markdown v-bind="args"></Markdown>
        `,
    }),
};
