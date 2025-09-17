import type { Meta, StoryObj } from '@storybook/vue3';
import { getBase64ByImg, getImage } from '../../packages/utils/src/util';
import { ref } from 'vue';

/**
 * 图片处理工具
 * 
 * 提供图片转换为Base64格式的工具函数。
 */
const meta: Meta = {
  title: '工具函数/Image 图片处理',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
图片处理工具提供了静态图片资源处理和图片格式转换功能。

### 主要特性
- getImage: 获取静态图片资源的完整URL路径
- getBase64ByImg: 将图片文件转换为Base64编码字符串
- 支持所有主流图片格式（JPG、PNG、GIF、WEBP等）
- 异步处理，通过回调函数返回结果
- 自动处理文件读取过程
- 返回完整的Data URL格式

### 使用场景
- 静态资源引用
- 图片上传预览
- 图片数据传输
- 图片缓存处理
- 头像上传功能

### 基本用法

\`\`\`javascript
import { getImage, getBase64ByImg } from '@jetlinks-web/utils';

// 获取静态图片资源路径
const logoPath = getImage('/logo.png');
const iconPath = getImage('/icons/home.svg');

// 处理文件上传
const handleFileUpload = (file) => {
  getBase64ByImg(file, (base64Url) => {
    console.log('Base64 结果:', base64Url);
    // 可以直接用于图片预览
    imagePreview.src = base64Url;
  });
};

// 在文件输入框中使用
const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    getBase64ByImg(file, (base64) => {
      setImagePreview(base64);
    });
  }
};
\`\`\`
        `,
        source: {
          type: 'code'
        }
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const StaticImage: Story = {
  name: '静态图片资源',
  parameters: {
    docs: {
      source: {
        code: `
import { getImage } from '@jetlinks-web/utils';

// 获取静态图片资源路径
const logoPath = getImage('/logo.png');
const bannerPath = getImage('/images/banner.jpg');
const iconPath = getImage('/icons/home.svg');

console.log('Logo路径:', logoPath);
// 输出: http://localhost:3000/images/logo.png

// 在Vue模板中使用
<template>
  <img :src="getImage('/logo.png')" alt="Logo" />
  <div :style="{ backgroundImage: \`url(\${getImage('/banner.jpg')})\` }"></div>
</template>

// 在组件中动态使用
const imageSrc = computed(() => getImage(props.imagePath));
        `
      }
    }
  },
  render: () => ({
    setup() {
      const imagePath = ref('/logo.png');
      const result = ref('');
      const commonPaths = ref([
        '/logo.png',
        '/images/banner.jpg',
        '/icons/home.svg',
        '/avatars/default.png',
        '/backgrounds/pattern.png'
      ]);
      
      const getImagePath = () => {
        result.value = getImage(imagePath.value);
      };
      
      const selectPath = (path) => {
        imagePath.value = path;
        result.value = getImage(path);
      };
      
      return { 
        imagePath, 
        result, 
        commonPaths, 
        getImagePath, 
        selectPath 
      };
    },
    template: `
      <div style="max-width: 500px;">
        <a-space direction="vertical" style="width: 100%;">
          <div>
            <label>图片路径：</label>
            <a-input 
              v-model:value="imagePath" 
              placeholder="输入图片路径，如：/logo.png"
              style="margin-top: 8px;"
            />
          </div>
          
          <div>
            <label>常用路径示例：</label>
            <div style="margin-top: 8px;">
              <a-space wrap>
                <a-tag 
                  v-for="path in commonPaths" 
                  :key="path"
                  style="cursor: pointer;"
                  @click="selectPath(path)"
                >
                  {{ path }}
                </a-tag>
              </a-space>
            </div>
          </div>
          
          <a-button type="primary" @click="getImagePath">
            获取完整路径
          </a-button>
          
          <div v-if="result">
            <label>生成的完整URL：</label>
            <a-input 
              :value="result" 
              readonly 
              style="margin-top: 8px;"
            />
          </div>
          
          <div v-if="result">
            <label>路径预览：</label>
            <div style="margin-top: 8px; padding: 16px; border: 1px solid #d9d9d9; border-radius: 6px; background: #fafafa;">
              <code style="word-break: break-all; font-size: 12px;">{{ result }}</code>
            </div>
          </div>
          
          <a-alert 
            message="说明" 
            type="info" 
            show-icon
          >
            <template #description>
              getImage 函数会将相对路径转换为完整的静态资源URL，
              自动拼接 /images 前缀和当前站点的base URL。
            </template>
          </a-alert>
          
          <p style="color: #666; font-size: 12px; margin: 8px 0 0 0;">
            用于处理静态图片资源路径，确保在不同环境下都能正确加载
          </p>
        </a-space>
      </div>
    `
  })
};

export const Basic: Story = {
  name: '基本使用',
  parameters: {
    docs: {
      source: {
        code: `
import { getBase64ByImg } from '@jetlinks-web/utils';

// 基本使用示例
const handleImageUpload = (file) => {
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    console.error('请选择图片文件');
    return;
  }
  
  // 转换为Base64
  getBase64ByImg(file, (base64Url) => {
    console.log('转换完成:', base64Url);
    
    // 可以用于预览
    const img = document.createElement('img');
    img.src = base64Url;
    document.body.appendChild(img);
  });
};

// 在组件中使用
const onFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    handleImageUpload(file);
  }
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const imageUrl = ref('');
      const fileName = ref('');
      const fileSize = ref('');
      const base64Size = ref('');
      const loading = ref(false);
      
      const handleFileUpload = (file) => {
        if (!file) return;
        
        // 验证文件类型
        if (!file.type.startsWith('image/')) {
          alert('请选择图片文件');
          return;
        }
        
        loading.value = true;
        fileName.value = file.name;
        fileSize.value = (file.size / 1024).toFixed(2) + ' KB';
        
        getBase64ByImg(file, (base64Url) => {
          imageUrl.value = base64Url;
          base64Size.value = (base64Url.length * 0.75 / 1024).toFixed(2) + ' KB';
          loading.value = false;
        });
      };
      
      const clearImage = () => {
        imageUrl.value = '';
        fileName.value = '';
        fileSize.value = '';
        base64Size.value = '';
      };
      
      return { 
        imageUrl, 
        fileName, 
        fileSize, 
        base64Size, 
        loading, 
        handleFileUpload, 
        clearImage 
      };
    },
    template: `
      <div style="max-width: 500px;">
        <a-space direction="vertical" style="width: 100%;">
          <div>
            <a-upload
              :beforeUpload="() => false"
              @change="(info) => handleFileUpload(info.file)"
              accept="image/*"
              :showUploadList="false"
            >
              <a-button type="primary" :loading="loading">
                <template #icon><upload-outlined /></template>
                选择图片文件
              </a-button>
            </a-upload>
          </div>
          
          <div v-if="fileName">
            <a-descriptions :column="1" size="small" bordered>
              <a-descriptions-item label="文件名">{{ fileName }}</a-descriptions-item>
              <a-descriptions-item label="原始大小">{{ fileSize }}</a-descriptions-item>
              <a-descriptions-item label="Base64大小" v-if="base64Size">{{ base64Size }}</a-descriptions-item>
            </a-descriptions>
          </div>
          
          <div v-if="imageUrl" style="text-align: center;">
            <div style="margin-bottom: 16px;">
              <img 
                :src="imageUrl" 
                style="max-width: 100%; max-height: 300px; border: 1px solid #d9d9d9; border-radius: 4px;"
                alt="预览图片"
              />
            </div>
            
            <a-space>
              <a-button @click="clearImage">清除图片</a-button>
              <a-button 
                type="primary" 
                @click="() => navigator.clipboard?.writeText(imageUrl)"
              >
                复制Base64
              </a-button>
            </a-space>
          </div>
          
          <p style="color: #666; font-size: 12px; margin: 8px 0 0 0;">
            选择图片文件查看Base64转换效果，支持JPG、PNG、GIF等格式
          </p>
        </a-space>
      </div>
    `
  })
};

export const MultipleFiles: Story = {
  name: '批量处理',
  parameters: {
    docs: {
      source: {
        code: `
import { getBase64ByImg } from '@jetlinks-web/utils';

// 批量处理多个图片文件
const handleMultipleFiles = (files) => {
  const results = [];
  let completed = 0;
  
  files.forEach((file, index) => {
    getBase64ByImg(file, (base64Url) => {
      results[index] = {
        name: file.name,
        size: file.size,
        type: file.type,
        base64: base64Url
      };
      
      completed++;
      
      // 所有文件处理完成
      if (completed === files.length) {
        console.log('所有图片处理完成:', results);
      }
    });
  });
};

// 使用示例
const onMultipleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  handleMultipleFiles(files);
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const images = ref([]);
      const loading = ref(false);
      
      const handleFilesUpload = (fileList) => {
        if (!fileList || fileList.length === 0) return;
        
        loading.value = true;
        images.value = [];
        
        const files = Array.from(fileList);
        let completed = 0;
        
        files.forEach((file, index) => {
          if (!file.type.startsWith('image/')) {
            completed++;
            return;
          }
          
          getBase64ByImg(file, (base64Url) => {
            images.value.push({
              id: index,
              name: file.name,
              size: (file.size / 1024).toFixed(2) + ' KB',
              type: file.type,
              base64: base64Url
            });
            
            completed++;
            if (completed === files.length) {
              loading.value = false;
            }
          });
        });
      };
      
      const clearAll = () => {
        images.value = [];
      };
      
      const removeImage = (id) => {
        images.value = images.value.filter(img => img.id !== id);
      };
      
      return { 
        images, 
        loading, 
        handleFilesUpload, 
        clearAll, 
        removeImage 
      };
    },
    template: `
      <div style="max-width: 600px;">
        <a-space direction="vertical" style="width: 100%;">
          <div>
            <a-upload
              :beforeUpload="() => false"
              @change="(info) => handleFilesUpload(info.fileList.map(f => f.originFileObj))"
              accept="image/*"
              multiple
              :showUploadList="false"
            >
              <a-button type="primary" :loading="loading">
                <template #icon><upload-outlined /></template>
                选择多个图片
              </a-button>
            </a-upload>
          </div>
          
          <div v-if="images.length > 0">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <span>共 {{ images.length }} 张图片</span>
              <a-button size="small" @click="clearAll">清除全部</a-button>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px;">
              <div 
                v-for="image in images" 
                :key="image.id"
                style="border: 1px solid #d9d9d9; border-radius: 8px; overflow: hidden;"
              >
                <div style="position: relative;">
                  <img 
                    :src="image.base64" 
                    style="width: 100%; height: 120px; object-fit: cover;"
                    :alt="image.name"
                  />
                  <a-button 
                    type="text" 
                    danger 
                    size="small"
                    style="position: absolute; top: 4px; right: 4px; background: rgba(255,255,255,0.8);"
                    @click="removeImage(image.id)"
                  >
                    ✕
                  </a-button>
                </div>
                <div style="padding: 8px;">
                  <div style="font-size: 12px; color: #333; margin-bottom: 4px; word-break: break-all;">
                    {{ image.name }}
                  </div>
                  <div style="font-size: 11px; color: #666;">
                    {{ image.size }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <p style="color: #666; font-size: 12px; margin: 8px 0 0 0;">
            支持同时选择多个图片文件进行批量Base64转换
          </p>
        </a-space>
      </div>
    `
  })
};

export const AvatarUpload: Story = {
  name: '头像上传示例',
  parameters: {
    docs: {
      source: {
        code: `
import { getBase64ByImg } from '@jetlinks-web/utils';

// 头像上传组件示例
const AvatarUpload = {
  setup() {
    const avatarUrl = ref('');
    const uploading = ref(false);
    
    const handleAvatarUpload = (file) => {
      // 验证文件大小（限制2MB）
      if (file.size > 2 * 1024 * 1024) {
        message.error('图片大小不能超过2MB');
        return;
      }
      
      // 验证文件类型
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        message.error('只支持JPG和PNG格式');
        return;
      }
      
      uploading.value = true;
      
      getBase64ByImg(file, (base64) => {
        avatarUrl.value = base64;
        uploading.value = false;
        message.success('头像上传成功');
      });
    };
    
    return { avatarUrl, uploading, handleAvatarUpload };
  }
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const avatarUrl = ref('');
      const uploading = ref(false);
      
      const handleAvatarUpload = (file) => {
        if (!file) return;
        
        // 验证文件大小（限制2MB）
        if (file.size > 2 * 1024 * 1024) {
          alert('图片大小不能超过2MB');
          return;
        }
        
        // 验证文件类型
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
          alert('只支持JPG、PNG和GIF格式');
          return;
        }
        
        uploading.value = true;
        
        getBase64ByImg(file, (base64) => {
          avatarUrl.value = base64;
          uploading.value = false;
        });
      };
      
      const removeAvatar = () => {
        avatarUrl.value = '';
      };
      
      return { 
        avatarUrl, 
        uploading, 
        handleAvatarUpload, 
        removeAvatar 
      };
    },
    template: `
      <div style="max-width: 400px; text-align: center;">
        <a-space direction="vertical" style="width: 100%;">
          <div style="position: relative; display: inline-block;">
            <div 
              :style="{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#f5f5f5',
                border: '2px dashed #d9d9d9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                backgroundImage: avatarUrl ? \`url(\${avatarUrl})\` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }"
              @click="() => $refs.fileInput?.click()"
            >
              <div v-if="!avatarUrl && !uploading" style="text-align: center; color: #666;">
                <div style="font-size: 24px; margin-bottom: 8px;">📷</div>
                <div style="font-size: 12px;">点击上传头像</div>
              </div>
              <div v-if="uploading" style="color: #666;">
                <div style="font-size: 12px;">上传中...</div>
              </div>
            </div>
            
            <input 
              ref="fileInput"
              type="file" 
              accept="image/jpeg,image/png,image/gif"
              style="display: none;"
              @change="(e) => handleAvatarUpload(e.target.files[0])"
            />
          </div>
          
          <div v-if="avatarUrl">
            <a-space>
              <a-button @click="removeAvatar" size="small">移除头像</a-button>
              <a-button 
                type="primary" 
                size="small"
                @click="() => $refs.fileInput?.click()"
              >
                更换头像
              </a-button>
            </a-space>
          </div>
          
          <div style="text-align: left;">
            <a-alert 
              message="上传要求" 
              type="info" 
              show-icon
            >
              <template #description>
                <ul style="margin: 0; padding-left: 16px;">
                  <li>支持JPG、PNG、GIF格式</li>
                  <li>文件大小不超过2MB</li>
                  <li>建议尺寸1:1正方形</li>
                </ul>
              </template>
            </a-alert>
          </div>
          
          <p style="color: #666; font-size: 12px; margin: 8px 0 0 0;">
            典型的头像上传场景，包含文件验证和预览功能
          </p>
        </a-space>
      </div>
    `
  })
};