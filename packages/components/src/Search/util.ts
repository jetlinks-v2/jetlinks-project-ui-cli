import {cloneDeep, isArray, isFunction, isString, omit} from 'lodash-es';
import type { SearchItemData } from './typing';
import {termType} from './setting';
import type { SearchProps, JColumnsProps } from './typing';

/**
 * 处理like，nlike特殊值
 * @param v
 */
export const handleLikeValue = (v: string) => {
    if (isString(v)) {
        return v.split('').reduce((pre: string, next: string) => {
            let _next = next;
            if (next === '\\') {
                _next = '\\\\';
            } else if (next === '%') {
                _next = '\\%';
            }
            return pre + _next;
        }, '');
    }
    return v;
};

const handleItemValue = (item: any, columnOptionMap: any) => {
    const _item = columnOptionMap[item.column].search;

    if (_item === null || _item === '' || _item === undefined) return item;
    if (_item.rename) {
        item.column = _item.rename;
    }

    if (_item.handleValue && isFunction(_item.handleValue)) {
        item.value = _item.handleValue(item.value, item);
    }

    if (['like', 'nlike'].includes(item.termType) && !!item.value) {
        item.value = `%${handleLikeValue(item.value)}%`;
    }

    if (_item.handleTerms && isFunction(_item.handleTerms)) {
      return _item.handleTerms(item);
    }

    return  item;
};

const isEmpty = (v) => {
    return (
        v === undefined ||
        v === null ||
        v === '' ||
        (isArray(v) && v.length === 0)
    );
};

const isFilterItem = (item: any) => {
  return !isEmpty(item.value) && item.column !== undefined
}

/**
 * 处理为外部使用
 * @terms {Array} 表单数据
 * @columnOptionMap {Map} column的Map对象
 */
export const termsParamsFormat = (
    terms,
    columnOptionMap,
    type: string = 'adv',
    dataFormat: string = 'terms',
) => {
    // 过滤掉terms中value无效的item
    const cloneParams = cloneDeep(terms.terms);
    const handleParamsValue = cloneParams.map((item) => omit(handleItemValue(item, columnOptionMap), ['_span']))
    const filterParams = handleParamsValue.filter(isFilterItem)
    if (dataFormat === 'terms') { // terms格式
      // 过滤，并处理值
      if (type === 'adv') {
        if (cloneParams.length > 1) { // 拓展开
          const array_A = handleParamsValue.slice(0, 3).filter(isFilterItem)
          const array_B = handleParamsValue.slice(3, 6).filter(isFilterItem)
          const _terms = []

          if (array_A.length > 0) {
            _terms.push({ terms: array_A });
          }

          if (array_B.length > 0) {
            _terms.push({ terms: array_B, type: handleParamsValue[3].type });
          }

          return { terms: _terms }
        }

        return {  terms: [{ terms: filterParams}] }
      }
      return filterParams
    }

    // dataFormat === 'object'
    return filterParams.reduce((pre, item) => {
      pre[item.column] = item;
      return pre
    }, {})
};

/**
 * TreeSelect过滤
 * @param value 过滤值
 * @param treeNode
 * @param key
 */
export const filterTreeSelectNode = (
    value: string,
    treeNode: any,
    key: string = 'name',
): boolean => {
    return treeNode[key]?.includes(value);
};

/**
 * Select过滤
 * @param value 过滤值
 * @param option
 * @param key
 */
export const filterSelectNode = (
    value: string,
    option: any,
    key: string = 'label',
): boolean => {
    return option[key]?.includes(value);
};

export const hasExpand = (terms): boolean => {
    let itemCount = 0;
    terms.forEach((a) => {
        a.terms.forEach((b) => {
            if (b) {
                itemCount += 1;
            }
        });
    });
    return itemCount >= 2;
};

function shouldExpand(a, b) {
  const isAFirstHasValue = a[0] !== null && a[0] !== undefined;
  const isARestNull = a.slice(1).every(item => item === null || item === undefined);
  const isBAllNull = b.every(item => item === null || item === undefined);

  return !(isAFirstHasValue && isARestNull && isBAllNull);
}

export const compatibleOldTerms = (q: string, columnsMap, defaultCacheValues) => {
    try {
        const terms = JSON.parse(q || '{}');

        if (terms.terms.length === 2) {
          const expand = shouldExpand(terms.terms[0].terms, terms.terms[1].terms)
          let _terms = []


          if (!expand) {
            _terms = [terms.terms[0].terms[0]]
          } else {
            _terms = [...terms.terms[0].terms, ...terms.terms[1].terms]
            // 重新
            let arr = Object.values(columnsMap)
            for (let i = 0; i < _terms.length; i++) {
              if (_terms[i] === null) {
                const indexIn = i % arr.length;
                const obj = getItemDefaultValue(arr[indexIn], defaultCacheValues)
                if (i === 3) {
                  obj.type = terms.terms[1].type
                }
                _terms[i] = obj
              }
            }

          }
          return { terms: _terms, expand}
        } else {
          return { terms: terms.terms, expand: terms.terms.length > 1};
        }

    } catch (e) {
      console.warn('[Pro Search Error] > ', e)
        return { terms: [], expand: false};
    }
};

export const getTermTypeFn = (type?: SearchProps['type']) => {
    switch (type) {
        case 'select':
        case 'treeSelect':
        case 'number':
            return 'eq';
        case 'date':
        case 'time':
            return 'gt';
        case 'timeRange':
        case 'rangePicker':
            return 'btw';
        default:
            return 'like';
    }
};

export const getTermTypes = (types: string[], locale: any) => {
    const termTypes = termType(locale)
    return types.map(code => {
      return termTypes.find(item => item.value === code)
    })
};

export const getTermOptions = (type: string, locale: any) => {
    let keys: string[] = [];
    switch (type) {
        case 'select':
        case 'treeSelect':
            keys = ['not', 'eq', 'in', 'nin'];
            break;
        case 'time':
        case 'date':
            keys = ['gt', 'lt', 'gte', 'lte'];
            break;
        case 'timeRange':
        case 'rangePicker':
            keys = ['btw', 'nbtw'];
            break;
        case 'number':
            keys = ['eq', 'not', 'gt', 'lt', 'gte', 'lte'];
            break;
        default:
            keys = ['like', 'nlike', 'eq', 'not'];
            // column?.includes('id') && type === 'string'
            //     ? ['eq']
            //     : ['like', 'nlike'];
            break;
    }
    return keys.length ? getTermTypes(keys, locale) : termType(locale);
};

/**
 * 获取单项默认值，仅初始化使用
 * @param record
 * @param defaultCacheValues
 */
export const getItemDefaultValue = (record: JColumnsProps, defaultCacheValues: Record<string|number, any>): SearchItemData & { _span: number} => {
  const defaultValue = {...defaultCacheValues[record.dataIndex as string]};

  return {
    column: record.dataIndex,
    termType: defaultValue.defaultTermType || getTermTypeFn(record.search.type),
    value: defaultValue.defaultValue,
    type: 'or',
    _span: record.search.span
  }
}
