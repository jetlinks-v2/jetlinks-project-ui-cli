<template>
  <div ref="echartsDom" class="echarts-warp" :style="style"></div>
</template>

<script lang="ts" setup>
import type {CSSProperties, Ref} from 'vue'
import { nextTick, ref, watch, defineProps, defineOptions } from 'vue'
import {useECharts} from '@jetlinks-web/hooks'

interface Props {
  style?: CSSProperties
}

defineOptions({
  name: 'JEcharts'
})

const props = defineProps({
  options: {
    type: Object,
    default: undefined,
  },
  style: Object as PropType<Props['style']>,
})

const echartsDom = ref<Ref<HTMLDivElement> | HTMLDivElement>()

const {setOptions} = useECharts(echartsDom.value)

watch(
  () => JSON.stringify(props.options),
  () => {
    if (props.options) {
      nextTick(() => {
        setOptions(props.options)
      })
    }
  },
  {immediate: true},
)
</script>

<style scoped>
.echarts-warp {
  width: 100%;
  height: 100%;
}
</style>
