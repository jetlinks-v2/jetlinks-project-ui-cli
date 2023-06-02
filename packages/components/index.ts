import type { App } from 'vue'
export { default as BlankLayoutPage} from './layout/BlankLayoutPage.vue'
export { default as Iframe} from './layout/Iframe.vue'
export { default as BasicLayoutPage} from './layout/BasicLayoutPage.vue'

import FullPage from './FullPage/index.vue'
import PermissionButton from './PermissionButton/index'
import { PageContainer, AIcon } from 'jetlinks-ui-components'

export default {
  install(app: App) {
    app.component('PageContainer', PageContainer)
      .component('AIcon', AIcon)
      .component('PermissionButton', PermissionButton)
      .component('FullPage', FullPage)
  }
}
