import { provide, inject, computed, type Ref, type ComputedRef } from 'vue'
import {
    RIGHT_MENU,
    TABLE_DATA_SOURCE,
    TABLE_ERROR,
    TABLE_GROUP_ERROR,
    TABLE_WRAPPER,
    TABLE_OPEN_GROUP,
    TABLE_TOOL,
    TABLE_GROUP_OPTIONS,
    TABLE_FORM_ITEM_ERROR,
    TABLE_GROUP_ACTIVE,
    FULL_SCREEN
} from "./consts";

interface FieldExpose {
    fieldName: string | number | undefined
    eventKey: string
    names: string | (string | number)[]
    validateRules: () => Promise<any>
    showErrorTip: (msg: string) => void
}

export interface FormContext {
    addField?: (key: string, field: FieldExpose) => void
    removeField?: (key: string) => void
    dataSource?: ComputedRef<any[]>
    rules?: Ref<Record<string, any>>
    validateItem?: (data: Record<string, any>, index: number) => Promise<any>
    removeFieldError?: (key: string) => void
    addFieldError?: (key: string, message: string) => void
    errorMap?: Ref<Record<string, any>>
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

export const useTableGroupError = () => inject(TABLE_GROUP_ERROR)

export const useTableDataSource = () => inject(TABLE_DATA_SOURCE, [])

export const useTableOpenGroup = () => inject(TABLE_OPEN_GROUP, false)

export const useTableTool = () => inject(TABLE_TOOL, {} as any)

export const useGroupOptions = () => inject(TABLE_GROUP_OPTIONS, [])

export const useFormItemError = () => inject(TABLE_FORM_ITEM_ERROR)

export const useGroupActive = () => inject(TABLE_GROUP_ACTIVE)

export const useTableFullScreen = () => inject(FULL_SCREEN)
