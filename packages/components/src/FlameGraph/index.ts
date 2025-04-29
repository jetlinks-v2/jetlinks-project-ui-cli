import FlameGraph from './FlameGraph.vue'
import type { App } from 'vue';

FlameGraph.install = function (app: App) {
  app.component(FlameGraph.name, FlameGraph)
}
export default FlameGraph;
