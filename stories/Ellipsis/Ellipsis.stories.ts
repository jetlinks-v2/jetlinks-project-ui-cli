import type { Meta, StoryObj } from '@storybook/vue3';
import Ellipsis from '../../packages/components/src/Ellipsis/Ellipsis.vue'
import EllipsisDemo from './Ellipsis.vue?raw';

// 定义元数据
const meta: Meta<typeof Ellipsis> = {
    title: '示例/Ellipsis',
    component: Ellipsis,
    tags: ['autodocs'],
    argTypes: {
        // 定义 props 的控制类型
        tooltip: { control: 'object', description: '文字提示' },
        lineClamp: { control: 'number', description: '文字展示的行数' },
        expandTrigger: { control: 'text', description: '样式class' },
    },
};
export default meta;
type Story = StoryObj<typeof meta>;

const text = `这是一段测试文字， 这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字、这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字`
// 基本使用示例
export const 基础使用: Story = {
    args: {
        lineClamp: 1,
        tooltip: {
            color: 'red'
        },
    },
    render: ({...args }) => ({
        components: { Ellipsis },
        setup() {
            return { args };
        },
        template: `
          <Ellipsis v-bind="args">${text}</Ellipsis>
        `,
    }),
    parameters: {
        docs: {
            source: {
                code: EllipsisDemo,
            },
        },
    },
};
