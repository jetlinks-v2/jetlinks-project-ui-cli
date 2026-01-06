import type { Ref, ComputedRef } from 'vue';
import { computed, ref, watch, shallowRef } from 'vue';

export interface TreeDataOptions<T = any> {
  /** 原始树形数据 */
  data: Ref<T[]>;
  /** 子节点字段名 */
  childrenColumnName?: string;
  /** rowKey 字段名或函数 */
  rowKey?: string | ((record: T) => string | number);
  /** 默认展开的行 keys */
  defaultExpandedRowKeys?: (string | number)[];
  /** 受控的展开行 keys */
  expandedRowKeys?: Ref<(string | number)[]>;
  /** 默认展开所有行 */
  defaultExpandAllRows?: boolean;
  /** 展开行变化回调 */
  onExpandedRowsChange?: (expandedKeys: (string | number)[]) => void;
}

export interface FlattenedNode<T = any> {
  /** 原始数据 */
  record: T;
  /** 节点 key */
  key: string | number;
  /** 节点层级 (0 开始) */
  level: number;
  /** 是否有子节点 */
  hasChildren: boolean;
  /** 是否展开 */
  expanded: boolean;
  /** 子节点数量 */
  childrenCount: number;
  /** 父节点 key */
  parentKey?: string | number;
  /** 在扁平化列表中的索引 */
  flatIndex: number;
}

export interface TreeDataResult<T = any> {
  /** 扁平化后的可见节点列表 */
  flattenedData: ComputedRef<FlattenedNode<T>[]>;
  /** 所有节点的 Map (key -> node) */
  nodeMap: ComputedRef<Map<string | number, FlattenedNode<T>>>;
  /** 展开的行 keys */
  expandedKeys: Ref<Set<string | number>>;
  /** 展开指定行 */
  expand: (key: string | number) => void;
  /** 折叠指定行 */
  collapse: (key: string | number) => void;
  /** 切换展开状态 */
  toggle: (key: string | number) => void;
  /** 展开所有行 */
  expandAll: () => void;
  /** 折叠所有行 */
  collapseAll: () => void;
  /** 获取节点的 key */
  getRowKey: (record: T, index?: number) => string | number;
  /** 判断节点是否展开 */
  isExpanded: (key: string | number) => boolean;
  /** 获取节点的所有祖先 keys */
  getAncestorKeys: (key: string | number) => (string | number)[];
  /** 展开到指定节点 (展开其所有祖先) */
  expandTo: (key: string | number) => void;
}

/**
 * 树形数据处理 Hook
 * 用于将树形数据扁平化为虚拟滚动可用的列表
 */
export function useTreeData<T = any>(options: TreeDataOptions<T>): TreeDataResult<T> {
  const {
    data,
    childrenColumnName = 'children',
    rowKey = 'key',
    defaultExpandedRowKeys = [],
    expandedRowKeys,
    defaultExpandAllRows = false,
    onExpandedRowsChange,
  } = options;

  // 内部展开状态
  const internalExpandedKeys = ref<Set<string | number>>(new Set(defaultExpandedRowKeys));

  // 实际使用的展开状态 (支持受控和非受控模式)
  const expandedKeys = computed({
    get: () => {
      if (expandedRowKeys?.value) {
        return new Set(expandedRowKeys.value);
      }
      return internalExpandedKeys.value;
    },
    set: (val) => {
      internalExpandedKeys.value = val;
      onExpandedRowsChange?.(Array.from(val));
    },
  });

  /**
   * 获取行的 key
   */
  const getRowKey = (record: T, index?: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    const key = (record as any)[rowKey];
    if (key !== undefined && key !== null) {
      return key;
    }
    // 如果没有 key，使用索引作为后备
    return index !== undefined ? index : String(record);
  };

  /**
   * 收集所有节点的 key (用于展开全部)
   */
  const collectAllKeys = (items: T[]): (string | number)[] => {
    const keys: (string | number)[] = [];

    const traverse = (list: T[]) => {
      for (const item of list) {
        const key = getRowKey(item);
        const children = (item as any)[childrenColumnName] as T[] | undefined;
        if (children && children.length > 0) {
          keys.push(key);
          traverse(children);
        }
      }
    };

    traverse(items);
    return keys;
  };

  // 初始化：如果设置了 defaultExpandAllRows，则展开所有
  if (defaultExpandAllRows && data.value.length > 0) {
    const allKeys = collectAllKeys(data.value);
    internalExpandedKeys.value = new Set(allKeys);
  }

  /**
   * 构建父子关系映射 (用于 getAncestorKeys)
   */
  const parentMap = shallowRef<Map<string | number, string | number | undefined>>(new Map());

  /**
   * 扁平化树形数据
   * 只包含当前可见的节点（已展开的节点的子节点）
   */
  const flattenedData = computed<FlattenedNode<T>[]>(() => {
    const result: FlattenedNode<T>[] = [];
    const newParentMap = new Map<string | number, string | number | undefined>();
    let flatIndex = 0;

    const traverse = (
      items: T[],
      level: number,
      parentKey?: string | number,
    ) => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const key = getRowKey(item, flatIndex);
        const children = (item as any)[childrenColumnName] as T[] | undefined;
        const hasChildren = !!(children && children.length > 0);
        const expanded = hasChildren && expandedKeys.value.has(key);

        // 记录父子关系
        newParentMap.set(key, parentKey);

        result.push({
          record: item,
          key,
          level,
          hasChildren,
          expanded,
          childrenCount: children?.length || 0,
          parentKey,
          flatIndex,
        });

        flatIndex++;

        // 如果展开了，递归处理子节点
        if (expanded && children) {
          traverse(children, level + 1, key);
        }
      }
    };

    traverse(data.value, 0);
    parentMap.value = newParentMap;

    return result;
  });

  /**
   * 所有节点的 Map
   */
  const nodeMap = computed(() => {
    const map = new Map<string | number, FlattenedNode<T>>();
    for (const node of flattenedData.value) {
      map.set(node.key, node);
    }
    return map;
  });

  /**
   * 展开节点
   */
  const expand = (key: string | number) => {
    const newSet = new Set(expandedKeys.value);
    newSet.add(key);
    expandedKeys.value = newSet;
  };

  /**
   * 折叠节点
   */
  const collapse = (key: string | number) => {
    const newSet = new Set(expandedKeys.value);
    newSet.delete(key);
    expandedKeys.value = newSet;
  };

  /**
   * 切换展开状态
   */
  const toggle = (key: string | number) => {
    if (expandedKeys.value.has(key)) {
      collapse(key);
    } else {
      expand(key);
    }
  };

  /**
   * 展开所有
   */
  const expandAll = () => {
    const allKeys = collectAllKeys(data.value);
    expandedKeys.value = new Set(allKeys);
  };

  /**
   * 折叠所有
   */
  const collapseAll = () => {
    expandedKeys.value = new Set();
  };

  /**
   * 判断是否展开
   */
  const isExpanded = (key: string | number): boolean => {
    return expandedKeys.value.has(key);
  };

  /**
   * 获取节点的所有祖先 keys
   */
  const getAncestorKeys = (key: string | number): (string | number)[] => {
    const ancestors: (string | number)[] = [];
    let currentKey: string | number | undefined = key;

    while (currentKey !== undefined) {
      const parentKey = parentMap.value.get(currentKey);
      if (parentKey !== undefined) {
        ancestors.unshift(parentKey);
      }
      currentKey = parentKey;
    }

    return ancestors;
  };

  /**
   * 展开到指定节点 (展开其所有祖先)
   */
  const expandTo = (key: string | number) => {
    const ancestors = getAncestorKeys(key);
    if (ancestors.length > 0) {
      const newSet = new Set(expandedKeys.value);
      for (const ancestorKey of ancestors) {
        newSet.add(ancestorKey);
      }
      expandedKeys.value = newSet;
    }
  };

  // 监听外部传入的 expandedRowKeys 变化
  if (expandedRowKeys) {
    watch(expandedRowKeys, (newKeys) => {
      internalExpandedKeys.value = new Set(newKeys);
    });
  }

  return {
    flattenedData,
    nodeMap,
    expandedKeys: internalExpandedKeys,
    expand,
    collapse,
    toggle,
    expandAll,
    collapseAll,
    getRowKey,
    isExpanded,
    getAncestorKeys,
    expandTo,
  };
}
