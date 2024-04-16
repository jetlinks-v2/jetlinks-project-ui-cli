import CardSelect from "./CardSelect.vue";
import type { App } from 'vue';

CardSelect.install = function (app: App) {
  app.component(CardSelect.name, CardSelect)
}
export default CardSelect
