import JSkeletonListTable from './components/ListTable.vue'
import JSkeletonListCard from './components/ListCard.vue'
import JSkeletonTree from './components/Tree.vue'
import JSkeletonDetail from './components/Detail.vue'
import JSkeletonDrawer from './components/Drawer.vue'
import JSkeletonDashboardCard from './components/DashBoardCard.vue'
import JSkeletonDashboardChart from './components/DashBoardChart.vue'
import JSkeletonList from './components/List.vue'
import JSkeletonPage from './components/Page.vue'
import Skeleton from './skeleton.vue'
import type { App } from 'vue'

export {
    JSkeletonDashboardCard,
    JSkeletonDashboardChart,
    JSkeletonListTable,
    JSkeletonListCard,
    JSkeletonPage,
    JSkeletonTree,
    JSkeletonDetail,
    JSkeletonDrawer,
    JSkeletonList
}

Skeleton.install = function (app: App) {
  app.component(Skeleton.name, Skeleton)
}

export default Skeleton

