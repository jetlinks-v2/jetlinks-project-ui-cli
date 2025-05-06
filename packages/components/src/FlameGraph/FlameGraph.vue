<template>
  <div class="j-flame-graph">
    <div class="actions">
      <a-space>
        <a-input-search class="j-flame-graph-search" placeholder="请输入" @search="search"></a-input-search>
        <a-button @click="invert">反转</a-button>
      </a-space>
    </div>
    <div ref="flameGraphRef"></div>
  </div>
</template>
<script setup>
import { flamegraph } from 'd3-flame-graph'
import * as d3 from 'd3';
import { nextTick, watch, ref, computed } from 'vue';

defineOptions({
  name: 'JFlameGraph',
})

const props = defineProps({
  data: {
    type: Object,
  },
  showSearch:{
    type: Boolean,
    default: true
  },
  showInvert:{
    type: Boolean,
    default: true
  },
  request: {
    type: Function,
  }
})

const flameGraphRef = ref(null)
const inverted = ref(false)
const chart = flamegraph()
  .setColorMapper(function(d, originalColor) {
      return d.highlight ? "#E600E6" : originalColor;
  })


const search = (val) => {
  chart.search(val)
}

const formatData = computed(() => {
  return (val) => {
    function formatDataFn(newVal) {
      newVal.children?.forEach(item => {
        formatDataFn(item)
      })
    }
    //格式化数据，增加根节点root
    const obj = {
      name: 'root',
      value: val.map(item => item.value).reduce((a, b) => a + b, 0),
      children: val
    }
    formatDataFn(obj)
    return obj
  }
})

const invert = () => {
  inverted.value = !inverted.value
  chart.inverted(inverted.value)
  d3.select(flameGraphRef.value)
      .datum(formatData.value(props.data))
      .call(chart)
}
watch(() => props.data, (newVal, oldVal) => {
  if(newVal) {
    nextTick(() => {
      d3.select(flameGraphRef.value)
        .datum(formatData.value(newVal))
        .call(chart)
    })
  }
}, {immediate: true})

</script>

