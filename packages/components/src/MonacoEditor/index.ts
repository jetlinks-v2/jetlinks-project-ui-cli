import Monaco from './Monaco.vue';
import type { App } from 'vue';

Monaco.install = function (app: App) {
  app.component(Monaco.name, Monaco)
}
export default Monaco;
