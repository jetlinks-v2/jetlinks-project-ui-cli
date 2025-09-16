import type { Meta, StoryObj } from '@storybook/vue3';
import AIcon from '../../../packages/components/src/Icon';

/**
 * AIcon 图标组件
 * 
 * 这是一个图标组件，支持Ant Design Vue内置图标和自定义iconfont图标。
 * 自动判断图标类型，优先使用Ant Design图标，不存在时使用自定义图标。
 * 
 * ## 何时使用
 * - 需要展示图标时
 * - 需要统一图标风格时
 * - 需要使用自定义图标时
 * - 按钮、菜单等需要图标装饰时
 */
const meta: Meta<typeof AIcon> = {
  title: '组件库/AIcon 图标',
  component: AIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
AIcon 是一个图标组件，支持Ant Design Vue内置图标和自定义iconfont图标。

### 主要特性
- 支持Ant Design Vue所有内置图标
- 支持自定义iconfont图标
- 自动判断图标类型
- 支持点击事件
- 支持自定义样式

### 基本用法
\`\`\`vue
<template>
  <AIcon type="HomeOutlined" />
</template>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'text',
      description: '图标类型，可以是Ant Design图标名或iconfont图标名'
    },
    scriptUrl: {
      control: 'text',
      description: 'iconfont项目的scriptUrl地址'
    }
  },
  args: {
    type: 'HomeOutlined'
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 常用图标
 * 展示一些常用的Ant Design图标
 */
export const 常用图标: Story = {
  render: () => ({
    components: { AIcon },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 24px; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <AIcon type="HomeOutlined" style="font-size: 24px;" />
          <span style="font-size: 12px;">HomeOutlined</span>
        </div>
        
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <AIcon type="UserOutlined" style="font-size: 24px;" />
          <span style="font-size: 12px;">UserOutlined</span>
        </div>
        
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <AIcon type="SettingOutlined" style="font-size: 24px;" />
          <span style="font-size: 12px;">SettingOutlined</span>
        </div>
        
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <AIcon type="SearchOutlined" style="font-size: 24px;" />
          <span style="font-size: 12px;">SearchOutlined</span>
        </div>
        
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <AIcon type="BellOutlined" style="font-size: 24px;" />
          <span style="font-size: 12px;">BellOutlined</span>
        </div>
        
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <AIcon type="MailOutlined" style="font-size: 24px;" />
          <span style="font-size: 12px;">MailOutlined</span>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="icon-showcase">
    <div class="icon-item">
      <AIcon type="HomeOutlined" />
      <span>HomeOutlined</span>
    </div>
    
    <div class="icon-item">
      <AIcon type="UserOutlined" />
      <span>UserOutlined</span>
    </div>
    
    <div class="icon-item">
      <AIcon type="SettingOutlined" />
      <span>SettingOutlined</span>
    </div>
    
    <div class="icon-item">
      <AIcon type="SearchOutlined" />
      <span>SearchOutlined</span>
    </div>
    
    <div class="icon-item">
      <AIcon type="BellOutlined" />
      <span>BellOutlined</span>
    </div>
    
    <div class="icon-item">
      <AIcon type="MailOutlined" />
      <span>MailOutlined</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import AIcon from '@jetlinks/components'
</script>

<style scoped>
.icon-showcase {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.icon-item :deep(.anticon) {
  font-size: 24px;
}

.icon-item span {
  font-size: 12px;
}
</style>`
      }
    }
  }
};

/**
 * 不同尺寸
 * 展示不同尺寸的图标
 */
export const 不同尺寸: Story = {
  render: () => ({
    components: { AIcon },
    template: `
      <div style="display: flex; align-items: center; gap: 32px;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <AIcon type="HeartOutlined" style="font-size: 16px;" />
          <span style="font-size: 12px;">16px</span>
        </div>
        
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <AIcon type="HeartOutlined" style="font-size: 20px;" />
          <span style="font-size: 12px;">20px</span>
        </div>
        
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <AIcon type="HeartOutlined" style="font-size: 24px;" />
          <span style="font-size: 12px;">24px</span>
        </div>
        
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <AIcon type="HeartOutlined" style="font-size: 32px;" />
          <span style="font-size: 12px;">32px</span>
        </div>
        
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <AIcon type="HeartOutlined" style="font-size: 48px;" />
          <span style="font-size: 12px;">48px</span>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="size-demo">
    <div class="size-item">
      <AIcon type="HeartOutlined" style="font-size: 16px;" />
      <span>16px</span>
    </div>
    
    <div class="size-item">
      <AIcon type="HeartOutlined" style="font-size: 20px;" />
      <span>20px</span>
    </div>
    
    <div class="size-item">
      <AIcon type="HeartOutlined" style="font-size: 24px;" />
      <span>24px</span>
    </div>
    
    <div class="size-item">
      <AIcon type="HeartOutlined" style="font-size: 32px;" />
      <span>32px</span>
    </div>
    
    <div class="size-item">
      <AIcon type="HeartOutlined" style="font-size: 48px;" />
      <span>48px</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import AIcon from '@jetlinks/components'
</script>

<style scoped>
.size-demo {
  display: flex;
  align-items: center;
  gap: 32px;
}

.size-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.size-item span {
  font-size: 12px;
}
</style>`
      }
    }
  }
};

/**
 * 不同颜色
 * 展示不同颜色的图标
 */
export const 不同颜色: Story = {
  render: () => ({
    components: { AIcon },
    template: `
      <div style="display: flex; align-items: center; gap: 32px;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <AIcon type="StarOutlined" style="font-size: 24px; color: #1890ff;" />
          <span style="font-size: 12px;">Primary</span>
        </div>
        
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <AIcon type="StarOutlined" style="font-size: 24px; color: #52c41a;" />
          <span style="font-size: 12px;">Success</span>
        </div>
        
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <AIcon type="StarOutlined" style="font-size: 24px; color: #faad14;" />
          <span style="font-size: 12px;">Warning</span>
        </div>
        
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <AIcon type="StarOutlined" style="font-size: 24px; color: #f5222d;" />
          <span style="font-size: 12px;">Error</span>
        </div>
        
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <AIcon type="StarOutlined" style="font-size: 24px; color: #666;" />
          <span style="font-size: 12px;">Secondary</span>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="color-demo">
    <div class="color-item">
      <AIcon type="StarOutlined" style="font-size: 24px; color: #1890ff;" />
      <span>Primary</span>
    </div>
    
    <div class="color-item">
      <AIcon type="StarOutlined" style="font-size: 24px; color: #52c41a;" />
      <span>Success</span>
    </div>
    
    <div class="color-item">
      <AIcon type="StarOutlined" style="font-size: 24px; color: #faad14;" />
      <span>Warning</span>
    </div>
    
    <div class="color-item">
      <AIcon type="StarOutlined" style="font-size: 24px; color: #f5222d;" />
      <span>Error</span>
    </div>
    
    <div class="color-item">
      <AIcon type="StarOutlined" style="font-size: 24px; color: #666;" />
      <span>Secondary</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import AIcon from '@jetlinks/components'
</script>

<style scoped>
.color-demo {
  display: flex;
  align-items: center;
  gap: 32px;
}

.color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.color-item span {
  font-size: 12px;
}
</style>`
      }
    }
  }
};

/**
 * 点击事件
 * 图标支持点击事件处理
 */
export const 点击事件: Story = {
  render: () => ({
    components: { AIcon },
    template: `
      <div style="display: flex; align-items: center; gap: 24px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <AIcon 
            type="LikeOutlined" 
            style="font-size: 20px; cursor: pointer;" 
            :style="{ color: liked ? '#f5222d' : '#666' }"
            @click="toggleLike"
          />
          <span>{{ liked ? '已点赞' : '点赞' }} ({{ likeCount }})</span>
        </div>
        
        <div style="display: flex; align-items: center; gap: 8px;">
          <AIcon 
            type="StarOutlined" 
            style="font-size: 20px; cursor: pointer;" 
            :style="{ color: starred ? '#faad14' : '#666' }"
            @click="toggleStar"
          />
          <span>{{ starred ? '已收藏' : '收藏' }} ({{ starCount }})</span>
        </div>
        
        <div style="display: flex; align-items: center; gap: 8px;">
          <AIcon 
            type="ShareAltOutlined" 
            style="font-size: 20px; cursor: pointer; color: #1890ff;" 
            @click="share"
          />
          <span>分享</span>
        </div>
      </div>
    `,
    data() {
      return {
        liked: false,
        likeCount: 23,
        starred: false,
        starCount: 8
      }
    },
    methods: {
      toggleLike() {
        this.liked = !this.liked;
        this.likeCount += this.liked ? 1 : -1;
      },
      toggleStar() {
        this.starred = !this.starred;
        this.starCount += this.starred ? 1 : -1;
      },
      share() {
        alert('分享功能');
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="interactive-demo">
    <div class="action-item">
      <AIcon 
        type="LikeOutlined" 
        :style="{ 
          fontSize: '20px', 
          cursor: 'pointer',
          color: liked ? '#f5222d' : '#666' 
        }"
        @click="toggleLike"
      />
      <span>{{ liked ? '已点赞' : '点赞' }} ({{ likeCount }})</span>
    </div>
    
    <div class="action-item">
      <AIcon 
        type="StarOutlined" 
        :style="{ 
          fontSize: '20px', 
          cursor: 'pointer',
          color: starred ? '#faad14' : '#666' 
        }"
        @click="toggleStar"
      />
      <span>{{ starred ? '已收藏' : '收藏' }} ({{ starCount }})</span>
    </div>
    
    <div class="action-item">
      <AIcon 
        type="ShareAltOutlined" 
        style="font-size: 20px; cursor: pointer; color: #1890ff;" 
        @click="share"
      />
      <span>分享</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AIcon from '@jetlinks/components'

const liked = ref(false)
const likeCount = ref(23)
const starred = ref(false)
const starCount = ref(8)

const toggleLike = () => {
  liked.value = !liked.value
  likeCount.value += liked.value ? 1 : -1
}

const toggleStar = () => {
  starred.value = !starred.value
  starCount.value += starred.value ? 1 : -1
}

const share = () => {
  alert('分享功能')
}
</script>

<style scoped>
.interactive-demo {
  display: flex;
  align-items: center;
  gap: 24px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>`
      }
    }
  }
};

/**
 * 实际应用场景
 * 在实际业务中的图标使用示例
 */
export const 实际应用场景: Story = {
  render: () => ({
    components: { AIcon },
    template: `
      <div style="max-width: 600px; display: flex; flex-direction: column; gap: 24px;">
        <!-- 导航栏 -->
        <div style="padding: 12px 16px; background: #001529; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 24px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <AIcon type="HomeOutlined" style="color: #fff; font-size: 16px;" />
                <span style="color: #fff;">首页</span>
              </div>
              
              <div style="display: flex; align-items: center; gap: 8px;">
                <AIcon type="FileTextOutlined" style="color: #fff; font-size: 16px;" />
                <span style="color: #fff;">文档</span>
              </div>
              
              <div style="display: flex; align-items: center; gap: 8px;">
                <AIcon type="TeamOutlined" style="color: #fff; font-size: 16px;" />
                <span style="color: #fff;">团队</span>
              </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 16px;">
              <AIcon type="BellOutlined" style="color: #fff; font-size: 16px;" />
              <AIcon type="UserOutlined" style="color: #fff; font-size: 16px;" />
            </div>
          </div>
        </div>

        <!-- 功能卡片 -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
          <div style="padding: 16px; border: 1px solid #f0f0f0; border-radius: 8px; text-align: center;">
            <AIcon type="DatabaseOutlined" style="font-size: 32px; color: #1890ff; margin-bottom: 8px;" />
            <div style="font-weight: 500; margin-bottom: 4px;">数据管理</div>
            <div style="font-size: 12px; color: #666;">管理和查看数据</div>
          </div>
          
          <div style="padding: 16px; border: 1px solid #f0f0f0; border-radius: 8px; text-align: center;">
            <AIcon type="BarChartOutlined" style="font-size: 32px; color: #52c41a; margin-bottom: 8px;" />
            <div style="font-weight: 500; margin-bottom: 4px;">数据分析</div>
            <div style="font-size: 12px; color: #666;">分析数据趋势</div>
          </div>
          
          <div style="padding: 16px; border: 1px solid #f0f0f0; border-radius: 8px; text-align: center;">
            <AIcon type="SettingOutlined" style="font-size: 32px; color: #faad14; margin-bottom: 8px;" />
            <div style="font-weight: 500; margin-bottom: 4px;">系统设置</div>
            <div style="font-size: 12px; color: #666;">配置系统参数</div>
          </div>
        </div>

        <!-- 操作按钮组 -->
        <div style="display: flex; gap: 12px;">
          <button style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            <AIcon type="PlusOutlined" style="font-size: 14px;" />
            <span>新建</span>
          </button>
          
          <button style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: #52c41a; color: white; border: none; border-radius: 4px; cursor: pointer;">
            <AIcon type="DownloadOutlined" style="font-size: 14px;" />
            <span>导出</span>
          </button>
          
          <button style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: #faad14; color: white; border: none; border-radius: 4px; cursor: pointer;">
            <AIcon type="UploadOutlined" style="font-size: 14px;" />
            <span>导入</span>
          </button>
          
          <button style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: #f5222d; color: white; border: none; border-radius: 4px; cursor: pointer;">
            <AIcon type="DeleteOutlined" style="font-size: 14px;" />
            <span>删除</span>
          </button>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="application-demo">
    <!-- 导航栏 -->
    <div class="navbar">
      <div class="nav-content">
        <div class="nav-left">
          <div class="nav-item">
            <AIcon type="HomeOutlined" />
            <span>首页</span>
          </div>
          
          <div class="nav-item">
            <AIcon type="FileTextOutlined" />
            <span>文档</span>
          </div>
          
          <div class="nav-item">
            <AIcon type="TeamOutlined" />
            <span>团队</span>
          </div>
        </div>
        
        <div class="nav-right">
          <AIcon type="BellOutlined" />
          <AIcon type="UserOutlined" />
        </div>
      </div>
    </div>

    <!-- 功能卡片 -->
    <div class="feature-cards">
      <div class="feature-card">
        <AIcon type="DatabaseOutlined" class="feature-icon primary" />
        <div class="feature-title">数据管理</div>
        <div class="feature-desc">管理和查看数据</div>
      </div>
      
      <div class="feature-card">
        <AIcon type="BarChartOutlined" class="feature-icon success" />
        <div class="feature-title">数据分析</div>
        <div class="feature-desc">分析数据趋势</div>
      </div>
      
      <div class="feature-card">
        <AIcon type="SettingOutlined" class="feature-icon warning" />
        <div class="feature-title">系统设置</div>
        <div class="feature-desc">配置系统参数</div>
      </div>
    </div>

    <!-- 操作按钮组 -->
    <div class="action-buttons">
      <button class="btn primary">
        <AIcon type="PlusOutlined" />
        <span>新建</span>
      </button>
      
      <button class="btn success">
        <AIcon type="DownloadOutlined" />
        <span>导出</span>
      </button>
      
      <button class="btn warning">
        <AIcon type="UploadOutlined" />
        <span>导入</span>
      </button>
      
      <button class="btn danger">
        <AIcon type="DeleteOutlined" />
        <span>删除</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import AIcon from '@jetlinks/components'
</script>

<style scoped>
.application-demo {
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.navbar {
  padding: 12px 16px;
  background: #001529;
  border-radius: 8px;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #fff;
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.feature-card {
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  text-align: center;
}

.feature-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.feature-icon.primary {
  color: #1890ff;
}

.feature-icon.success {
  color: #52c41a;
}

.feature-icon.warning {
  color: #faad14;
}

.feature-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.feature-desc {
  font-size: 12px;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
}

.btn.primary {
  background: #1890ff;
}

.btn.success {
  background: #52c41a;
}

.btn.warning {
  background: #faad14;
}

.btn.danger {
  background: #f5222d;
}

.btn :deep(.anticon) {
  font-size: 14px;
}
</style>`
      }
    }
  }
};