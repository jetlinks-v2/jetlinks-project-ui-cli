export const defaultProps = () => ({
  rowKey: {
    type: String,
    default: 'id'
  },
  columns: {
    type: Array,
    default: () => ([])
  },
})

export const bodyProps = () => ({
  dataSource: {
    type: Array,
    default: () => ([])
  },
  cellHeight: {
    type: Number,
    default: 50
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
  rowSelection: {
    type: Object,
    default: undefined
  },
  scroll: {
    type: Object,
    default: undefined
  }
})
