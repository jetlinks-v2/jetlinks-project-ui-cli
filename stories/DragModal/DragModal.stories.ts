import type { Meta, StoryObj } from '@storybook/vue3';
import DragModal from '../../packages/components/src/DragModal/DragModal.vue';

// 定义元数据
const meta: Meta<typeof DragModal> = {
    title: '示例/DragModal',
    component: DragModal,
    tags: ['autodocs'],
    argTypes: {
        title: {control: "text", description: '标题'},
        height: { description: '高度'},
        dragRang: {control: "text", description: '拖拽范围'},
        width: { description: '宽度'},
        bodyStyle: {control: "object", description: '内容样式'},
        footer: {control: "boolean", description: '是否显示底部'},
    }
};
export default meta;
type Story = StoryObj<typeof meta>;


export const 基础使用: Story = {
    args: {
        title: '这是一段测试文字',
        height: 200
    },
    render: ({...args }) => ({
        components: { DragModal },
        setup() {
            return { args };
        },
        template: `
         <div style="width: 100%; height: 500px;">
           <DragModal v-bind="args">
             <p>这是一个可拖动弹窗</p>
           </DragModal>
         </div>
        `,
    }),
};
