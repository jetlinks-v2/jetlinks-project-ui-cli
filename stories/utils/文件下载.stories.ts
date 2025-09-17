import type { Meta, StoryObj } from '@storybook/vue3';
import { downloadFileByUrl, downloadBlob, downloadJson, buildScriptTag } from '../../packages/utils/src/document';

/**
 * 文档工具函数
 * 
 * 这里展示了项目中文档相关的工具函数的使用方法和示例。
 */
const meta: Meta = {
  title: '工具函数/Document 文件下载',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
文档工具函数提供了文件下载、脚本标签创建等功能。

### 主要功能
- 通过URL下载文件
- Blob数据下载
- JSON数据下载
- 动态创建script标签

### 使用场景
- 文件导出功能
- 报表下载
- 配置文件导出
- 动态加载脚本

### 基本用法

\`\`\`javascript
import { downloadFileByUrl, downloadBlob, downloadJson, buildScriptTag } from '@jetlinks-web/utils';

// 通过URL下载文件
downloadFileByUrl('https://example.com/file.pdf', '文档', 'pdf');

// Blob数据下载
const data = new Blob(['Hello World'], { type: 'text/plain' });
downloadBlob(data, '文本文件', 'txt');

// JSON数据下载
const jsonData = { name: '张三', age: 25 };
downloadJson(jsonData, '用户数据');

// 创建script标签
const script = buildScriptTag('https://cdn.example.com/library.js');
document.head.appendChild(script);
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

export const DownloadByUrl: Story = {
  name: 'URL文件下载',
  parameters: {
    docs: {
      source: {
        code: `
import { downloadFileByUrl } from '@jetlinks-web/utils';

// 下载PDF文件
const downloadPdf = () => {
  downloadFileByUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '示例文档', 'pdf');
};

// 下载图片文件
const downloadImage = () => {
  downloadFileByUrl('https://via.placeholder.com/300x200', '示例图片', 'png');
};

// 在模板中使用
<a-button type="primary" @click="downloadPdf">
  下载PDF文件
</a-button>
<a-button @click="downloadImage">
  下载图片
</a-button>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const downloadPdf = () => {
        downloadFileByUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '示例文档', 'pdf');
      };
      
      const downloadImage = () => {
        downloadFileByUrl('https://via.placeholder.com/300x200', '示例图片', 'png');
      };
      
      return { downloadPdf, downloadImage };
    },
    template: `
      <div>
        <a-space direction="vertical" style="width: 100%;">
          <div>
            <a-button type="primary" @click="downloadPdf">
              下载PDF文件
            </a-button>
            <p style="margin: 8px 0; color: #666; font-size: 12px;">
              点击下载一个示例PDF文件
            </p>
          </div>
          
          <div>
            <a-button @click="downloadImage">
              下载图片
            </a-button>
            <p style="margin: 8px 0; color: #666; font-size: 12px;">
              点击下载一个示例图片文件
            </p>
          </div>
        </a-space>
      </div>
    `
  })
};

export const DownloadBlob: Story = {
  name: 'Blob数据下载',
  parameters: {
    docs: {
      source: {
        code: `
import { downloadBlob } from '@jetlinks-web/utils';

// 下载文本文件
const downloadText = () => {
  const textData = '这是一个文本文件的内容\\n第二行内容\\n第三行内容';
  downloadBlob(textData, '文本文件', 'txt');
};

// 下载CSV文件
const downloadCsv = () => {
  const csvData = 'name,age,city\\n张三,25,北京\\n李四,30,上海\\n王五,28,广州';
  downloadBlob(csvData, '用户数据', 'csv');
};

// 在模板中使用
<a-button type="primary" @click="downloadText">
  下载文本文件
</a-button>
<a-button @click="downloadCsv">
  下载CSV文件
</a-button>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const downloadText = () => {
        const textData = '这是一个文本文件的内容\n第二行内容\n第三行内容';
        downloadBlob(textData, '文本文件', 'txt');
      };
      
      const downloadCsv = () => {
        const csvData = 'name,age,city\n张三,25,北京\n李四,30,上海\n王五,28,广州';
        downloadBlob(csvData, '用户数据', 'csv');
      };
      
      return { downloadText, downloadCsv };
    },
    template: `
      <div>
        <a-space direction="vertical" style="width: 100%;">
          <div>
            <a-button type="primary" @click="downloadText">
              下载文本文件
            </a-button>
            <p style="margin: 8px 0; color: #666; font-size: 12px;">
              下载包含多行文本内容的txt文件
            </p>
          </div>
          
          <div>
            <a-button @click="downloadCsv">
              下载CSV文件
            </a-button>
            <p style="margin: 8px 0; color: #666; font-size: 12px;">
              下载包含用户数据的CSV文件
            </p>
          </div>
        </a-space>
      </div>
    `
  })
};

export const DownloadJson: Story = {
  name: 'JSON数据下载',
  parameters: {
    docs: {
      source: {
        code: `
import { downloadJson } from '@jetlinks-web/utils';

// 下载用户配置
const downloadConfig = () => {
  const config = {
    theme: 'dark',
    language: 'zh-CN',
    notifications: {
      email: true,
      push: false,
      sms: true
    },
    user: {
      name: '张三',
      role: 'admin',
      permissions: ['read', 'write', 'delete']
    }
  };
  downloadJson(config, '用户配置');
};

// 下载数据列表
const downloadDataList = () => {
  const dataList = [
    { id: 1, name: '产品A', price: 199.99, category: '电子产品' },
    { id: 2, name: '产品B', price: 299.99, category: '家居用品' },
    { id: 3, name: '产品C', price: 99.99, category: '服装鞋帽' }
  ];
  downloadJson(dataList, '产品列表');
};

// 在模板中使用
<a-button type="primary" @click="downloadConfig">
  下载配置文件
</a-button>
<a-button @click="downloadDataList">
  下载数据列表
</a-button>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const downloadConfig = () => {
        const config = {
          theme: 'dark',
          language: 'zh-CN',
          notifications: {
            email: true,
            push: false,
            sms: true
          },
          user: {
            name: '张三',
            role: 'admin',
            permissions: ['read', 'write', 'delete']
          }
        };
        downloadJson(config, '用户配置');
      };
      
      const downloadDataList = () => {
        const dataList = [
          { id: 1, name: '产品A', price: 199.99, category: '电子产品' },
          { id: 2, name: '产品B', price: 299.99, category: '家居用品' },
          { id: 3, name: '产品C', price: 99.99, category: '服装鞋帽' }
        ];
        downloadJson(dataList, '产品列表');
      };
      
      return { downloadConfig, downloadDataList };
    },
    template: `
      <div>
        <a-space direction="vertical" style="width: 100%;">
          <div>
            <a-button type="primary" @click="downloadConfig">
              下载配置文件
            </a-button>
            <p style="margin: 8px 0; color: #666; font-size: 12px;">
              下载包含用户配置信息的JSON文件，文件名会自动添加日期后缀
            </p>
          </div>
          
          <div>
            <a-button @click="downloadDataList">
              下载数据列表
            </a-button>
            <p style="margin: 8px 0; color: #666; font-size: 12px;">
              下载包含产品数据的JSON文件列表
            </p>
          </div>
        </a-space>
      </div>
    `
  })
};

export const BuildScript: Story = {
  name: '创建脚本标签',
  parameters: {
    docs: {
      source: {
        code: `
import { buildScriptTag } from '@jetlinks-web/utils';

// 动态加载外部脚本
const loadScript = () => {
  const script = buildScriptTag('https://unpkg.com/dayjs@1.11.10/dayjs.min.js');
  
  script.onload = () => {
    console.log('脚本加载成功');
    // 这里可以使用已加载的库
  };
  
  script.onerror = () => {
    console.error('脚本加载失败');
  };
  
  document.head.appendChild(script);
};

// 加载多个脚本
const loadMultipleScripts = () => {
  const scripts = [
    'https://unpkg.com/lodash@4.17.21/lodash.min.js',
    'https://unpkg.com/axios@1.6.0/dist/axios.min.js'
  ];
  
  scripts.forEach(src => {
    const script = buildScriptTag(src);
    document.head.appendChild(script);
  });
};

// 在模板中使用
<a-button type="primary" @click="loadScript">
  加载外部脚本
</a-button>
<a-button @click="loadMultipleScripts">
  加载多个脚本
</a-button>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const loadScript = () => {
        const script = buildScriptTag('https://unpkg.com/dayjs@1.11.10/dayjs.min.js');
        
        script.onload = () => {
          console.log('dayjs脚本加载成功');
        };
        
        script.onerror = () => {
          console.error('dayjs脚本加载失败');
        };
        
        document.head.appendChild(script);
      };
      
      const loadMultipleScripts = () => {
        const scripts = [
          'https://unpkg.com/lodash@4.17.21/lodash.min.js',
          'https://unpkg.com/axios@1.6.0/dist/axios.min.js'
        ];
        
        scripts.forEach(src => {
          const script = buildScriptTag(src);
          script.onload = () => {
            console.log(`脚本 ${src} 加载成功`);
          };
          document.head.appendChild(script);
        });
      };
      
      return { loadScript, loadMultipleScripts };
    },
    template: `
      <div>
        <a-space direction="vertical" style="width: 100%;">
          <div>
            <a-button type="primary" @click="loadScript">
              加载DayJS脚本
            </a-button>
            <p style="margin: 8px 0; color: #666; font-size: 12px;">
              动态加载dayjs库，加载结果会在控制台输出
            </p>
          </div>
          
          <div>
            <a-button @click="loadMultipleScripts">
              加载多个脚本
            </a-button>
            <p style="margin: 8px 0; color: #666; font-size: 12px;">
              同时加载lodash和axios库，加载结果会在控制台输出
            </p>
          </div>
        </a-space>
      </div>
    `
  })
};