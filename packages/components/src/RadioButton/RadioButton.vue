<template>
  <div class="j-radio-button" :style="styles">
    <div v-for="item in options" @click="onClick(item)"  class="j-radio-button-item" :class="{'active': myValue === item.value }">
      {{ item.label }}
    </div>
  </div>
</template>

<script setup>
import { defineOptions, defineProps, defineEmits, ref, computed, watch } from 'vue'
defineOptions({
  name: 'JRadioButton',
})

const props = defineProps({
  value: {
    type: [String, Number],
    default: undefined
  },
  options: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Number,
    default: 3
  }
})

const emit = defineEmits(['update:value'])

const myValue = ref(props.value)

const styles = computed(() => {
  return {
    'grid-template-columns': `repeat(${props.columns}, 1fr)`
  }
})

const onClick = (record) => {
  if (myValue.value !== record.value) {
    myValue.value = record.value
    emit('update:value', record.value)
    emit('select', record.value)
  }
}

watch(() => props.value, () => {
  myValue.value = props.value
})

</script>
