import type { Preview } from '@storybook/vue3';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import { setup } from '@storybook/vue3';
import JComponents from '../packages/components/src'
import '../packages/components/lib/style/index.css'
import Antdv from "ant-design-vue";

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
  }
};

export default preview;
