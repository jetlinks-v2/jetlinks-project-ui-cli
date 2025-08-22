import VirtualTable from './VirtualTable.vue'
import type { App } from 'vue';

VirtualTable.install = function (app: App) {
    app.component(VirtualTable.name, VirtualTable)
}
export default VirtualTable;
