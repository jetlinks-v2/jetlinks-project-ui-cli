import TimeFormat from './timeFormat.vue'
import type { App } from 'vue';

TimeFormat.install = function (app: App) {
  app.component(TimeFormat.name, TimeFormat)
}

export default TimeFormat
