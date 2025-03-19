import { provide, inject, computed } from 'vue'
import {
  RIGHT_MENU,
  TABLE_DATA_SOURCE,
  TABLE_ERROR,
  TABLE_WRAPPER,
  TABLE_TOOL,
  TABLE_FORM_ITEM_ERROR,
  FULL_SCREEN
} from "../consts";

export * from './useResizeObserver'
export * from './useValidate'
export * from './useGroup'

type FiledExpose = {

}

const FormContextKey = 'form-context'
export const useFormContext = (options: Record<string, any>) => {
  provide(FormContextKey, options)
}

export const useInjectForm = () => {
  return inject(FormContextKey, {
    addField: (key: string, field: FiledExpose) => {},
    dataSource: computed(() => []),
    rules: computed(() => undefined),
  })
}

export const useInjectError = () => inject(TABLE_ERROR)

export const useTableWrapper = () => inject(TABLE_WRAPPER)

export const useRightMenuContext = () => inject(RIGHT_MENU)


export const useTableDataSource = () => inject(TABLE_DATA_SOURCE, [])


export const useTableTool = () => inject(TABLE_TOOL, false)


export const useFormItemError = () => inject(TABLE_FORM_ITEM_ERROR)

export const useTableFullScreen = () => inject(FULL_SCREEN)
