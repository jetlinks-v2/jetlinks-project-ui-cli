import type { App } from 'vue';
import EditTable from './EditTable.vue'
import EditTableBody from './Body.vue'
import EditTableHeader from './Header.vue'
import FormItem from './FormItem.vue'

EditTable.install = function (app: App) {
  app.component(EditTable.name, EditTable)
  app.component(EditTableBody.name, EditTableBody)
  app.component(EditTableHeader.name, EditTableHeader)
  app.component(FormItem.name, FormItem)
}
export default EditTable
