import ValueItem from './ValueItem.vue'
import type { App } from 'vue';

ValueItem.install = function (app: App) {
  app.component(ValueItem.name, ValueItem)
}
export default ValueItem
