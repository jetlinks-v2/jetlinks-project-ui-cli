import type { ColumnType } from 'ant-design-vue/lib/table'
import { omit} from "lodash-es";

type ColumnsFormType = {
  rules: Array<Record<string, any>>,
  watch: Array<string>
}
export type ColumnsType = Array<ColumnType & { form?: ColumnsFormType, width: number, _width: number, left: number }>



/**
 * 规则收集器，收集columns中的rules和watch
 * @param columns
 */
export const collectValidateRules = (columns: ColumnsType):  Record<string, any> => {
  const rules = {}
  columns.forEach(item => {
    if (item.form) {
      if (item.form.rules) {
        rules[item.dataIndex as string] = item.form.rules
      }
    }
  })
  return rules
}

/**
 * 清除内部属性
 * @param record
 */
export const handlePureRecord = (record: Record<string, any>) => {
  if (!record) return {}

  return omit(record, ['__serial', '__index', '__top', '__selected', '__key', '__dataIndex', '__oldSerial'])
}


/**
 * 计算每个column的宽度和位置
 * @param columns
 * @param warpWidth
 * @param scrollX
 */
export const handleColumnsWidth = (columns: ColumnsType, warpWidth: number, scrollX: number): any[] => {

  let newColumns = [...columns]
  let noWidthLen = 0 // 没有width属性的长度
  let hasWidthCount = 0 // 有width属性的合计
  let average = 0 // 每个column宽度
  let parseAverage = 0 // 取整宽度
  let decimalCount = 0 // 收集每个取整后的小数
  let lastNoWidthIndex : number | undefined = undefined // 最后一个没有width属性的位置

  newColumns.forEach((item, index) => {
    if (item.width) { // 是否有设置width属性
      hasWidthCount += item.width
    } else {
      noWidthLen += 1
      lastNoWidthIndex = index
    }
  })

  if (noWidthLen) {
    average = ((scrollX ?? warpWidth) - hasWidthCount) / noWidthLen // 剩余平分分配宽度
    parseAverage = scrollX  ? 150 :Math.trunc(average)
    decimalCount = (average - parseAverage) * noWidthLen
  }

  return newColumns.map((item, index) => {
    let _width = item.width

    if (!item.width) {
      _width = parseAverage
    }

    if (index === lastNoWidthIndex) {
      _width = decimalCount < 0 ? parseAverage : Math.trunc(decimalCount) + parseAverage
    }

    item._width = _width
    // item.left = left

    return item
  }, [])
}

export const handleColumnFixed = (columns: ColumnsType) => {
  const left = {
    keys: [],
    width: 0
  }
  const center = {
    keys: [],
    width: 0
  }
  const right = {
    keys: [],
    width: 0
  }

  columns.forEach(item => {
    if (item.fixed === 'left') {
      left.keys.push(item)
      left.width += item._width
    } else if (item.fixed === 'right') {
      right.keys.push(item)
      right.width += item._width
    } else {
      center.keys.push(item)
      center.width += item._width
    }
  })

  return {
    left,
    center,
    right
  }
}
