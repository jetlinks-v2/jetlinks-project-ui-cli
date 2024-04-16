import AIcon from './icon';
import type { App } from 'vue';

AIcon.install = function (app: App) {
  app.component(AIcon.name, AIcon)
}
export default AIcon;
