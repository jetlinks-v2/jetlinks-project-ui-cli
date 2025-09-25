import type { Meta, StoryObj } from '@storybook/vue3';
import { isFullScreen } from '../../packages/utils/src/util';
import { ref } from 'vue';

/**
 * 工具函数
 * 
 * 这里展示了项目中常用的工具函数的使用方法和示例。
 */
const meta: Meta = {
  title: '工具函数/FullScreen 全屏检测',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
isFullScreen 是一个用于检测当前页面是否处于全屏状态的工具函数。

### 主要特性
- 跨浏览器兼容，支持各种全屏 API
- 实时检测全屏状态
- 返回布尔值，便于条件判断

### 支持的浏览器 API
- document.fullscreen (标准 API)
- document.mozFullScreen (Firefox)
- document.webkitIsFullScreen (WebKit)
- document.webkitFullScreen (旧版 WebKit)
- document.msFullScreen (IE/Edge)

### 使用场景
- 根据全屏状态调整 UI 布局
- 控制视频播放器的全屏功能
- 响应式设计中的状态判断
- 用户体验优化

### 基本用法

\`\`\`javascript
import { isFullScreen } from '@jetlinks-web/utils';

// 检测当前是否全屏
const fullscreenStatus = isFullScreen();
console.log('当前是否全屏:', fullscreenStatus);

// 在条件判断中使用
if (isFullScreen()) {
  console.log('当前处于全屏模式');
} else {
  console.log('当前不在全屏模式');
}
\`\`\`

### 在 Vue 组件中使用

\`\`\`vue
<template>
  <div>
    <p>全屏状态: {{ fullscreenStatus ? '是' : '否' }}</p>
    <a-button @click="checkFullscreen">检测全屏状态</a-button>
    <a-button @click="toggleFullscreen">
      {{ fullscreenStatus ? '退出全屏' : '进入全屏' }}
    </a-button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { isFullScreen } from '@jetlinks-web/utils';

const fullscreenStatus = ref(false);

const checkFullscreen = () => {
  fullscreenStatus.value = isFullScreen();
};

const toggleFullscreen = async () => {
  if (isFullScreen()) {
    await document.exitFullscreen();
  } else {
    await document.documentElement.requestFullscreen();
  }
  setTimeout(() => {
    fullscreenStatus.value = isFullScreen();
  }, 100);
};

// 监听全屏状态变化
const handleFullscreenChange = () => {
  fullscreenStatus.value = isFullScreen();
};

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('msfullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
  document.removeEventListener('msfullscreenchange', handleFullscreenChange);
});
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

export const BasicUsage: Story = {
  name: '基本使用',
  parameters: {
    docs: {
      source: {
        code: `
import { isFullScreen } from '@jetlinks-web/utils';

// 检测当前全屏状态
const checkStatus = () => {
  const status = isFullScreen();
  console.log('当前全屏状态:', status);
  return status;
};

// 在模板中使用
<a-button @click="checkStatus">
  检测全屏状态
</a-button>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const fullscreenStatus = ref(false);
      
      const checkStatus = () => {
        fullscreenStatus.value = isFullScreen();
        console.log('当前全屏状态:', fullscreenStatus.value);
      };
      
      return { fullscreenStatus, checkStatus };
    },
    template: `
      <div>
        <a-space direction="vertical" style="width: 100%;">
          <div>
            <p>当前全屏状态: <strong>{{ fullscreenStatus ? '是' : '否' }}</strong></p>
            <a-button type="primary" @click="checkStatus">
              检测全屏状态
            </a-button>
          </div>
          <p style="color: #666; font-size: 12px;">
            点击按钮检测当前页面是否处于全屏状态
          </p>
        </a-space>
      </div>
    `
  })
};

export const WithFullscreenToggle: Story = {
  name: '全屏切换演示',
  parameters: {
    docs: {
      source: {
        code: `
import { isFullScreen } from '@jetlinks-web/utils';
import { ref, onMounted, onUnmounted } from 'vue';

const fullscreenStatus = ref(false);

// 切换全屏状态
const toggleFullscreen = async () => {
  try {
    if (isFullScreen()) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
    // 延迟检测状态变化
    setTimeout(() => {
      fullscreenStatus.value = isFullScreen();
    }, 100);
  } catch (error) {
    console.error('全屏操作失败:', error);
  }
};

// 监听全屏状态变化
const handleFullscreenChange = () => {
  fullscreenStatus.value = isFullScreen();
};

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
});

// 在模板中使用
<a-button @click="toggleFullscreen">
  {{ fullscreenStatus ? '退出全屏' : '进入全屏' }}
</a-button>
        `
      }
    }
  },
  render: () => ({
    setup() {
      const fullscreenStatus = ref(false);
      
      const toggleFullscreen = async () => {
        try {
          if (isFullScreen()) {
            await document.exitFullscreen();
          } else {
            await document.documentElement.requestFullscreen();
          }
          setTimeout(() => {
            fullscreenStatus.value = isFullScreen();
          }, 100);
        } catch (error) {
          console.error('全屏操作失败:', error);
        }
      };
      
      const checkStatus = () => {
        fullscreenStatus.value = isFullScreen();
      };
      
      const handleFullscreenChange = () => {
        fullscreenStatus.value = isFullScreen();
      };
      
      return { 
        fullscreenStatus, 
        toggleFullscreen, 
        checkStatus,
        handleFullscreenChange
      };
    },
    mounted() {
      document.addEventListener('fullscreenchange', this.handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange);
      document.addEventListener('mozfullscreenchange', this.handleFullscreenChange);
      document.addEventListener('msfullscreenchange', this.handleFullscreenChange);
    },
    unmounted() {
      document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', this.handleFullscreenChange);
    },
    template: `
      <div>
        <a-space direction="vertical" style="width: 100%;">
          <div>
            <a-alert 
              :message="'当前全屏状态: ' + (fullscreenStatus ? '全屏模式' : '普通模式')"
              :type="fullscreenStatus ? 'success' : 'info'"
              show-icon
              style="margin-bottom: 16px;"
            />
          </div>
          
          <div>
            <a-space>
              <a-button 
                type="primary" 
                @click="toggleFullscreen"
              >
                {{ fullscreenStatus ? '退出全屏' : '进入全屏' }}
              </a-button>
              
              <a-button @click="checkStatus">
                刷新状态
              </a-button>
            </a-space>
          </div>
          
          <div>
            <p style="color: #666; font-size: 12px;">
              • 点击"进入全屏"按钮将页面切换到全屏模式<br/>
              • 点击"退出全屏"按钮或按 ESC 键退出全屏<br/>
              • 全屏状态会自动检测并更新显示
            </p>
          </div>
        </a-space>
      </div>
    `
  })
};

export const InComponent: Story = {
  name: '在组件中使用',
  parameters: {
    docs: {
      source: {
        code: `
import { isFullScreen } from '@jetlinks-web/utils';
import { ref, computed, onMounted, onUnmounted } from 'vue';

export default {
  setup() {
    const fullscreenStatus = ref(false);
    
    // 计算属性：根据全屏状态调整样式
    const containerStyle = computed(() => ({
      padding: fullscreenStatus.value ? '20px' : '10px',
      backgroundColor: fullscreenStatus.value ? '#f0f2f5' : '#ffffff',
      border: fullscreenStatus.value ? 'none' : '1px solid #d9d9d9',
      borderRadius: fullscreenStatus.value ? '0' : '6px'
    }));
    
    // 监听全屏状态变化
    const handleFullscreenChange = () => {
      fullscreenStatus.value = isFullScreen();
    };
    
    onMounted(() => {
      // 初始化检测
      fullscreenStatus.value = isFullScreen();
      
      // 监听各种全屏事件
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.addEventListener('mozfullscreenchange', handleFullscreenChange);
      document.addEventListener('msfullscreenchange', handleFullscreenChange);
    });
    
    onUnmounted(() => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    });
    
    return {
      fullscreenStatus,
      containerStyle
    };
  }
};
        `
      }
    }
  },
  render: () => ({
    setup() {
      const fullscreenStatus = ref(false);
      
      const containerStyle = computed(() => ({
        padding: fullscreenStatus.value ? '20px' : '10px',
        backgroundColor: fullscreenStatus.value ? '#f0f2f5' : '#ffffff',
        border: fullscreenStatus.value ? 'none' : '1px solid #d9d9d9',
        borderRadius: fullscreenStatus.value ? '0' : '6px',
        transition: 'all 0.3s ease'
      }));
      
      const handleFullscreenChange = () => {
        fullscreenStatus.value = isFullScreen();
      };
      
      const toggleFullscreen = async () => {
        try {
          if (isFullScreen()) {
            await document.exitFullscreen();
          } else {
            await document.documentElement.requestFullscreen();
          }
        } catch (error) {
          console.error('全屏操作失败:', error);
        }
      };
      
      return { 
        fullscreenStatus, 
        containerStyle, 
        handleFullscreenChange,
        toggleFullscreen
      };
    },
    mounted() {
      this.fullscreenStatus = isFullScreen();
      document.addEventListener('fullscreenchange', this.handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange);
      document.addEventListener('mozfullscreenchange', this.handleFullscreenChange);
      document.addEventListener('msfullscreenchange', this.handleFullscreenChange);
    },
    unmounted() {
      document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', this.handleFullscreenChange);
    },
    template: `
      <div>
        <div :style="containerStyle">
          <a-space direction="vertical" style="width: 100%;">
            <a-typography-title :level="4">
              响应式容器演示
            </a-typography-title>
            
            <a-descriptions bordered size="small">
              <a-descriptions-item label="全屏状态">
                <a-tag :color="fullscreenStatus ? 'green' : 'blue'">
                  {{ fullscreenStatus ? '全屏模式' : '普通模式' }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="容器样式">
                {{ fullscreenStatus ? '全屏样式' : '普通样式' }}
              </a-descriptions-item>
            </a-descriptions>
            
            <a-button type="primary" @click="toggleFullscreen">
              {{ fullscreenStatus ? '退出全屏' : '进入全屏' }}
            </a-button>
            
            <a-alert
              message="容器样式会根据全屏状态自动调整"
              description="进入全屏后，容器的内边距、背景色、边框等样式会发生变化，展示了如何在组件中响应全屏状态。"
              type="info"
              show-icon
            />
          </a-space>
        </div>
      </div>
    `
  })
};