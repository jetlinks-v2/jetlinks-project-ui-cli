
import type { Meta, StoryObj } from '@storybook/vue3';
import Scrollbar from '../../packages/components/src/Scrollbar/Scrollbar.vue';
import ScrollbarDemo from './Scrollbar.vue?raw'
// 定义元数据
const meta: Meta<typeof Scrollbar> = {
    title: '示例/Scrollbar',
    component: Scrollbar,
    tags: ['autodocs'],
    argTypes: {

    }
};
export default meta;
type Story = StoryObj<typeof meta>;


export const 基础使用: Story = {
    args: {

    },
    render: ({...args }) => ({
        components: { Scrollbar },
        setup() {
            return { args };
        },
        template: `
          <Scrollbar v-bind="args" :height="300">
            <div style="height: 400px; width: 110%; background-color: #999999">
              这是一个容器框,可以横向滚动，也可以纵向滚动，不信你可以试试
            </div>
          </Scrollbar>
        `,
    }),
    parameters: {
        docs: {
            source: {
                code: ScrollbarDemo
            }
        }
    }
};
