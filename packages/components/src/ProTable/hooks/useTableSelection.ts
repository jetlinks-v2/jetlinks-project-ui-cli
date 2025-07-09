import {ref, provide, watch, unref, computed, type MaybeRef, reactive} from "vue";
import type {TableRowSelection} from "ant-design-vue/lib/table/interface";
import {omit} from "lodash-es";

interface SelectionOptions extends TableRowSelection {
  type?: 'checkbox' | 'radio',
  rowKey?: string,
  isCheck?: MaybeRef<boolean>; // 使用 MaybeRef 类型
}

export const PROTABLE_ROW_SELECTION_KEY = Symbol('protable-row-selection-key')

export const useTableSelection = (options: SelectionOptions = {
  type: 'checkbox',
  rowKey: "id",
  isCheck: true
}) => {
  const {
    type = 'checkbox', // 选择模式
    rowKey = 'id',      // 行标识字段
  } = options;

  const selectedRowKeys = ref<string[]>([]);
  const selectedRows = ref<any[]>([]);

  const selectionObj = ref(null)

  const isCheckRef = computed(() => {
    return unref(options.isCheck)
  })

  const onSelect = (record: any, selected: boolean) => {
    if (type === 'checkbox') {
      if (selected) {
        selectedRows.value.push(record)
      } else {
        selectedRows.value = selectedRows.value.filter(i => {
          return i[rowKey] !== record[rowKey]
        })
      }
      selectedRowKeys.value = selectedRows.value.map(i => i[rowKey])
    }
  }

  // 单选
  const onChange = (_selectedRowKeys: string[], _selectedRows: any[]) => {
    if (type === 'radio') {
      selectedRowKeys.value = _selectedRowKeys
      selectedRows.value = _selectedRows
    }
  }

  const onSelectAll = (selected: boolean, _selectedRows: any[], changeRows: any[]) => {
    if (selected) {
      selectedRows.value.push(...changeRows)
    } else {
      const arr = changeRows.map((item: any) => item[rowKey]);
      selectedRows.value = selectedRows.value.filter(i => {
        return !arr.includes(i[rowKey])
      })
    }
    selectedRowKeys.value = selectedRows.value.map(i => i[rowKey])
  }

  const onSelectNone = () => {
    selectedRowKeys.value = []
    selectedRows.value = []
  }

  const updateSelection = () => {
    if (isCheckRef.value) {
      // 提供选择上下文
      selectionObj.value = type === 'checkbox' ? {
        ...omit(options, ['isCheck']),
        selectedRowKeys: selectedRowKeys.value,
        onSelect,
        onSelectAll,
        onSelectNone,
      } : {
        ...omit(options, ['isCheck']),
        selectedRowKeys: selectedRowKeys.value,
        onChange,
        onSelectNone
      }
    } else {
      // 清空选择状态
      onSelectNone();
      selectionObj.value = null;
    }
  };

  watch(
    isCheckRef,
    () => {
      updateSelection();
    },
    { immediate: true, deep: false } // 注意：deep 设为 false
  );

  watch(() => selectedRows.value, () => {
    if (isCheckRef.value) {
      updateSelection();
    }
  }, {
    deep: true,
  });

  provide(PROTABLE_ROW_SELECTION_KEY, selectionObj);

  return {
    selectedRowKeys,
    selectedRows,
    onSelectNone
  }
}
