import type { Meta, StoryObj } from '@storybook/vue3';
import CardSelect from './CardSelect.vue';

// 定义元数据
const meta: Meta<typeof CardSelect> = {
  title: '示例/CardSelect',
  component: CardSelect,
  tags: ['autodocs'],
  argTypes: {
    // 定义 props 的控制类型
    layout: { control: 'text', description: '布局方式' }, // 可选：horizontal, vertical, grid
    options: { control: 'object', description: '选项数组' }, // 每个选项包含 label 和 value 属性
    value: { description: '选中的值' }, // 选中的值数组
    disabled: { control: 'boolean' },
    multiple: { control: 'boolean' },
    column: { control: 'number' },
    itemLayout: { control: 'text' },
    onSelect: {
      action: 'onSelect',
      description: '被选中时调用' ,
      table: {
        type: { summary: '(e, option) => void' },
        defaultValue: { summary: 'undefined' }, 
      }
    }
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基本使用示例
export const 基础使用: Story = {
  args: {
    value: [],
    options: [
      {
        value: '1',
        label: '识别性识别性识别性识别性识别性',
        describe: 'describe',
    },
    {
        value: '2',
        label: '独特性',
        describe: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
    },
    {
        value: '3',
        label: '抽象性',
        describe: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
    },
    {
        value: '4',
        label: '差异性',
        describe: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
    },
    ],
  }
};

export const 垂直布局: Story = {
  args: {
    layout: 'vertical', // 垂直布局
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
  } 
}

export const 全部禁用: Story = {
  args: {
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
    disabled: true,
  }
}

export const 单个禁用: Story = {
  args: {
    options: [
      { label: 'Option 1', value: 'option1', disabled: true },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
    
  }
}

export const 多选: Story = {
  args: {
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
    multiple: true, // 多选
  }
}

export const 自定义内容: Story = {
  args: {
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
  },
  render: ({...args}) => ({
    components: { CardSelect },
    setup(){
      return { args }
    },
    template: `
      <j-card-select v-bind="args">
        <template #itemRender={node}>
          {{ node.label }} - {{ node.value }}
        </template>
      </j-card-select>
    `
  })
}