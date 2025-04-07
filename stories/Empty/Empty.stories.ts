import type {Meta, StoryObj} from '@storybook/vue3';
import Empty from '../../packages/components/src/Empty/Empty.vue';

// 定义元数据
const meta: Meta<typeof Empty> = {
    title: '示例/Empty',
    component: Empty,
    tags: ['autodocs'],
    argTypes: {
        description: {description: '自定义描述内容'},
        image: {description: '设置显示图片，为 string 时表示自定义图片地址'},
        imageStyle: {description: '图片样式'},
    }
};
export default meta;
type Story = StoryObj<typeof meta>;


export const 基础使用: Story = {
    args: {
        description: '这是一段测试文字',
    },
    render: ({...args}) => ({
        components: {Empty},
        setup() {
            return {args};
        },
        template: `
          <Empty v-bind="args">

          </Empty>
        `,
    }),
    parameters: {
        docs: {
            source: {
                code: `
                <j-empty description="这是一段测试文字" />
        `,
            },
        },
    },
};

export const 图标设置: Story = {
    args: {
        image: "https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original",
        imageStyle: {
            height: '60px',
        }
    },
    render: ({...args}) => ({
        components: {Empty},
        setup() {
            return {args};
        },
        template: `
          <Empty v-bind="args">
            <template #description>
      <span>
        Customize
        <a href="#API">Description</a>
      </span>
            </template>
            <a-button type="primary">Create Now</a-button>
          </Empty>
        `,
    }),
    parameters: {
        docs: {
            source: {
                code: `
<j-empty>
    <template #description>
      <span>
        Customize
        <a href="#API">Description</a>
      </span>
    </template>
    <a-button type="primary">Create Now</a-button>
</j-empty>
        `,
            },
        },
    },
};
