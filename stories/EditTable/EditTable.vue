<script setup>
import { defaultProps, bodyProps} from '@jetlinks-web/components/es/EditTable/props'

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
