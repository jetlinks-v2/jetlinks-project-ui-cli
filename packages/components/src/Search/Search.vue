<template>
  <Form :model="terms" @finish="searchSubmit">
    <div :class="['JSearch-warp', props.class]" :style="style">
      <div class="JSearch-content simple">
        <div class="JSearch-items">
          <Row :gutter="[16, 16]">
            <Col
                v-for="(item, index) in searchItems"
                :key="index + '_' + item.column"
                :span="item.span || 24 / column"
            >
              <SearchItem
                  :only-value="true"
                  :expand="false"
                  :index="index + 1"
                  :columns="searchItems"
                  :component-props="item.componentProps"
                  :terms-item="terms.terms[index]"
                  :reset="resetNumber"
                  :label-width="labelWidth"
                  @change="(v) => itemValueChange(v, index)"
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
                  <Button type="stroke" @click="reset">
                    {{ resetText }}
                  </Button>
                  <FormItemRest>
                    <Button
                        html-type="submit"
                        type="primary"
                    >
                      {{ submitText }}
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

<script setup lang="ts">
import { JColumnsProps, SearchItemData, SearchProps, Terms } from './typing';
import {
  Button,
  Row,
  Col,
  Form,
  FormItemRest,
} from 'ant-design-vue';
import { set } from 'lodash-es';
import {reactive, ref, provide, watch, computed, inject} from 'vue';
import type { PropType } from 'vue';
import { termsParamsFormat } from './util';
import SearchItem from './Item.vue';
import { optionsMapKey } from './setting';
import { SearchConfig } from '@jetlinks-web/constants'

defineOptions({
  name: 'JSearch',
})

interface Emit {
  (e: 'search', data: Terms[] | {}): void;
}

type SearchType = 'terms' | 'object';

const props = defineProps({
  columns: {
    type: Array as PropType<JColumnsProps[]>,
    default: () => [],
    required: true,
  },
  type: {
    type: String as PropType<SearchType>,
    default: 'terms',
    required: true,
  },
  column: {
    type: Number,
    default: 4,
  },
  style: {
    type: [String, Object],
    default: undefined,
  },
  class: {
    type: String,
    default: '',
  },
  labelWidth: {
    type: Number,
    default: 40,
  },
  resetText: {
    type: String,
    default: '重置',
  },
  submitText: {
    type: String,
    default: '搜索',
  },
  align: {
    type: String,
    default: 'value'
  }
});

const columnOptionMap = ref(new Map());

const emit = defineEmits<Emit>();
// 当前查询条件
const terms = reactive<Terms>({terms: []});

const searchItems = ref<SearchProps[]>([]); // 当前查询条件列表

const context = inject(SearchConfig, { align: props.align})

const footerStyles = computed(() => {
  const align = context.align || props.align
  if (align === 'value') {
    return { paddingLeft: `${props.labelWidth + 8}px`}
  }
  return {}
})

provide(optionsMapKey, columnOptionMap);
const itemValueChange = (value: SearchItemData, index: number) => {
  set(terms.terms, [index], value);
};

const handleItems = (reset: boolean = false) => {
  searchItems.value = [];
  terms.terms = [];
  columnOptionMap.value.clear();
  let hasSearch = false;
  props.columns!.forEach((item, index) => {
    if (item.search && Object.keys(item.search).length) {
      columnOptionMap.value.set(item.dataIndex, item.search);
      // 默认值
      const {search} = item;
      let defaultTerms = null;
      // 包含defaultValue 或者 defaultOnceValue
      if (
          search.defaultValue !== undefined ||
          search.defaultTermType ||
          search.defaultOnceValue
      ) {
        const _value =
            search.defaultValue || reset
                ? search.defaultValue
                : search.defaultOnceValue;

        defaultTerms = {
          type: 'and',
          value: _value,
          termType: search.defaultTermType || 'like',
          column: item.dataIndex,
        };
      }

      if (
          search.defaultValue !== undefined ||
          search.defaultOnceValue !== undefined
      ) {
        hasSearch = true;
      }

      terms.terms.push(defaultTerms);
      searchItems.value.push({
        ...item.search,
        sortIndex: item.search.first ? 0 : index + 1,
        title: item.title as any,
        column: item.dataIndex,
      });
    }
  });

  if (hasSearch) {
    searchSubmit();
  }
};

/**
 * 提交
 */
const searchSubmit = () => {
  emit(
      'search',
      termsParamsFormat(
          terms.terms,
          columnOptionMap.value,
          'low',
          props.type,
      ),
  );
};

/**
 * 重置查询
 */
const resetNumber = ref(1);
const reset = () => {
  resetNumber.value += 1;
  handleItems(true);
  if (props.type == 'object') {
    emit('search', {});
  } else if (props.type == 'terms') {
    emit('search', []);
  }
};

watch(() => props.columns, () => {
  handleItems();
}, {immediate: true,  deep: true })

</script>

<style scoped lang="less">
.JSearch-warp {
  padding: 24px;
  background-color: #fff;
  margin-bottom: 24px;

  .pack-up {
    .JSearch-items {
      flex: 1 1 auto;

      .left {
        min-width: 380px;
        max-width: 580px;
      }
    }
  }

  &.senior {
    > .JSearch-content {
      display: flex;

      .JSearch-footer {
        display: flex;
        gap: 64px;
        position: relative;

        .more-btn {
          .more-text {
            padding-right: 24px;
          }

          .more-icon {
            transition: transform 0.3s;
            transform: rotateZ(90deg);
            font-size: 14px;

            &.more-up {
              transform: rotateZ(-90deg);
            }
          }
        }

        &.expand {
          margin-top: 16px;
          width: 100%;
          justify-content: space-between;
        }

        .JSearch-footer--btns {
          display: flex;
          gap: 12px;
        }
      }

      .items-expand {
        display: flex;
        gap: 16px;

        .left,
        & .right {
          min-width: 0;
          flex: 1 1 0;
        }

        .left-items,
        & .right-items {
          display: flex;
          gap: 16px;
          flex-direction: column;
        }

        .center {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        &.vertical {
          flex-direction: column;

          .center {
            flex-direction: row;
            justify-content: center;
          }
        }
      }

      &.senior-expand {
        flex-direction: column;
      }

      &.small {
        gap: 12px;

        .JSearch-footer {
          gap: 4px;
        }
      }
    }
  }

  .JSearch-content {
    &.simple {
      .JSearch-footer--btns {
        display: flex;
        gap: 12px;
      }

      .JSearch-item {
        gap: 8px;

        .JSearch-item--label {
          text-align: right;
        }
      }
    }
  }

  .no-radius {
    border-radius: 0;
    border-color: #f1f1f1;
  }

  .search-history-warp {
    position: relative;

    .search-history-button {
      padding-right: 32px;
    }

    .search-history-button-icon {
      position: absolute;
      width: 24px;
      height: 18px;
      right: 6px;
      top: 8px;
      color: #fff;
      line-height: 18px;
      text-align: center;
      font-weight: bold;

      > span {
        font-size: 14px;
      }
    }
  }
}

.search-history-empty {
  padding: 12px 12px 6px 12px;
  background-color: #fff;
}

.search-history-items {
  width: 120px;
  max-height: 300px;
  overflow-y: auto;

  .search-history-item {
    display: flex;
    padding: 4px 0px 4px 4px;
    align-items: center;
    gap: 4px;

    &:hover {
      background-color: #f1f1f1;
    }

    .history-item--title {
      width: calc(100% - 30px);
      cursor: pointer;
    }

    .delete {
      padding: 0 6px;
      flex: 0 0 28px;
    }
  }
}

.search-history-list-pop {
  .ant-popover-inner-content {
    padding: 0;
  }
}
</style>
