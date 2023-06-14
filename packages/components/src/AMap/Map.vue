<template>
  <div
    :style="props.style || { width: '100%', height: '100%' }"
    :class="props.class"
  >
    <el-amap
      v-if="amapKey"
      v-bind="{
        ...props,
        ...$attrs
      }"
      :map-style="_mapStyle"
      @init="initMap"
      @click="(e) => emit('click', e)"
      @dblclick="(e) => emit('dblclick', e)"
      @movestart="(e) => emit('movestart', e)"
      @moveend="(e) => emit('moveend', e)"
      @rightclick="(e) => emit('rightclick', e)"
    >
      <template v-if="isOpenUi">
        <template v-if="uiLoading">
          <slot></slot>
        </template>
      </template>
      <template v-else><slot></slot></template>
    </el-amap>
    <JEmpty v-else description="请配置高德地图key" style="padding: 20%" />
  </div>
</template>

<script setup name="InitAMap" lang="ts">
import type { CSSProperties, PropType } from 'vue';
import { ref, computed } from 'vue'
import { initAMapApiLoader, ElAmap } from '@vuemap/vue-amap';
import '@vuemap/vue-amap/dist/style.css';
import { store } from '@jetlinks/stores'
import { getAMapUiPromise } from '@jetlinks/utils'
import { MapProps } from './util'
interface AMapProps {
  style?: CSSProperties;
  class?: string;
  AMapUI?: string | boolean;
  plugins?: string[]
}

const systemStore = store.SystemStore

const amapKey = systemStore.systemInfo.apiKey

const emit = defineEmits([
  'initMap',
  'click',
  'dblclick',
  'movestart',
  'moveend',
  'rightclick',
])

const props = defineProps({
  ...MapProps(),
  style: Object as PropType<AMapProps['style']>,
  class: String as PropType<AMapProps['class']>,
  AMapUI: [String, Boolean],
  center: Array,
  plugin: Array,
  zooms: {
    type: Array,
    default: [3, 20]
  }
});

const _mapStyle = computed(() => {
  return props.mapStyle ? `amap://styles/${props.mapStyle}` : undefined
})

initAMapApiLoader({
  key: amapKey || '',
  plugin: props.plugin
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
