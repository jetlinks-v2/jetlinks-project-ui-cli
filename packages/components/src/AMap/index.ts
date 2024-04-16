import Map from './Map.vue'
import type { App } from 'vue';

Map.install = function (app: App) {
  app.component(Map.name, Map)
}
export default Map
