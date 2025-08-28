import {tableProps} from "ant-design-vue/es/table/Table";
import {PropType} from "vue";
import {TableProps} from "ant-design-vue/es/table";
import {paginationProps} from 'ant-design-vue/es/pagination/Pagination'
import { omit } from 'lodash-es'

export const _headerProps = {
  mode: {
    type: [String, undefined] as PropType<'TABLE' | 'CARD' | undefined>, // TABLE , CARD
    default: undefined,
  },
  modeValue: { // mode 为undefined时
    type: String,
    default: 'TABLE',
  },
}
export const _alertProps = {
  alertShow: {
    type: Boolean,
    default: true,
  },
  rowSelection: {
    type: Object as PropType<TableProps['rowSelection']>,
    default: () => undefined,
  },
}
export const _contentProps = {
  ...tableProps(),
  ..._headerProps,
  cardBodyClass: {
    type: String,
    default: '',
  },
  columns: {
    type: Array,
    default: () => [],
  },
  dataSource: {
    type: Array,
    default: undefined
  },
  gridColumns: {
    type: Array as PropType<number[]>,
    default: () => [1, 2, 3, 4],
  },
  scroll: {
    type: [Object, Boolean],
    default: () => ({}) //  x: 1366
  },
  rowKey: {
    type: [String, Function],
    default: 'id',
  },
  type: {
    type: String as PropType<'TREE' | 'PAGE'>, // TREE , PAGE
    default: 'PAGE',
  },
  height: {
    type: Number,
    default: 500
  }
}

export const _paginationProps = {
  ...omit(paginationProps(), ['onChange']),
  total: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 12
  },
  pageIndex: {
    type: Number,
    default: 0
  },
  /**
   *  是否显示分页内容
   */
  isShowContent: {
    type: Boolean,
  },
}

export const proTableProps = {
  ..._contentProps,
  ..._alertProps,
  bodyStyle: {
    type: Object,
    default: () => ({
      padding: '16px 24px 24px'
    })
  },
  request: {
    type: Function,
    default: undefined,
  },
  params: {
    type: Object,
    default: () => ({})
  },
  type: {
    type: String as PropType<'TREE' | 'PAGE'>, // TREE , PAGE
    default: 'PAGE',
  },
  defaultParams: {
    type: Object,
    default: () => ({})
  },
  noPagination: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Object, // Boolean,
    default: () => {
      return {
        showSizeChanger: true,
        size: 'size',
        pageSizeOptions: ['12', '24', '48', '96'],
      };
    },
  },
}
