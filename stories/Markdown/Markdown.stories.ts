import type { Meta, StoryObj } from '@storybook/vue3';
import Markdown from '../../packages/components/src/Markdown/Markdown';
import {_source} from "./data";
import MarkdownDemo from './Markdown.vue?raw'

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
        source: _source
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
    parameters: {
        docs: {
            source: {
                code: MarkdownDemo,
            },
        },
    },
};
