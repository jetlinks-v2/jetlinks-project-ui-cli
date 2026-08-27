import type { Preview } from '@storybook/vue3'
import Antd, { theme } from 'ant-design-vue'
import { setup } from '@storybook/vue3'
import JComponents from '../packages/components/src'
import 'ant-design-vue/dist/reset.css' // 导入 Ant Design Vue 样式
import './preview.css'

setup((app) => {
  app.use(Antd).use(JComponents) // 注册自定义通用组件
})

const preview: Preview = {
  globalTypes: {
    antdTheme: {
      name: 'Theme',
      description: 'Ant Design Vue theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      const isDark = context.globals.antdTheme === 'dark'
      const themeConfig = {
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }
      const storyBackground = isDark ? '#000000' : '#ffffff'
      const storyColor = isDark
        ? 'rgba(255, 255, 255, 0.85)'
        : 'rgba(0, 0, 0, 0.88)'
      const scrollbarTrack = isDark
        ? 'rgba(255, 255, 255, 0.06)'
        : 'rgba(0, 0, 0, 0.04)'
      const scrollbarThumb = isDark
        ? 'rgba(255, 255, 255, 0.24)'
        : 'rgba(0, 0, 0, 0.22)'
      const scrollbarThumbHover = isDark
        ? 'rgba(255, 255, 255, 0.36)'
        : 'rgba(0, 0, 0, 0.34)'

      return {
        components: { story },
        setup() {
          return {
            themeConfig,
            storyBackground,
            storyColor,
            scrollbarTrack,
            scrollbarThumb,
            scrollbarThumbHover,
          }
        },
        template: `
          <a-config-provider :theme="themeConfig">
            <div
              class="jetlinks-story-theme"
              :style="{
                minHeight: '100vh',
                background: storyBackground,
                color: storyColor,
                '--j-story-scrollbar-track': scrollbarTrack,
                '--j-story-scrollbar-thumb': scrollbarThumb,
                '--j-story-scrollbar-thumb-hover': scrollbarThumbHover
              }"
            >
              <story />
            </div>
          </a-config-provider>
        `,
      }
    },
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      source: {
        type: 'auto',
      },
    },
    test: { disable: true },
    // 设置默认背景为 Ant Design Vue 风格
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'grey',
          value: '#f5f5f5',
        },
        {
          name: 'dark',
          value: '#001529',
        },
      ],
    },
    // 设置默认视口
    viewport: {
      viewports: {
        responsive: {
          name: 'Responsive',
          styles: {
            width: '100%',
            height: '100%',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1200px',
            height: '800px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
      },
    },
  },
}

export default preview
