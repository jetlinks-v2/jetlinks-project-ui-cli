import Empty from './Empty.vue'
import type { App } from 'vue';

Empty.install = function (app: App) {
  app.component(Empty.name, Empty)
}
export default Empty;
