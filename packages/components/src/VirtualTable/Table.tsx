import { defineComponent, computed, ref, h, watch, onMounted, onBeforeUnmount, nextTick, shallowRef, markRaw } from 'vue';
import type { PropType } from 'vue';
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

// 展开图标组件
const ExpandIcon = defineComponent({
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
        // 占位符，保持对齐
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
});

/**
 * 虚拟滚动 Table 组件
 * 完全兼容 a-table 的所有功能，同时支持大数据虚拟滚动
 * 支持树形数据的虚拟滚动
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
    // Table ref
    const tableRef = ref();
    const scrollContainerRef = ref<HTMLElement>();

    // 解析虚拟滚动配置
    const virtualConfig = computed(() => {
      if (!props.virtual) return null;

      if (typeof props.virtual === 'boolean') {
        return props.virtual
          ? {
            itemHeight: 54,
            overscan: 5,
            threshold: 100,
          }
          : null;
      }

      return {
        itemHeight: props.virtual.itemHeight || 54,
        overscan: props.virtual.overscan || 5,
        threshold: props.virtual.threshold || 100,
      };
    });

    // 获取容器高度
    const containerHeight = computed(() => {
      if (!props.scroll?.y) return 0;

      const y = props.scroll.y;
      if (typeof y === 'number') return y;

      // 解析 '500px' 这样的字符串
      const num = parseInt(String(y), 10);
      return isNaN(num) ? 0 : num;
    });

    // 获取子节点字段名
    const childrenColumnName = computed(() => {
      return props.childrenColumnName || 'children';
    });

    // 获取 rowKey
    const rowKeyProp = computed(() => {
      return props.rowKey || 'key';
    });

    // 判断是否为树形数据
    const isTreeData = computed(() => {
      const data = props.dataSource || [];
      return data.some((item: any) => {
        const children = item[childrenColumnName.value];
        return children && Array.isArray(children) && children.length > 0;
      });
    });

    // 使用树形数据 hook
    const treeDataResult = useTreeData({
      data: toRef(props, 'dataSource') as any,
      childrenColumnName: childrenColumnName.value,
      rowKey: rowKeyProp.value,
      defaultExpandedRowKeys: props.defaultExpandedRowKeys as any,
      expandedRowKeys: props.expandedRowKeys ? toRef(props, 'expandedRowKeys') as any : undefined,
      defaultExpandAllRows: props.defaultExpandAllRows,
      onExpandedRowsChange: (keys) => {
        emit('expandedRowsChange', keys);
      },
    });

    // 处理展开/折叠
    const handleExpand = (node: FlattenedNode) => {
      treeDataResult.toggle(node.key);
      emit('expand', !node.expanded, node.record);
    };

    // 判断是否启用虚拟滚动
    const shouldEnableVirtual = computed(() => {
      if (!virtualConfig.value) return false;
      if (!props.scroll?.y) return false;

      // 对于树形数据，使用扁平化后的数据长度
      const dataLength = isTreeData.value
        ? treeDataResult.flattenedData.value.length
        : (props.dataSource?.length || 0);

      return dataLength >= virtualConfig.value.threshold;
    });

    // 虚拟滚动的数据数量（树形数据使用扁平化后的长度）
    const itemCount = computed(() => {
      if (isTreeData.value) {
        return treeDataResult.flattenedData.value.length;
      }
      return props.dataSource?.length || 0;
    });

    // 初始化虚拟滚动
    const virtualScroll = useVirtualScroll({
      itemCount,
      containerHeight,
      itemHeight: virtualConfig.value?.itemHeight || 54,
      overscan: virtualConfig.value?.overscan || 5,
      threshold: virtualConfig.value?.threshold || 100,
    });

    // 查找并监听滚动容器
    const findScrollContainer = () => {
      if (!tableRef.value) return null;

      // 查找 .ant-table-body 元素（这是实际的滚动容器）
      const tableElement = tableRef.value.$el || tableRef.value;
      const scrollBody = tableElement.querySelector('.ant-table-body');

      return scrollBody as HTMLElement;
    };

    // 设置滚动监听
    const setupScrollListener = () => {
      nextTick(() => {
        const container = findScrollContainer();
        if (container) {
          scrollContainerRef.value = container;
          container.addEventListener('scroll', virtualScroll.handleScroll);
        }
      });
    };

    // 移除滚动监听
    const removeScrollListener = () => {
      if (scrollContainerRef.value) {
        scrollContainerRef.value.removeEventListener('scroll', virtualScroll.handleScroll);
        scrollContainerRef.value = undefined;
      }
    };

    // 监听虚拟滚动启用状态变化
    watch(shouldEnableVirtual, (enabled) => {
      if (enabled) {
        setupScrollListener();
      } else {
        removeScrollListener();
      }
    });

    // 生命周期
    onMounted(() => {
      if (shouldEnableVirtual.value) {
        setupScrollListener();
      }
    });

    onBeforeUnmount(() => {
      removeScrollListener();
    });

    // 暴露方法
    expose({
      scrollTo: virtualScroll.scrollTo,
      scrollToIndex: virtualScroll.scrollToIndex,
      // 树形数据相关方法
      expand: treeDataResult.expand,
      collapse: treeDataResult.collapse,
      toggle: treeDataResult.toggle,
      expandAll: treeDataResult.expandAll,
      collapseAll: treeDataResult.collapseAll,
      expandTo: treeDataResult.expandTo,
      isExpanded: treeDataResult.isExpanded,
    });

    // 渲染函数
    return () => {
      // 不使用虚拟滚动的情况
      if (!shouldEnableVirtual.value) {
        return (
          <Table
            ref={tableRef}
            {...attrs}
            {...props}
            v-slots={slots}
          />
        );
      }

      // 使用虚拟滚动
      const { startIndex, endIndex, offsetY, totalHeight } = virtualScroll;

      // 准备虚拟滚动数据
      let virtualDataSource: any[];
      let needsCustomIndent = false;
      const indentSize = props.indentSize ?? 15;

      if (isTreeData.value) {
        // 树形数据：使用扁平化后的数据
        const flatData = treeDataResult.flattenedData.value;
        const visibleNodes = flatData.slice(startIndex.value, endIndex.value);

        // 使用 Proxy 代理原始 record，确保修改能同步到原始数据
        virtualDataSource = visibleNodes.map((node) => {
          return new Proxy(node.record, {
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
        });

        needsCustomIndent = true;
      } else {
        // 普通数据：直接切片
        virtualDataSource = (props.dataSource || []).slice(
          startIndex.value,
          endIndex.value,
        );
      }

      // 处理列，添加树形展开功能
      let processedColumns = props.columns;

      if (needsCustomIndent && processedColumns && processedColumns.length > 0) {
        // 克隆 columns，修改第一列以添加展开按钮和缩进
        processedColumns = processedColumns.map((col, colIndex) => {
          if (colIndex === 0) {
            const originalRender = col.customRender;
            return {
              ...col,
              customRender: (renderProps: any) => {
                const { record, text, index } = renderProps;
                const treeNode = record.__virtual_tree_node__ as FlattenedNode | undefined;

                if (!treeNode) {
                  // 非树形数据行，使用原始渲染
                  if (originalRender) {
                    return originalRender(renderProps);
                  }
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
      }

      // 自定义 body 组件
      const customComponents = {
        ...(props.components || {}),
        body: {
          wrapper: (bodyProps: any, { slots: bodySlots }: any) => {
            // 计算底部占位高度
            let accumulatedHeight = offsetY.value;
            for (let i = startIndex.value; i < endIndex.value; i++) {
              accumulatedHeight += virtualScroll.getItemHeight(i);
            }
            const bottomHeight = totalHeight.value - accumulatedHeight;

            return (
              <tbody {...bodyProps} class="ant-table-tbody">
              {/* 顶部占位 */}
              {offsetY.value > 0 && (
                <tr aria-hidden="true" style={{ height: 0 }}>
                  <td
                    style={{
                      padding: 0,
                      border: 0,
                      height: `${offsetY.value}px`,
                    }}
                    colSpan={processedColumns?.length || 1}
                  />
                </tr>
              )}

              {/* 渲染可见行 */}
              {bodySlots.default?.()}

              {/* 底部占位 */}
              {bottomHeight > 0 && (
                <tr aria-hidden="true" style={{ height: 0 }}>
                  <td
                    style={{
                      padding: 0,
                      border: 0,
                      height: `${bottomHeight}px`,
                    }}
                    colSpan={processedColumns?.length || 1}
                  />
                </tr>
              )}
              </tbody>
            );
          },
        },
      };

      // 移除树形数据的 children 配置，因为我们自己处理
      const tableProps = {
        ...props,
        dataSource: virtualDataSource,
        columns: processedColumns,
        components: customComponents,
        // 禁用 Table 自带的树形功能，我们自己处理
        ...(isTreeData.value ? { childrenColumnName: '__disabled__' } : {}),
      };

      return (
        <Table
          ref={tableRef}
          {...attrs}
          {...tableProps}
          v-slots={slots}
        />
      );
    };
  },
});
