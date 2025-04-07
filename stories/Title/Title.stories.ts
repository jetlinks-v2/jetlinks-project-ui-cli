import type { Meta, StoryObj } from '@storybook/vue3';
import Title from '../../packages/components/src/Title/title.vue';
import TitleDemo from "./Title.vue?raw";

// 定义元数据
const meta: Meta<typeof Title> = {
    title: '示例/Title',
    component: Title,
    tags: ['autodocs'],
    argTypes: {
        data: {description: '数据'},
        style: {description: '样式style'}
    }
};
export default meta;
type Story = StoryObj<typeof meta>;

export const 基础使用: Story = {
    args: {
        data: '这是一段测试文字'
    },
    render: ({...args }) => ({
        components: { Title },
        setup() {
            return { args };
        },
        template: `
          <Title v-bind="args">
            <template #extra>
                <a-button type="link"><AIcon type="EditOutlined" /></a-button>
            </template>
          </Title>
        `,
    }),
    parameters: {
        docs: {
            source: {
                code: TitleDemo
            }
        }
    }
};
