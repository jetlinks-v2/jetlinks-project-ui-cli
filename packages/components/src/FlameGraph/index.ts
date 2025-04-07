import FlameGraph from './index.vue'
import type { App } from 'vue';

FlameGraph.install = function (app: App) {
  app.component(FlameGraph.name, FlameGraph)
}
export default FlameGraph;
