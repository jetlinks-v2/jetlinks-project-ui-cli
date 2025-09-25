import type { Meta, StoryObj } from '@storybook/vue3';
import { 
  isArray, 
  isObject, 
  isString, 
  isFunction, 
  isDate, 
  isPromise, 
  isSymbol,
  isUndefined, 
  isBoolean, 
  isNumber, 
  isEmpty, 
  isElement, 
  isPropAbsent, 
  isStringNumber, 
  isWindow 
} from '../../packages/utils/src/type';

/**
 * 类型判断工具函数
 * 
 * 这里展示了项目中常用的类型判断函数的使用方法和示例。
 */
const meta: Meta = {
  title: '工具函数/类型判断',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
类型判断工具函数提供了一系列用于检测各种数据类型的方法。

### 主要特性
- 支持基础类型判断（string、number、boolean 等）
- 支持引用类型判断（array、object、function 等）
- 支持特殊值判断（empty、undefined、null 等）
- 支持浏览器对象判断（element、window 等）

### 基本用法

\`\`\`javascript
import { 
  isArray, 
  isObject, 
  isString, 
  isNumber, 
  isBoolean,
  isEmpty,
  isUndefined
} from '@jetlinks-web/utils';

// 基础类型判断
console.log(isString('hello')); // true
console.log(isNumber(123)); // true
console.log(isBoolean(true)); // true

// 引用类型判断
console.log(isArray([1, 2, 3])); // true
console.log(isObject({})); // true

// 特殊值判断
console.log(isEmpty('')); // true
console.log(isUndefined(undefined)); // true
\`\`\`

### 在 Vue 组件中使用

\`\`\`vue
<template>
  <div>
    <input v-model="inputValue" @input="checkType" />
    <p>类型: {{ valueType }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { isString, isNumber, isEmpty } from '@jetlinks-web/utils';

const inputValue = ref('');
const valueType = ref('');

const checkType = () => {
  const value = inputValue.value;
  if (isEmpty(value)) {
    valueType.value = '空值';
  } else if (isNumber(Number(value)) && !isNaN(Number(value))) {
    valueType.value = '数字';
  } else if (isString(value)) {
    valueType.value = '字符串';
  }
};
</script>
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

export const IsArray: Story = {
  name: '数组类型判断',
  parameters: {
    docs: {
      source: {
        code: `
import { isArray } from '@jetlinks-web/utils';

// 判断是否为数组
const checkArray = (value) => {
  return isArray(value);
};

console.log(checkArray([1, 2, 3])); // true
console.log(checkArray('hello')); // false
console.log(checkArray({})); // false
        `
      }
    }
  },
  render: () => ({
    setup() {
      const testValues = [
        { value: [1, 2, 3], label: '[1, 2, 3]' },
        { value: 'hello', label: '"hello"' },
        { value: {}, label: '{}' },
        { value: null, label: 'null' }
      ];
      
      return { testValues, isArray };
    },
    template: `
      <div>
        <h4>isArray 测试结果：</h4>
        <div v-for="test in testValues" :key="test.label" style="margin: 8px 0;">
          <code>isArray({{ test.label }})</code> = 
          <span :style="{ color: isArray(test.value) ? '#52c41a' : '#ff4d4f' }">
            {{ isArray(test.value) }}
          </span>
        </div>
      </div>
    `
  })
};

export const IsString: Story = {
  name: '字符串类型判断',
  parameters: {
    docs: {
      source: {
        code: `
import { isString } from '@jetlinks-web/utils';

// 判断是否为字符串
const checkString = (value) => {
  return isString(value);
};

console.log(checkString('hello')); // true
console.log(checkString(123)); // false
console.log(checkString(true)); // false
        `
      }
    }
  },
  render: () => ({
    setup() {
      const testValues = [
        { value: 'hello', label: '"hello"' },
        { value: 123, label: '123' },
        { value: true, label: 'true' },
        { value: [], label: '[]' }
      ];
      
      return { testValues, isString };
    },
    template: `
      <div>
        <h4>isString 测试结果：</h4>
        <div v-for="test in testValues" :key="test.label" style="margin: 8px 0;">
          <code>isString({{ test.label }})</code> = 
          <span :style="{ color: isString(test.value) ? '#52c41a' : '#ff4d4f' }">
            {{ isString(test.value) }}
          </span>
        </div>
      </div>
    `
  })
};

export const IsNumber: Story = {
  name: '数字类型判断',
  parameters: {
    docs: {
      source: {
        code: `
import { isNumber } from '@jetlinks-web/utils';

// 判断是否为数字
const checkNumber = (value) => {
  return isNumber(value);
};

console.log(checkNumber(123)); // true
console.log(checkNumber('123')); // false
console.log(checkNumber(NaN)); // true
        `
      }
    }
  },
  render: () => ({
    setup() {
      const testValues = [
        { value: 123, label: '123' },
        { value: '123', label: '"123"' },
        { value: NaN, label: 'NaN' },
        { value: 0, label: '0' }
      ];
      
      return { testValues, isNumber };
    },
    template: `
      <div>
        <h4>isNumber 测试结果：</h4>
        <div v-for="test in testValues" :key="test.label" style="margin: 8px 0;">
          <code>isNumber({{ test.label }})</code> = 
          <span :style="{ color: isNumber(test.value) ? '#52c41a' : '#ff4d4f' }">
            {{ isNumber(test.value) }}
          </span>
        </div>
      </div>
    `
  })
};

export const IsBoolean: Story = {
  name: '布尔类型判断',
  parameters: {
    docs: {
      source: {
        code: `
import { isBoolean } from '@jetlinks-web/utils';

// 判断是否为布尔值
const checkBoolean = (value) => {
  return isBoolean(value);
};

console.log(checkBoolean(true)); // true
console.log(checkBoolean(false)); // true
console.log(checkBoolean('true')); // false
        `
      }
    }
  },
  render: () => ({
    setup() {
      const testValues = [
        { value: true, label: 'true' },
        { value: false, label: 'false' },
        { value: 'true', label: '"true"' },
        { value: 1, label: '1' }
      ];
      
      return { testValues, isBoolean };
    },
    template: `
      <div>
        <h4>isBoolean 测试结果：</h4>
        <div v-for="test in testValues" :key="test.label" style="margin: 8px 0;">
          <code>isBoolean({{ test.label }})</code> = 
          <span :style="{ color: isBoolean(test.value) ? '#52c41a' : '#ff4d4f' }">
            {{ isBoolean(test.value) }}
          </span>
        </div>
      </div>
    `
  })
};

export const IsEmpty: Story = {
  name: '空值判断',
  parameters: {
    docs: {
      source: {
        code: `
import { isEmpty } from '@jetlinks-web/utils';

// 判断是否为空值
const checkEmpty = (value) => {
  return isEmpty(value);
};

console.log(checkEmpty('')); // true
console.log(checkEmpty([])); // true
console.log(checkEmpty({})); // true
console.log(checkEmpty(0)); // false
        `
      }
    }
  },
  render: () => ({
    setup() {
      const testValues = [
        { value: '', label: '""' },
        { value: [], label: '[]' },
        { value: {}, label: '{}' },
        { value: 0, label: '0' },
        { value: null, label: 'null' },
        { value: undefined, label: 'undefined' }
      ];
      
      return { testValues, isEmpty };
    },
    template: `
      <div>
        <h4>isEmpty 测试结果：</h4>
        <div v-for="test in testValues" :key="test.label" style="margin: 8px 0;">
          <code>isEmpty({{ test.label }})</code> = 
          <span :style="{ color: isEmpty(test.value) ? '#52c41a' : '#ff4d4f' }">
            {{ isEmpty(test.value) }}
          </span>
        </div>
      </div>
    `
  })
};

export const IsUndefined: Story = {
  name: 'undefined 判断',
  parameters: {
    docs: {
      source: {
        code: `
import { isUndefined } from '@jetlinks-web/utils';

// 判断是否为 undefined
const checkUndefined = (value) => {
  return isUndefined(value);
};

console.log(checkUndefined(undefined)); // true
console.log(checkUndefined(null)); // false
console.log(checkUndefined('')); // false
        `
      }
    }
  },
  render: () => ({
    setup() {
      const testValues = [
        { value: undefined, label: 'undefined' },
        { value: null, label: 'null' },
        { value: '', label: '""' },
        { value: 0, label: '0' }
      ];
      
      return { testValues, isUndefined };
    },
    template: `
      <div>
        <h4>isUndefined 测试结果：</h4>
        <div v-for="test in testValues" :key="test.label" style="margin: 8px 0;">
          <code>isUndefined({{ test.label }})</code> = 
          <span :style="{ color: isUndefined(test.value) ? '#52c41a' : '#ff4d4f' }">
            {{ isUndefined(test.value) }}
          </span>
        </div>
      </div>
    `
  })
};

export const IsStringNumber: Story = {
  name: '字符串数字判断',
  parameters: {
    docs: {
      source: {
        code: `
import { isStringNumber } from '@jetlinks-web/utils';

// 判断字符串是否为数字
const checkStringNumber = (value) => {
  return isStringNumber(value);
};

console.log(checkStringNumber('123')); // true
console.log(checkStringNumber('123.45')); // true
console.log(checkStringNumber('abc')); // false
        `
      }
    }
  },
  render: () => ({
    setup() {
      const testValues = [
        { value: '123', label: '"123"' },
        { value: '123.45', label: '"123.45"' },
        { value: 'abc', label: '"abc"' },
        { value: '0', label: '"0"' },
        { value: 123, label: '123 (number)' }
      ];
      
      return { testValues, isStringNumber };
    },
    template: `
      <div>
        <h4>isStringNumber 测试结果：</h4>
        <div v-for="test in testValues" :key="test.label" style="margin: 8px 0;">
          <code>isStringNumber({{ test.label }})</code> = 
          <span :style="{ color: isStringNumber(test.value) ? '#52c41a' : '#ff4d4f' }">
            {{ isStringNumber(test.value) }}
          </span>
        </div>
      </div>
    `
  })
};