import type { Meta, StoryObj } from '@storybook/vue3';
import CheckButton from '../../packages/components/src/CheckButton/CheckButton.vue';
import CheckButtonDemo from "./CheckButton.vue?raw";

// 定义元数据
const meta: Meta<typeof CheckButton> = {
    title: '示例/CheckButton',
    component: CheckButton,
    tags: ['autodocs'],
    argTypes: {
        options: {description: '选项'},
        multiple: {description: '是否多选'},
        value: {description: '值'},
        disabled: {description: '是否禁用'},
        class: {description: '样式class'},
        style: {description: '样式style'},
    }
};
export default meta;
type Story = StoryObj<typeof meta>;


export const 基础使用: Story = {
    args: {
        options: [
            {label: "选项1", value: '1'},
            {label: "选项2", value: '2'},
            {label: "选项3", value: '3'},
            {label: "选项4", value: '4'},
            {label: "选项5", value: '5'},
        ],
        multiple: true,
        value: ['1', '4'],
    },
    render: ({...args }) => ({
        components: { CheckButton },
        setup() {
            return { args };
        },
        template: `
          <CheckButton v-bind="args" />
        `,
    }),
    parameters: {
        docs: {
            source: {
                code: CheckButtonDemo
            }
        }
    }
};
