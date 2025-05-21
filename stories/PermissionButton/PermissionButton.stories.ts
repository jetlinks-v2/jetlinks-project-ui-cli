import type { Meta, StoryObj } from '@storybook/vue3';
import PermissionButton from '../../packages/components/src/PermissionButton';

// 定义元数据
const meta: Meta<typeof PermissionButton> = {
    title: '示例/PermissionButton',
    component: PermissionButton,
    tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;


export const 基础使用: Story = {
    args: {
        // hasPermission: true
    },
    render: ({...args }) => ({
        components: { PermissionButton },
        setup() {
            return { args };
        },
        template: `
          <a-button>这是一个没有写完的数据</a-button>
        `,
    }),
};
