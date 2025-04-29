<template>
    <j-auto-complete :options="options" />
</template>
<script setup>

const props = defineProps({
    options: {
        type: Array,
        default: () => []
    }
})

</script>
