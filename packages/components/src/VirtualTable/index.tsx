import VirtualTable from './Table'
import type { App } from 'vue';

VirtualTable.install = function (app: App) {
    app.component(VirtualTable.name, VirtualTable)
}
export default VirtualTable;
