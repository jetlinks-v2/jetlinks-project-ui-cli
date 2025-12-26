import type { Ref, ComputedRef } from "vue";
import Schema from "async-validator";
import { handlePureRecord, collectValidateRules } from "../utils";
import type { ColumnsType } from "../utils";
import { ref, watch, toRaw } from 'vue'

/** 数据源项类型 */
type DataSourceItem = Record<string, any> & {
  __validate_id?: string
  __validate_index?: number
  __serial?: number
  __dataIndex?: number
}

type DataSourceType = Array<DataSourceItem>

/** 校验错误项类型 */
export interface ErrorItem {
  message: string
  __serial: number
  __dataIndex: number
  field: string
  fieldValue: any
  groupId?: string
}

/** useValidate 配置选项 */
export interface ValidateOptions {
  /** 校验失败回调 */
  onError?: (err: Array<Array<ErrorItem>>) => void
  /** 校验成功回调 */
  onSuccess?: () => void
  /** 编辑变化回调 */
  onEdit?: (item: any) => void
  /** 是否校验没有 rowKey 的行 */
  validateRowKey?: boolean
}

/** useValidate 返回值类型 */
export interface UseValidateReturn {
  /** 校验所有数据 */
  validate: () => Promise<DataSourceItem[]>
  /** 校验单条数据 */
  validateItem: (data: Record<string, any>, index?: number) => Promise<any>
  /** 错误映射表 */
  errorMap: Ref<Record<string, any>>
  /** 校验规则 */
  rules: Ref<Record<string, any>>
  /** 重新创建校验器（当列配置变化时调用） */
  recreateValidator: () => void
  /** 清除所有错误 */
  clearErrors: () => void
}

/**
 * 表单校验 Hook
 * @param dataSource 数据源
 * @param columns 列配置（可以是响应式的）
 * @param rowKey 行唯一标识字段
 * @param options 配置选项
 */
export const useValidate = (
  dataSource: Ref<DataSourceType> | ComputedRef<DataSourceType>,
  columns: ColumnsType | Ref<ColumnsType> | ComputedRef<ColumnsType>,
  rowKey: string,
  options: ValidateOptions = {}
): UseValidateReturn => {
  const errorMap = ref<Record<string, any>>({})
  const rules = ref<Record<string, any>>({})

  let schemaInstance: Schema | null = null

  const _options: Required<Pick<ValidateOptions, 'validateRowKey'>> & ValidateOptions = {
    validateRowKey: false,
    ...options
  }

  /**
   * 获取列配置（处理响应式和非响应式情况）
   */
  const getColumns = (): ColumnsType => {
    if ('value' in columns) {
      return (columns as Ref<ColumnsType>).value
    }
    return columns as ColumnsType
  }

  /**
   * 创建/重新创建校验器
   */
  const createValidator = () => {
    const currentColumns = getColumns()
    rules.value = collectValidateRules(currentColumns)
    schemaInstance = new Schema(rules.value)
  }

  /**
   * 校验单条数据
   * @param data 要校验的数据
   * @param index 数据索引
   */
  const validateItem = (data: Record<string, any>, index: number = 0): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!schemaInstance) {
        createValidator()
      }

      // 使用 toRaw 避免代理对象问题
      const rawData = toRaw(data)

      schemaInstance!.validate(rawData, { firstFields: true }, (errors: any[] | null) => {
        if (errors?.length) {
          const mappedErrors = errors.map(item => ({
            ...item,
            __serial: rawData.__serial ?? index + 1,
            __dataIndex: index,
            fieldValue: rawData[item.field]
          }))
          reject(mappedErrors)
        } else {
          resolve(rawData)
        }
      })
    })
  }

  /**
   * 校验所有数据
   */
  const validate = (): Promise<DataSourceItem[]> => {
    return new Promise((resolve, reject) => {
      const filterDataSource = dataSource.value
      const len = filterDataSource.length

      // 空数据直接返回
      if (len === 0) {
        _options.onSuccess?.()
        resolve([])
        return
      }

      const errors: Array<Array<ErrorItem>> = []
      const successItems: DataSourceItem[] = []
      let completedCount = 0

      const checkComplete = () => {
        completedCount += 1
        if (completedCount === len) {
          const hasErrors = errors.length > 0

          if (hasErrors) {
            // 按 __dataIndex 排序错误
            errors.sort((a, b) => {
              const aIndex = a[0]?.__dataIndex ?? 0
              const bIndex = b[0]?.__dataIndex ?? 0
              return aIndex - bIndex
            })
            _options.onError?.(errors)
            reject(errors)
          } else {
            _options.onSuccess?.()
            resolve(successItems)
          }
        }
      }

      const shouldValidateRow = _options.validateRowKey

      filterDataSource.forEach((record, index) => {
        // 判断是否需要校验该行
        const hasRowKey = !!record[rowKey]

        if (shouldValidateRow || hasRowKey) {
          validateItem(record, index)
            .then(res => {
              successItems.push(handlePureRecord(res))
              checkComplete()
            })
            .catch(err => {
              errors.push(err)
              checkComplete()
            })
        } else {
          // 跳过没有 rowKey 的行
          checkComplete()
        }
      })
    })
  }

  /**
   * 清除所有错误
   */
  const clearErrors = () => {
    errorMap.value = {}
  }

  /**
   * 重新创建校验器（当列配置变化时调用）
   */
  const recreateValidator = () => {
    createValidator()
  }

  // 初始化校验器
  createValidator()

  // 如果 columns 是响应式的，监听其变化并重新创建校验器
  if ('value' in columns) {
    watch(
      () => JSON.stringify((columns as Ref<ColumnsType>).value),
      () => {
        createValidator()
      }
    )
  }

  return {
    validate,
    validateItem,
    errorMap,
    rules,
    recreateValidator,
    clearErrors
  }
}
