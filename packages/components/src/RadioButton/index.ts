import RadioButton from './RadioButton.vue'
import type { App } from 'vue';

RadioButton.install = function (app: App) {
  app.component(RadioButton.name, RadioButton)
  return app
}

export default RadioButton
