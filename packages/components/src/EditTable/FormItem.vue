<template>
  <a-tooltip
    color="#ffffff"
    :get-popup-container="popContainer"
    :arrowPointAtCenter="true"
  >
    <template #title>
      <span style="color: #1d2129">{{errorMap.message}}</span>
    </template>
    <div v-if="errorMap.visible" class="jetlinks-table-form-error-target" ></div>
  </a-tooltip>
  <div :id="eventKey" style="position: relative" :class="{'jetlinks-edit-table-form-has-error': errorMap.message }">
    <slot />
  </div>
</template>

<script setup>
import {onBeforeUnmount, computed, defineEmits, reactive, watch, defineProps, defineOptions, provide} from "vue";
import {get, isArray } from 'lodash-es'
import { useProvideFormItemContext } from 'ant-design-vue/es/form/FormItemContext'
import {useInjectError, useInjectForm} from "./hooks";
import {TABLE_FORM_ITEM_ERROR} from "./consts";

defineOptions({
  name: 'JEditTableFormItem'
})

const props = defineProps({
  name: {
    type: [String, Array],
    default: undefined
  },
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['change'])

const context = useInjectForm()
const globalErrorMessage = useInjectError()

let hideTimer

const eventKey = computed(() => {
  const names = isArray(props.name) ? props.name : [props.name]
  return names.join('-')
})

const errorMap = reactive({
  message: '',
  visible: false
})

const filedId = computed(() => {
  const names = isArray(props.name) ? props.name : [props.name]
  return names.join('_')
})

const filedName = computed(() => {
  const names = isArray(props.name) ? props.name : [props.name]
  const _rules = context.rules.value
  let tempKey = undefined

  for (const key of names) {
    if (key in _rules) {
      tempKey = key
    }
  }

  return tempKey
})

const filedValue = computed(() => {
  return get(context.dataSource.value, props.name)
})

provide(TABLE_FORM_ITEM_ERROR, errorMap)

const popContainer = (e) => {
  return e
}

const removeTimer = () => {
  if (hideTimer) {
    window.clearTimeout(hideTimer)
    hideTimer = null
  }
}
const showErrorTip = (msg) => {
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
const validateRules = () => {
  let index = 0
  if (isArray(props.name)) {
    index = props.name[0]
  }

  const promise = context.validateItem({ [filedName.value]: get(context.dataSource.value, props.name) }, index)
  promise.catch(res => {
    const error = res?.filter(item => item.field === filedName.value) || []
    if (error.length === 0) {
      hideErrorTip()
      context.removeFieldError(eventKey.value)
    } else {
      removeTimer()
      errorMap.message = error[0]?.message || errorMap.message
      errorMap.visible = !!error.length
      context.addFieldError(eventKey.value, errorMap.message)
    }
    return errorMap.message
  })

  return promise
}

const onFieldBlur = () => {
  // validateRules()
}

const onFieldChange = () => {
  validateRules()
  emit('change')
}

watch(() => globalErrorMessage.value, (val) => {
  if (val[eventKey.value]) {
    showErrorTip(val[eventKey.value])
  } else {
    hideErrorTip()
  }
}, { immediate: true, deep: true})

useProvideFormItemContext({
  id: filedId,
  onFieldChange,
  onFieldBlur,
}, computed(() => get(context.dataSource.value, props.name)))

onBeforeUnmount(() => {
  hideErrorTip()
})

watch(() => [filedName.value, props.name], () => {
  context.addField(eventKey.value, {
    filedName: filedName.value,
    eventKey: eventKey.value,
    names: props.name,
    validateRules,
    showErrorTip
  })
}, { immediate: true })

</script>
