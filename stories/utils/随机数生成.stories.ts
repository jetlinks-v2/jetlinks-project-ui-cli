import type { Meta, StoryObj } from '@storybook/vue3';
import { randomString, randomNumber, generateSerialNumber } from '../../packages/utils/src/util';
import { ref } from 'vue';

/**
 * 随机数生成工具
 * 
 * 提供生成随机字符串和随机数字的工具函数。
 */
const meta: Meta = {
  title: '工具函数/Random 随机数生成',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
随机数生成工具提供了生成随机字符串、随机数字和序列号的实用函数。

### 主要特性
- randomString: 生成指定长度的随机字符串
- randomNumber: 生成基于时间戳的随机数字
- generateSerialNumber: 生成指定长度的序列号
- 支持自定义长度
- 字符串包含大小写字母和数字

### 使用场景
- 生成唯一ID
- 创建临时密码
- 生成验证码
- 创建文件名后缀

### 基本用法

\`\`\`javascript
import { randomString, randomNumber, generateSerialNumber } from '@jetlinks-web/utils';

// 生成32位随机字符串（默认）
const str1 = randomString();

// 生成指定长度的随机字符串
const str2 = randomString(16);

// 生成随机数字
const num = randomNumber();

// 生成序列号
const serial = generateSerialNumber(6);
\`\`\`
        `,
        source: {
          type: 'code'
        }
      }
    }
  },
  argTypes: {
    length: {
      control: 'number',
      description: '字符串长度',
      defaultValue: 32
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const RandomString: Story = {
  name: '随机字符串生成',
  parameters: {
    docs: {
      source: {
        code: `
import { randomString } from '@jetlinks-web/utils';

// 生成默认长度的随机字符串
const defaultString = randomString();
console.log(defaultString); // 32位随机字符串

// 生成指定长度的随机字符串
const customString = randomString(16);
console.log(customString); // 16位随机字符串

// 在组件中使用
const generateString = () => {
  const newString = randomString(length);
  setResult(newString);
};
        `
      }
    }
  },
  render: (args) => ({
    setup() {
      const result = ref('');
      const length = ref(args.length || 32);
      
      const generate = () => {
        result.value = randomString(length.value);
      };
      
      return { result, length, generate };
    },
    template: `
      <div style="max-width: 500px;">
        <a-space direction="vertical" style="width: 100%;">
          <div>
            <label>字符串长度：</label>
            <a-input-number v-model:value="length" :min="1" :max="100" style="width: 120px; margin-left: 8px;" />
          </div>
          
          <a-button type="primary" @click="generate">
            生成随机字符串
          </a-button>
          
          <div v-if="result">
            <label>生成结果：</label>
            <a-input 
              :value="result" 
              readonly 
              style="margin-top: 8px;"
              :addon-after="result.length + ' 位'"
            />
          </div>
          
          <p style="color: #666; font-size: 12px; margin: 8px 0 0 0;">
            点击按钮生成指定长度的随机字符串，包含大小写字母和数字
          </p>
        </a-space>
      </div>
    `
  }),
  args: {
    length: 32
  }
};

export const RandomNumber: Story = {
  name: '随机数字生成',
  parameters: {
    docs: {
      source: {
        code: `
import { randomNumber } from '@jetlinks-web/utils';

// 生成随机数字
const number = randomNumber();
console.log(number); // 基于时间戳的随机数字

// 在组件中使用
const generateNumber = () => {
  const newNumber = randomNumber();
  setResult(newNumber);
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const result = ref('');
      const history = ref([]);
      
      const generate = () => {
        const newNumber = randomNumber();
        result.value = newNumber.toString();
        history.value.unshift(newNumber);
        if (history.value.length > 5) {
          history.value = history.value.slice(0, 5);
        }
      };
      
      return { result, history, generate };
    },
    template: `
      <div style="max-width: 400px;">
        <a-space direction="vertical" style="width: 100%;">
          <a-button type="primary" @click="generate">
            生成随机数字
          </a-button>
          
          <div v-if="result">
            <label>当前结果：</label>
            <a-input 
              :value="result" 
              readonly 
              style="margin-top: 8px; font-family: monospace;"
            />
          </div>
          
          <div v-if="history.length > 0">
            <label>历史记录：</label>
            <div style="margin-top: 8px;">
              <a-tag v-for="(num, index) in history" :key="index" style="margin: 2px; font-family: monospace;">
                {{ num }}
              </a-tag>
            </div>
          </div>
          
          <p style="color: #666; font-size: 12px; margin: 8px 0 0 0;">
            生成基于时间戳的随机数字，每次生成的数字都是唯一的
          </p>
        </a-space>
      </div>
    `
  })
};

export const SerialNumber: Story = {
  name: '序列号生成',
  parameters: {
    docs: {
      source: {
        code: `
import { generateSerialNumber } from '@jetlinks-web/utils';

// 生成6位序列号
const serial6 = generateSerialNumber(6);
console.log(serial6); // 例如: "000123"

// 生成8位序列号
const serial8 = generateSerialNumber(8);
console.log(serial8); // 例如: "00012345"

// 在组件中使用
const generateSerial = (length) => {
  const newSerial = generateSerialNumber(length);
  setResult(newSerial);
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const result = ref('');
      const length = ref(6);
      const history = ref([]);
      
      const generate = () => {
        const newSerial = generateSerialNumber(length.value);
        result.value = newSerial;
        history.value.unshift(newSerial);
        if (history.value.length > 8) {
          history.value = history.value.slice(0, 8);
        }
      };
      
      return { result, length, history, generate };
    },
    template: `
      <div style="max-width: 500px;">
        <a-space direction="vertical" style="width: 100%;">
          <div>
            <label>序列号长度：</label>
            <a-input-number 
              v-model:value="length" 
              :min="1" 
              :max="20"
              style="width: 120px; margin-left: 8px;" 
            />
          </div>
          
          <a-button type="primary" @click="generate">
            生成序列号
          </a-button>
          
          <div v-if="result">
            <label>生成结果：</label>
            <a-input 
              :value="result" 
              readonly 
              style="margin-top: 8px; font-family: monospace;"
              :addon-after="result.length + ' 位'"
            />
          </div>
          
          <div v-if="history.length > 0">
            <label>历史记录：</label>
            <div style="margin-top: 8px;">
              <a-tag 
                v-for="(serial, index) in history" 
                :key="index" 
                style="margin: 2px; font-family: monospace;"
              >
                {{ serial }}
              </a-tag>
            </div>
          </div>
          
          <p style="color: #666; font-size: 12px; margin: 8px 0 0 0;">
            生成指定长度的数字序列号，不足位数会用0填充
          </p>
        </a-space>
      </div>
    `
  })
};

export const Comparison: Story = {
  name: '对比演示',
  parameters: {
    docs: {
      source: {
        code: `
import { randomString, randomNumber } from '@jetlinks-web/utils';

// 批量生成不同类型的随机值
const generateBatch = () => {
  const results = [];
  
  // 生成不同长度的字符串
  results.push({ type: '8位字符串', value: randomString(8) });
  results.push({ type: '16位字符串', value: randomString(16) });
  results.push({ type: '32位字符串', value: randomString(32) });
  
  // 生成随机数字
  results.push({ type: '随机数字', value: randomNumber() });
  
  return results;
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const results = ref([]);
      
      const generateBatch = () => {
        results.value = [
          { type: '8位字符串', value: randomString(8) },
          { type: '16位字符串', value: randomString(16) },
          { type: '32位字符串', value: randomString(32) },
          { type: '6位序列号', value: generateSerialNumber(6) },
          { type: '随机数字', value: randomNumber().toString() }
        ];
      };
      
      return { results, generateBatch };
    },
    template: `
      <div style="max-width: 600px;">
        <a-space direction="vertical" style="width: 100%;">
          <a-button type="primary" @click="generateBatch">
            批量生成随机值
          </a-button>
          
          <div v-if="results.length > 0">
            <a-table 
              :dataSource="results" 
              :columns="[
                { title: '类型', dataIndex: 'type', key: 'type' },
                { title: '生成值', dataIndex: 'value', key: 'value' }
              ]"
              :pagination="false"
              size="small"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'value'">
                  <code style="word-break: break-all;">{{ record.value }}</code>
                </template>
              </template>
            </a-table>
          </div>
          
          <p style="color: #666; font-size: 12px; margin: 8px 0 0 0;">
            演示不同类型随机值的生成效果
          </p>
        </a-space>
      </div>
    `
  })
};