import type { App } from 'vue';
import DragModal from "./DragModal.vue";

DragModal.install = function (app: App) {
  app.component(DragModal.name, DragModal)
}
export default DragModal
