import Scrollbar from './Scrollbar.vue'
import type { App } from 'vue';

Scrollbar.install = function (app: App) {
  app.component(Scrollbar.name, Scrollbar)
}
export default Scrollbar;

