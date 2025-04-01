import type { Meta, StoryObj } from '@storybook/vue3';
import AIcon from '../../packages/components/src/Icon';
import JAIcon from './AIcon.vue?raw';

// 定义元数据
const meta: Meta<typeof AIcon> = {
    title: '示例/Icon',
    component: AIcon,
    tags: ['autodocs'],
    argTypes: {
        // 定义 props 的控制类型
        type: { control: 'text', description: '图标的类型' },
        scriptUrl: { control: 'text', description: 'iconfont.cn 项目在线生成的 js 地址' },
        class: { control: 'text', description: '样式class' },
    },
};
export default meta;
type Story = StoryObj<typeof meta>;

// 基本使用示例
export const 基础使用: Story = {
    args: {
        // type: 'EditOutlined',
        type: 'icon-paiduizhong',
        scriptUrl: "//at.alicdn.com/t/c/font_4035907_e2upz5fi7ew.js"
    },
    parameters: {
        docs: {
            source: {
                code: JAIcon
            }
        }
    }
};
