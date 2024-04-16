import FullPage from './FullPage.vue'
import type { App } from 'vue';

FullPage.install = function (app: App) {
  app.component(FullPage.name, FullPage)
}
export default FullPage
