import { provide, inject, computed, type Ref, type ComputedRef } from 'vue'
import {
  RIGHT_MENU,
  TABLE_DATA_SOURCE,
  TABLE_ERROR,
  TABLE_WRAPPER,
  TABLE_TOOL,
  TABLE_FORM_ITEM_ERROR,
  FULL_SCREEN,
  TABLE_H_SCROLL
} from "../consts";

export * from './useResizeObserver'
export * from './useValidate'
export * from './useGroup'

interface FieldExpose {
  fieldName: string | number | undefined
  eventKey: string
  names: string | (string | number)[]
  validateRules: () => Promise<any>
  showErrorTip: (msg: string) => void
}

interface FormContext {
  addField?: (key: string, field: FieldExpose) => void
  removeField?: (key: string) => void
  dataSource?: ComputedRef<any[]>
  rules?: Ref<Record<string, any>>
  validateItem?: (data: Record<string, any>, index: number) => Promise<any>
  removeFieldError?: (key: string) => void
  addFieldError?: (key: string, message: string) => void
}

const FormContextKey = 'form-context'

export const useFormContext = (options: FormContext) => {
  provide(FormContextKey, options)
}

export const useInjectForm = (): FormContext => {
  return inject(FormContextKey, {
    addField: () => {},
    removeField: () => {},
    dataSource: computed(() => []),
    rules: computed(() => undefined) as unknown as Ref<Record<string, any>>,
  })
}

export const useInjectError = () => inject<Ref<Record<string, string>>>(TABLE_ERROR)

export const useTableWrapper = () => inject(TABLE_WRAPPER)

export const useRightMenuContext = () => inject(RIGHT_MENU)

export const useTableDataSource = () => inject(TABLE_DATA_SOURCE, [])

export const useTableTool = () => inject(TABLE_TOOL, {} as any)

export const useFormItemError = () => inject(TABLE_FORM_ITEM_ERROR)

export const useTableFullScreen = () => inject(FULL_SCREEN)

export const useHScroll = () => inject(TABLE_H_SCROLL)
