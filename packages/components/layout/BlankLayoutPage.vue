<template>
  <router-view v-slot="Component">
    <keep-alive>
      <component :is="components || Component" />
    </keep-alive>
  </router-view>
</template>

<script setup name="BlankLayoutPage" lang="ts">
import { useRoute, useRouter } from 'vue-router'
import {computed} from "vue";

const route = useRoute()

const components = computed(() => route.matched[route.matched.length - 1]?.components?.default)


</script>

<style scoped>

</style>
