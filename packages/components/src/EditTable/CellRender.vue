<script lang="ts">
import { defineComponent, h, shallowRef, watch } from 'vue'

/**
 * CellRender - 优化的单元格渲染组件
 * 使用 shallowRef 和手动更新检查来避免不必要的重渲染
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
    }
  },
  setup(props) {
    // 使用 shallowRef 避免深度响应式
    const cachedResult = shallowRef<any>(null)
    const lastValue = shallowRef<any>(undefined)
    const lastRecordId = shallowRef<any>(undefined)

    // 手动检查是否需要重新渲染
    const shouldUpdate = () => {
      // 检查 value 是否变化
      if (props.value !== lastValue.value) {
        return true
      }

      // 检查 record 的关键属性是否变化（假设有 id 或 key）
      const currentRecordId = (props.record as any)?.id || (props.record as any)?.key
      if (currentRecordId !== lastRecordId.value) {
        return true
      }

      return false
    }

    // 执行渲染函数
    const render = () => {
      if (shouldUpdate() || cachedResult.value === null) {
        lastValue.value = props.value
        lastRecordId.value = (props.record as any)?.id || (props.record as any)?.key

        try {
          cachedResult.value = props.renderFn(props.value, props.record, props.index)
        } catch (error) {
          console.error('[CellRender] Render error:', error)
          cachedResult.value = null
        }
      }

      return cachedResult.value
    }

    return () => {
      return h('div', { class: 'cell-render-wrapper' }, [render()])
    }
  }
})
</script>
