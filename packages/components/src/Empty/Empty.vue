<template>
  <LocaleProvider>
    <Empty v-bind="baseProps">
      <template v-for="item in renderArr" :key="item" #[item]="scope">
        <slot :name="item" :scope="scope"></slot>
      </template>
    </Empty>
  </LocaleProvider>
</template>

<script lang="ts" setup>
import { Empty } from 'ant-design-vue'
import { useSlots } from 'vue'
import NoData from './image'
import { omit } from 'lodash-es'
import type { PropType, CSSProperties } from 'vue'
import { useLocaleReceiver } from "../LocaleReciver/index";
import LocaleProvider from "../LocaleProvider/index.vue";

defineOptions({
  name: 'JEmpty'
})

const slots = useSlots()
const renderArr = Object.keys(slots)

const [contextLocale] = useLocaleReceiver('Empty')

const props = defineProps({
  description: {
    type: String,
  },
  image: {
    type: String,
    default: NoData,
  },
  imageStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => {
      return { height: '60px' }
    },
  },
})

const baseProps = omit({...props, description: props.description || contextLocale.value.description}, ...renderArr)
</script>
<style lang="less">
.@{ant-prefix}-empty-description {
  color: #b3b3b3;
  font-size: 14px;
}
</style>
