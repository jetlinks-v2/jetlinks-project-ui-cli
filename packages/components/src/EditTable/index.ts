import type { App } from 'vue';
import EditTable from './EditTable.vue'
import FormItem from './FormItem.vue'

EditTable.install = function (app: App) {
  app.component(EditTable.name, EditTable)
  app.component(FormItem.name, FormItem)
}
export default EditTable
