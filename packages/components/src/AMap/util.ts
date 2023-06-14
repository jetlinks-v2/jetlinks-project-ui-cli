export const MapProps = () => ({
  //  响应式
  center: Array,
  labelzIndex: Number,
  lang: String,
  mapStyle: String,

  //  静态属性
  vid: String,
  amapManager: Object as any,
  defaultCursor: String,
  animateEnable: {
    type: Boolean,
    default: true
  },
  isHotspot: Boolean,
  rotateEnable: {
    type: Boolean,
    default: true
  },
  resizeEnable: {
    type: Boolean,
    default: true
  },
  showIndoorMap: Boolean,
  expandZoomRange: Boolean,
  dragEnable: {
    type: Boolean,
    default: true
  },
  zoomEnable: {
    type: Boolean,
    default: true
  },
  doubleClickZoom: {
    type: Boolean,
    default: true
  },
  keyboardEnable: {
    type: Boolean,
    default: true
  },
  jogEnable: {
    type: Boolean,
    default: true
  },
  scrollWheel: {
    type: Boolean,
    default: true
  },
  touchZoom: {
    type: Boolean,
    default: true
  },

})
