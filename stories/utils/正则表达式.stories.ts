import type { Meta, StoryObj } from '@storybook/vue3';
import { regular } from '../../packages/utils/src/regular';
import { ref } from 'vue';

/**
 * 工具函数
 * 
 * 这里展示了项目中常用的正则表达式验证函数的使用方法和示例。
 */
const meta: Meta = {
  title: '工具函数/Regular 正则表达式',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
regular 是一个包含常用正则表达式验证方法的工具对象，提供了多种类型的数据验证功能。

### 主要特性
- 包含多种常用的正则表达式模式
- 提供对应的验证方法
- 支持 URL、邮箱、手机号、IP地址等格式验证
- 包含密码强度、字符类型等验证

### 验证类型
- URL 地址验证
- 邮箱地址验证  
- 手机号码验证
- IP 地址验证
- 密码强度验证
- 中英文字符验证
- 数字字母验证
- 颜色格式验证

### 基本用法

\`\`\`javascript
import { regular } from '@jetlinks-web/utils';

// URL 验证
const isValidUrl = regular.isUrl('https://www.example.com');

// 邮箱验证
const isValidEmail = regular.isEmail('user@example.com');

// 手机号验证
const isValidPhone = regular.isCellphone('13800138000');

// IP 地址验证
const isValidIp = regular.isIpReg('192.168.1.1');
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

export const UrlValidation: Story = {
  name: 'URL 地址验证',
  parameters: {
    docs: {
      source: {
        code: `
import { regular } from '@jetlinks-web/utils';

// URL 验证示例
const urlInput = ref('');
const isValid = ref(false);

const validateUrl = () => {
  isValid.value = regular.isUrl(urlInput.value);
};

// 在模板中使用
<template>
  <div>
    <a-input 
      v-model:value="urlInput" 
      placeholder="请输入 URL 地址"
      @input="validateUrl"
    />
    <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f' }">
      验证结果: {{ isValid ? '有效的 URL' : '无效的 URL' }}
    </p>
  </div>
</template>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const urlInput = ref('https://www.example.com');
      const isValid = ref(true);
      
      const validateUrl = () => {
        isValid.value = regular.isUrl(urlInput.value);
      };
      
      return { urlInput, isValid, validateUrl };
    },
    template: `
      <div style="width: 300px;">
        <a-input 
          v-model:value="urlInput" 
          placeholder="请输入 URL 地址"
          @input="validateUrl"
        />
        <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f', marginTop: '8px' }">
          验证结果: {{ isValid ? '✅ 有效的 URL' : '❌ 无效的 URL' }}
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 8px;">
          示例: https://www.example.com
        </p>
      </div>
    `
  })
};

export const EmailValidation: Story = {
  name: '邮箱地址验证',
  parameters: {
    docs: {
      source: {
        code: `
import { regular } from '@jetlinks-web/utils';

// 邮箱验证示例
const emailInput = ref('');
const isValid = ref(false);

const validateEmail = () => {
  isValid.value = regular.isEmail(emailInput.value);
};

// 在模板中使用
<template>
  <div>
    <a-input 
      v-model:value="emailInput" 
      placeholder="请输入邮箱地址"
      @input="validateEmail"
    />
    <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f' }">
      验证结果: {{ isValid ? '有效的邮箱' : '无效的邮箱' }}
    </p>
  </div>
</template>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const emailInput = ref('user@example.com');
      const isValid = ref(true);
      
      const validateEmail = () => {
        isValid.value = regular.isEmail(emailInput.value);
      };
      
      return { emailInput, isValid, validateEmail };
    },
    template: `
      <div style="width: 300px;">
        <a-input 
          v-model:value="emailInput" 
          placeholder="请输入邮箱地址"
          @input="validateEmail"
        />
        <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f', marginTop: '8px' }">
          验证结果: {{ isValid ? '✅ 有效的邮箱' : '❌ 无效的邮箱' }}
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 8px;">
          示例: user@example.com
        </p>
      </div>
    `
  })
};

export const PhoneValidation: Story = {
  name: '手机号码验证',
  parameters: {
    docs: {
      source: {
        code: `
import { regular } from '@jetlinks-web/utils';

// 手机号验证示例
const phoneInput = ref('');
const isValid = ref(false);

const validatePhone = () => {
  isValid.value = regular.isCellphone(phoneInput.value);
};

// 在模板中使用
<template>
  <div>
    <a-input 
      v-model:value="phoneInput" 
      placeholder="请输入手机号码"
      @input="validatePhone"
    />
    <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f' }">
      验证结果: {{ isValid ? '有效的手机号' : '无效的手机号' }}
    </p>
  </div>
</template>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const phoneInput = ref('13800138000');
      const isValid = ref(true);
      
      const validatePhone = () => {
        isValid.value = regular.isCellphone(phoneInput.value);
      };
      
      return { phoneInput, isValid, validatePhone };
    },
    template: `
      <div style="width: 300px;">
        <a-input 
          v-model:value="phoneInput" 
          placeholder="请输入手机号码"
          @input="validatePhone"
        />
        <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f', marginTop: '8px' }">
          验证结果: {{ isValid ? '✅ 有效的手机号' : '❌ 无效的手机号' }}
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 8px;">
          示例: 13800138000
        </p>
      </div>
    `
  })
};

export const IpValidation: Story = {
  name: 'IP 地址验证',
  parameters: {
    docs: {
      source: {
        code: `
import { regular } from '@jetlinks-web/utils';

// IP 地址验证示例
const ipInput = ref('');
const isValid = ref(false);

const validateIp = () => {
  isValid.value = regular.isIpReg(ipInput.value);
};

// 在模板中使用
<template>
  <div>
    <a-input 
      v-model:value="ipInput" 
      placeholder="请输入 IP 地址"
      @input="validateIp"
    />
    <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f' }">
      验证结果: {{ isValid ? '有效的 IP 地址' : '无效的 IP 地址' }}
    </p>
  </div>
</template>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const ipInput = ref('192.168.1.1');
      const isValid = ref(true);
      
      const validateIp = () => {
        isValid.value = regular.isIpReg(ipInput.value);
      };
      
      return { ipInput, isValid, validateIp };
    },
    template: `
      <div style="width: 300px;">
        <a-input 
          v-model:value="ipInput" 
          placeholder="请输入 IP 地址"
          @input="validateIp"
        />
        <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f', marginTop: '8px' }">
          验证结果: {{ isValid ? '✅ 有效的 IP 地址' : '❌ 无效的 IP 地址' }}
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 8px;">
          示例: 192.168.1.1
        </p>
      </div>
    `
  })
};

export const PasswordValidation: Story = {
  name: '密码强度验证',
  parameters: {
    docs: {
      source: {
        code: `
import { regular } from '@jetlinks-web/utils';

// 密码强度验证示例（必须包含大小写英文和数字，至少8位）
const passwordInput = ref('');
const isValid = ref(false);

const validatePassword = () => {
  isValid.value = regular.isPassword(passwordInput.value);
};

// 在模板中使用
<template>
  <div>
    <a-input-password 
      v-model:value="passwordInput" 
      placeholder="请输入密码"
      @input="validatePassword"
    />
    <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f' }">
      验证结果: {{ isValid ? '密码强度符合要求' : '密码强度不符合要求' }}
    </p>
  </div>
</template>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const passwordInput = ref('Password123');
      const isValid = ref(true);
      
      const validatePassword = () => {
        isValid.value = regular.isPassword(passwordInput.value);
      };
      
      return { passwordInput, isValid, validatePassword };
    },
    template: `
      <div style="width: 300px;">
        <a-input-password 
          v-model:value="passwordInput" 
          placeholder="请输入密码"
          @input="validatePassword"
        />
        <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f', marginTop: '8px' }">
          验证结果: {{ isValid ? '✅ 密码强度符合要求' : '❌ 密码强度不符合要求' }}
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 8px;">
          要求: 至少8位，包含大小写英文和数字<br/>
          示例: Password123
        </p>
      </div>
    `
  })
};

export const ColorValidation: Story = {
  name: '颜色格式验证',
  parameters: {
    docs: {
      source: {
        code: `
import { regular } from '@jetlinks-web/utils';

// 颜色格式验证示例（支持 HEX 格式）
const colorInput = ref('');
const isValid = ref(false);

const validateColor = () => {
  isValid.value = regular.isColorReg(colorInput.value);
};

// 在模板中使用
<template>
  <div>
    <a-input 
      v-model:value="colorInput" 
      placeholder="请输入颜色值"
      @input="validateColor"
    />
    <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f' }">
      验证结果: {{ isValid ? '有效的颜色格式' : '无效的颜色格式' }}
    </p>
  </div>
</template>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const colorInput = ref('#FF5733');
      const isValid = ref(true);
      
      const validateColor = () => {
        isValid.value = regular.isColorReg(colorInput.value);
      };
      
      return { colorInput, isValid, validateColor };
    },
    template: `
      <div style="width: 300px;">
        <a-input 
          v-model:value="colorInput" 
          placeholder="请输入颜色值"
          @input="validateColor"
        />
        <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f', marginTop: '8px' }">
          验证结果: {{ isValid ? '✅ 有效的颜色格式' : '❌ 无效的颜色格式' }}
        </p>
        <div v-if="isValid" :style="{ 
          width: '30px', 
          height: '30px', 
          backgroundColor: colorInput,
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          marginTop: '8px'
        }"></div>
        <p style="color: #666; font-size: 12px; margin-top: 8px;">
          支持格式: #FF5733 或 #F73 或 FF5733
        </p>
      </div>
    `
  })
};

export const EnglishOrNumberValidation: Story = {
  name: '英文或数字验证',
  parameters: {
    docs: {
      source: {
        code: `
import { regular } from '@jetlinks-web/utils';

// 英文或数字验证示例
const input = ref('');
const isValid = ref(false);

const validate = () => {
  isValid.value = regular.isEnglishOrNumber(input.value);
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const input = ref('abc123');
      const isValid = ref(true);
      
      const validate = () => {
        isValid.value = regular.isEnglishOrNumber(input.value);
      };
      
      return { input, isValid, validate };
    },
    template: `
      <div style="width: 300px;">
        <a-input 
          v-model:value="input" 
          placeholder="请输入英文或数字"
          @input="validate"
        />
        <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f', marginTop: '8px' }">
          验证结果: {{ isValid ? '✅ 有效格式' : '❌ 无效格式' }}
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 8px;">
          只允许英文字母和数字<br/>
          示例: abc123
        </p>
      </div>
    `
  })
};

export const CronValidation: Story = {
  name: 'Cron 表达式验证',
  parameters: {
    docs: {
      source: {
        code: `
import { regular } from '@jetlinks-web/utils';

// Cron 表达式验证示例
const cronInput = ref('');
const isValid = ref(false);

const validateCron = () => {
  isValid.value = regular.isCronReg(cronInput.value);
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const cronInput = ref('0 0 12 * * ?');
      const isValid = ref(true);
      
      const validateCron = () => {
        isValid.value = regular.isCronReg(cronInput.value);
      };
      
      return { cronInput, isValid, validateCron };
    },
    template: `
      <div style="width: 300px;">
        <a-input 
          v-model:value="cronInput" 
          placeholder="请输入 Cron 表达式"
          @input="validateCron"
        />
        <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f', marginTop: '8px' }">
          验证结果: {{ isValid ? '✅ 有效的 Cron 表达式' : '❌ 无效的 Cron 表达式' }}
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 8px;">
          示例: 0 0 12 * * ? (每天中午12点执行)
        </p>
      </div>
    `
  })
};

export const EnglishValidation: Story = {
  name: '英文字符验证',
  parameters: {
    docs: {
      source: {
        code: `
import { regular } from '@jetlinks-web/utils';

// 英文字符验证示例
const englishInput = ref('');
const isValid = ref(false);

const validateEnglish = () => {
  isValid.value = regular.isEnglish(englishInput.value);
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const englishInput = ref('Hello');
      const isValid = ref(true);
      
      const validateEnglish = () => {
        isValid.value = regular.isEnglish(englishInput.value);
      };
      
      return { englishInput, isValid, validateEnglish };
    },
    template: `
      <div style="width: 300px;">
        <a-input 
          v-model:value="englishInput" 
          placeholder="请输入英文字符"
          @input="validateEnglish"
        />
        <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f', marginTop: '8px' }">
          验证结果: {{ isValid ? '✅ 有效的英文字符' : '❌ 无效的英文字符' }}
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 8px;">
          只允许英文字母<br/>
          示例: Hello
        </p>
      </div>
    `
  })
};

export const ChineseValidation: Story = {
  name: '中文字符验证',
  parameters: {
    docs: {
      source: {
        code: `
import { regular } from '@jetlinks-web/utils';

// 中文字符验证示例
const chineseInput = ref('');
const isValid = ref(false);

const validateChinese = () => {
  isValid.value = regular.isChinese(chineseInput.value);
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const chineseInput = ref('你好世界');
      const isValid = ref(true);
      
      const validateChinese = () => {
        isValid.value = regular.isChinese(chineseInput.value);
      };
      
      return { chineseInput, isValid, validateChinese };
    },
    template: `
      <div style="width: 300px;">
        <a-input 
          v-model:value="chineseInput" 
          placeholder="请输入中文字符"
          @input="validateChinese"
        />
        <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f', marginTop: '8px' }">
          验证结果: {{ isValid ? '✅ 有效的中文字符' : '❌ 无效的中文字符' }}
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 8px;">
          只允许中文字符<br/>
          示例: 你好世界
        </p>
      </div>
    `
  })
};

export const TelephoneValidation: Story = {
  name: '座机号码验证',
  parameters: {
    docs: {
      source: {
        code: `
import { regular } from '@jetlinks-web/utils';

// 座机号码验证示例
const telephoneInput = ref('');
const isValid = ref(false);

const validateTelephone = () => {
  isValid.value = regular.isTelephone(telephoneInput.value);
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const telephoneInput = ref('010-12345678');
      const isValid = ref(true);
      
      const validateTelephone = () => {
        isValid.value = regular.isTelephone(telephoneInput.value);
      };
      
      return { telephoneInput, isValid, validateTelephone };
    },
    template: `
      <div style="width: 300px;">
        <a-input 
          v-model:value="telephoneInput" 
          placeholder="请输入座机号码"
          @input="validateTelephone"
        />
        <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f', marginTop: '8px' }">
          验证结果: {{ isValid ? '✅ 有效的座机号码' : '❌ 无效的座机号码' }}
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 8px;">
          示例: 010-12345678
        </p>
      </div>
    `
  })
};

export const Ipv6Validation: Story = {
  name: 'IPv6 地址验证',
  parameters: {
    docs: {
      source: {
        code: `
import { regular } from '@jetlinks-web/utils';

// IPv6 地址验证示例
const ipv6Input = ref('');
const isValid = ref(false);

const validateIpv6 = () => {
  isValid.value = regular.isIpv6(ipv6Input.value);
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const ipv6Input = ref('2001:0db8:85a3:0000:0000:8a2e:0370:7334');
      const isValid = ref(true);
      
      const validateIpv6 = () => {
        isValid.value = regular.isIpv6(ipv6Input.value);
      };
      
      return { ipv6Input, isValid, validateIpv6 };
    },
    template: `
      <div style="width: 300px;">
        <a-input 
          v-model:value="ipv6Input" 
          placeholder="请输入 IPv6 地址"
          @input="validateIpv6"
        />
        <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f', marginTop: '8px' }">
          验证结果: {{ isValid ? '✅ 有效的 IPv6 地址' : '❌ 无效的 IPv6 地址' }}
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 8px;">
          示例: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
        </p>
      </div>
    `
  })
};

export const DomainValidation: Story = {
  name: '域名验证',
  parameters: {
    docs: {
      source: {
        code: `
import { regular } from '@jetlinks-web/utils';

// 域名验证示例
const domainInput = ref('');
const isValid = ref(false);

const validateDomain = () => {
  isValid.value = regular.isDomain(domainInput.value);
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const domainInput = ref('example.com');
      const isValid = ref(true);
      
      const validateDomain = () => {
        isValid.value = regular.isDomain(domainInput.value);
      };
      
      return { domainInput, isValid, validateDomain };
    },
    template: `
      <div style="width: 300px;">
        <a-input 
          v-model:value="domainInput" 
          placeholder="请输入域名"
          @input="validateDomain"
        />
        <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f', marginTop: '8px' }">
          验证结果: {{ isValid ? '✅ 有效的域名' : '❌ 无效的域名' }}
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 8px;">
          示例: example.com
        </p>
      </div>
    `
  })
};

export const InputValidation: Story = {
  name: '输入格式验证',
  parameters: {
    docs: {
      source: {
        code: `
import { regular } from '@jetlinks-web/utils';

// 输入格式验证示例（小写字母开头，数字字母下划线）
const inputValue = ref('');
const isValid = ref(false);

const validateInput = () => {
  isValid.value = regular.isInputReg(inputValue.value);
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const inputValue = ref('variable_name123');
      const isValid = ref(true);
      
      const validateInput = () => {
        isValid.value = regular.isInputReg(inputValue.value);
      };
      
      return { inputValue, isValid, validateInput };
    },
    template: `
      <div style="width: 300px;">
        <a-input 
          v-model:value="inputValue" 
          placeholder="请输入变量名"
          @input="validateInput"
        />
        <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f', marginTop: '8px' }">
          验证结果: {{ isValid ? '✅ 有效的变量名' : '❌ 无效的变量名' }}
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 8px;">
          小写字母开头，可包含数字、字母、下划线<br/>
          示例: variable_name123
        </p>
      </div>
    `
  })
};

export const ModalValidation: Story = {
  name: '标识符验证',
  parameters: {
    docs: {
      source: {
        code: `
import { regular } from '@jetlinks-web/utils';

// 标识符验证示例（字母开头，数字字母下划线）
const modalInput = ref('');
const isValid = ref(false);

const validateModal = () => {
  isValid.value = regular.isModalReg(modalInput.value);
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const modalInput = ref('VariableName123');
      const isValid = ref(true);
      
      const validateModal = () => {
        isValid.value = regular.isModalReg(modalInput.value);
      };
      
      return { modalInput, isValid, validateModal };
    },
    template: `
      <div style="width: 300px;">
        <a-input 
          v-model:value="modalInput" 
          placeholder="请输入标识符"
          @input="validateModal"
        />
        <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f', marginTop: '8px' }">
          验证结果: {{ isValid ? '✅ 有效的标识符' : '❌ 无效的标识符' }}
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 8px;">
          字母开头，可包含数字、字母、下划线<br/>
          示例: VariableName123
        </p>
      </div>
    `
  })
};

export const TextValidation: Story = {
  name: '中文文本验证',
  parameters: {
    docs: {
      source: {
        code: `
import { regular } from '@jetlinks-web/utils';

// 中文文本验证示例
const textInput = ref('');
const isValid = ref(false);

const validateText = () => {
  isValid.value = regular.isTextReg(textInput.value);
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const textInput = ref('这是中文文本');
      const isValid = ref(true);
      
      const validateText = () => {
        isValid.value = regular.isTextReg(textInput.value);
      };
      
      return { textInput, isValid, validateText };
    },
    template: `
      <div style="width: 300px;">
        <a-input 
          v-model:value="textInput" 
          placeholder="请输入中文文本"
          @input="validateText"
        />
        <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f', marginTop: '8px' }">
          验证结果: {{ isValid ? '✅ 有效的中文文本' : '❌ 无效的中文文本' }}
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 8px;">
          只允许中文字符或空字符串<br/>
          示例: 这是中文文本
        </p>
      </div>
    `
  })
};

export const SqlValidation: Story = {
  name: 'SQL 语句验证',
  parameters: {
    docs: {
      source: {
        code: `
import { regular } from '@jetlinks-web/utils';

// SQL 语句验证示例
const sqlInput = ref('');
const isValid = ref(false);

const validateSql = () => {
  isValid.value = regular.isSql(sqlInput.value);
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const sqlInput = ref('SELECT * FROM users WHERE id = 1');
      const isValid = ref(true);
      
      const validateSql = () => {
        isValid.value = regular.isSql(sqlInput.value);
      };
      
      return { sqlInput, isValid, validateSql };
    },
    template: `
      <div style="width: 300px;">
        <a-textarea 
          v-model:value="sqlInput" 
          placeholder="请输入 SQL 语句"
          @input="validateSql"
          :rows="3"
        />
        <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f', marginTop: '8px' }">
          验证结果: {{ isValid ? '✅ 有效的 SQL 语句' : '❌ 无效的 SQL 语句' }}
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 8px;">
          示例: SELECT * FROM users WHERE id = 1
        </p>
      </div>
    `
  })
};

export const ImageValidation: Story = {
  name: '图片格式验证',
  parameters: {
    docs: {
      source: {
        code: `
import { regular } from '@jetlinks-web/utils';

// 图片格式验证示例
const imgInput = ref('');
const isValid = ref(false);

const validateImg = () => {
  isValid.value = regular.isImg(imgInput.value);
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const imgInput = ref('image.jpg');
      const isValid = ref(true);
      
      const validateImg = () => {
        isValid.value = regular.isImg(imgInput.value);
      };
      
      return { imgInput, isValid, validateImg };
    },
    template: `
      <div style="width: 300px;">
        <a-input 
          v-model:value="imgInput" 
          placeholder="请输入图片文件名"
          @input="validateImg"
        />
        <p :style="{ color: isValid ? '#52c41a' : '#ff4d4f', marginTop: '8px' }">
          验证结果: {{ isValid ? '✅ 有效的图片格式' : '❌ 无效的图片格式' }}
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 8px;">
          支持格式: png, jpg, jpeg, svg, webp, gif, bmp<br/>
          示例: image.jpg
        </p>
      </div>
    `
  })
};