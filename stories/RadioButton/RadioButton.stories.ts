import type { Meta, StoryObj } from '@storybook/vue3';
import RadioButton from '../../packages/components/src/RadioButton/RadioButton.vue';

// 定义元数据
const meta: Meta<typeof RadioButton> = {
    title: '示例/RadioButton',
    component: RadioButton,
    tags: ['autodocs'],
    argTypes: {
        options: {description: '选项' },
        columns: {description: '每行的个数' },
        value: {description: '值' },
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
        columns: 4,
        value: '1'
    },
    render: ({...args }) => ({
        components: { RadioButton },
        setup() {
            return { args };
        },
        template: `
          <RadioButton v-bind="args"></RadioButton>
        `,
    }),
};
