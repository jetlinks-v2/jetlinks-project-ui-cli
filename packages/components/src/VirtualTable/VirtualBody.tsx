import { defineComponent, ref, computed, watch } from 'vue';
import type { PropType } from 'vue';
import { useVirtualScroll } from './useVirtualScroll';

export interface VirtualBodyProps {
  data: any[];
  scrollY: number;
  itemHeight?: number | ((index: number) => number);
  overscan?: number;
  threshold?: number;
}

/**
 * 虚拟滚动 Body 组件
 * 用于替代 Table 的默认 body
 */
export default defineComponent({
  name: 'VirtualBody',
  props: {
    data: {
      type: Array as PropType<any[]>,
      required: true,
    },
    scrollY: {
      type: Number,
      required: true,
    },
    itemHeight: {
      type: [Number, Function] as PropType<number | ((index: number) => number)>,
      default: 54,
    },
    overscan: {
      type: Number,
      default: 5,
    },
    threshold: {
      type: Number,
      default: 100,
    },
  },
  setup(props, { slots }) {
    const itemCount = computed(() => props.data.length);

    // 初始化虚拟滚动
    const virtualScroll = useVirtualScroll({
      itemCount,
      containerHeight: props.scrollY,
      itemHeight: props.itemHeight,
      overscan: props.overscan,
      threshold: props.threshold,
    });

    // 判断是否启用虚拟滚动
    const isVirtualEnabled = computed(() => {
      return props.data.length >= (props.threshold || 100);
    });

    return () => {
      const { data } = props;

      if (!isVirtualEnabled.value) {
        // 数据量小，不使用虚拟滚动，渲染所有行
        return <tbody class="ant-table-tbody">{slots.default?.()}</tbody>;
      }

      // 使用虚拟滚动
      const { startIndex, endIndex, offsetY, totalHeight, visibleCount } = virtualScroll;

      // 计算底部占位高度
      const bottomHeight = totalHeight.value - offsetY.value;
      let accumulatedHeight = offsetY.value;
      for (let i = startIndex.value; i < endIndex.value; i++) {
        accumulatedHeight += virtualScroll.getItemHeight(i);
      }
      const actualBottomHeight = totalHeight.value - accumulatedHeight;

      return (
        <tbody class="ant-table-tbody">
        {/* 顶部占位元素 */}
        {offsetY.value > 0 && (
          <tr aria-hidden="true" class="ant-table-virtual-placeholder">
            <td
              style={{
                padding: 0,
                border: 0,
                height: `${offsetY.value}px`,
              }}
            />
          </tr>
        )}

        {/* 渲染可见行 */}
        {slots.default?.()}

        {/* 底部占位元素 */}
        {actualBottomHeight > 0 && (
          <tr aria-hidden="true" class="ant-table-virtual-placeholder">
            <td
              style={{
                padding: 0,
                border: 0,
                height: `${actualBottomHeight}px`,
              }}
            />
          </tr>
        )}
        </tbody>
      );
    };
  },
});
