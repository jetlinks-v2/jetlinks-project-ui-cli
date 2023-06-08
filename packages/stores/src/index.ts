import { createPinia } from 'pinia'
import type { App } from 'vue'

const pinia = createPinia()

export function setupPinia(app: App) {
    app.use(pinia)
}

export * from 'pinia'

export * from './global'
