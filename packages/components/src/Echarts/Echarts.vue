<template>
  <div ref="echartsDom" class="echarts-warp" :style="style"></div>
</template>

  <script lang="ts" name="Echarts" setup>
import { CSSProperties, nextTick, ref, watch, Ref } from 'vue'
import { useECharts } from '@jetlinks-web/hooks'

interface Props {
  style?: CSSProperties
}

const props = defineProps({
  options: {
    type: Object,
    default: undefined,
  },
  style: Object as PropType<Props['style']>,
})

const echartsDom = ref<Ref<HTMLDivElement> | HTMLDivElement>()

const { setOptions } = useECharts(echartsDom.value)

watch(
  () => props.options,
  () => {
    if (props.options) {
      nextTick(() => {
        setOptions(props.options)
      })
    }
  },
  { immediate: true, deep: true },
)
</script>

<style scoped>
.echarts-warp {
  width: 100%;
  height: 100%;
}
</style>
