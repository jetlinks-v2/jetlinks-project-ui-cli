import type { Ref, ComputedRef } from 'vue';
import { computed, ref, watch, isRef, shallowRef } from 'vue';

export interface VirtualScrollOptions {
  // 总数据量
  itemCount: Ref<number> | ComputedRef<number>;
  // 容器高度（px）
  containerHeight: number | Ref<number> | ComputedRef<number>;
  // 行高
  itemHeight?: number | ((index: number) => number);
  // 预渲染行数
  overscan?: number;
  // 启用阈值
  threshold?: number;
}

export interface VirtualScrollResult {
  // 虚拟列表状态
  startIndex: Ref<number>;
  endIndex: Ref<number>;
  offsetY: Ref<number>;
  totalHeight: Ref<number>;
  visibleCount: Ref<number>;

  // 滚动位置
  scrollTop: Ref<number>;

  // 方法
  scrollTo: (offset: number) => void;
  scrollToIndex: (index: number) => void;
  handleScroll: (e: Event) => void;

  // 行高相关
  getItemHeight: (index: number) => number;
  setItemHeight: (index: number, height: number) => void;
}

/**
 * 高性能虚拟滚动 Hook
 * 优化点：
 * 1. 使用累积高度缓存，避免重复计算
 * 2. 使用二分查找快速定位索引
 * 3. 使用 shallowRef 减少响应式开销
 * 4. 滚动节流减少计算频率
 */
export function useVirtualScroll(options: VirtualScrollOptions): VirtualScrollResult {
  const {
    itemCount,
    containerHeight: containerHeightOption,
    itemHeight = 54,
    overscan = 5,
    threshold = 100,
  } = options;

  // 固定行高模式（性能更高）
  const isFixedHeight = typeof itemHeight === 'number';
  const fixedItemHeight = isFixedHeight ? itemHeight : 54;

  // 容器高度（支持响应式）
  const containerHeight = computed(() => {
    if (isRef(containerHeightOption)) {
      return containerHeightOption.value;
    }
    return containerHeightOption;
  });

  // 滚动位置 - 使用 shallowRef 减少响应式开销
  const scrollTop = shallowRef(0);

  // 动态行高缓存（仅在非固定高度模式使用）
  const itemHeights = shallowRef<Map<number, number>>(new Map());

  // 累积高度缓存 - 用于二分查找
  const accumulatedHeights = shallowRef<number[]>([]);
  let heightsCacheValid = false;

  /**
   * 获取指定索引的行高
   */
  const getItemHeight = (index: number): number => {
    if (isFixedHeight) {
      return fixedItemHeight;
    }

    // 优先使用缓存的高度
    const cached = itemHeights.value.get(index);
    if (cached !== undefined) {
      return cached;
    }

    // 使用配置的高度函数
    if (typeof itemHeight === 'function') {
      return itemHeight(index);
    }

    return fixedItemHeight;
  };

  /**
   * 设置行高（用于动态测量）
   */
  const setItemHeight = (index: number, height: number) => {
    if (height > 0 && itemHeights.value.get(index) !== height) {
      itemHeights.value.set(index, height);
      heightsCacheValid = false; // 使缓存失效
    }
  };

  /**
   * 重建累积高度缓存
   */
  const rebuildAccumulatedHeights = () => {
    if (heightsCacheValid) return;

    const count = itemCount.value;
    const heights: number[] = new Array(count + 1);
    heights[0] = 0;

    if (isFixedHeight) {
      // 固定高度模式，直接计算
      for (let i = 0; i < count; i++) {
        heights[i + 1] = heights[i] + fixedItemHeight;
      }
    } else {
      // 动态高度模式
      for (let i = 0; i < count; i++) {
        heights[i + 1] = heights[i] + getItemHeight(i);
      }
    }

    accumulatedHeights.value = heights;
    heightsCacheValid = true;
  };

  /**
   * 二分查找：找到第一个累积高度大于 target 的索引
   */
  const binarySearchIndex = (target: number): number => {
    rebuildAccumulatedHeights();
    const heights = accumulatedHeights.value;

    if (heights.length === 0) return 0;

    let left = 0;
    let right = heights.length - 1;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (heights[mid] <= target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    return Math.max(0, left - 1);
  };

  /**
   * 获取累积高度
   */
  const getAccumulatedHeight = (index: number): number => {
    rebuildAccumulatedHeights();
    const heights = accumulatedHeights.value;

    if (index < 0) return 0;
    if (index >= heights.length) return heights[heights.length - 1] || 0;

    return heights[index];
  };

  /**
   * 计算总高度
   */
  const totalHeight = computed(() => {
    if (isFixedHeight) {
      return itemCount.value * fixedItemHeight;
    }
    rebuildAccumulatedHeights();
    const heights = accumulatedHeights.value;
    return heights.length > 0 ? heights[heights.length - 1] : 0;
  });

  /**
   * 计算可视范围的起始索引 - 使用二分查找 O(log n)
   */
  const startIndex = computed(() => {
    const count = itemCount.value;
    if (count < threshold) {
      return 0;
    }

    const index = binarySearchIndex(scrollTop.value);
    return Math.max(0, index - overscan);
  });

  /**
   * 计算可视范围的结束索引
   */
  const endIndex = computed(() => {
    const count = itemCount.value;
    if (count < threshold) {
      return count;
    }

    const targetHeight = scrollTop.value + containerHeight.value;
    const index = binarySearchIndex(targetHeight);
    return Math.min(count, index + 1 + overscan);
  });

  /**
   * 顶部偏移量
   */
  const offsetY = computed(() => {
    const start = startIndex.value;
    if (start === 0) return 0;
    return getAccumulatedHeight(start);
  });

  /**
   * 可见行数
   */
  const visibleCount = computed(() => endIndex.value - startIndex.value);

  // 滚动节流
  let scrollRAF: number | null = null;

  /**
   * 处理滚动事件（带节流）
   */
  const handleScroll = (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target) return;

    // 使用 RAF 节流
    if (scrollRAF !== null) {
      cancelAnimationFrame(scrollRAF);
    }

    scrollRAF = requestAnimationFrame(() => {
      scrollTop.value = target.scrollTop;
      scrollRAF = null;
    });
  };

  /**
   * 滚动到指定位置
   */
  const scrollTo = (offset: number) => {
    const maxScroll = Math.max(0, totalHeight.value - containerHeight.value);
    scrollTop.value = Math.max(0, Math.min(offset, maxScroll));
  };

  /**
   * 滚动到指定索引
   */
  const scrollToIndex = (index: number) => {
    if (index < 0 || index >= itemCount.value) {
      return;
    }
    scrollTo(getAccumulatedHeight(index));
  };

  // 数据变化时使缓存失效并重置滚动位置
  watch(itemCount, () => {
    heightsCacheValid = false;
    const maxScroll = Math.max(0, totalHeight.value - containerHeight.value);
    if (scrollTop.value > maxScroll) {
      scrollTop.value = maxScroll;
    }
  });

  return {
    startIndex,
    endIndex,
    offsetY,
    totalHeight,
    visibleCount,
    scrollTop,
    scrollTo,
    scrollToIndex,
    handleScroll,
    getItemHeight,
    setItemHeight,
  };
}
