import BadgeStatus from './Badge.vue'
import type { App } from 'vue';

BadgeStatus.install = function (app: App) {
  app.component(BadgeStatus.name, BadgeStatus)
}

export * from './color'
export default BadgeStatus
