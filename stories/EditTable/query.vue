<script setup>
import { defaultProps, bodyProps} from '@jetlinks-web/components/es/EditTable/props'
import { ref } from 'vue'

const props = defineProps({
  ...defaultProps(),
  ...bodyProps()
})

const selectedRowKeys = ref([])

const onSelect = (record, selected) => {
  const keys = new Set(selectedRowKeys.value)
  if (selected) {
    keys.add(record.id)
  } else {
    keys.delete(record.id)
  }
  selectedRowKeys.value = [...keys.values()]
}

</script>

<template>
  <j-edit-table
    :columns="columns"
    :dataSource="dataSource"
    :rowSelection="{
       selectedRowKeys: selectedRowKeys,
       onSelect: onSelect
    }"
  />
  <div>
    <h3>选中输出：</h3>
    {{ JSON.stringify(selectedRowKeys) }}
  </div>
</template>
