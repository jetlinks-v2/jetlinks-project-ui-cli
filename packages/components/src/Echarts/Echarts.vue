<template>
  <div ref="echartsDom" style="height: 100%;width: 100%" :style="style"></div>
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

const {setOptions} = useECharts(echartsDom)

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

