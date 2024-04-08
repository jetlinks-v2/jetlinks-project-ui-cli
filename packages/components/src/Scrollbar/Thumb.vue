<template>
  <transition name="j-scrollbar-fade">
    <div
      v-show="always || visible"
      ref="instance"
      :class="['j-scrollbar__bar', props.vertical ? 'is-vertical' : 'is-horizontal']"
      @mousedown="clickTrackHandler"
    >
      <div
        ref="thumb"
        class="j-scrollbar__thumb"
        :style="thumbStyle"
        @mousedown="clickThumbHandler"
      />
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, ref, toRef } from 'vue'
import { useEventListener } from '@vueuse/core'
import { isClient } from '@jetlinks-web/utils'
import { scrollbarContextKey } from './constants'
import { BAR_MAP, renderThumbStyle } from './util'
import { thumbProps } from './thumbProps'

const props = defineProps(thumbProps)

const scrollbar = inject(scrollbarContextKey)

if (!scrollbar) throw new Error('can not inject scrollbar context')

const instance = ref<HTMLDivElement>()
const thumb = ref<HTMLDivElement>()

const thumbState = ref<Partial<Record<'X' | 'Y', number>>>({})
const visible = ref(false)

let cursorDown = false
let cursorLeave = false
let originalOnSelectStart:
  | ((this: GlobalEventHandlers, ev: Event) => any)
  | null = isClient ? document.onselectstart : null

const bar = computed(() => BAR_MAP[props.vertical ? 'vertical' : 'horizontal'])

const thumbStyle = computed(() =>
  renderThumbStyle({
    size: props.size,
    move: props.move,
    bar: bar.value,
  })
)

const offsetRatio = computed(
  () =>
    instance.value![bar.value.offset] ** 2 /
    scrollbar.wrapElement![bar.value.scrollSize] /
    props.ratio /
    Thumb.value![bar.value.offset]
)

const clickThumbHandler = (e: MouseEvent) => {
  // prevent click event of middle and right button
  e.stopPropagation()
  if (e.ctrlKey || [1, 2].includes(e.button)) return

  window.getSelection()?.removeAllRanges()
  startDrag(e)

  const el = e.currentTarget as HTMLDivElement
  if (!el) return
  thumbState.value[bar.value.axis] =
    el[bar.value.offset] -
    (e[bar.value.client] - el.getBoundingClientRect()[bar.value.direction])
}

const clickTrackHandler = (e: MouseEvent) => {
  if (!Thumb.value || !instance.value || !scrollbar.wrapElement) return

  const offset = Math.abs(
    (e.target as HTMLElement).getBoundingClientRect()[bar.value.direction] -
    e[bar.value.client]
  )
  const thumbHalf = Thumb.value[bar.value.offset] / 2
  const thumbPositionPercentage =
    ((offset - thumbHalf) * 100 * offsetRatio.value) /
    instance.value[bar.value.offset]

  scrollbar.wrapElement[bar.value.scroll] =
    (thumbPositionPercentage * scrollbar.wrapElement[bar.value.scrollSize]) /
    100
}

const startDrag = (e: MouseEvent) => {
  e.stopImmediatePropagation()
  cursorDown = true
  document.addEventListener('mousemove', mouseMoveDocumentHandler)
  document.addEventListener('mouseup', mouseUpDocumentHandler)
  originalOnSelectStart = document.onselectstart
  document.onselectstart = () => false
}

const mouseMoveDocumentHandler = (e: MouseEvent) => {
  if (!instance.value || !Thumb.value) return
  if (cursorDown === false) return

  const prevPage = thumbState.value[bar.value.axis]
  if (!prevPage) return

  const offset =
    (instance.value.getBoundingClientRect()[bar.value.direction] -
      e[bar.value.client]) *
    -1
  const thumbClickPosition = Thumb.value[bar.value.offset] - prevPage
  const thumbPositionPercentage =
    ((offset - thumbClickPosition) * 100 * offsetRatio.value) /
    instance.value[bar.value.offset]
  scrollbar.wrapElement[bar.value.scroll] =
    (thumbPositionPercentage * scrollbar.wrapElement[bar.value.scrollSize]) /
    100
}

const mouseUpDocumentHandler = () => {
  cursorDown = false
  thumbState.value[bar.value.axis] = 0
  document.removeEventListener('mousemove', mouseMoveDocumentHandler)
  document.removeEventListener('mouseup', mouseUpDocumentHandler)
  restoreOnselectstart()
  if (cursorLeave) visible.value = false
}

const mouseMoveScrollbarHandler = () => {
  cursorLeave = false
  visible.value = !!props.size
}

const mouseLeaveScrollbarHandler = () => {
  cursorLeave = true
  visible.value = cursorDown
}

onBeforeUnmount(() => {
  restoreOnselectstart()
  document.removeEventListener('mouseup', mouseUpDocumentHandler)
})

const restoreOnselectstart = () => {
  if (document.onselectstart !== originalOnSelectStart)
    document.onselectstart = originalOnSelectStart
}

useEventListener(
  toRef(scrollbar, 'scrollbarElement'),
  'mousemove',
  mouseMoveScrollbarHandler
)
useEventListener(
  toRef(scrollbar, 'scrollbarElement'),
  'mouseleave',
  mouseLeaveScrollbarHandler
)
</script>
