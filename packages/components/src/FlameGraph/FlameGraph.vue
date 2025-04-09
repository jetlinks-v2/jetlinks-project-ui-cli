<template>
  <div class="j-flame-graph">
    <a-space>
      <a-input-search class="j-flame-graph-search" placeholder="请输入" @search="search"></a-input-search>
      <a-button @click="invert">反转</a-button>
    </a-space>
    <div id="j-flame-graph"></div>
  </div>
</template>
<script setup>
import { flamegraph } from 'd3-flame-graph'
import * as d3 from 'd3';
import { onMounted, watch, ref, computed } from 'vue';

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
  fieldNames: {
    type: Object,
    default: () => ({
      name: 'className',
      value: 'samples',
      children: 'children'
    })
  },
  request: {
    type: Function,
  }
})

const inverted = ref(false)
const chart = flamegraph()
  .setColorMapper(function(d, originalColor) {
      return d.highlight ? "#E600E6" : originalColor;
  })
  .setSearchHandler(function(searchResults, searchSum, totalValue) {
      console.log(searchResults, searchSum, totalValue);
  });


const search = (val) => {
  chart.search(val)
}

const formatData = computed(() => {
  return (val) => {
    function formatDataFn(newVal) {
      newVal.name = newVal[props.fieldNames.name]
      newVal.value = newVal[props.fieldNames.value]
      if(newVal[props.fieldNames.children] || newVal.children) {
        newVal[props.fieldNames.children || 'children'].forEach(item => {
          formatDataFn(item)
        })
      }
    }
    formatDataFn(val)
    return val
  }
})

const invert = () => {
  inverted.value = !inverted.value
  chart.inverted(inverted.value)
  d3.select('#flame-graph')
      .datum(formatData.value(props.data))
      .call(chart)
}
onMounted(() => {
  watch(() => props.data, (newVal, oldVal) => {
    if(newVal) {
      d3.select('#flame-graph')
      .datum(formatData.value(newVal))
      .call(chart)
    }
  }, {immediate: true})
})

</script>

