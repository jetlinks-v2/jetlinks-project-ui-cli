import type { Meta, StoryObj } from '@storybook/vue3';
import { paramsEncodeQuery, encodeQuery, handleParamsToString } from '../../packages/utils/src/encodeQuery';

/**
 * 工具函数
 * 
 * 这里展示了项目中查询条件转换相关的工具函数的使用方法和示例。
 */
const meta: Meta = {
  title: '工具函数/Query 查询条件转换',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
查询条件转换工具函数，用于处理前端查询参数到后端接口格式的转换。

### 主要特性
- 支持复杂查询条件的嵌套处理
- 自动处理 LIKE、IN、START、END 等查询类型
- 支持数组和对象的递归处理
- 支持排序参数的转换

### 使用场景
- 表格查询条件转换
- API 请求参数编码
- 复杂筛选条件处理

### 基本用法

\`\`\`javascript
import { paramsEncodeQuery, encodeQuery, handleParamsToString } from '@jetlinks-web/utils';

// paramsEncodeQuery - 新版参数编码
const params = {
  terms: [
    { column: 'name', type: 'like', value: '测试', termsType: 'string' }
  ],
  sorts: [{ name: 'createTime', order: 'desc' }],
  current: 1
};
const encoded = paramsEncodeQuery(params);

// encodeQuery - 旧版查询条件编码（支持正则判断）
const queryParams = {
  terms: {
    'name$LIKE': '搜索关键词',
    'status$IN': ['active', 'pending'],
    'prefix$START': '前缀',
    'suffix$END': '后缀'
  },
  sorts: { createTime: 'descend' },
  current: 1
};
const queryEncoded = encodeQuery(queryParams);

// handleParamsToString - 参数转字符串
const searchItems = [
  { column: 'name', value: '测试', termType: 'like' },
  { column: 'status', value: 'active', termType: 'eq' }
];
const stringified = handleParamsToString(searchItems);
\`\`\`
        `
      },
      source: {
        type: 'code'
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ParamsEncodeQuery: Story = {
  name: 'paramsEncodeQuery - 新版参数编码',
  parameters: {
    docs: {
      source: {
        code: `
import { paramsEncodeQuery } from '@jetlinks-web/utils';

// 复杂查询参数
const params = {
  terms: [
    {
      column: 'name',
      type: 'like',
      value: '测试产品',
      termsType: 'string',
      terms: []
    },
    {
      column: 'status',
      type: 'in',
      value: ['active', 'pending'],
      termsType: 'string',
      terms: []
    }
  ],
  sorts: [
    { name: 'createTime', order: 'desc' },
    { name: 'name', order: 'asc' }
  ],
  current: 1
};

const result = paramsEncodeQuery(params);
console.log('编码结果:', result);
        `
      }
    }
  },
  render: () => ({
    setup() {
      const executeDemo = () => {
        const params = {
          terms: [
            {
              column: 'name',
              type: 'like',
              value: '测试产品',
              termsType: 'string',
              terms: []
            },
            {
              column: 'status',
              type: 'in',
              value: ['active', 'pending'],
              termsType: 'string',
              terms: []
            }
          ],
          sorts: [
            { name: 'createTime', order: 'desc' },
            { name: 'name', order: 'asc' }
          ],
          current: 1
        };

        const result = paramsEncodeQuery(params);
        console.log('paramsEncodeQuery 结果:', result);
        return result;
      };

      return { executeDemo };
    },
    template: `
      <div>
        <a-button type="primary" @click="executeDemo">
          执行 paramsEncodeQuery 示例
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          点击按钮执行示例，查看控制台输出结果
        </p>
        <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <h4>输入参数示例：</h4>
          <pre style="margin: 0; font-size: 12px; white-space: pre-wrap;">{{
            JSON.stringify({
              terms: [
                { column: 'name', type: 'like', value: '测试产品', termsType: 'string', terms: [] },
                { column: 'status', type: 'in', value: ['active', 'pending'], termsType: 'string', terms: [] }
              ],
              sorts: [
                { name: 'createTime', order: 'desc' },
                { name: 'name', order: 'asc' }
              ],
              current: 1
            }, null, 2)
          }}</pre>
        </div>
      </div>
    `
  })
};

export const EncodeQuery: Story = {
  name: 'encodeQuery - 查询条件编码（正则判断）',
  parameters: {
    docs: {
      source: {
        code: `
import { encodeQuery } from '@jetlinks-web/utils';

// 支持多种查询类型的正则判断
const queryParams = {
  terms: {
    'name$LIKE': '搜索关键词',        // 模糊查询，自动添加 %
    'status$IN': ['active', 'pending'], // IN 查询，转为字符串
    'title$START': '前缀',           // 开始匹配，添加后缀 %
    'content$END': '后缀',           // 结束匹配，添加前缀 %
    'type@string': '普通查询',       // 指定类型查询
    'age': 25                        // 普通等值查询
  },
  sorts: {
    createTime: 'descend',
    name: 'ascend'
  },
  current: 1,
  pageSize: 10
};

const result = encodeQuery(queryParams);
console.log('编码结果:', result);
        `
      }
    }
  },
  render: () => ({
    setup() {
      const executeDemo = () => {
        const queryParams = {
          terms: {
            'name$LIKE': '搜索关键词',
            'status$IN': ['active', 'pending'],
            'title$START': '前缀',
            'content$END': '后缀',
            'type@string': '普通查询',
            'age': 25
          },
          sorts: {
            createTime: 'descend',
            name: 'ascend'
          },
          current: 1,
          pageSize: 10
        };

        const result = encodeQuery(queryParams);
        console.log('encodeQuery 结果:', result);
        return result;
      };

      return { executeDemo };
    },
    template: `
      <div>
        <a-button type="primary" @click="executeDemo">
          执行 encodeQuery 示例
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          点击按钮执行示例，查看控制台输出结果。支持 $LIKE、$IN、$START、$END 等正则判断
        </p>
        <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <h4>查询类型说明：</h4>
          <ul style="margin: 8px 0; padding-left: 20px; font-size: 12px;">
            <li><code>$LIKE</code>: 模糊查询，自动在前后添加 %</li>
            <li><code>$IN</code>: IN 查询，数组转为字符串</li>
            <li><code>$START</code>: 开始匹配，在后面添加 %</li>
            <li><code>$END</code>: 结束匹配，在前面添加 %</li>
            <li><code>@type</code>: 指定字段类型</li>
          </ul>
        </div>
      </div>
    `
  })
};

export const HandleParamsToString: Story = {
  name: 'handleParamsToString - 参数转字符串',
  parameters: {
    docs: {
      source: {
        code: `
import { handleParamsToString } from '@jetlinks-web/utils';

// 搜索条件项数组
const searchItems = [
  { column: 'name', value: '产品名称', termType: 'like' },
  { column: 'status', value: 'active', termType: 'eq' },
  { column: 'category', value: '电子产品', termType: 'like' },
  { column: 'price', value: 100, termType: 'gte' },
  { column: 'tags', value: ['热销', '推荐'], termType: 'in' }
];

const result = handleParamsToString(searchItems);
console.log('字符串化结果:', result);

// 解析结果为 JSON
const parsed = JSON.parse(result);
console.log('解析后的结构:', parsed);
        `
      }
    }
  },
  render: () => ({
    setup() {
      const executeDemo = () => {
        const searchItems = [
          { column: 'name', value: '产品名称', termType: 'like' },
          { column: 'status', value: 'active', termType: 'eq' },
          { column: 'category', value: '电子产品', termType: 'like' },
          { column: 'price', value: 100, termType: 'gte' },
          { column: 'tags', value: ['热销', '推荐'], termType: 'in' }
        ];

        const result = handleParamsToString(searchItems);
        console.log('handleParamsToString 结果:', result);
        
        try {
          const parsed = JSON.parse(result);
          console.log('解析后的结构:', parsed);
        } catch (e) {
          console.error('JSON 解析失败:', e);
        }
        
        return result;
      };

      return { executeDemo };
    },
    template: `
      <div>
        <a-button type="primary" @click="executeDemo">
          执行 handleParamsToString 示例
        </a-button>
        <p style="margin-top: 16px; color: #666;">
          点击按钮执行示例，将搜索条件数组转换为 JSON 字符串格式
        </p>
        <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <h4>输入数据示例：</h4>
          <pre style="margin: 0; font-size: 12px; white-space: pre-wrap;">{{
            JSON.stringify([
              { column: 'name', value: '产品名称', termType: 'like' },
              { column: 'status', value: 'active', termType: 'eq' },
              { column: 'category', value: '电子产品', termType: 'like' },
              { column: 'price', value: 100, termType: 'gte' },
              { column: 'tags', value: ['热销', '推荐'], termType: 'in' }
            ], null, 2)
          }}</pre>
        </div>
      </div>
    `
  })
};