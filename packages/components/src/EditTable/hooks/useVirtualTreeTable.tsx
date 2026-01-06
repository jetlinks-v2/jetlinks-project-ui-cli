import { computed, defineComponent, ref } from 'vue'
import VirtualList from 'ant-design-vue/lib/vc-virtual-list'

interface UseVirtualTreeTableOptions<T> {
  treeData: any
  columns: any
  rowKey?: string
  rowHeight?: number
  scrollY?: number
}

export function useVirtualTreeTable<T = any>(
  options: UseVirtualTreeTableOptions<T>,
) {
  const {
    treeData,
    columns,
    rowKey = 'key',
    rowHeight = 48,
    scrollY = 400,
  } = options

  /** ----------------------------
   * 展开状态
   ----------------------------- */
  const expandedKeys = ref<Set<string>>(new Set())

  const toggleExpand = (key: string) => {
    if (expandedKeys.value.has(key)) {
      expandedKeys.value.delete(key)
    } else {
      expandedKeys.value.add(key)
    }
  }

  /** ----------------------------
   * Tree → Flat
   ----------------------------- */
  function flattenTree(nodes: any[], level = 0, result: any[] = []) {
    for (const node of nodes) {
      const key = node[rowKey]
      const isLeaf = !node.children || node.children.length === 0

      result.push({
        key,
        record: node,
        level,
        isLeaf,
      })

      if (!isLeaf && expandedKeys.value.has(key)) {
        flattenTree(node.children, level + 1, result)
      }
    }
    return result
  }

  const flatData = computed(() => {
    return flattenTree(treeData.value || [])
  })

  /** ----------------------------
   * Virtual Body 工厂
   ----------------------------- */
  const VirtualBody = defineComponent({
    name: 'VirtualTableBody',
    setup() {
      return () => (
        <VirtualList
          data={flatData.value}
          height={scrollY}
          itemHeight={rowHeight}
          itemKey="key"
        >
          {(item: any) => (
            <tr>
              {columns.value.map((col: any, index: number) => {
                if (index === 0) {
                  return (
                    <td>
                      <div
                        style={{
                          paddingLeft: `${item.level * 16}px`,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {!item.isLeaf && (
                          <span
                            style={{ cursor: 'pointer', marginRight: '4px' }}
                            onClick={() => toggleExpand(item.key)}
                          >
                            {expandedKeys.value.has(item.key) ? '▼' : '▶'}
                          </span>
                        )}
                        <span>{item.record[col.dataIndex]}</span>
                      </div>
                    </td>
                  )
                }

                return <td>{item.record[col.dataIndex]}</td>
              })}
            </tr>
          )}
        </VirtualList>
      )
    },
  })

  /** ----------------------------
   * 暴露给 Table 的 components
   ----------------------------- */
  const components = {
    body: {
      wrapper: VirtualBody,
    },
  }

  return {
    flatData,
    expandedKeys,
    toggleExpand,
    components,
  }
}
