<script lang="ts">
import { defineComponent, h, shallowRef, markRaw } from 'vue'

/**
 * CellRender - 高性能单元格渲染组件
 *
 * 优化点：
 * 1. 使用 shallowRef 避免深度响应式
 * 2. 缓存渲染结果，避免不必要的重渲染
 * 3. 使用 markRaw 标记渲染结果，避免被 Vue 代理
 * 4. 智能对比 record 的 key 变化
 */
export default defineComponent({
  name: "CellRender",
  props: {
    renderFn: {
      type: Function,
      required: true
    },
    value: null,
    record: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    // 可选：指定用于对比的 key 字段
    rowKey: {
      type: String,
      default: 'id'
    }
  },
  setup(props) {
    // 使用 shallowRef 避免深度响应式
    const cachedResult = shallowRef<any>(null)

    // 缓存上次渲染的关键信息
    let lastValue: any = Symbol('initial')
    let lastRecordKey: any = Symbol('initial')
    let lastIndex: number = -1

    // 获取 record 的唯一标识
    const getRecordKey = (record: any): any => {
      return record?.[props.rowKey] ?? record?.key ?? record?.__dataIndex
    }

    // 检查是否需要重新渲染
    const shouldRerender = (): boolean => {
      const currentRecordKey = getRecordKey(props.record)

      // 快速检查：index 和 key 都没变，value 也没变
      if (
        lastIndex === props.index &&
        lastRecordKey === currentRecordKey &&
        lastValue === props.value
      ) {
        return false
      }

      return true
    }

    // 执行渲染
    const doRender = () => {
      if (!shouldRerender() && cachedResult.value !== null) {
        return cachedResult.value
      }

      // 更新缓存的对比值
      lastValue = props.value
      lastRecordKey = getRecordKey(props.record)
      lastIndex = props.index

      try {
        const result = props.renderFn(props.value, props.record, props.index)
        // 使用 markRaw 避免渲染结果被代理
        cachedResult.value = result != null ? markRaw({ node: result }) : null
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('[CellRender] Render error:', error)
        }
        cachedResult.value = null
      }

      return cachedResult.value
    }

    return () => {
      const result = doRender()
      return h('div', {
        class: 'cell-render-wrapper',
        style: { display: 'contents' } // 避免额外的 DOM 层级影响布局
      }, result?.node ?? null)
    }
  }
})
</script>
