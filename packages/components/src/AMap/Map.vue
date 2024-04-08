<template>
  <div
    :style="props.style || { width: '100%', height: '100%' }"
    :class="props.class"
  >
    <el-amap
      v-if="hasAMapKey"
      :map-style="_mapStyle"
      v-bind="{
        ...props,
        ...$attrs
      }"
      @init="initMap"
    >
      <template v-if="uiLoading">
        <slot></slot>
      </template>
      <template v-else><slot></slot></template>
    </el-amap>
    <Empty v-else description="请配置高德地图key" style="padding: 20%" />
  </div>
</template>

<script setup name="InitAMap" lang="ts">
import type { CSSProperties, PropType } from 'vue';
import { ref, computed, inject } from 'vue'
import { initAMapApiLoader, ElAmap } from '@vuemap/vue-amap';
import { getAMapUiPromise } from '@jetlinks-web/utils'
import { MapProps } from './util'
import { MAPConfig } from "@jetlinks-web/constants";
import Empty from '../Empty'
import '@vuemap/vue-amap/dist/style.css';

interface AMapProps {
  style?: CSSProperties;
  class?: string;
  AMapUI?: string | boolean;
  plugins?: string[]
}

const emit = defineEmits([
  'initMap',
])

const props = defineProps({
  ...MapProps(),
  style: Object as PropType<AMapProps['style']>,
  class: String as PropType<AMapProps['class']>,
  AMapUI: [String, Boolean],
  center: Array,
  plugins: Array as PropType<string[]>,
  zooms: {
    type: Array,
    default: [3, 20]
  },
  JSKey: String,
  WebKey: String,
});

const config = inject<{ mapStyle: any, JSKey: string, WebKey: string }>(MAPConfig)

const _mapStyle = computed(() => {
  if (props.mapStyle) {
    return `amap://styles/${props.mapStyle}`
  }

  if (config.mapStyle) {
    return config.mapStyle
  }

  return undefined
})

const hasAMapKey = computed(() => {
  return !!(props.JSKey || config.JSKey)
})

initAMapApiLoader({
  key: props.JSKey || config.JSKey || '',
  securityJsCode: props.WebKey || config.WebKey,
  plugins: props.plugins
});

const uiLoading = ref<boolean>(false);

const map = ref<any>(null);

const isOpenUi = computed(() => {
  return 'AMapUI' in props || props.AMapUI;
});
const getAMapUI = () => {
  const version = typeof props.AMapUI === 'string' ? props.AMapUI : '1.1';
  getAMapUiPromise(version).then(() => {
    uiLoading.value = true;
  });
};

const initMap = (e: any) => {
  map.value = e;
  emit('initMap', e)
  if (isOpenUi.value) {
    getAMapUI();
  }
};

</script>

<style scoped>

</style>
