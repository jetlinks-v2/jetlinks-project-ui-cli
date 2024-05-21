import ProLayout from './Basic/BasicLayout';
import PageContainer from './PageContainer';
import { LayoutType } from './defaultSettings'
import type { App } from 'vue';

ProLayout.install = function (app: App) {
  app.component(ProLayout.name, ProLayout)
}

export { PageContainer, LayoutType };
export default ProLayout;

