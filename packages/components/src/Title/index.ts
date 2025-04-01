import Title from './title.vue';
import type { App } from 'vue';

Title.install = function (app: App) {
  app.component(Title.name, Title)
}
export default Title;
