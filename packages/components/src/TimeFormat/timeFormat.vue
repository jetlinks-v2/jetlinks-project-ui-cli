<template>
  <span>
    {{ timeFormat }}
  </span>
</template>

<script setup>
import dayjs from "dayjs";

defineOptions({
  name: 'TimeFormat'
})

const props = defineProps({
  time: {
    type: [String, Number, undefined]
  },
  format: {
    type: String
  }
})

const handleValue = (time,  format) => {
  const value = Number(time)
  const _format = format || 'YYYY-MM-DD HH:mm:ss'

  if (!isNaN(value)) {
    return dayjs(value).format(_format)
  }

  return time
}

const timeFormat = computed(() => {
  if (props.time) {
    return handleValue(props.time, props.format)
  }
  return props.time
})
</script>

<style scoped>

</style>
