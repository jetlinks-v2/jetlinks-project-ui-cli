<template>
  <j-pro-layout
    v-bind="config"
    v-model:openKeys="state.openKeys"
    v-model:collapsed="state.collapsed"
    v-model:selectedKeys="state.selectedKeys"
    :breadcrumb="{ routes: breadcrumb }"
    :pure="state.pure"
  >
    <template #breadcrumbRender="slotProps">
      <a v-if="slotProps.route.index !== 0 && !slotProps.route.isLast" @click="() => jumpPage(slotProps.route)" >
        {{ slotProps.route.breadcrumbName }}
      </a>
      <span v-else style='cursor: default' >{{ slotProps.route.breadcrumbName }}</span>
    </template>

    <template #rightContentRender>
      <div class="right-content">
        <User />
      </div>
    </template>

    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </j-pro-layout>
</template>

<script setup name="BasicLayoutPage" lang="ts">
import { store } from '@jetlinks/router'
import { clearMenuItem } from 'jetlinks-ui-components/es/ProLayout/util';
import { reactive, computed, watchEffect } from 'vue'
import { User } from './components'
import { useRouter } from '@jetlinks/router'

type StateType = {
  collapsed: boolean;
  openKeys: string[];
  selectedKeys: string[];
  pure: boolean;
};

const router = useRouter();

const config = reactive({
  theme: store.SystemStore.theme,
  siderWidth: store.SystemStore.layout.siderWidth,
  logo: store.SystemStore.layout.logo,
  title: store.SystemStore.layout.title,
  menuData: clearMenuItem(store.MenuStore.siderMenus),
  layout: store.SystemStore.layout.layout,
  splitMenus: store.SystemStore.layout.layout === 'mix'
})

const state = reactive<StateType>({
  pure: false,
  collapsed: false, // default value
  openKeys: [],
  selectedKeys: [],
});

/**
 * 面包屑
 */
const breadcrumb = computed(() =>
  {
    const paths = router.currentRoute.value.matched
    return paths.map((item, index) => {
      return {
        index,
        isLast: index === (paths.length -1),
        path: item.path,
        breadcrumbName: (item.meta as any).title || '',
      }
    })
  }
);

/**
 * 路由跳转
 */
const jumpPage = (route: { path: string}) => {
  router.push(route.path)
}

/**
 * 处理菜单状态
 */
watchEffect(() => {
  if (router.currentRoute) {
    const paths = router.currentRoute.value.matched
    state.selectedKeys = paths.map(item => item.path)
    state.openKeys = paths.map(item => item.path)
    console.log(paths) // 误删
  }
})

</script>

<style scoped>

</style>
