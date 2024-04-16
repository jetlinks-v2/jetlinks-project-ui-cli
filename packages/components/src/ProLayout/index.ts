import ProLayout from './Basic/BasicLayout';
import PageContainer from './PageContainer';
import type { App } from 'vue';

ProLayout.install = function (app: App) {
  app.component(ProLayout.name, ProLayout)
}

export { PageContainer };
export default ProLayout;

