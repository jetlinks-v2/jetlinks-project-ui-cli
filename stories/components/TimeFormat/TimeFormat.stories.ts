import type { Meta, StoryObj } from '@storybook/vue3';
import JTimeFormat from '../../../packages/components/src/TimeFormat/timeFormat.vue';

/**
 * TimeFormat 时间格式化组件
 * 
 * 这是一个用于格式化和显示时间的组件，基于dayjs库实现。
 * 支持多种时间输入格式和自定义输出格式，适用于各种时间显示场景。
 * 
 * ## 何时使用
 * - 需要格式化时间戳显示时
 * - 统一项目中的时间显示格式时
 * - 需要将数字时间戳转换为可读格式时
 * - 在表格、列表中显示时间字段时
 */
const meta: Meta<typeof JTimeFormat> = {
  title: '组件库/TimeFormat 时间格式化',
  component: JTimeFormat,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
TimeFormat 是一个时间格式化组件，用于统一显示各种时间格式。

### 主要特性
- 支持时间戳和字符串时间
- 基于dayjs，支持多种格式化选项
- 自动处理数字和字符串格式
- 轻量级，性能优秀
- 支持自定义格式模式

### 基本用法
\`\`\`vue
<template>
  <JTimeFormat :time="1642665600000" />
</template>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    time: {
      control: 'text',
      description: '时间值，支持时间戳(数字)或时间字符串'
    },
    format: {
      control: 'text',
      description: '格式化模式，基于dayjs格式，默认为 YYYY-MM-DD HH:mm:ss'
    }
  },
  args: {
    time: Date.now(),
    format: 'YYYY-MM-DD HH:mm:ss'
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 默认格式
 * 使用默认格式显示当前时间
 */
export const 默认格式: Story = {
  args: {
    time: 1642665600000, // 2022-01-20 12:00:00
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JTimeFormat :time="1642665600000" />
</template>

<script setup lang="ts">
import JTimeFormat from '@jetlinks/components'
</script>`
      }
    }
  }
};

/**
 * 日期格式
 * 只显示日期，不显示时间
 */
export const 日期格式: Story = {
  args: {
    time: 1642665600000,
    format: 'YYYY-MM-DD'
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JTimeFormat :time="1642665600000" format="YYYY-MM-DD" />
</template>

<script setup lang="ts">
import JTimeFormat from '@jetlinks/components'
</script>`
      }
    }
  }
};

/**
 * 时间格式
 * 只显示时间，不显示日期
 */
export const 时间格式: Story = {
  args: {
    time: 1642665600000,
    format: 'HH:mm:ss'
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JTimeFormat :time="1642665600000" format="HH:mm:ss" />
</template>

<script setup lang="ts">
import JTimeFormat from '@jetlinks/components'
</script>`
      }
    }
  }
};

/**
 * 中文格式
 * 使用中文的日期时间格式
 */
export const 中文格式: Story = {
  args: {
    time: 1642665600000,
    format: 'YYYY年MM月DD日 HH:mm:ss'
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JTimeFormat :time="1642665600000" format="YYYY年MM月DD日 HH:mm:ss" />
</template>

<script setup lang="ts">
import JTimeFormat from '@jetlinks/components'
</script>`
      }
    }
  }
};

/**
 * 12小时制格式
 * 使用12小时制显示时间
 */
export const 十二小时制: Story = {
  args: {
    time: 1642665600000,
    format: 'YYYY-MM-DD hh:mm:ss A'
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JTimeFormat :time="1642665600000" format="YYYY-MM-DD hh:mm:ss A" />
</template>

<script setup lang="ts">
import JTimeFormat from '@jetlinks/components'
</script>`
      }
    }
  }
};

/**
 * 字符串时间
 * 处理字符串格式的时间
 */
export const 字符串时间: Story = {
  args: {
    time: '2024-01-20 15:30:00',
    format: 'YYYY年MM月DD日'
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JTimeFormat time="2024-01-20 15:30:00" format="YYYY年MM月DD日" />
</template>

<script setup lang="ts">
import JTimeFormat from '@jetlinks/components'
</script>`
      }
    }
  }
};

/**
 * 不同格式对比
 * 展示同一时间的不同格式化效果
 */
export const 不同格式对比: Story = {
  render: () => ({
    components: { JTimeFormat },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; font-family: monospace;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border: 1px solid #e8e8e8; border-radius: 4px;">
          <span style="font-weight: 600; min-width: 200px;">默认格式:</span>
          <JTimeFormat :time="timestamp" />
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border: 1px solid #e8e8e8; border-radius: 4px;">
          <span style="font-weight: 600; min-width: 200px;">日期格式:</span>
          <JTimeFormat :time="timestamp" format="YYYY-MM-DD" />
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border: 1px solid #e8e8e8; border-radius: 4px;">
          <span style="font-weight: 600; min-width: 200px;">时间格式:</span>
          <JTimeFormat :time="timestamp" format="HH:mm:ss" />
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border: 1px solid #e8e8e8; border-radius: 4px;">
          <span style="font-weight: 600; min-width: 200px;">中文格式:</span>
          <JTimeFormat :time="timestamp" format="YYYY年MM月DD日 HH时mm分ss秒" />
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border: 1px solid #e8e8e8; border-radius: 4px;">
          <span style="font-weight: 600; min-width: 200px;">12小时制:</span>
          <JTimeFormat :time="timestamp" format="YYYY-MM-DD hh:mm:ss A" />
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border: 1px solid #e8e8e8; border-radius: 4px;">
          <span style="font-weight: 600; min-width: 200px;">ISO格式:</span>
          <JTimeFormat :time="timestamp" format="YYYY-MM-DDTHH:mm:ssZ" />
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border: 1px solid #e8e8e8; border-radius: 4px;">
          <span style="font-weight: 600; min-width: 200px;">相对格式:</span>
          <JTimeFormat :time="timestamp" format="MMM DD, YYYY" />
        </div>
      </div>
    `,
    data() {
      return {
        timestamp: 1642665600000 // 2022-01-20 12:00:00
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="time-format-demo">
    <div class="format-item">
      <span class="format-label">默认格式:</span>
      <JTimeFormat :time="timestamp" />
    </div>
    <div class="format-item">
      <span class="format-label">日期格式:</span>
      <JTimeFormat :time="timestamp" format="YYYY-MM-DD" />
    </div>
    <div class="format-item">
      <span class="format-label">时间格式:</span>
      <JTimeFormat :time="timestamp" format="HH:mm:ss" />
    </div>
    <div class="format-item">
      <span class="format-label">中文格式:</span>
      <JTimeFormat :time="timestamp" format="YYYY年MM月DD日 HH时mm分ss秒" />
    </div>
    <div class="format-item">
      <span class="format-label">12小时制:</span>
      <JTimeFormat :time="timestamp" format="YYYY-MM-DD hh:mm:ss A" />
    </div>
    <div class="format-item">
      <span class="format-label">ISO格式:</span>
      <JTimeFormat :time="timestamp" format="YYYY-MM-DDTHH:mm:ssZ" />
    </div>
    <div class="format-item">
      <span class="format-label">相对格式:</span>
      <JTimeFormat :time="timestamp" format="MMM DD, YYYY" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JTimeFormat from '@jetlinks/components'

const timestamp = ref(1642665600000) // 2022-01-20 12:00:00
</script>

<style scoped>
.time-format-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: monospace;
}

.format-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}

.format-label {
  font-weight: 600;
  min-width: 200px;
}
</style>`
      }
    }
  }
};

/**
 * 实际应用场景
 * 在数据表格中的应用示例
 */
export const 实际应用场景: Story = {
  render: () => ({
    components: { JTimeFormat },
    template: `
      <div style="border: 1px solid #e8e8e8; border-radius: 8px; overflow: hidden;">
        <div style="background: #fafafa; padding: 12px; font-weight: 600; border-bottom: 1px solid #e8e8e8;">
          系统日志
        </div>
        <div style="padding: 0;">
          <div v-for="(log, index) in logs" :key="index" 
               style="display: flex; align-items: center; padding: 12px; border-bottom: 1px solid #f0f0f0;"
               :style="{ backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa' }">
            <div style="flex: 1; display: flex; align-items: center; gap: 12px;">
              <span :style="{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: log.level === 'error' ? '#fff2f0' : log.level === 'warning' ? '#fffbe6' : '#f6ffed',
                color: log.level === 'error' ? '#ff4d4f' : log.level === 'warning' ? '#faad14' : '#52c41a',
                border: '1px solid',
                borderColor: log.level === 'error' ? '#ffccc7' : log.level === 'warning' ? '#ffe58f' : '#b7eb8f'
              }">
                {{ log.level === 'error' ? '错误' : log.level === 'warning' ? '警告' : '信息' }}
              </span>
              <span>{{ log.message }}</span>
            </div>
            <div style="color: #999; font-size: 14px; min-width: 160px; text-align: right;">
              <JTimeFormat :time="log.timestamp" format="MM-DD HH:mm:ss" />
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        logs: [
          { level: 'info', message: '用户登录成功', timestamp: Date.now() - 1000 * 60 * 5 },
          { level: 'warning', message: '检测到异常访问频率', timestamp: Date.now() - 1000 * 60 * 15 },
          { level: 'error', message: '数据库连接失败', timestamp: Date.now() - 1000 * 60 * 30 },
          { level: 'info', message: '定时任务执行完成', timestamp: Date.now() - 1000 * 60 * 45 },
          { level: 'info', message: '系统启动成功', timestamp: Date.now() - 1000 * 60 * 60 }
        ]
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="log-panel">
    <div class="log-header">
      系统日志
    </div>
    <div class="log-content">
      <div 
        v-for="(log, index) in logs" 
        :key="index" 
        class="log-item"
        :class="{ 'log-item-even': index % 2 === 0 }"
      >
        <div class="log-info">
          <span 
            class="log-level"
            :class="[\`log-level-\${log.level}\`]"
          >
            {{ getLevelText(log.level) }}
          </span>
          <span>{{ log.message }}</span>
        </div>
        <div class="log-time">
          <JTimeFormat :time="log.timestamp" format="MM-DD HH:mm:ss" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JTimeFormat from '@jetlinks/components'

const logs = ref([
  { level: 'info', message: '用户登录成功', timestamp: Date.now() - 1000 * 60 * 5 },
  { level: 'warning', message: '检测到异常访问频率', timestamp: Date.now() - 1000 * 60 * 15 },
  { level: 'error', message: '数据库连接失败', timestamp: Date.now() - 1000 * 60 * 30 },
  { level: 'info', message: '定时任务执行完成', timestamp: Date.now() - 1000 * 60 * 45 },
  { level: 'info', message: '系统启动成功', timestamp: Date.now() - 1000 * 60 * 60 }
])

const getLevelText = (level: string) => {
  const levelMap = {
    error: '错误',
    warning: '警告',  
    info: '信息'
  }
  return levelMap[level] || level
}
</script>

<style scoped>
.log-panel {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.log-header {
  background: #fafafa;
  padding: 12px;
  font-weight: 600;
  border-bottom: 1px solid #e8e8e8;
}

.log-content {
  padding: 0;
}

.log-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.log-item-even {
  background: #fff;
}

.log-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.log-level {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid;
}

.log-level-error {
  background-color: #fff2f0;
  color: #ff4d4f;
  border-color: #ffccc7;
}

.log-level-warning {
  background-color: #fffbe6;
  color: #faad14;
  border-color: #ffe58f;
}

.log-level-info {
  background-color: #f6ffed;
  color: #52c41a;
  border-color: #b7eb8f;
}

.log-time {
  color: #999;
  font-size: 14px;
  min-width: 160px;
  text-align: right;
}
</style>`
      }
    }
  }
};

/**
 * 实时时间
 * 展示实时更新的时间显示
 */
export const 实时时间: Story = {
  render: () => ({
    components: { JTimeFormat },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: center; padding: 24px; border: 1px solid #e8e8e8; border-radius: 8px;">
        <h3 style="margin: 0; color: #333;">实时时间显示</h3>
        <div style="font-size: 24px; font-weight: 600; color: #1890ff;">
          <JTimeFormat :time="currentTime" format="YYYY-MM-DD HH:mm:ss" />
        </div>
        <div style="font-size: 16px; color: #666;">
          <JTimeFormat :time="currentTime" format="dddd, MMMM DD, YYYY" />
        </div>
        <div style="font-size: 14px; color: #999;">
          时间戳: {{ currentTime }}
        </div>
      </div>
    `,
    data() {
      return {
        currentTime: Date.now(),
        timer: null
      }
    },
    mounted() {
      this.timer = setInterval(() => {
        this.currentTime = Date.now()
      }, 1000)
    },
    beforeUnmount() {
      if (this.timer) {
        clearInterval(this.timer)
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="real-time-demo">
    <h3>实时时间显示</h3>
    <div class="time-display">
      <JTimeFormat :time="currentTime" format="YYYY-MM-DD HH:mm:ss" />
    </div>
    <div class="date-display">
      <JTimeFormat :time="currentTime" format="dddd, MMMM DD, YYYY" />
    </div>
    <div class="timestamp-display">
      时间戳: {{ currentTime }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import JTimeFormat from '@jetlinks/components'

const currentTime = ref(Date.now())
let timer: NodeJS.Timeout | null = null

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.real-time-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  padding: 24px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.real-time-demo h3 {
  margin: 0;
  color: #333;
}

.time-display {
  font-size: 24px;
  font-weight: 600;
  color: #1890ff;
}

.date-display {
  font-size: 16px;
  color: #666;
}

.timestamp-display {
  font-size: 14px;
  color: #999;
}
</style>`
      }
    }
  }
};