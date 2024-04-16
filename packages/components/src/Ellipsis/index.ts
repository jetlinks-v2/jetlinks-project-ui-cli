import Ellipsis from './Ellipsis.vue'
import type { App } from 'vue';

Ellipsis.install = function (app: App) {
  app.component(Ellipsis.name, Ellipsis)
}
export default Ellipsis
