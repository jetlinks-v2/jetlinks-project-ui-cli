import { defineComponent, computed, ref, watch, onMounted, onBeforeUnmount, nextTick, toRef, shallowRef, markRaw } from 'vue';
import type { PropType, CSSProperties } from 'vue';
import { Table } from 'ant-design-vue'
import { tableProps } from 'ant-design-vue/lib/table'
import type { TableProps } from 'ant-design-vue/lib/table';
import { useVirtualScroll } from './useVirtualScroll';
import { useTreeData } from './useTreeData';
import type { FlattenedNode } from './useTreeData';

export interface VirtualTableProps extends TableProps {
  /**
   * 虚拟滚动配置
   */
  virtual?: boolean | {
    /**
     * 行高（固定或动态）
     * @default 54
     */
    itemHeight?: number | ((index: number) => number);
    /**
     * 预渲染行数
     * @default 5
     */
    overscan?: number;
    /**
     * 启用阈值（数据量超过此值才启用虚拟滚动）
     * @default 100
     */
    threshold?: number;
  };
}

// 展开图标组件 - 使用 markRaw 避免响应式包装
const ExpandIcon = markRaw(defineComponent({
  name: 'VirtualExpandIcon',
  props: {
    expanded: Boolean,
    hasChildren: Boolean,
    onExpand: Function as PropType<() => void>,
    prefixCls: {
      type: String,
      default: 'ant-table',
    },
  },
  setup(props) {
    const handleClick = (e: Event) => {
      e.stopPropagation();
      props.onExpand?.();
    };

    return () => {
      if (!props.hasChildren) {
        return <span class={`${props.prefixCls}-row-expand-icon ${props.prefixCls}-row-expand-icon-spaced`} />;
      }

      return (
        <button
          type="button"
          class={[
            `${props.prefixCls}-row-expand-icon`,
            props.expanded
              ? `${props.prefixCls}-row-expand-icon-expanded`
              : `${props.prefixCls}-row-expand-icon-collapsed`,
          ]}
          onClick={handleClick}
          aria-expanded={props.expanded}
        />
      );
    };
  },
}));

// Proxy 缓存池
const proxyCache = new WeakMap<object, any>();

function getOrCreateProxy(record: any, node: FlattenedNode): any {
  let proxy = proxyCache.get(record);
  if (proxy && proxy.__virtual_tree_node__ === node) {
    return proxy;
  }

  proxy = new Proxy(record, {
    get(target, prop) {
      if (prop === '__virtual_tree_node__') {
        return node;
      }
      return Reflect.get(target, prop);
    },
    set(target, prop, value) {
      if (prop !== '__virtual_tree_node__') {
        return Reflect.set(target, prop, value);
      }
      return true;
    },
    has(target, prop) {
      if (prop === '__virtual_tree_node__') {
        return true;
      }
      return Reflect.has(target, prop);
    },
    ownKeys(target) {
      return [...Reflect.ownKeys(target), '__virtual_tree_node__'];
    },
    getOwnPropertyDescriptor(target, prop) {
      if (prop === '__virtual_tree_node__') {
        return { configurable: true, enumerable: false, value: node };
      }
      return Reflect.getOwnPropertyDescriptor(target, prop);
    },
  });

  proxyCache.set(record, proxy);
  return proxy;
}

/**
 * 虚拟滚动 Table 组件
 * 性能优化：
 * 1. 数据切片使用 computed 缓存，避免重复切片
 * 2. 使用 shallowRef 减少响应式开销
 * 3. 使用 passive 滚动事件监听
 * 4. rowKey 确保组件正确复用
 */
export default defineComponent({
  name: 'JVirtualTable',
  inheritAttrs: false,
  props: {
    ...tableProps(),
    virtual: {
      type: [Boolean, Object] as PropType<VirtualTableProps['virtual']>,
      default: false,
    },
  },
  emits: ['expandedRowsChange', 'expand'],
  setup(props, { attrs, slots, expose, emit }) {
    const tableRef = ref();
    const scrollContainerRef = shallowRef<HTMLElement>();

    // 解析虚拟滚动配置
    const virtualConfig = computed(() => {
      if (!props.virtual) return null;

      if (typeof props.virtual === 'boolean') {
        return props.virtual
          ? { itemHeight: 54, overscan: 5, threshold: 100 }
          : null;
      }

      return {
        itemHeight: props.virtual.itemHeight || 54,
        overscan: props.virtual.overscan || 5,
        threshold: props.virtual.threshold || 100,
      };
    });

    // 容器高度
    const containerHeight = computed(() => {
      if (!props.scroll?.y) return 0;
      const y = props.scroll.y;
      if (typeof y === 'number') return y;
      const num = parseInt(String(y), 10);
      return isNaN(num) ? 0 : num;
    });

    const childrenColumnName = computed(() => props.childrenColumnName || 'children');
    const rowKeyProp = computed(() => props.rowKey || 'key');

    // 判断是否为树形数据
    const isTreeData = computed(() => {
      const data = props.dataSource || [];
      return data.some((item: any) => {
        const children = item[childrenColumnName.value];
        return children && Array.isArray(children) && children.length > 0;
      });
    });

    // 树形数据处理
    const treeDataResult = useTreeData({
      data: toRef(props, 'dataSource') as any,
      childrenColumnName: childrenColumnName.value,
      rowKey: rowKeyProp.value,
      defaultExpandedRowKeys: props.defaultExpandedRowKeys as any,
      expandedRowKeys: props.expandedRowKeys ? toRef(props, 'expandedRowKeys') as any : undefined,
      defaultExpandAllRows: props.defaultExpandAllRows,
      onExpandedRowsChange: (keys) => emit('expandedRowsChange', keys),
    });

    const handleExpand = (node: FlattenedNode) => {
      treeDataResult.toggle(node.key);
      emit('expand', !node.expanded, node.record);
    };

    // 数据数量
    const itemCount = computed(() => {
      if (isTreeData.value) {
        return treeDataResult.flattenedData.value.length;
      }
      return props.dataSource?.length || 0;
    });

    // 判断是否启用虚拟滚动
    const shouldEnableVirtual = computed(() => {
      if (!virtualConfig.value) return false;
      if (!props.scroll?.y) return false;
      return itemCount.value >= virtualConfig.value.threshold;
    });

    // 虚拟滚动 hook
    const virtualScroll = useVirtualScroll({
      itemCount,
      containerHeight,
      itemHeight: virtualConfig.value?.itemHeight || 54,
      overscan: virtualConfig.value?.overscan || 5,
      threshold: virtualConfig.value?.threshold || 100,
    });

    // ⭐ 关键优化：使用 computed 缓存切片数据，避免每次渲染都创建新数组
    const virtualDataSource = computed(() => {
      if (!shouldEnableVirtual.value) {
        return props.dataSource || [];
      }

      const start = virtualScroll.startIndex.value;
      const end = virtualScroll.endIndex.value;

      if (isTreeData.value) {
        const flatData = treeDataResult.flattenedData.value;
        const visibleNodes = flatData.slice(start, end);
        return visibleNodes.map((node) => getOrCreateProxy(node.record, node));
      }

      return (props.dataSource || []).slice(start, end);
    });

    // 缓存 columns 处理
    const processedColumns = computed(() => {
      if (!isTreeData.value || !shouldEnableVirtual.value) {
        return props.columns;
      }

      const columns = props.columns;
      if (!columns || columns.length === 0) return columns;

      const indentSize = props.indentSize ?? 15;

      return columns.map((col, colIndex) => {
        if (colIndex === 0) {
          const originalRender = col.customRender;
          return {
            ...col,
            customRender: (renderProps: any) => {
              const { record, text } = renderProps;
              const treeNode = record.__virtual_tree_node__ as FlattenedNode | undefined;

              if (!treeNode) {
                if (originalRender) return originalRender(renderProps);
                return text;
              }

              const { level, hasChildren, expanded } = treeNode;
              const indentStyle: CSSProperties = {
                paddingLeft: `${level * indentSize}px`,
                display: 'inline-flex',
                alignItems: 'center',
              };

              const content = originalRender ? originalRender(renderProps) : text;

              return (
                <span style={indentStyle}>
                  <ExpandIcon
                    expanded={expanded}
                    hasChildren={hasChildren}
                    onExpand={() => handleExpand(treeNode)}
                  />
                  <span>{content}</span>
                </span>
              );
            },
          };
        }
        return col;
      });
    });

    // 缓存 components
    const virtualComponents = computed(() => {
      if (!shouldEnableVirtual.value) {
        return props.components;
      }

      const { startIndex, endIndex, offsetY, totalHeight, getItemHeight } = virtualScroll;
      const columns = processedColumns.value;

      return {
        ...(props.components || {}),
        body: {
          wrapper: (bodyProps: any, { slots: bodySlots }: any) => {
            let accumulatedHeight = offsetY.value;
            for (let i = startIndex.value; i < endIndex.value; i++) {
              accumulatedHeight += getItemHeight(i);
            }
            const bottomHeight = totalHeight.value - accumulatedHeight;

            return (
              <tbody {...bodyProps} class="ant-table-tbody">
                {offsetY.value > 0 && (
                  <tr aria-hidden="true" style={{ height: 0 }}>
                    <td style={{ padding: 0, border: 0, height: `${offsetY.value}px` }} colSpan={columns?.length || 1} />
                  </tr>
                )}
                {bodySlots.default?.()}
                {bottomHeight > 0 && (
                  <tr aria-hidden="true" style={{ height: 0 }}>
                    <td style={{ padding: 0, border: 0, height: `${bottomHeight}px` }} colSpan={columns?.length || 1} />
                  </tr>
                )}
              </tbody>
            );
          },
        },
      };
    });

    // 滚动监听
    const findScrollContainer = () => {
      if (!tableRef.value) return null;
      const tableElement = tableRef.value.$el || tableRef.value;
      return tableElement.querySelector('.ant-table-body') as HTMLElement;
    };

    const setupScrollListener = () => {
      nextTick(() => {
        const container = findScrollContainer();
        if (container) {
          scrollContainerRef.value = container;
          container.addEventListener('scroll', virtualScroll.handleScroll, { passive: true });
        }
      });
    };

    const removeScrollListener = () => {
      if (scrollContainerRef.value) {
        scrollContainerRef.value.removeEventListener('scroll', virtualScroll.handleScroll);
        scrollContainerRef.value = undefined;
      }
    };

    watch(shouldEnableVirtual, (enabled) => {
      if (enabled) setupScrollListener();
      else removeScrollListener();
    });

    onMounted(() => {
      if (shouldEnableVirtual.value) setupScrollListener();
    });

    onBeforeUnmount(() => {
      removeScrollListener();
    });

    // 滚动到指定索引（同时更新虚拟状态和真实 DOM）
    const scrollToIndex = (index: number) => {
      virtualScroll.scrollToIndex(index);
      // 同步滚动真实 DOM
      nextTick(() => {
        if (scrollContainerRef.value) {
          scrollContainerRef.value.scrollTop = virtualScroll.scrollTop.value;
        }
      });
    };

    // 滚动到指定位置
    const scrollTo = (offset: number) => {
      virtualScroll.scrollTo(offset);
      nextTick(() => {
        if (scrollContainerRef.value) {
          scrollContainerRef.value.scrollTop = virtualScroll.scrollTop.value;
        }
      });
    };

    expose({
      scrollTo,
      scrollToIndex,
      expand: treeDataResult.expand,
      collapse: treeDataResult.collapse,
      toggle: treeDataResult.toggle,
      expandAll: treeDataResult.expandAll,
      collapseAll: treeDataResult.collapseAll,
      expandTo: treeDataResult.expandTo,
      isExpanded: treeDataResult.isExpanded,
    });

    return () => {
      const tablePropsObj = {
        ...props,
        dataSource: virtualDataSource.value,
        columns: processedColumns.value,
        components: virtualComponents.value,
        ...(isTreeData.value && shouldEnableVirtual.value ? { childrenColumnName: '__disabled__' } : {}),
      };

      return (
        <Table
          ref={tableRef}
          {...attrs}
          {...tablePropsObj}
          v-slots={slots}
        />
      );
    };
  },
});
