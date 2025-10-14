<template>
  <Form :model="terms" @finish="searchSubmit">
    <div
        ref="searchRef"
        class="JSearch-warp senior"
        :class="[attrs.class, hashId]"
        :style="attrs.style"
    >
      <!--  高级模式  -->
      <div
          v-if="props.type === 'advanced'"
          ref="searchRefContentRef"
          :class="[
                    'JSearch-content',
                    expand || compatible ? 'senior-expand' : 'pack-up',
                    screenSize ? 'big' : 'small',
                ]"
      >
        <div
            :class="[
                        'JSearch-items',
                        expand ? 'items-expand' : '',
                        layout,
                    ]"
        >
          <div class="left">
            <div class="left-items">
              <template v-for="(item, index) in terms.terms.slice(0, 3)">
                <SearchItem
                  :expand="expand"
                  :index="index + 1"
                  :onlyValue="false"
                  v-model:value="item.value"
                  v-model:termType="item.termType"
                  v-model:column="item.column"
                  v-model:type="item.type"
                />
              </template>
            </div>
          </div>
          <div v-if="expand" class="center">
            <Select
                v-model:value="terms.terms[3].type"
                class="center-select"
                style="width: 100px"
                :options="typeOptions(contextLocale)"
            />
          </div>
          <div v-if="expand" class="right">
            <div class="right-items">
              <template v-for="(item, index) in terms.terms.slice(3, 6)">
                <SearchItem
                  v-if="expand && index !== 4"
                  :expand="expand"
                  :index="index + 4"
                  :onlyValue="false"
                  v-model:value="item.value"
                  v-model:termType="item.termType"
                  v-model:column="item.column"
                  v-model:type="item.type"
                />
              </template>
            </div>
          </div>
        </div>
        <div
            :class="[
                        'JSearch-footer',
                        expand || compatible ? 'expand' : '',
                    ]"
        >
          <slot name="footerRender" :reset="reset" :submit="searchSubmit" :expandChange="expandChange">
            <div class="JSearch-footer--btns">
              <Button type="stroke" @click="reset"> {{contextLocale.advanced.reset}}</Button>
              <SaveHistory
                  :terms="terms"
                  :target="target"
                  :request="request || context.saveRequest"
              />
              <History
                  :target="target"
                  :request="historyRequest || context.historyRequest"
                  :delete-request="deleteRequest || context.deleteRequest"
                  :delete-key="deleteKey || context.deleteKey"
                  @click="searchSubmit"
                  @itemClick="historyItemClick"
              />
            </div>
            <Button
                type="link"
                class="more-btn"
                @click="expandChange"
            >
              <span class="more-text"> {{contextLocale.advanced.more}} </span>
              <AIcon
                  type="DoubleRightOutlined"
                  :class="[
                                  'more-icon',
                                  expand ? 'more-up' : 'more-down',
                              ]"
              />
            </Button>
          </slot>
        </div>
      </div>
      <!--  简单模式  -->
      <div v-else class="JSearch-content single big pack-up">
        <div class="JSearch-items">
          <div class="left">
            <SearchItem
              :expand="false"
              :index="1"
              :onlyValue="false"
              v-model:value="terms.terms[0].value"
              v-model:termType="terms.terms[0].termType"
              v-model:column="terms.terms[0].column"
              v-model:type="terms.terms[0].type"
            />
          </div>
        </div>
        <div class="JSearch-footer">
          <div class="JSearch-footer--btns">
            <FormItemRest>
              <Button @click="reset">
                {{contextLocale.advanced.reset}}
              </Button>
              <Button html-type="submit" type="primary">
                {{contextLocale.advanced.search}}
              </Button>
            </FormItemRest>
          </div>
        </div>
      </div>
    </div>
  </Form>
</template>

<script setup lang="ts">
import SearchItem from '../Item.vue';
import { typeOptions } from '../setting';
import {useHandleColumns, useOptionMapContent, useRouteQuery} from '../hooks';
import {
  PropType,
  ref,
  reactive,
  watch,
  defineExpose,
  useAttrs,
  inject,
  computed,
  toRefs
} from 'vue';
import SaveHistory from './SaveHistory.vue';
import History from './History.vue';
import type {
  Terms,
  JColumnsProps,
} from '../typing';
import {
  compatibleOldTerms, getItemDefaultValue,
  hasExpand,
  termsParamsFormat,
} from '../util';
import { Select, Button, Form, FormItemRest } from 'ant-design-vue'
import { AIcon } from '../../components'
import {useLocaleReceiver} from "../../LocaleReciver";
import {SearchConfig} from "../../utils/constants";
import {isObject} from "lodash-es";
import useSearchStyle from '../style'

defineOptions({
  name: 'JAdvancedSearch',
  inheritAttrs: false
})

type UrlParam = {
  q: string | null;
  target: string | null;
};

interface Emit {
  (e: 'search', data: Terms): void;
}

const props = defineProps({
  columns: {
    type: Array as PropType<JColumnsProps[]>,
    default: () => [],
    required: true,
  },
  type: {
    type: String,
    default: 'advanced',
  },
  target: {
    type: String,
    default: '',
    required: true,
  },
  request: {
    type: Function as PropType<(data: any, target: string) => Promise<any>>,
    default: undefined,
  },
  historyRequest: {
    type: Function as PropType<(target: string) => Promise<any>>,
    default: undefined,
  },
  deleteRequest: {
    type: Function as PropType<
        (target: string, id: string) => Promise<any>
    >,
    default: null,
  },
  deleteKey: {
    type: String,
    default: 'key',
  },
  defaultValues: {
    type: Object,
    default: undefined,
  }
});

const emit = defineEmits(['search'])

const columnsOptionMap = ref({}); // 存储每个columnItem的option
const terms = reactive<Terms>({terms: []});// 当前查询条件
const expand = ref(false);
const layout = ref('horizontal');
const compatible = ref(false);
const screenSize = ref(true);

const context = inject(SearchConfig)

const prefixCls = computed(() => 'JSearch')
const [wrapSSR, hashId] = useSearchStyle(prefixCls)

const [contextLocale] = useLocaleReceiver('Search')
const attrs = useAttrs()
const q = useRouteQuery('q');
const target = useRouteQuery('target');
const { initValues, columnsMap, defaultCacheValues } = useHandleColumns(props, terms, { mode: 'advanced'})

useOptionMapContent(columnsOptionMap)

const expandChange = () => {
  expand.value = !expand.value;
  terms.terms.length = 1
  if (expand.value) { // 展开
    let arr = Object.values(columnsMap.value)
    const mergeArr = []

    for (let i = 1; i < 6; i++) {
      const indexIn = i % arr.length;
      const obj = getItemDefaultValue(arr[indexIn], defaultCacheValues.value)
      if (i === 3) {
        obj.type = 'and'
      }
      mergeArr.push(obj);
    }

    terms.terms = [...terms.terms,...mergeArr]
  }
};

const addUrlParams = () => {
  if(props.target){
    q.value = encodeURI(JSON.stringify(terms));
    target.value = props.target;
  }
};

const submitData = () => {
  const data = termsParamsFormat(terms, columnsMap.value)
  emit('search', data);
};

/**
 * 提交
 */
const searchSubmit = () => {
  submitData();
  if (props.type === 'advanced') {
    addUrlParams();
  }
};

/**
 * 重置查询
 */
const reset = () => {
  expand.value = false;
  initValues()
  if (props.type === 'advanced') {
    q.value = null;
    target.value = null;
  }
  emit('search', {terms: []});
};

/**
 * 历史下拉单选
 * @param content {string}
 */
const historyItemClick = (content: string) => {
  try {
    const object = compatibleOldTerms(content, columnsMap.value, defaultCacheValues.value)
    terms.terms = object.terms || [];
    expand.value = object.expand
    searchSubmit();
  } catch (e) {
    console.warn(`Search组件中han.dleUrlParams处理JSON时异常：【${e}】`);
  }
};

/**
 * 处理URL中的查询参数
 */
const handleUrlParams = () => {
  if (props.target && props.target === target.value) {
    const params = decodeURI(q.value)
    historyItemClick(params)
  }
}

/**
 * 处理传入的默认值
 */
const handleDefaultValues = (value) => {

  if (!isObject(value)) return

  const _value = JSON.parse(JSON.stringify(value));
  if (!(_value.terms.length === 1 && _value.terms[0].terms.length === 1)) {
    let arr = Object.values(columnsMap.value)

    for (let i = 1; i < 6; i++) {
      const aIndex = i < 3 ? 0 : 1
      const bIndex = i % 3
      const item = _value.terms[aIndex].terms[bIndex]

      if (!item) {
        const fillItem = getItemDefaultValue(arr[aIndex * 3 + bIndex], defaultCacheValues.value)
        if (i === 3) {
          fillItem.type = 'and'
        }
        _value.terms[aIndex].terms[bIndex] = fillItem
      }
    }
  }
  historyItemClick(JSON.stringify(_value))
}

/**
 * 清除值
 */
const clearValue = () => {
  if (props.type === 'advanced' && props.target !== target.value) {
    q.value = null;
    target.value = null;
  }
}

handleUrlParams()

watch(() => props.target, () => {
  clearValue()
}, {
  immediate: true
})

defineExpose({
  setValues:handleDefaultValues,
  reset
})
</script>

