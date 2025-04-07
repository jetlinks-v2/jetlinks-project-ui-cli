<template>
    <div style="border: 1px solid red">
        <a-input v-bind="props" v-model:value="myValue" placeholder="这是自定义的组件" @change="change" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  value: {
    type: String,
    default: undefined,
  }
})

const emit = defineEmits(['update:value', 'change'])
const myValue = ref(props.value);

const change = (e) => {
  myValue.value = e.target.value;
  emit('update:value', myValue.value);
  emit('change');
};

watch(
    () => props.value,
    () => {
      myValue.value = props.value;
    },
    { immediate: true },
);
</script>

<style scoped></style>
