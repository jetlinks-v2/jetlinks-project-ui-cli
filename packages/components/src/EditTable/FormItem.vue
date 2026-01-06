<template>
  <a-tooltip
    v-if="errorMap.visible"
    color="#ffffff"
    :get-popup-container="popContainer"
    :arrowPointAtCenter="true"
    open
  >
    <template #title>
      <span style="color: #1d2129">{{ errorMap.message }}</span>
    </template>
    <div v-if="errorMap.visible" :class="['jetlinks-table-form-error-target', hashId, 'hashId']"></div>
  </a-tooltip>
  <div :id="eventKey" style="position: relative" :class="{'jetlinks-edit-table-form-has-error': errorMap.message, [hashId]: true }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, computed, reactive, watch, provide, toRaw, nextTick, onMounted } from "vue";
import { get, isArray, set, cloneDeep } from 'lodash-es'
import { useProvideFormItemContext } from 'ant-design-vue/lib/form/FormItemContext'
import Schema from 'async-validator'
import { useInjectError, useInjectForm } from "./hooks";
import { TABLE_FORM_ITEM_ERROR } from "./consts";
import genEditTableStyle from './style'
import { fieldPool } from './fieldPool'

defineOptions({
  name: 'JEditTableFormItem'
})

interface Props {
  name?: string | (string | number)[]
  required?: boolean
  rules?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  name: undefined,
  required: false,
  rules: () => []
})

const emit = defineEmits<{
  (e: 'change'): void
}>()

const prefixCls = computed(() => 'jetlinks-edit-table')
const [wrapSSR, hashId] = genEditTableStyle(prefixCls)

const context = useInjectForm()
const globalErrorMessage = useInjectError()

let hideTimer: ReturnType<typeof setTimeout> | null = null

// 缓存字段路径，避免频繁的数组操作
let cachedFieldPath: (string | number)[] | null = null
let cachedName: string | (string | number)[] | undefined = undefined

// 计算字段路径
const fieldPath = computed(() => {
  if (!props.name) return []
  // 如果 name 没变，返回缓存
  if (cachedName === props.name && cachedFieldPath) {
    return cachedFieldPath
  }
  cachedName = props.name
  cachedFieldPath = isArray(props.name) ? props.name : [props.name]
  return cachedFieldPath
})

// 事件key，用于标识字段 - 使用简单字符串拼接
const eventKey = computed(() => fieldPath.value.join('-'))

// 字段ID
const fieldId = computed(() => {
  const path = fieldPath.value
  if (path.length === 0) return ''
  const [index, ...extra] = path
  return `${index}-${extra.join('.')}`
})

// 字段名（最后一个路径部分）
const fieldName = computed(() => {
  const path = fieldPath.value
  return path.length > 0 ? path[path.length - 1] : undefined
})

// 行索引
const rowIndex = computed(() => {
  const path = fieldPath.value
  return path.length > 0 ? Number(path[0]) : 0
})

// 字段值 - 优化：避免不必要的 get 调用
const fieldValue = computed(() => {
  if (!context.dataSource?.value || !props.name) return undefined
  const dataSource = context.dataSource.value
  const path = fieldPath.value

  // 快速路径：单层访问
  if (path.length === 1) {
    return dataSource[path[0] as any]
  }

  // 快速路径：双层访问（最常见的情况：dataSource[index][field]）
  if (path.length === 2) {
    const item = dataSource[path[0] as any]
    return item ? item[path[1] as any] : undefined
  }

  // 深层路径：使用 lodash.get
  return get(dataSource, props.name)
})

// 错误状态
const errorMap = reactive({
  message: '',
  visible: false
})

// 向下提供错误状态
provide(TABLE_FORM_ITEM_ERROR, errorMap)

const popContainer = (e: HTMLElement) => {
  return e
}

const removeTimer = () => {
  if (hideTimer) {
    window.clearTimeout(hideTimer)
    hideTimer = null
  }
}

const showErrorTip = (msg: string) => {
  removeTimer()
  errorMap.message = msg
  errorMap.visible = true
}

const hideErrorTip = () => {
  errorMap.visible = false
  removeTimer()
  hideTimer = setTimeout(() => {
    errorMap.message = ''
  }, 300)
}

// 获取当前字段的校验规则
const getFieldRules = () => {
  // 优先使用 props.rules
  if (props.rules && props.rules.length > 0) {
    return props.rules
  }

  // 从 context 中获取规则
  if (context.rules?.value && fieldName.value) {
    const rules = context.rules.value[fieldName.value as string]
    if (Array.isArray(rules)) {
      return rules
    }
  }

  // 如果 required 但没有规则，创建默认必填规则
  if (props.required) {
    return [{ required: true, message: `${fieldName.value} 不能为空` }]
  }

  return []
}

// 使用 async-validator 执行校验
const validateField = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const rules = getFieldRules()

    if (!rules || rules.length === 0) {
      hideErrorTip()
      context.removeFieldError?.(eventKey.value)
      resolve()
      return
    }

    const descriptor = {
      [fieldName.value as string]: rules
    }

    const validator = new Schema(descriptor)
    const data = {
      [fieldName.value as string]: toRaw(fieldValue.value)
    }

    validator.validate(data, { firstFields: true }, (errors) => {
      if (errors && errors.length > 0) {
        const errorMsg = errors[0].message || '校验失败'
        showErrorTip(errorMsg)
        context.addFieldError?.(eventKey.value, errorMsg)
        reject(errors)
      } else {
        hideErrorTip()
        context.removeFieldError?.(eventKey.value)
        resolve()
      }
    })
  })
}

// 兼容旧API的校验方法
const validateRules = () => {
  // 如果 context 提供了 validateItem，使用它来保持兼容性
  if (context.validateItem) {
    const promise = context.validateItem(
      { [fieldName.value as string]: fieldValue.value },
      rowIndex.value
    )

    promise.then(() => {
      hideErrorTip()
      context.removeFieldError?.(eventKey.value)
    }).catch((res: any) => {
      const error = res?.filter((item: any) => item.field === fieldName.value) || []
      if (error.length === 0) {
        hideErrorTip()
        context.removeFieldError?.(eventKey.value)
      } else {
        removeTimer()
        errorMap.message = error[0]?.message || errorMap.message
        errorMap.visible = !!error.length
        context.addFieldError?.(eventKey.value, errorMap.message)
      }
    })

    return promise
  }

  // 使用本地校验
  return validateField()
}

const onFieldBlur = () => {
  // 改为失焦时校验，减少实时校验的性能开销
  validateRules()
}

const onFieldChange = () => {
  // 只触发 change 事件，不进行校验
  // validateRules() // 移到 onBlur
  emit('change')
}

// 监听全局错误变化 - 精确监听单个字段，避免深度遍历
watch(() => globalErrorMessage?.value?.[eventKey.value], (errorMsg) => {
  if (errorMsg) {
    showErrorTip(errorMsg)
  } else {
    hideErrorTip()
  }
}, { immediate: true })

// 注册到 ant-design-vue form context
useProvideFormItemContext({
  id: fieldId,
  onFieldChange,
  onFieldBlur,
}, computed(() => {
  return get(context.dataSource?.value, props.name)
}))

// 注册字段到父组件 - 使用字段池复用，减少创建/销毁开销
let isRegistered = false
const registerField = () => {
  if (props.name && !isRegistered) {
    // 使用字段池获取或创建字段信息
    const fieldInfo = fieldPool.acquire(eventKey.value, {
      fieldName: fieldName.value,
      eventKey: eventKey.value,
      names: props.name,
      validateRules,
      showErrorTip
    })

    context.addField?.(eventKey.value, fieldInfo)
    isRegistered = true
  }
}

// 延迟注册，避免虚拟滚动时的同步阻塞
onMounted(() => {
  nextTick(() => {
    registerField()
  })
})

onBeforeUnmount(() => {
  hideErrorTip()
  if (isRegistered) {
    context.removeField?.(eventKey.value)
    // 释放字段到池中，而不是销毁
    fieldPool.release(eventKey.value)
    isRegistered = false
  }
})

// 暴露方法
defineExpose({
  validate: validateField,
  validateRules,
  showErrorTip,
  hideErrorTip
})
</script>
