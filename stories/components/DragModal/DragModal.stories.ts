import type { Meta, StoryObj } from '@storybook/vue3';
import JDragModal from '../../../packages/components/src/DragModal/DragModal.vue';

/**
 * JDragModal 可拖拽模态框组件
 *
 * 这是一个支持拖拽和缩放的模态框组件，用户可以自由拖动和调整模态框的位置和大小。
 * 相比普通模态框，提供了更好的交互体验和灵活性。
 *
 * ## 何时使用
 * - 需要可拖拽的模态框时
 * - 需要调整模态框大小时
 * - 需要灵活布局的弹窗时
 * - 需要多个模态框同时显示时
 */
const meta: Meta<typeof JDragModal> = {
  title: '组件库/DragModal 拖拽模态框',
  component: JDragModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
JDragModal 是一个支持拖拽和缩放的模态框组件。

### 主要特性
- 支持拖拽移动位置
- 支持右下角拖拽调整大小
- 支持自定义标题和底部
- 支持最小尺寸限制
- 内置国际化支持
- 支持事件回调

### 基本用法
\`\`\`vue
<template>
  <JDragModal 
    title="标题"
    :width="500"
    :height="300"
  >
    模态框内容
  </JDragModal>
</template>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: '模态框标题'
    },
    width: {
      control: 'number',
      description: '模态框宽度'
    },
    height: {
      control: 'number',
      description: '模态框高度'
    },
    footer: {
      control: 'boolean',
      description: '是否显示底部'
    },
    dragRang: {
      control: 'object',
      description: '拖拽范围限制 [minWidth, minHeight]'
    },
    bodyStyle: {
      control: 'object',
      description: '内容区域样式'
    }
  },
  args: {
    title: '拖拽模态框',
    width: 500,
    height: 300,
    footer: true,
    dragRang: [400, 200]
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基础使用
 * 最基本的拖拽模态框
 */
export const 基础使用: Story = {
  render: (args) => ({
    components: { JDragModal },
    setup() {
      return { args };
    },
    template: `
      <div style="height: 100vh; position: relative; background: #f0f2f5;">
        <JDragModal v-bind="args">
          <div style="padding: 20px;">
            <h3 style="margin: 0 0 16px 0;">欢迎使用拖拽模态框</h3>
            <p style="margin: 0 0 12px 0; color: #666;">
              这是一个支持拖拽和缩放的模态框组件，您可以：
            </p>
            <ul style="margin: 0; color: #666;">
              <li>拖拽标题栏移动模态框位置</li>
              <li>拖拽右下角调整模态框大小</li>
              <li>点击确定或取消按钮</li>
            </ul>
          </div>
        </JDragModal>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div style="height: 100vh; position: relative; background: #f0f2f5;">
    <JDragModal 
      title="拖拽模态框"
      :width="500"
      :height="300"
    >
      <div style="padding: 20px;">
        <h3>欢迎使用拖拽模态框</h3>
        <p>这是一个支持拖拽和缩放的模态框组件，您可以：</p>
        <ul>
          <li>拖拽标题栏移动模态框位置</li>
          <li>拖拽右下角调整模态框大小</li>
          <li>点击确定或取消按钮</li>
        </ul>
      </div>
    </JDragModal>
  </div>
</template>

<script setup lang="ts">
</script>`
      }
    }
  }
};

/**
 * 无标题模态框
 * 设置title为false隐藏标题栏
 */
export const 无标题模态框: Story = {
  render: () => ({
    components: { JDragModal },
    template: `
      <div style="height: 100vh; position: relative; background: #f0f2f5;">
        <JDragModal 
          :title="false"
          :width="400"
          :height="250"
          :footer="false"
        >
          <div style="padding: 24px; text-align: center;">
            <div style="width: 60px; height: 60px; background: #1890ff; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 24px;">✓</span>
            </div>
            <h3 style="margin: 0 0 12px 0;">操作成功</h3>
            <p style="margin: 0; color: #666;">
              您的操作已成功完成！
            </p>
          </div>
        </JDragModal>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div style="height: 100vh; position: relative; background: #f0f2f5;">
    <JDragModal 
      :title="false"
      :width="400"
      :height="250"
      :footer="false"
    >
      <div style="padding: 24px; text-align: center;">
        <div class="success-icon">
          <span>✓</span>
        </div>
        <h3>操作成功</h3>
        <p>您的操作已成功完成！</p>
      </div>
    </JDragModal>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.success-icon {
  width: 60px;
  height: 60px;
  background: #1890ff;
  border-radius: 50%;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

h3 {
  margin: 0 0 12px 0;
}

p {
  margin: 0;
  color: #666;
}
</style>`
      }
    }
  }
};

/**
 * 自定义底部
 * 使用插槽自定义底部内容
 */
export const 自定义底部: Story = {
  render: () => ({
    components: { JDragModal },
    template: `
      <div style="height: 100vh; position: relative; background: #f0f2f5;">
        <JDragModal 
          title="用户信息"
          :width="450"
          :height="350"
        >
          <div style="padding: 20px;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
              <img 
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                style="width: 60px; height: 60px; border-radius: 50%;"
                alt="avatar"
              />
              <div>
                <h3 style="margin: 0 0 4px 0;">张三</h3>
                <p style="margin: 0; color: #666;">前端开发工程师</p>
              </div>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #666;">邮箱:</span>
                <span>zhang.san@company.com</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #666;">部门:</span>
                <span>技术部</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #666;">入职时间:</span>
                <span>2021-06-01</span>
              </div>
            </div>
          </div>
          
          <template #footer>
            <div style="display: flex; justify-content: space-between; width: 100%;">
              <div>
                <button style="padding: 6px 12px; border: 1px solid #d9d9d9; border-radius: 4px; background: white; margin-right: 8px;">
                  编辑
                </button>
                <button style="padding: 6px 12px; border: 1px solid #ff4d4f; border-radius: 4px; background: white; color: #ff4d4f;">
                  删除
                </button>
              </div>
              <button style="padding: 6px 12px; border: 1px solid #1890ff; border-radius: 4px; background: #1890ff; color: white;">
                关闭
              </button>
            </div>
          </template>
        </JDragModal>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div style="height: 100vh; position: relative; background: #f0f2f5;">
    <JDragModal 
      title="用户信息"
      :width="450"
      :height="350"
    >
      <div style="padding: 20px;">
        <div class="user-header">
          <img 
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            class="user-avatar"
            alt="avatar"
          />
          <div class="user-basic">
            <h3>张三</h3>
            <p>前端开发工程师</p>
          </div>
        </div>
        
        <div class="user-details">
          <div class="detail-item">
            <span class="label">邮箱:</span>
            <span>zhang.san@company.com</span>
          </div>
          <div class="detail-item">
            <span class="label">部门:</span>
            <span>技术部</span>
          </div>
          <div class="detail-item">
            <span class="label">入职时间:</span>
            <span>2021-06-01</span>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="custom-footer">
          <div class="footer-left">
            <button class="btn-secondary">编辑</button>
            <button class="btn-danger">删除</button>
          </div>
          <button class="btn-primary">关闭</button>
        </div>
      </template>
    </JDragModal>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.user-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.user-basic h3 {
  margin: 0 0 4px 0;
}

.user-basic p {
  margin: 0;
  color: #666;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
}

.label {
  color: #666;
}

.custom-footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.footer-left {
  display: flex;
  gap: 8px;
}

.btn-secondary {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.btn-danger {
  padding: 6px 12px;
  border: 1px solid #ff4d4f;
  border-radius: 4px;
  background: white;
  color: #ff4d4f;
  cursor: pointer;
}

.btn-primary {
  padding: 6px 12px;
  border: 1px solid #1890ff;
  border-radius: 4px;
  background: #1890ff;
  color: white;
  cursor: pointer;
}
</style>`
      }
    }
  }
};

/**
 * 表单模态框
 * 在模态框中使用表单
 */
export const 表单模态框: Story = {
  render: () => ({
    components: { JDragModal },
    template: `
      <div style="height: 100vh; position: relative; background: #f0f2f5;">
        <JDragModal 
          title="创建项目"
          :width="500"
          :height="400"
          :dragRang="[450, 350]"
        >
          <div style="padding: 20px;">
            <form style="display: flex; flex-direction: column; gap: 16px;">
              <div>
                <label style="display: block; margin-bottom: 6px; font-weight: 500;">项目名称</label>
                <input 
                  type="text" 
                  placeholder="请输入项目名称"
                  style="width: 100%; padding: 8px 12px; border: 1px solid #d9d9d9; border-radius: 4px; box-sizing: border-box;"
                />
              </div>
              
              <div>
                <label style="display: block; margin-bottom: 6px; font-weight: 500;">项目类型</label>
                <select 
                  style="width: 100%; padding: 8px 12px; border: 1px solid #d9d9d9; border-radius: 4px; box-sizing: border-box;"
                >
                  <option value="">请选择项目类型</option>
                  <option value="web">Web应用</option>
                  <option value="mobile">移动应用</option>
                  <option value="desktop">桌面应用</option>
                </select>
              </div>
              
              <div>
                <label style="display: block; margin-bottom: 6px; font-weight: 500;">技术栈</label>
                <div style="display: flex; flex-wrap: gap: 8px;">
                  <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                    <input type="checkbox" /> Vue.js
                  </label>
                  <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                    <input type="checkbox" /> React
                  </label>
                  <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                    <input type="checkbox" /> Angular
                  </label>
                  <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                    <input type="checkbox" /> Node.js
                  </label>
                </div>
              </div>
              
              <div>
                <label style="display: block; margin-bottom: 6px; font-weight: 500;">项目描述</label>
                <textarea 
                  placeholder="请输入项目描述"
                  rows="3"
                  style="width: 100%; padding: 8px 12px; border: 1px solid #d9d9d9; border-radius: 4px; box-sizing: border-box; resize: vertical;"
                ></textarea>
              </div>
            </form>
          </div>
        </JDragModal>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div style="height: 100vh; position: relative; background: #f0f2f5;">
    <JDragModal 
      title="创建项目"
      :width="500"
      :height="400"
      :dragRang="[450, 350]"
    >
      <div style="padding: 20px;">
        <form class="project-form">
          <div class="form-item">
            <label>项目名称</label>
            <input 
              type="text" 
              placeholder="请输入项目名称"
              v-model="projectForm.name"
            />
          </div>
          
          <div class="form-item">
            <label>项目类型</label>
            <select v-model="projectForm.type">
              <option value="">请选择项目类型</option>
              <option value="web">Web应用</option>
              <option value="mobile">移动应用</option>
              <option value="desktop">桌面应用</option>
            </select>
          </div>
          
          <div class="form-item">
            <label>技术栈</label>
            <div class="checkbox-group">
              <label class="checkbox-item">
                <input type="checkbox" v-model="projectForm.techs" value="vue" /> 
                Vue.js
              </label>
              <label class="checkbox-item">
                <input type="checkbox" v-model="projectForm.techs" value="react" /> 
                React
              </label>
              <label class="checkbox-item">
                <input type="checkbox" v-model="projectForm.techs" value="angular" /> 
                Angular
              </label>
              <label class="checkbox-item">
                <input type="checkbox" v-model="projectForm.techs" value="nodejs" /> 
                Node.js
              </label>
            </div>
          </div>
          
          <div class="form-item">
            <label>项目描述</label>
            <textarea 
              placeholder="请输入项目描述"
              rows="3"
              v-model="projectForm.description"
            ></textarea>
          </div>
        </form>
      </div>
    </JDragModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const projectForm = ref({
  name: '',
  type: '',
  techs: [],
  description: ''
})
</script>

<style scoped>
.project-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-item label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-item input,
.form-item select,
.form-item textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-item textarea {
  resize: vertical;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-weight: normal !important;
}

.checkbox-item input {
  width: auto;
  margin: 0;
  padding: 0;
}
</style>`
      }
    }
  }
};

/**
 * 实际应用场景
 * 在实际业务场景中的应用示例
 */
export const 实际应用场景: Story = {
  render: () => ({
    components: { JDragModal },
    template: `
      <div style="height: 100vh; position: relative; background: #f0f2f5; padding: 20px;">
        <!-- 模拟主界面 -->
        <div style="background: white; border-radius: 8px; padding: 24px; height: calc(100vh - 40px); position: relative;">
          <h2 style="margin: 0 0 20px 0;">项目管理系统</h2>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
            <div style="padding: 16px; border: 1px solid #e8e8e8; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #1890ff;">28</div>
              <div style="color: #666; font-size: 14px;">进行中项目</div>
            </div>
            <div style="padding: 16px; border: 1px solid #e8e8e8; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #52c41a;">156</div>
              <div style="color: #666; font-size: 14px;">已完成项目</div>
            </div>
            <div style="padding: 16px; border: 1px solid #e8e8e8; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #faad14;">12</div>
              <div style="color: #666; font-size: 14px;">待审核项目</div>
            </div>
          </div>
          
          <div style="margin-bottom: 16px;">
            <button 
              style="padding: 8px 16px; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px;"
              @click="showDetailModal = !showDetailModal"
            >
              查看项目详情
            </button>
            <button 
              style="padding: 8px 16px; background: #52c41a; color: white; border: none; border-radius: 4px; cursor: pointer;"
              @click="showSettingsModal = !showSettingsModal"
            >
              系统设置
            </button>
          </div>
          
          <!-- 项目详情模态框 -->
          <JDragModal 
            v-if="showDetailModal"
            title="项目详情 - 电商平台前端"
            :width="600"
            :height="450"
            @cancel="showDetailModal = false"
          >
            <div style="padding: 20px;">
              <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                <img 
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  style="width: 80px; height: 80px; border-radius: 8px;"
                  alt="project"
                />
                <div style="flex: 1;">
                  <h3 style="margin: 0 0 8px 0;">电商平台前端</h3>
                  <p style="margin: 0 0 8px 0; color: #666;">
                    基于Vue.js 3.0构建的现代化电商平台前端应用
                  </p>
                  <div style="display: flex; gap: 12px; margin-bottom: 8px;">
                    <span style="padding: 2px 8px; background: #e6f7ff; color: #1890ff; border-radius: 12px; font-size: 12px;">Vue.js</span>
                    <span style="padding: 2px 8px; background: #f6ffed; color: #52c41a; border-radius: 12px; font-size: 12px;">TypeScript</span>
                    <span style="padding: 2px 8px; background: #fff2e8; color: #faad14; border-radius: 12px; font-size: 12px;">Ant Design</span>
                  </div>
                  <div style="color: #666; font-size: 14px;">
                    负责人: 张三 | 创建时间: 2024-01-15
                  </div>
                </div>
              </div>
              
              <div style="border-top: 1px solid #f0f0f0; padding-top: 16px;">
                <h4 style="margin: 0 0 12px 0;">项目进度</h4>
                <div style="background: #f5f5f5; border-radius: 10px; height: 8px; margin-bottom: 8px;">
                  <div style="background: #1890ff; height: 8px; border-radius: 10px; width: 75%;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 14px; color: #666;">
                  <span>已完成 75%</span>
                  <span>预计完成: 2024-03-30</span>
                </div>
              </div>
              
              <div style="margin-top: 20px;">
                <h4 style="margin: 0 0 12px 0;">团队成员</h4>
                <div style="display: flex; gap: 8px;">
                  <img 
                    v-for="i in 5" 
                    :key="i"
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    style="width: 32px; height: 32px; border-radius: 50%;"
                    alt="member"
                  />
                </div>
              </div>
            </div>
          </JDragModal>
          
          <!-- 系统设置模态框 -->
          <JDragModal 
            v-if="showSettingsModal"
            title="系统设置"
            :width="500"
            :height="400"
            @cancel="showSettingsModal = false"
          >
            <div style="padding: 20px;">
              <div style="margin-bottom: 24px;">
                <h4 style="margin: 0 0 16px 0;">基础设置</h4>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>系统通知</span>
                    <label style="position: relative; display: inline-block; width: 44px; height: 24px;">
                      <input type="checkbox" checked style="opacity: 0; width: 0; height: 0;" />
                      <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #1890ff; border-radius: 24px; transition: .4s;">
                        <span style="position: absolute; content: ''; height: 18px; width: 18px; left: 22px; bottom: 3px; background-color: white; border-radius: 50%; transition: .4s;"></span>
                      </span>
                    </label>
                  </div>
                  
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>邮件提醒</span>
                    <label style="position: relative; display: inline-block; width: 44px; height: 24px;">
                      <input type="checkbox" style="opacity: 0; width: 0; height: 0;" />
                      <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; border-radius: 24px; transition: .4s;">
                        <span style="position: absolute; content: ''; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; border-radius: 50%; transition: .4s;"></span>
                      </span>
                    </label>
                  </div>
                  
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>自动保存</span>
                    <label style="position: relative; display: inline-block; width: 44px; height: 24px;">
                      <input type="checkbox" checked style="opacity: 0; width: 0; height: 0;" />
                      <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #1890ff; border-radius: 24px; transition: .4s;">
                        <span style="position: absolute; content: ''; height: 18px; width: 18px; left: 22px; bottom: 3px; background-color: white; border-radius: 50%; transition: .4s;"></span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 style="margin: 0 0 16px 0;">主题设置</h4>
                <div style="display: flex; gap: 12px;">
                  <div style="width: 60px; height: 40px; background: white; border: 2px solid #1890ff; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px;">
                    浅色
                  </div>
                  <div style="width: 60px; height: 40px; background: #2c3e50; border: 2px solid transparent; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; color: white;">
                    深色
                  </div>
                  <div style="width: 60px; height: 40px; background: linear-gradient(135deg, white 50%, #2c3e50 50%); border: 2px solid transparent; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px;">
                    自动
                  </div>
                </div>
              </div>
            </div>
          </JDragModal>
        </div>
      </div>
    `,
    data() {
      return {
        showDetailModal: true,
        showSettingsModal: false
      }
    }
  }),
  parameters: {
    docs: {
      source: {
        code: `<template>
  <div class="application-demo">
    <!-- 主界面 -->
    <div class="main-content">
      <h2>项目管理系统</h2>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number primary">28</div>
          <div class="stat-label">进行中项目</div>
        </div>
        <div class="stat-card">
          <div class="stat-number success">156</div>
          <div class="stat-label">已完成项目</div>
        </div>
        <div class="stat-card">
          <div class="stat-number warning">12</div>
          <div class="stat-label">待审核项目</div>
        </div>
      </div>
      
      <div class="actions">
        <button class="btn-primary" @click="showDetailModal = true">
          查看项目详情
        </button>
        <button class="btn-success" @click="showSettingsModal = true">
          系统设置
        </button>
      </div>
      
      <!-- 项目详情模态框 -->
      <JDragModal 
        v-if="showDetailModal"
        title="项目详情 - 电商平台前端"
        :width="600"
        :height="450"
        @cancel="showDetailModal = false"
      >
        <div class="project-detail">
          <div class="project-header">
            <img 
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              class="project-image"
              alt="project"
            />
            <div class="project-info">
              <h3>电商平台前端</h3>
              <p>基于Vue.js 3.0构建的现代化电商平台前端应用</p>
              <div class="tech-tags">
                <span class="tag primary">Vue.js</span>
                <span class="tag success">TypeScript</span>
                <span class="tag warning">Ant Design</span>
              </div>
              <div class="project-meta">
                负责人: 张三 | 创建时间: 2024-01-15
              </div>
            </div>
          </div>
          
          <div class="progress-section">
            <h4>项目进度</h4>
            <div class="progress-bar">
              <div class="progress-fill" style="width: 75%;"></div>
            </div>
            <div class="progress-info">
              <span>已完成 75%</span>
              <span>预计完成: 2024-03-30</span>
            </div>
          </div>
          
          <div class="team-section">
            <h4>团队成员</h4>
            <div class="team-avatars">
              <img 
                v-for="i in 5" 
                :key="i"
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                class="team-avatar"
                alt="member"
              />
            </div>
          </div>
        </div>
      </JDragModal>
      
      <!-- 系统设置模态框 -->
      <JDragModal 
        v-if="showSettingsModal"
        title="系统设置"
        :width="500"
        :height="400"
        @cancel="showSettingsModal = false"
      >
        <div class="settings-content">
          <div class="settings-section">
            <h4>基础设置</h4>
            <div class="setting-items">
              <div class="setting-item">
                <span>系统通知</span>
                <label class="switch">
                  <input type="checkbox" checked />
                  <span class="slider round"></span>
                </label>
              </div>
              
              <div class="setting-item">
                <span>邮件提醒</span>
                <label class="switch">
                  <input type="checkbox" />
                  <span class="slider round"></span>
                </label>
              </div>
              
              <div class="setting-item">
                <span>自动保存</span>
                <label class="switch">
                  <input type="checkbox" checked />
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
          </div>
          
          <div class="settings-section">
            <h4>主题设置</h4>
            <div class="theme-options">
              <div class="theme-option active light">浅色</div>
              <div class="theme-option dark">深色</div>
              <div class="theme-option auto">自动</div>
            </div>
          </div>
        </div>
      </JDragModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showDetailModal = ref(false)
const showSettingsModal = ref(false)
</script>

<style scoped>
.application-demo {
  height: 100vh;
  background: #f0f2f5;
  padding: 20px;
}

.main-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  height: calc(100vh - 40px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-number.primary { color: #1890ff; }
.stat-number.success { color: #52c41a; }
.stat-number.warning { color: #faad14; }

.stat-label {
  color: #666;
  font-size: 14px;
}

.actions {
  margin-bottom: 16px;
}

.btn-primary {
  padding: 8px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
}

.btn-success {
  padding: 8px 16px;
  background: #52c41a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.project-detail {
  padding: 20px;
}

.project-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.project-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
}

.project-info {
  flex: 1;
}

.project-info h3 {
  margin: 0 0 8px 0;
}

.project-info p {
  margin: 0 0 8px 0;
  color: #666;
}

.tech-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.tag {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.tag.primary { background: #e6f7ff; color: #1890ff; }
.tag.success { background: #f6ffed; color: #52c41a; }
.tag.warning { background: #fff2e8; color: #faad14; }

.project-meta {
  color: #666;
  font-size: 14px;
}

.progress-section {
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
  margin-bottom: 20px;
}

.progress-section h4 {
  margin: 0 0 12px 0;
}

.progress-bar {
  background: #f5f5f5;
  border-radius: 10px;
  height: 8px;
  margin-bottom: 8px;
  overflow: hidden;
}

.progress-fill {
  background: #1890ff;
  height: 100%;
  transition: width 0.3s ease;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
}

.team-section h4 {
  margin: 0 0 12px 0;
}

.team-avatars {
  display: flex;
  gap: 8px;
}

.team-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.settings-content {
  padding: 20px;
}

.settings-section {
  margin-bottom: 24px;
}

.settings-section h4 {
  margin: 0 0 16px 0;
}

.setting-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #1890ff;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

.theme-options {
  display: flex;
  gap: 12px;
}

.theme-option {
  width: 60px;
  height: 40px;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: border-color 0.3s;
}

.theme-option.active {
  border-color: #1890ff;
}

.theme-option.light {
  background: white;
}

.theme-option.dark {
  background: #2c3e50;
  color: white;
}

.theme-option.auto {
  background: linear-gradient(135deg, white 50%, #2c3e50 50%);
}
</style>`
      }
    }
  }
};
