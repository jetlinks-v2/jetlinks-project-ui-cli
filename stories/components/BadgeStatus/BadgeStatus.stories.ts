import type { Meta, StoryObj } from '@storybook/vue3';
import JBadgeStatus from '../../../packages/components/src/BadgeStatus/Badge.vue';

/**
 * BadgeStatus 徽标状态组件
 * 
 * 这是一个用于显示状态的徽标组件，基于 ant-design-vue 的 Badge 组件封装。
 * 主要用于显示数据的状态信息，如成功、警告、错误等。
 * 
 * ## 何时使用
 * - 需要显示状态信息时
 * - 在列表或卡片中标识不同状态
 * - 需要用颜色区分不同类型的数据时
 */
const meta: Meta<typeof JBadgeStatus> = {
  title: '组件库/BadgeStatus 徽标状态',
  component: JBadgeStatus,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
BadgeStatus 是一个状态徽标组件，用于显示不同状态的标识。

### 主要特性
- 支持多种预设状态（成功、警告、错误、默认）
- 支持自定义状态映射
- 自动颜色匹配
- 基于 ant-design-vue Badge 组件

### 基本用法
\`\`\`vue
<template>
  <JBadgeStatus text="在线" status="success" />
</template>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: '显示的文本内容'
    },
    status: {
      control: 'select',
      options: ['success', 'warning', 'error', 'default'],
      description: '状态类型，可以是预设值或自定义值'
    },
    statusNames: {
      control: 'object',
      description: '自定义状态值颜色映射对象'
    }
  },
  args: {
    text: '状态文本',
    status: 'default'
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 默认状态
 * 最基本的用法，显示默认状态的徽标
 */
export const 默认状态: Story = {
  args: {
    text: '默认状态',
    status: 'default'
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JBadgeStatus text="默认状态" status="default" />
</template>

<script setup lang="ts">
import JBadgeStatus from '@jetlinks/components'
</script>`
      }
    }
  }
};

/**
 * 成功状态
 * 显示成功状态，通常用绿色表示
 */
export const 成功状态: Story = {
  args: {
    text: '在线',
    status: 'success'
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JBadgeStatus text="在线" status="success" />
</template>

<script setup lang="ts">
import JBadgeStatus from '@jetlinks/components'
</script>`
      }
    }
  }
};

/**
 * 警告状态
 * 显示警告状态，通常用橙色表示
 */
export const 警告状态: Story = {
  args: {
    text: '待处理',
    status: 'warning'
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JBadgeStatus text="待处理" status="warning" />
</template>

<script setup lang="ts">
import JBadgeStatus from '@jetlinks/components'
</script>`
      }
    }
  }
};

/**
 * 错误状态
 * 显示错误状态，通常用红色表示
 */
export const 错误状态: Story = {
  args: {
    text: '离线',
    status: 'error'
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JBadgeStatus text="离线" status="error" />
</template>

<script setup lang="ts">
import JBadgeStatus from '@jetlinks/components'
</script>`
      }
    }
  }
};

/**
 * 自定义状态映射
 * 演示如何使用自定义的状态值映射
 */
export const 自定义状态映射: Story = {
  args: {
    text: '已激活',
    status: '1',
    statusNames: {
      '1': 'success',
      '0': 'error',
      'pending': 'warning',
      'default': 'default'
    }
  },
  parameters: {
    docs: {
      source: {
        code: `<template>
  <JBadgeStatus 
    text="已激活" 
    status="1" 
    :status-names="statusNames" 
  />
</template>

<script setup lang="ts">
import JBadgeStatus from '@jetlinks/components'

const statusNames = {
  '1': 'success',    // 已激活
  '0': 'error',      // 未激活
  'pending': 'warning', // 待处理
  'default': 'default'  // 默认
}
</script>`
      },
      description: {
        story: `
这个示例展示了如何使用自定义的状态映射。你可以将数字、字符串等任意值映射到对应的颜色状态。

### 使用场景
- 后端返回数字状态码时
- 需要自定义状态值时
- 多种业务状态映射时
        `
      }
    }
  }
};

/**
 * 不同文本长度
 * 展示不同长度文本的显示效果
 */
export const 不同文本长度: Story = {
  render: () => ({
    components: { JBadgeStatus },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <JBadgeStatus text="短" status="success" />
        <JBadgeStatus text="中等长度文本" status="warning" />
        <JBadgeStatus text="这是一个比较长的状态描述文本" status="error" />
        <JBadgeStatus text="超长文本演示：设备运行状态正常且所有传感器数据已同步" status="default" />
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <JBadgeStatus text="短" status="success" />
    <JBadgeStatus text="中等长度文本" status="warning" />
    <JBadgeStatus text="这是一个比较长的状态描述文本" status="error" />
    <JBadgeStatus text="超长文本演示：设备运行状态正常且所有传感器数据已同步" status="default" />
  </div>
</template>

<script setup lang="ts">
import JBadgeStatus from '@jetlinks/components'
</script>

<style scoped>
/* 可选的样式 */
.status-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>`
      },
      description: {
        story: '演示不同长度文本的显示效果，组件会自动适应文本长度。'
      }
    }
  }
};

/**
 * 设备状态示例
 * 模拟真实的设备状态场景
 */
export const 设备状态示例: Story = {
  render: () => ({
    components: { JBadgeStatus },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 300px;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border: 1px solid #d9d9d9; border-radius: 4px;">
          <span>设备001</span>
          <JBadgeStatus text="在线" status="success" />
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border: 1px solid #d9d9d9; border-radius: 4px;">
          <span>设备002</span>
          <JBadgeStatus text="维护中" status="warning" />
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border: 1px solid #d9d9d9; border-radius: 4px;">
          <span>设备003</span>
          <JBadgeStatus text="故障" status="error" />
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border: 1px solid #d9d9d9; border-radius: 4px;">
          <span>设备004</span>
          <JBadgeStatus text="未知" status="default" />
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="device-list">
    <div class="device-item">
      <span>设备001</span>
      <JBadgeStatus text="在线" status="success" />
    </div>
    <div class="device-item">
      <span>设备002</span>
      <JBadgeStatus text="维护中" status="warning" />
    </div>
    <div class="device-item">
      <span>设备003</span>
      <JBadgeStatus text="故障" status="error" />
    </div>
    <div class="device-item">
      <span>设备004</span>
      <JBadgeStatus text="未知" status="default" />
    </div>
  </div>
</template>

<script setup lang="ts">
import JBadgeStatus from '@jetlinks/components'
</script>

<style scoped>
.device-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 300px;
}

.device-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}
</style>`
      },
      description: {
        story: '这是一个实际应用场景的示例，展示了在设备列表中如何使用 BadgeStatus 组件来显示设备状态。'
      }
    }
  }
};

/**
 * 数字状态映射示例
 * 演示数字到状态的映射用法
 */
export const 数字状态映射: Story = {
  render: () => ({
    components: { JBadgeStatus },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="margin-bottom: 12px; font-weight: bold;">订单状态示例：</div>
        <JBadgeStatus text="待支付" :status="0" :status-names="statusMapping" />
        <JBadgeStatus text="已支付" :status="1" :status-names="statusMapping" />
        <JBadgeStatus text="配送中" :status="2" :status-names="statusMapping" />
        <JBadgeStatus text="已完成" :status="3" :status-names="statusMapping" />
        <JBadgeStatus text="已取消" :status="4" :status-names="statusMapping" />
      </div>
    `,
    data() {
      return {
        statusMapping: {
          0: 'warning',   // 待支付
          1: 'default',   // 已支付
          2: 'default',   // 配送中
          3: 'success',   // 已完成
          4: 'error'      // 已取消
        }
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="order-status-demo">
    <div class="title">订单状态示例：</div>
    <JBadgeStatus text="待支付" :status="0" :status-names="statusMapping" />
    <JBadgeStatus text="已支付" :status="1" :status-names="statusMapping" />
    <JBadgeStatus text="配送中" :status="2" :status-names="statusMapping" />
    <JBadgeStatus text="已完成" :status="3" :status-names="statusMapping" />
    <JBadgeStatus text="已取消" :status="4" :status-names="statusMapping" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JBadgeStatus from '@jetlinks/components'

// 定义数字状态码到颜色状态的映射
const statusMapping = ref({
  0: 'warning',   // 待支付 - 橙色警告
  1: 'default',   // 已支付 - 默认灰色
  2: 'default',   // 配送中 - 默认灰色  
  3: 'success',   // 已完成 - 绿色成功
  4: 'error'      // 已取消 - 红色错误
})
</script>

<style scoped>
.order-status-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title {
  margin-bottom: 12px;
  font-weight: bold;
}
</style>`
      },
      description: {
        story: `
这个示例展示了如何将数字状态码映射到对应的颜色状态，适用于后端返回数字状态码的场景。

### 使用场景
- 后端API返回数字状态码
- 订单状态、任务状态等业务场景
- 需要将业务状态码转换为视觉状态

### 状态码映射说明
- 0: warning (待支付) 
- 1: default (已支付)
- 2: default (配送中)
- 3: success (已完成)
- 4: error (已取消)
        `
      }
    }
  }
};