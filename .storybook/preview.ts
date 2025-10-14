import type { Preview } from '@storybook/vue3';
import Antd from 'ant-design-vue';
import { setup } from '@storybook/vue3';
import JComponents from '../packages/components/src'
import Antdv from "ant-design-vue";
import 'ant-design-vue/dist/reset.css'; // 导入 Ant Design Vue 样式

setup((app) => {
  app.use(Antd).use(JComponents).use(Antdv) // 注册自定义通用组件
})

const preview: Preview = {
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
        type: 'auto'
      }
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
  }
};

export default preview;
