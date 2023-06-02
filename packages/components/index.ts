import type { App } from 'vue'

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
