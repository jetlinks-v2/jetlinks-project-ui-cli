import type {Meta, StoryObj} from '@storybook/vue3';
import FlameGraph from '../../packages/components/src/FlameGraph/FlameGraph.vue';
import data from './stack.json';

// 定义元数据
const meta: Meta<typeof FlameGraph> = {
  title: '示例/FlameGraph',
  component: FlameGraph,
  tags: ['autodocs'],
  argTypes: {
      data: {description: '火焰图数据'},
      fieldNames: {description: '自定义数据字段'},
      showSearch: {description: '是否显示搜索框'},
      showInvert: {description: '是否显示反转按钮'},
  }
};
export default meta;
type Story = StoryObj<typeof meta>;

export const 基础使用: Story = {
  args: {
    data: data,
    fieldNames: {
     name: 'className',
     value: 'samples',
    },
  },
  render: ({...args}) => ({
    components: {FlameGraph},
    setup() {
      return {args};
    },
    template: '<FlameGraph v-bind="args" />',
  })
}
