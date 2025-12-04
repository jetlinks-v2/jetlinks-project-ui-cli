<script setup lang="ts">
import {reactive, ref, computed, inject, useAttrs, defineExpose} from 'vue';
import {searchProps} from "./setting";
import {useLocaleReceiver} from "../LocaleReciver";
import type {Terms} from './typing';
import {Button, Col, Form, FormItemRest, Row} from "ant-design-vue";
import {SearchConfig} from "../utils/constants";
import Item from './Item.vue'
import {useHandleColumns, useOptionMapContent} from "./hooks";
import {termsParamsFormat} from "./util";
import useSearchStyle from './style'

defineOptions({
  name: 'JSearch',
  inheritAttrs: false
})

const props = defineProps({
  ...searchProps()
})

const emit = defineEmits(['search', 'reset'])

const [contextLocale] = useLocaleReceiver('Search')
const attrs = useAttrs()

const columnsOptionMap = ref({}); // 存储每个columnItem的option
const terms = reactive<Terms>({terms: []});// 当前查询条件

const context = inject(SearchConfig, { align: props.align})
const { initValues, columnsMap } = useHandleColumns(props, terms)

const prefixCls = computed(() => 'JSearch')
const [wrapSSR, hashId] = useSearchStyle(prefixCls);

useOptionMapContent(columnsOptionMap)

const footerStyles = computed(() => {
  const align = context.align || props.align
  if (align === 'value') {
    return { paddingLeft: `${props.labelWidth + 8}px`}
  }
  return {}
})

const searchSubmit = () => {
  emit('search', termsParamsFormat(terms, columnsMap.value, 'low', props.type));
}

const reset = () => {
  initValues()
  emit('reset')
}

const handleDefaultValues = (value) => {
  const isObject = Object.prototype.toString.call(value) === '[object Object]'
  let _params = isObject ? Object.keys(value).map((key) => ({ column: key, value: value[key], termType: 'eq' })) : [...value]

  terms.terms.forEach((item) => {
    const paramsItem = _params.find(paramsItem => paramsItem.column === item.column)
    if (paramsItem) {
      item.value = paramsItem.value
    }
  })

  emit('search', termsParamsFormat(terms, columnsMap.value));
}

defineExpose({
  setValues:handleDefaultValues,
  reset
})

</script>

<template>
  <Form :model="terms" @finish="searchSubmit">
    <div class="JSearch-warp" :class="[attrs.class, hashId]" :style="attrs.style">
      <div class="JSearch-content simple">
        <div class="JSearch-items">
          <Row :gutter="[16, 16]">
            <Col
              v-for="(item, index) in terms.terms"
              :span="item._span || 24 / column"
            >
              <Item
                v-model:value="item.value"
                v-model:termType="item.termType"
                v-model:column="item.column"
                v-model:type="item.type"
                :labelWidth="labelWidth"
              />
            </Col>
            <Col :span="24 / column">
              <slot
                name="footerRender"
                :reset="reset"
                :submit="searchSubmit"
              >
                <div
                  class="JSearch-footer--btns"
                  :style="footerStyles"
                >
                  <Button @click="reset">
                    {{ resetText || contextLocale.search.reset }}
                  </Button>
                  <FormItemRest>
                    <Button
                      html-type="submit"
                      type="primary"
                    >
                      {{ submitText || contextLocale.search.search }}
                    </Button>
                  </FormItemRest>
                </div>
              </slot>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  </Form>
</template>
