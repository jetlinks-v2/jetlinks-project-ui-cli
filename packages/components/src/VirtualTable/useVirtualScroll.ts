import type { Ref, ComputedRef } from 'vue';
import { computed, ref, watch, isRef } from 'vue';

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
 * 虚拟滚动 Hook
 */
export function useVirtualScroll(options: VirtualScrollOptions): VirtualScrollResult {
  const {
    itemCount,
    containerHeight: containerHeightOption,
    itemHeight = 54,
    overscan = 5,
    threshold = 100,
  } = options;

  // 容器高度（支持响应式）
  const containerHeight = computed(() => {
    if (isRef(containerHeightOption)) {
      return containerHeightOption.value;
    }
    return containerHeightOption;
  });

  // 滚动位置
  const scrollTop = ref(0);

  // 动态行高缓存
  const itemHeights = ref<Map<number, number>>(new Map());

  /**
   * 获取指定索引的行高
   */
  const getItemHeight = (index: number): number => {
    // 优先使用缓存的高度
    if (itemHeights.value.has(index)) {
      return itemHeights.value.get(index)!;
    }

    // 使用配置的高度
    if (typeof itemHeight === 'function') {
      return itemHeight(index);
    }

    return itemHeight;
  };

  /**
   * 设置行高（用于动态测量）
   */
  const setItemHeight = (index: number, height: number) => {
    if (height > 0 && itemHeights.value.get(index) !== height) {
      itemHeights.value.set(index, height);
    }
  };

  /**
   * 计算总高度
   */
  const totalHeight = computed(() => {
    let total = 0;
    for (let i = 0; i < itemCount.value; i++) {
      total += getItemHeight(i);
    }
    return total;
  });

  /**
   * 计算可视范围的起始索引
   */
  const startIndex = computed(() => {
    if (itemCount.value < threshold) {
      return 0;
    }

    let accumulated = 0;
    for (let i = 0; i < itemCount.value; i++) {
      const height = getItemHeight(i);
      if (accumulated + height > scrollTop.value) {
        return Math.max(0, i - overscan);
      }
      accumulated += height;
    }
    return 0;
  });

  /**
   * 计算可视范围的结束索引
   */
  const endIndex = computed(() => {
    if (itemCount.value < threshold) {
      return itemCount.value;
    }

    const start = startIndex.value;
    let accumulated = 0;

    // 从起始索引开始累加
    for (let i = 0; i < start; i++) {
      accumulated += getItemHeight(i);
    }

    for (let i = start; i < itemCount.value; i++) {
      accumulated += getItemHeight(i);
      if (accumulated > scrollTop.value + containerHeight.value) {
        return Math.min(itemCount.value, i + 1 + overscan);
      }
    }

    return itemCount.value;
  });

  /**
   * 顶部偏移量
   */
  const offsetY = computed(() => {
    let offset = 0;
    for (let i = 0; i < startIndex.value; i++) {
      offset += getItemHeight(i);
    }
    return offset;
  });

  /**
   * 可见行数
   */
  const visibleCount = computed(() => endIndex.value - startIndex.value);

  /**
   * 处理滚动事件
   */
  const handleScroll = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target) {
      scrollTop.value = target.scrollTop;
    }
  };

  /**
   * 滚动到指定位置
   */
  const scrollTo = (offset: number) => {
    scrollTop.value = Math.max(0, Math.min(offset, totalHeight.value - containerHeight.value));
  };

  /**
   * 滚动到指定索引
   */
  const scrollToIndex = (index: number) => {
    if (index < 0 || index >= itemCount.value) {
      return;
    }

    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += getItemHeight(i);
    }
    scrollTo(offset);
  };

  // 数据变化时重置滚动位置
  watch(itemCount, () => {
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
