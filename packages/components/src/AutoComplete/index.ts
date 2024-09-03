import AutoComplete from './AutoComplete.vue';
import type { App } from 'vue';

AutoComplete.install = function (app: App) {
  app.component(AutoComplete.name, AutoComplete)
}

export default AutoComplete;
