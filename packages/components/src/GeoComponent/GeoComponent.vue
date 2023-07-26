<!-- 坐标点拾取组件 -->
<template>
  <div class="page-container">
    <j-input allowClear v-bind="props" v-model:value="inputPoint">
      <template #addonAfter>
        <AIcon type="EnvironmentOutlined" @click="modalVisible = true" />
      </template>
    </j-input>
    <j-modal
      title="地理位置"
      ok-text="确认"
      cancel-text="取消"
      v-model:visible="modalVisible"
      width="700px"
      @cancel="modalVisible = false"
      @ok="handleModalSubmit"
      destroyOnClose
    >
      <div style="width: 100%; height: 400px">
        <div style="margin-bottom: 10px;">地理位置：{{ mapPoint }}</div>
        <el-amap
          :center="_center"
          :zoom="_zoom"
          @init="initMap"
          @click="clickMap"
        >
          <el-amap-search-box visible @select="selectPosition" />
          <el-amap-marker :position="position" />
        </el-amap>
      </div>
    </j-modal>
  </div>
</template>

<script setup lang="ts">
import { store } from '@jetlinks/stores'
import { initAMapApiLoader } from '@vuemap/vue-amap'
import '@vuemap/vue-amap/dist/style.css'
import { CSSProperties, PropType } from 'vue'

interface AMapProps {
  style?: CSSProperties
  class?: string
  AMapUI?: string | boolean
  plugins?: string[]
}

const systemStore = store.SystemStore

const amapKey = systemStore.systemInfo.apiKey

interface EmitProps {
  (e: 'update:point', data: string): void
  (e: 'change', data: string): void
}
const props = defineProps({
  style: Object as PropType<AMapProps['style']>,
  class: String as PropType<AMapProps['class']>,
  AMapUI: [String, Boolean],
  center: Array,
  plugin: Array,
  zoom: {
    type: Number,
    default: 12,
  },
  securityJsCode: String,
  point: { type: [Number, String], default: '' },
})
const emit = defineEmits<EmitProps>()


initAMapApiLoader({
  key: amapKey || 'a0415acfc35af15f10221bfa5a6850b4',
  securityJsCode: props.securityJsCode
})

// 手动输入的坐标点(经纬度字符串)
const inputPoint = computed({
  get: () => {
    return props.point
  },
  set: (val: any) => {
    mapPoint.value = val
    emit('update:point', val)
    emit('change', val)
  },
})

// 地图弹窗
const modalVisible = ref<boolean>(false)

const handleModalSubmit = () => {
  inputPoint.value = mapPoint.value
  modalVisible.value = false
}

// 地图拾取的坐标点(经纬度字符串)
const mapPoint = ref('')

const _zoom = ref<number>(props.zoom)
const _center = ref<number[]>(props.center)
let map: any = null

// 地图经纬度
const position = ref<number[] | string[]>([])

/**
 * 地图初始化
 * @param e
 */
const initMap = (e: any) => {
  map = e

  const pointStr = mapPoint.value as string
  position.value = pointStr ? pointStr.split(',') : _center.value
}

/**
 * 地图点击
 * @param e
 */
const clickMap = (e: any) => {
  mapPoint.value = `${e.lnglat.lng},${e.lnglat.lat}`
  position.value = [e.lnglat.lng, e.lnglat.lat]
}

/**
 * 选择搜索结果
 * @param e
 */
const selectPosition = (e: any) => {
  const selectPoint = [e.poi.location.lng, e.poi.location.lat]
  map.setCenter(selectPoint)
  mapPoint.value = selectPoint.join(',')
  position.value = selectPoint
}
</script>

<style lang="less" scoped></style>
