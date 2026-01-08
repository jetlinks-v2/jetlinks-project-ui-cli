<template>
  <a-tooltip
    v-if="errorState.visible"
    color="#ffffff"
    :get-popup-container="popContainer"
    :arrowPointAtCenter="true"
    v-model:open="visible"
    @open-change="(v) => visible = v"
  >
    <template #title>
      <span style="color: #1d2129">{{ errorState.message }}</span>
    </template>
    <div :class="['jetlinks-table-form-error-target', hashId, 'hashId']"></div>
  </a-tooltip>
  <div :id="eventKey" style="position: relative" :class="{'jetlinks-edit-table-form-has-error': errorState.message, [hashId]: true }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, computed, shallowReactive, watch, provide, toRaw, onMounted, shallowRef, ref } from "vue";
import { get, isArray } from 'lodash-es'
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
const visible = ref(false)

const context = useInjectForm()
const globalErrorMessage = useInjectError()

let hideTimer: ReturnType<typeof setTimeout> | null = null

// 缓存 Schema 实例，避免重复创建
let cachedSchema: Schema | null = null
let cachedRulesHash: string | null = null

// 计算字段路径 - 简化逻辑
const fieldPath = computed<(string | number)[]>(() => {
  if (!props.name) return []
  return isArray(props.name) ? props.name : [props.name]
})

// 事件key - 使用 shallowRef 优化
const eventKey = computed(() => fieldPath.value.join('-'))

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

// 字段值 - 优化访问路径
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

// 错误状态 - 使用 shallowReactive 减少响应式开销
const errorState = shallowReactive({
  message: '',
  visible: false
})

// 向下提供错误状态
provide(TABLE_FORM_ITEM_ERROR, errorState)

const popContainer = (e: HTMLElement) => e

const removeTimer = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

const showErrorTip = (msg: string) => {
  removeTimer()
  errorState.message = msg
  errorState.visible = true
}

const hideErrorTip = () => {
  errorState.visible = false
  removeTimer()
  hideTimer = setTimeout(() => {
    errorState.message = ''
  }, 300)
}

// 获取当前字段的校验规则 - 缓存规则
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

// 获取或创建 Schema 实例
const getSchema = (): Schema | null => {
  const rules = getFieldRules()

  if (!rules || rules.length === 0) {
    cachedSchema = null
    cachedRulesHash = null
    return null
  }

  // 简单的规则哈希检查
  const rulesHash = JSON.stringify(rules)
  if (cachedRulesHash === rulesHash && cachedSchema) {
    return cachedSchema
  }

  // 创建新的 Schema
  const descriptor = {
    [fieldName.value as string]: rules
  }
  cachedSchema = new Schema(descriptor)
  cachedRulesHash = rulesHash

  return cachedSchema
}

// 使用 async-validator 执行校验
const validateField = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const schema = getSchema()

    if (!schema) {
      hideErrorTip()
      context.removeFieldError?.(eventKey.value)
      resolve()
      return
    }

    const data = {
      [fieldName.value as string]: toRaw(fieldValue.value)
    }

    schema.validate(data, { firstFields: true }, (errors) => {
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
        errorState.message = error[0]?.message || errorState.message
        errorState.visible = !!error.length
        context.addFieldError?.(eventKey.value, errorState.message)
      }
    })

    return promise
  }

  // 使用本地校验
  return validateField()
}

const onFieldBlur = () => {
  // 失焦时校验，减少实时校验的性能开销
  validateRules()
}

const onFieldChange = () => {
  emit('change')
}

// 监听全局错误变化 - 使用精确的 key 监听
const currentEventKey = shallowRef('')

watch(() => eventKey.value, (newKey) => {
  currentEventKey.value = newKey
}, { immediate: true })

watch(() => {
  const key = currentEventKey.value
  return key ? globalErrorMessage?.value?.[key] : undefined
}, (errorMsg) => {
  if (errorMsg) {
    showErrorTip(errorMsg)
  } else if (errorState.visible) {
    hideErrorTip()
  }
}, { immediate: true })

// 注册到 ant-design-vue form context - 延迟计算
const fieldId = computed(() => {
  const path = fieldPath.value
  if (path.length === 0) return ''
  const [index, ...extra] = path
  return `${index}-${extra.join('.')}`
})

useProvideFormItemContext({
  id: fieldId,
  onFieldChange,
  onFieldBlur,
}, computed(() => {
  return get(context.dataSource?.value, props.name)
}))

// 注册字段到父组件 - 使用字段池复用
let isRegistered = false

const registerField = () => {
  if (props.name && !isRegistered) {
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

// 延迟注册，使用 queueMicrotask 替代 nextTick，性能更好
onMounted(() => {
  queueMicrotask(registerField)
})

onBeforeUnmount(() => {
  removeTimer()
  if (isRegistered) {
    context.removeField?.(eventKey.value)
    fieldPool.release(eventKey.value)
    isRegistered = false
  }
  // 清理缓存
  cachedSchema = null
  cachedRulesHash = null
})

// 暴露方法
defineExpose({
  validate: validateField,
  validateRules,
  showErrorTip,
  hideErrorTip
})
</script>
