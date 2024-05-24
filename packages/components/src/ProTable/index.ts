import ProTable from './ProTable.vue'
import type { App } from 'vue';

ProTable.install = function (app: App) {
    app.component(ProTable.name, ProTable)
}
export default ProTable;
