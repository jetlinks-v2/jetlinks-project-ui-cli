<template>
  <div :class="['jtable-body-spin', hashId]" :style="bodyStyle" id="jtable-body-spin">
    <Spin :spinning="loading">
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
        <Content v-bind="props" :mode="_mode" :dataSource="_dataSource" :column="column">
          <template v-for="(_, key) in slots" :key="key" v-slot:[key]="slotProps">
            <template v-if="!extraSlots.includes(key)">
              <slot :name="key" v-bind="slotProps"></slot>
            </template>
          </template>
        </Content>
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
    </Spin>
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
import {debounce} from 'lodash-es';
import {TableConfig} from "../utils/constants";
import {useTableInject} from "./hooks";
import useProTableStyle from "./style";
import {onlyMessage} from "@jetlinks-web/utils";
import {useLocaleReceiver} from "../LocaleReciver";

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
let currentRequestId = 0;
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

const handleData = (result: any, _params: any) => {
  if (props.type === 'PAGE') {
    // 判断如果是最后一页且最后一页为空，就跳转到前一页
    // 判断条件：如果是total分开查询，判断result的长度；如果不分开查询就判断result.data的长度
    if(props.totalRequest){
      if(result.length === 0){
        return true
      } else {
        _dataSource.value = result || [];
        page.pageIndex = _params?.pageIndex || 0;
        page.pageSize = _params?.pageSize || 12;
        page.total = page.pageSize * (page.pageIndex + 1) + 1
      }
    } else {
      if (
          result?.total &&
          result?.pageSize &&
          result?.pageIndex &&
          result?.data?.length === 0
      ) {
        return true
      } else {
        _dataSource.value = result?.data || [];
        page.pageIndex = result?.pageIndex || 0;
        page.pageSize = result?.pageSize || 12;
        page.total = result?.total || 0;
      }
    }
  } else {
    _dataSource.value = result || [];
  }
  return false
}
const handleSearch = async (_params?: Record<string, any>) => {
  if (Array.isArray(props.dataSource)) {
    _dataSource.value = props.dataSource
  } else if (props.request) {
    const __params = {
      pageIndex: page.pageIndex,
      pageSize: Number(page.pageSize),
      ...props.defaultParams,
      ..._params,
      terms: [
        ...(props.defaultParams?.terms || []),
        ...(_params?.terms || []),
      ],
    }
    loading.value = true
    const resp = await props.request(__params).finally(() => {
      loading.value = false;
    });
    if (resp.success) {
      const flag = handleData(resp.result || {}, _params)
      if (flag) { // 判断如果是最后一页且最后一页为空，就跳转到前一页
        if(props.totalRequest){
          onlyMessage(contextLocale.value.pagination?.lastPage || '', 'error')
          // 置灰下一页
          page.total = page.pageSize * (page.pageIndex > 0 ? page.pageIndex : 1)
        } else {
          page.pageIndex = page.pageIndex > 0 ? page.pageIndex - 1 : 0;
          handleSearch({
            ..._params,
            pageSize: page.pageSize,
            pageIndex: page.pageIndex,
          });
        }
      }
    } else {
      _dataSource.value = [];
    }
    if(props.totalRequest){
      currentRequestId++;
      const requestId = currentRequestId;
      page.loading = true
      props.totalRequest(__params).then((res) => {
        if(res.success){
          page.total = res.result || 0;
        }
      }).finally(() => {
        if (requestId === currentRequestId) {
          page.loading = false
        }
      })
    }
  } else {
    _dataSource.value = []
  }
}

const _debounceFn = debounce(handleSearch, 300);

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
    _debounceFn(newValue || {});
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
    if (newVal && !props.request) {
      handleSearch(props.params);
    }
  },
  { deep: true, immediate: true },
);

onMounted(() => {
  windowChange(); // 初始化
  window.onresize = () => {
    windowChange();
  };
});

onUnmounted(() => {
  window.onresize = null;
});

defineExpose({reload, dataSource: _dataSource})
</script>

