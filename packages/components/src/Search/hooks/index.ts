import {provide, inject, watchEffect, ref, } from 'vue'
import type { Ref, Reactive } from 'vue'
import type {JColumnsProps, Terms, ColumnsMap} from "../typing";
import {getItemDefaultValue} from "../util";

export * from './useSearchItems';
export * from './useRouteQuery';

const optionMapKey = Symbol('optionMapKey');
const columnsMapKey = Symbol('columnMapKey');
const columnsValues = Symbol('columnsValues');

export const useOptionMapContent = (optionsMap: any) => {
  provide(optionMapKey, optionsMap)
}

export const useOptionMap = (): Ref<Record<string, any>> => {
  return inject(optionMapKey);
}

export const useColumnsMapContent = (columnsMap: any) => {
  provide(columnsMapKey, columnsMap)
}

export const useColumnsMap = (): Ref<Record<string, ColumnsMap>> => {
  return inject(columnsMapKey);
}

export const useDefaultValue = (): Ref<Record<string, any>> => {
  return inject(columnsValues)
}

export const useHandleColumns = (props: any, terms: Reactive<Terms>) : {
  initValues: () => void
  columnsMap: Ref<Record<string, JColumnsProps>>
  defaultCacheValues: Record<string, any>
} => {
  const columnsMap = ref<Record<string, ColumnsMap>>({}); // 存储每个column
  const defaultCacheValues = ref<Record<string, any>>({})

  useColumnsMapContent(columnsMap)
  /**
   * 处理search.first为true的排序
   * @param arr
   */
  const moveFirstElementsToFront = (arr: JColumnsProps[]): JColumnsProps[] =>  {
    // 提取所有 first: true 的元素
    const firstElements = arr.filter(item => item.search.first === true);
    // 提取剩余的元素
    const otherElements = arr.filter(item => item.search.first !== true);
    // 合并并返回
    return [...firstElements, ...otherElements];
  }

  /**
   * 处理默认值
   * @param arr
   */
  const handleDefaultValue = (arr: JColumnsProps[]) => {
    for (const item of arr) {
      const { search } = item;
      const _data = {
        defaultValue: undefined,
        defaultTermType: undefined
      }
      _data.defaultValue = search.defaultValue;
      _data.defaultTermType = search.defaultTermType;

      defaultCacheValues.value[item.dataIndex as string] = _data
    }
    provide(columnsValues, defaultCacheValues)
  }

  const initValues = () => {
    const arr = Object.values(columnsMap.value) as JColumnsProps[]

    if (props.mode === 'advanced') {
      //  设置第一位
      terms.terms = [getItemDefaultValue(arr[0], defaultCacheValues.value)]
    } else {
      terms.terms = arr.map(item => getItemDefaultValue(item, defaultCacheValues.value) )
    }
  }

  const handleColumns = (columns: JColumnsProps[]) => {
    const columnsSearch = columns.filter(item => item.hasOwnProperty('search') && Object.keys(item.search).length)
    // 排序
    const columnsSort = moveFirstElementsToFront(columnsSearch)

    columnsSort.forEach((item, index) => {
      columnsMap.value[item.dataIndex as string] = { ...item, _sort_index: index }
    })

    handleDefaultValue(columnsSort)

    if (terms.terms.length === 0 ) { // 高级模式处理数据
      initValues()
    }
  }

  watchEffect(() =>{
    handleColumns(props.columns);
  })

  return {
    initValues,
    columnsMap,
    defaultCacheValues
  }
}
