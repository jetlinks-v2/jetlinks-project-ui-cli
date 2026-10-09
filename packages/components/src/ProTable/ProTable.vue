<template>
  <div :class="['jtable-body-spin', hashId]" :style="bodyStyle" id="jtable-body-spin">
      <div class="jtable-body">
        <Header :initMode="mode" :mode="_mode" :modeValue="modeValue" @change="onCheck">
          <template #headerLeftRender>
            <slot name="headerLeftRender"></slot>
          </template>
          <template #headerRightRender>
            <slot name="headerRightRender"></slot>
          </template>
        </Header>
        <Alert v-if="showAlert" :rowSelection="rowSelection || _rowSelection" @close="onClose">
          <slot name="alertRender" :rowSelection="rowSelection || _rowSelection" :onClose="onClose"></slot>
        </Alert>
        <Spin :spinning="loading" wrapperClassName="jtable-content-spin">
        <Content v-bind="props" :mode="_mode" :dataSource="_dataSource" :column="column">
          <template v-for="(_, key) in slots" :key="key" v-slot:[key]="slotProps">
            <template v-if="!extraSlots.includes(key)">
              <slot :name="key" v-bind="slotProps"></slot>
            </template>
          </template>
        </Content>
        </Spin>
        <Pagination @change="onPageChange" v-if="showPagination" v-bind="myPagination" :total="page.total" :pageIndex="page.pageIndex" :pageSize="page.pageSize" :totalLoading="page.loading" :totalRequest="totalRequest">
          <slot
              name="paginationRender"
              :total="page.total"
              :pageSize="page.pageSize"
              :current="page.pageIndex + 1"
              :onChange="onPageChange"
          ></slot>
        </Pagination>
      </div>
  </div>
</template>

<script setup lang="ts">
import {proTableProps} from "./setting";
import {Spin} from 'ant-design-vue';
import Header from './Header.vue';
import Alert from './Alert.vue';
import Content from './Content.vue';
import Pagination from './Pagination.vue';
import {useSlots, watch, onMounted, onUnmounted, computed, ref, reactive, inject} from "vue";
import {TableConfig} from "../utils/constants";
import {useTableInject} from "./hooks";
import useProTableStyle from "./style";
import {onlyMessage} from "@jetlinks-web/utils";
import {useLocaleReceiver} from "../LocaleReciver";
import {useProTableRequest} from './hooks/useProTableRequest';

defineOptions({
  name: 'JProTable'
})

const tableConfig = inject(TableConfig, {
  pagination: {}
})

const props = defineProps({
  ...proTableProps
})
const slots = useSlots()
const emit = defineEmits<{ (event: 'requestError', error: unknown): void }>()

const myPagination = computed(() => {
  const globalPagination = tableConfig.pagination || {}
  let showQuickJumper = globalPagination.showQuickJumper ?? props.pagination.showQuickJumper ?? false

  return {
    showSizeChanger: true,
    size: 'size',
    pageSizeOptions: ['12', '24', '48', '96'],
    ...globalPagination,
    ...props.pagination,
    showQuickJumper
  }
})

const loading = ref<boolean>(false)
const _dataSource = ref<any[]>([])
const _mode = ref<'TABLE' | 'CARD'>(props.mode || props.modeValue || 'CARD')
const column = ref<number>(4)
const page = reactive({
  pageIndex: 0,
  pageSize: tableConfig.pagination?.pageSize || 12 ,
  total: 0,
  loading: false
})

const prefixCls = computed(() => 'pro-table')
const [wrapSSR, hashId] = useProTableStyle(prefixCls)
const [contextLocale] = useLocaleReceiver('ProTable');
const extraSlots = ['headerRightRender', 'headerLeftRender', 'paginationRender', 'alertRender']

const _rowSelection = useTableInject()

const showAlert = computed(() => {
  return props.alertShow && (props.rowSelection?.selectedRowKeys?.length || _rowSelection?.value?.selectedRowKeys?.length)
})

const showPagination = computed(() => {
  return !!_dataSource.value.length && !props.noPagination && props.type === 'PAGE'
})
const onCheck = (e) => {
  _mode.value = e.target.value;
}

const { handleSearch } = useProTableRequest(
  props, page, loading, _dataSource,
  () => onlyMessage(contextLocale.value.pagination?.lastPage || '', 'error'),
  (error) => emit('requestError', error),
)

const onPageChange = (_page, size) => {
  handleSearch({
    ...props.params,
    pageSize: size,
    pageIndex: page.pageSize === size ? (_page ? _page - 1 : 0) : 0
  })
}
const onClose = () => {
  if(props.rowSelection){
    props.rowSelection.onChange?.([], []);
    props.rowSelection.onSelectNone?.();
  } else if(_rowSelection?.value){
    _rowSelection.value?.onSelectNone?.()
  }
}
/**
 * 刷新数据
 * @param _params
 */
const reload = (_params?: Record<string, any>) => {
  handleSearch({
    ...props.params,
    ..._params,
    pageSize: page.pageSize || 12, // 刷新页面不改变分页情况
    pageIndex: page.pageIndex || 0,
  });
};

const _gridColumns = computed(() => {
  if(props.gridColumns?.length){
    const arr = props.gridColumns
    const lastValue = arr.slice(-1)?.[0]
    if(arr?.length < 4){
      while (arr.length < 4) {
        arr.push(lastValue);
      }
      return arr;
    } else {
      return props.gridColumns.slice(0, 4)
    }
  } else {
    return [1, 2, 3, 4]
  }
})

// 监听宽度，计算显示卡片个数
const windowChange = () => {
  const ele = document.getElementById('jtable-body-spin')
  if(ele){
    const styles = window.getComputedStyle(ele)
    const width = parseFloat(styles.width);
    if(width <= 992){
      column.value = _gridColumns.value?.[0] || 1
    } else if (width > 992 && width <= 1440) {
      column.value = _gridColumns.value?.[1] || 2
    } else if (width > 1440 && width <= 1600) {
      column.value = _gridColumns.value?.[2] || 3
    } else if (width > 1600) {
      column.value = _gridColumns.value?.[3] || 4
    }
  }
}

watch(
  () => props.params,
  (newValue) => {
    handleSearch({
      ...(newValue || {}),
      pageSize: page.pageSize || 12,
      pageIndex: 0,
    });
  },
  {deep: true, immediate: true},
);

watch(props.modeValue, (newValue) => {
  if (newValue) {
    _mode.value = newValue;
  }
}, { immediate: true });

watch(
  () => props.dataSource,
  (newVal) => {
    if (Array.isArray(newVal) || !props.request) {
      handleSearch(props.params);
    }
  },
  { deep: true, immediate: true },
);

onMounted(() => {
  windowChange(); // 初始化

  window.addEventListener('resize', windowChange);
});

onUnmounted(() => {
  window.removeEventListener('resize', windowChange);
});

defineExpose({reload, dataSource: _dataSource})
</script>
