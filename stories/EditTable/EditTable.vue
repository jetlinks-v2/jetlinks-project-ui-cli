<script setup>
import { defaultProps, bodyProps} from '../../packages/components/src/EditTable/props'

const props = defineProps({
  ...defaultProps(),
  ...bodyProps()
})
</script>

<template>
  <j-edit-table
    :columns="columns"
    :dataSource="dataSource"
  />
</template>
