import CheckButton from './CheckButton.vue';
import type { App } from 'vue';

CheckButton.install = function (app: App) {
  app.component(CheckButton.name, CheckButton)
}
export default CheckButton;
