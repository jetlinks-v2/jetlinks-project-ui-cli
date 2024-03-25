<template>
  <div ref="scrollbarRef" class="j-scrollbar">
    <div
      ref="wrapRef"
      :class="wrapKls"
      :style="wrapStyle"
      @scroll="handleScroll"
    >
      <component
        :is="tag"
        :id="id"
        ref="resizeRef"
        :class="resizeKls"
        :role="role"
        :aria-label="ariaLabel"
        :aria-orientation="ariaOrientation"
      >
        <slot/>
      </component>
    </div>
    <template v-if="!native">
      <bar ref="barRef" :always="always" :min-size="minSize"/>
    </template>
  </div>
</template>
<script lang="ts" setup>
import {
  computed,
  nextTick,
  onMounted,
  onUpdated,
  provide,
  reactive,
  ref,
  watch,
} from 'vue'
import { useEventListener, useResizeObserver } from '@vueuse/core'
import { isNumber, isObject } from '@jetlinks-web/utils'
import Bar from './Bar.vue'
import { scrollbarContextKey } from './constants'
import { scrollbarEmits, scrollbarProps, BarInstance } from './scrollbar'
import type { CSSProperties, StyleValue } from 'vue'

const COMPONENT_NAME = 'JScrollbar'

defineOptions({
  name: COMPONENT_NAME,
})

const props = defineProps(scrollbarProps)
const emit = defineEmits(scrollbarEmits)

let stopResizeObserver: (() => void) | undefined = undefined
let stopResizeListener: (() => void) | undefined = undefined

const scrollbarRef = ref<HTMLDivElement>()
const wrapRef = ref<HTMLDivElement>()
const resizeRef = ref<HTMLElement>()
const barRef = ref<BarInstance>()

const wrapStyle = computed<StyleValue>(() => {
  const style: CSSProperties = {}
  if (props.height) style.height = `${props.height}px`
  if (props.maxHeight) style.maxHeight = `${props.maxHeight}px`
  return [props.wrapStyle, style]
})

const wrapKls = computed(() => {
  return [
    'j-scrollbar__wrap',
    'j-scrollbar__wrap--hidden-default'
  ]
})

const resizeKls = computed(() => {
  return ['j-scrollbar__view', props.viewClass]
})

const handleScroll = () => {
  if (wrapRef.value) {
    barRef.value?.handleScroll(wrapRef.value)

    emit('scroll', {
      scrollTop: wrapRef.value.scrollTop,
      scrollLeft: wrapRef.value.scrollLeft,
    })
  }
}

function scrollTo(xCord: number, yCord?: number): void
function scrollTo(options: ScrollToOptions): void
function scrollTo(arg1: any, arg2?: number) {
  if (isObject(arg1)) {
    wrapRef.value!.scrollTo(arg1)
  } else if (isNumber(arg1) && isNumber(arg2)) {
    wrapRef.value!.scrollTo(arg1, arg2)
  }
}

const setScrollTop = (value: number) => {
  if (!isNumber(value)) {
    throw new Error('value must be a number');
  }
  wrapRef.value!.scrollTop = value
}

const setScrollLeft = (value: number) => {
  if (!isNumber(value)) {
    throw new Error(`[${COMPONENT_NAME}] value must be a number`);
  }
  wrapRef.value!.scrollLeft = value
}

const update = () => {
  barRef.value?.update()
}

watch(
  () => props.noresize,
  (noResize) => {
    if (noResize) {
      stopResizeObserver?.()
      stopResizeListener?.()
    } else {
      ;({stop: stopResizeObserver} = useResizeObserver(resizeRef, update))
      stopResizeListener = useEventListener('resize', update)
    }
  },
  {immediate: true}
)

watch(
  () => [props.maxHeight, props.height],
  () => {
    if (!props.native)
      nextTick(() => {
        update()
        if (wrapRef.value) {
          barRef.value?.handleScroll(wrapRef.value)
        }
      })
  }
)

provide(
  scrollbarContextKey,
  reactive({
    scrollbarElement: scrollbarRef,
    wrapElement: wrapRef,
  })
)

onMounted(() => {
  if (!props.native)
    nextTick(() => {
      update()
    })
})
onUpdated(() => update())

defineExpose({
  /** @description scrollbar wrap ref */
  wrapRef,
  /** @description update scrollbar state manually */
  update,
  /** @description scrolls to a particular set of coordinates */
  scrollTo,
  /** @description set distance to scroll top */
  setScrollTop,
  /** @description set distance to scroll left */
  setScrollLeft,
  /** @description handle scroll event */
  handleScroll,
})
</script>

<style lang="less">
@scrollbar-bg-color: #909399;
@scrollbar-hover-bg-color: #909399;
@scrollbar-hover-opacity: 0.5;
@scrollbar-opacity: 0.3;
@transition-duration: 0.3s;

.j-scrollbar {
  overflow: hidden;
  position: relative;
  height: 100%;

  &__wrap {
    overflow: auto;
    height: 100%;

    &--hidden-default {
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  &__thumb {
    position: relative;
    display: block;
    width: 0;
    height: 0;
    cursor: pointer;
    border-radius: inherit;
    background-color: @scrollbar-bg-color;
    transition: @transition-duration background-color;
    opacity: @scrollbar-opacity;

    &:hover {
      background-color: @scrollbar-hover-bg-color;
      opacity: @scrollbar-hover-opacity;
    }
  }

  &__bar {
    position: absolute;
    right: 2px;
    bottom: 2px;
    z-index: 1;
    border-radius: 4px;

    &--vertical {
      width: 6px;
      top: 2px;

      > div {
        width: 100%;
      }
    }

    &--horizontal {
      height: 6px;
      left: 2px;

      > div {
        height: 100%;
      }
    }
  }
}

.j-scrollbar-fade {
  &-enter-active {
    transition: opacity 340ms ease-out;
  }

  &-leave-active {
    transition: opacity 120ms ease-out;
  }

  &-enter-from,
  &-leave-active {
    opacity: 0;
  }
}
</style>
