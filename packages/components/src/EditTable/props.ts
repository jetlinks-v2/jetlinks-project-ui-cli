export const defaultProps = () => ({
  rowKey: {
    type: String,
    default: 'id'
  },
  columns: {
    type: Array,
    default: () => ([])
  },
  searchColumns: {
    type: Array,
    default: () => [
      {
        title: '标识',
        dataIndex: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
      }
    ]
  },
})

export const bodyProps = () => ({
  dataSource: {
    type: Array,
    default: () => ([])
  },
  columns: {
    type: Array,
    default: () => ([])
  },
  cellHeight: {
    type: Number,
    default: 65
  },
  height: {
    type: Number,
    default: 300
  },
  style: {
    type: Object,
    default: () => ({})
  },
  disableMenu: {
    type: Boolean,
    default: true
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  openGroup: {
    type: Boolean,
    default: false
  },
  rowSelection: {
    type: Object,
    default: undefined
  }
})
