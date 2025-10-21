import type { Meta, StoryObj } from '@storybook/vue3';
import { hexToRgb } from '../../packages/utils/src/util';
import { ref } from 'vue';

/**
 * 颜色转换工具
 * 
 * 提供16进制颜色转RGB格式的工具函数。
 */
const meta: Meta = {
  title: '工具函数/Color 颜色转换',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
颜色转换工具提供了16进制颜色码转换为RGB格式的功能。

### 主要特性
- 支持标准6位16进制颜色码（#RRGGBB）
- 支持简写3位16进制颜色码（#RGB）
- 自动验证颜色码格式
- 返回 "r, g, b" 格式的字符串

### 使用场景
- CSS颜色值转换
- 颜色计算和处理
- 主题颜色配置
- 图表颜色设置

### 基本用法

\`\`\`javascript
import { hexToRgb } from '@jetlinks-web/utils';

// 转换6位16进制颜色
const rgb1 = hexToRgb('#FF0000'); // "255, 0, 0"

// 转换3位16进制颜色（会自动扩展）
const rgb2 = hexToRgb('#F00');   // "255, 0, 0"

// 不带#号也支持
const rgb3 = hexToRgb('00FF00'); // "0, 255, 0"

// 无效格式返回null
const invalid = hexToRgb('invalid'); // null
\`\`\`
        `,
        source: {
          type: 'code'
        }
      }
    }
  },
  argTypes: {
    hexColor: {
      control: 'color',
      description: '16进制颜色值',
      defaultValue: '#FF0000'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: '基本转换',
  parameters: {
    docs: {
      source: {
        code: `
import { hexToRgb } from '@jetlinks-web/utils';

// 基本转换示例
const convertColor = (hexColor) => {
  const rgb = hexToRgb(hexColor);
  if (rgb) {
    console.log(\`RGB值: \${rgb}\`);
    return rgb;
  } else {
    console.log('无效的颜色格式');
    return null;
  }
};

// 使用示例
convertColor('#FF0000'); // "255, 0, 0"
convertColor('#00FF00'); // "0, 255, 0"
convertColor('#0000FF'); // "0, 0, 255"
        `
      }
    }
  },
  render: (args) => ({
    setup() {
      const inputColor = ref(args.hexColor || '#FF0000');
      const result = ref('');
      const isValid = ref(true);
      
      const convert = () => {
        const rgb = hexToRgb(inputColor.value);
        if (rgb) {
          result.value = rgb;
          isValid.value = true;
        } else {
          result.value = '';
          isValid.value = false;
        }
      };
      
      // 初始转换
      convert();
      
      return { inputColor, result, isValid, convert };
    },
    template: `
      <div style="max-width: 500px;">
        <a-space direction="vertical" style="width: 100%;">
          <div>
            <label>16进制颜色：</label>
            <a-input 
              v-model:value="inputColor" 
              placeholder="输入16进制颜色，如：#FF0000"
              style="margin-top: 8px;"
              @input="convert"
            />
          </div>
          
          <div>
            <label>颜色预览：</label>
            <div 
              :style="{ 
                width: '100px', 
                height: '50px', 
                backgroundColor: isValid ? inputColor : '#f5f5f5',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                fontSize: '12px'
              }"
            >
              {{ isValid ? '' : '无效颜色' }}
            </div>
          </div>
          
          <div v-if="isValid && result">
            <label>RGB 结果：</label>
            <a-input 
              :value="result" 
              readonly 
              style="margin-top: 8px; font-family: monospace;"
              addon-before="rgb("
              addon-after=")"
            />
          </div>
          
          <div v-if="!isValid">
            <a-alert 
              message="无效的颜色格式" 
              description="请输入有效的16进制颜色码，支持 #RRGGBB 或 #RGB 格式"
              type="error" 
              show-icon 
            />
          </div>
          
          <p style="color: #666; font-size: 12px; margin: 8px 0 0 0;">
            支持 #RRGGBB 和 #RGB 格式，自动验证并转换
          </p>
        </a-space>
      </div>
    `
  }),
  args: {
    hexColor: '#FF0000'
  }
};

export const PresetColors: Story = {
  name: '预设颜色',
  parameters: {
    docs: {
      source: {
        code: `
import { hexToRgb } from '@jetlinks-web/utils';

// 预设常用颜色转换
const presetColors = [
  { name: '红色', hex: '#FF0000' },
  { name: '绿色', hex: '#00FF00' },
  { name: '蓝色', hex: '#0000FF' },
  { name: '黄色', hex: '#FFFF00' },
  { name: '紫色', hex: '#800080' },
  { name: '橙色', hex: '#FFA500' },
];

presetColors.forEach(color => {
  const rgb = hexToRgb(color.hex);
  console.log(\`\${color.name}: \${rgb}\`);
});
        `
      }
    }
  },
  render: () => ({
    setup() {
      const colors = [
        { name: '红色', hex: '#FF0000' },
        { name: '绿色', hex: '#00FF00' },
        { name: '蓝色', hex: '#0000FF' },
        { name: '黄色', hex: '#FFFF00' },
        { name: '紫色', hex: '#800080' },
        { name: '橙色', hex: '#FFA500' },
        { name: '粉色', hex: '#FFC0CB' },
        { name: '青色', hex: '#00FFFF' }
      ];
      
      const convertedColors = colors.map(color => ({
        ...color,
        rgb: hexToRgb(color.hex)
      }));
      
      return { convertedColors };
    },
    template: `
      <div style="max-width: 600px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
          <div 
            v-for="color in convertedColors" 
            :key="color.hex"
            style="border: 1px solid #d9d9d9; border-radius: 8px; overflow: hidden;"
          >
            <div 
              :style="{ 
                backgroundColor: color.hex, 
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                fontWeight: 'bold'
              }"
            >
              {{ color.name }}
            </div>
            <div style="padding: 12px;">
              <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                HEX: <code>{{ color.hex }}</code>
              </div>
              <div style="font-size: 12px; color: #666;">
                RGB: <code>{{ color.rgb }}</code>
              </div>
            </div>
          </div>
        </div>
        
        <p style="color: #666; font-size: 12px; margin: 16px 0 0 0; text-align: center;">
          常用颜色的16进制到RGB转换示例
        </p>
      </div>
    `
  })
};

export const ShortFormat: Story = {
  name: '简写格式支持',
  parameters: {
    docs: {
      source: {
        code: `
import { hexToRgb } from '@jetlinks-web/utils';

// 3位简写格式会自动扩展为6位
const examples = [
  { short: '#F00', expanded: '#FF0000' },
  { short: '#0F0', expanded: '#00FF00' },
  { short: '#00F', expanded: '#0000FF' },
  { short: '#FFF', expanded: '#FFFFFF' },
  { short: '#000', expanded: '#000000' }
];

examples.forEach(({ short, expanded }) => {
  const rgbShort = hexToRgb(short);
  const rgbExpanded = hexToRgb(expanded);
  
  console.log(\`\${short} -> \${rgbShort}\`);
  console.log(\`\${expanded} -> \${rgbExpanded}\`);
  console.log('结果相同:', rgbShort === rgbExpanded);
});
        `
      }
    }
  },
  render: () => ({
    setup() {
      const examples = [
        { short: '#F00', expanded: '#FF0000', name: '红色' },
        { short: '#0F0', expanded: '#00FF00', name: '绿色' },
        { short: '#00F', expanded: '#0000FF', name: '蓝色' },
        { short: '#FFF', expanded: '#FFFFFF', name: '白色' },
        { short: '#000', expanded: '#000000', name: '黑色' }
      ];
      
      const results = examples.map(item => ({
        ...item,
        shortRgb: hexToRgb(item.short),
        expandedRgb: hexToRgb(item.expanded),
        same: hexToRgb(item.short) === hexToRgb(item.expanded)
      }));
      
      return { results };
    },
    template: `
      <div style="max-width: 700px;">
        <a-table 
          :dataSource="results" 
          :columns="[
            { title: '颜色', dataIndex: 'name', key: 'name', width: 80 },
            { title: '简写格式', dataIndex: 'short', key: 'short', width: 100 },
            { title: '完整格式', dataIndex: 'expanded', key: 'expanded', width: 120 },
            { title: 'RGB结果', dataIndex: 'shortRgb', key: 'rgb', width: 120 },
            { title: '结果一致', dataIndex: 'same', key: 'same', width: 100 }
          ]"
          :pagination="false"
          size="small"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'short' || column.key === 'expanded'">
              <div style="display: flex; align-items: center; gap: 8px;">
                <div 
                  :style="{ 
                    width: '20px', 
                    height: '20px', 
                    backgroundColor: record[column.key],
                    border: '1px solid #d9d9d9',
                    borderRadius: '3px'
                  }"
                ></div>
                <code>{{ record[column.key] }}</code>
              </div>
            </template>
            <template v-else-if="column.key === 'rgb'">
              <code>{{ record.shortRgb }}</code>
            </template>
            <template v-else-if="column.key === 'same'">
              <a-tag :color="record.same ? 'green' : 'red'">
                {{ record.same ? '✓ 一致' : '✗ 不一致' }}
              </a-tag>
            </template>
          </template>
        </a-table>
        
        <p style="color: #666; font-size: 12px; margin: 16px 0 0 0;">
          3位简写格式（#RGB）会自动扩展为6位格式（#RRGGBB），转换结果完全一致
        </p>
      </div>
    `
  })
};