import type {Meta, StoryObj} from '@storybook/vue3';
import Search from '../../packages/components/src/Search';
import SearchDemo from './Search.vue?raw';
import Basic from './Basic.vue'
import BasicDemo from './Basic.vue?raw'
import AdvancedSearch from './Advanced.vue'
import AdvancedSearchDemo from './Advanced.vue?raw'
import AdvancedLow from './AdvancedLow.vue'
import AdvancedLowDemo from './AdvancedLow.vue?raw'
import Component from './Component.vue';
import ComponentDemo from './Component.vue?raw';
import {columns} from "./data";

// 定义元数据
const meta: Meta<typeof Search> = {
    title: '示例/Search',
    component: Search,
    tags: ['autodocs'],
    argTypes: {
        // 定义 props 的控制类型
        columns: {description: '搜索项，包含配置'},
        type: {description: '返回值的类型'},
        column: {description: '每一排搜索项的个数'},
        style: {description: '样式style'},
        class: {description: '样式class'},
        labelWidth: {description: 'label 标签的宽度'},
        resetText: {description: '重置按钮的文本'},
        submitText: {description: '提交按钮的文本'},
        align: {description: '操作按钮对齐'},
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基本使用示例
export const 基础使用: Story = {
    args: {
        columns: columns,
        type: 'terms',
    },
    parameters: {
        docs: {
            source: {
                code: SearchDemo
            }
        }
    }
};

export const 类型切换: Story = {
    args: {},
    render: (args) => {
        return <Basic {...args} />
    },
    parameters: {
        docs: {
            source: {
                code: BasicDemo
            }
        }
    }
};

export const 高级搜索: Story = {
    args: {},
    render: (args) => {
        return <AdvancedSearch {...args} />
    },
    parameters: {
        docs: {
            source: {
                code: AdvancedSearchDemo
            }
        }
    }
};

export const 高级搜索简单版: Story = {
    args: {},
    render: (args) => {
        return <AdvancedLow {...args} />
    },
    parameters: {
        docs: {
            source: {
                code: AdvancedLowDemo
            }
        }
    }
};

export const 自定义组件: Story = {
    args: {},
    render: (args) => {
        return <Component {...args} />
    },
    parameters: {
        docs: {
            source: {
                code: ComponentDemo
            }
        }
    }
};

