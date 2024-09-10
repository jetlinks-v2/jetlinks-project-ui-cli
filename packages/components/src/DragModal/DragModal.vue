<template>
  <div ref='dialog' :style='styles' class='jetlinks-drag-modal'>
    <Transition name='dialog'>
      <div class='jetlinks-drag-modal-sprite' ref='header'>
        <div class='header' v-if="title !== false">
          <span>{{ title }}</span>
          <a-button size='small' type='text' @click.stop='onCancel'>
            <AIcon type='CloseOutlined' />
          </a-button>
        </div>
        <div class='jetlinks-drag-modal-body' :style="bodyStyle">
          <slot></slot>
        </div>
        <div class='jetlinks-drag-modal-footer' v-if='footer !== false'>
          <slot name='footer'>
            <Button @click.stop='onCancel'>取消</Button>
            <Button type="primary" @click.stop='onOk'>确认</Button>
          </slot>
        </div>
      </div>
    </Transition>

    <div class="jetlinks-drag-modal-range drag-bottom-right" @mousedown.stop='rangeMove($event,"drag-bottom-right")'></div>
  </div>
</template>

<script setup lang='ts'>
import { ref, useSlots, defineEmits, defineProps, defineOptions, computed, onMounted, watch} from 'vue'
import { Button } from 'ant-design-vue'

defineOptions({
  name: 'JDragModal'
})

const props = defineProps({
  title: {
    type: [String, Boolean],
    default: ''
  },
  width: {
    type: Number,
    default: 400
  },
  height: {
    type: Number,
    default: 100
  },
  dragRang: {
    type: [Array , Number],
    default: [400, 200]
  },
  bodyStyle: {
    type: Object,
    default: () => ({})
  },
  footer: {
    type: Boolean,
    default: true
  }
})
const emits = defineEmits(['cancel', 'heightChange', 'ok', 'visibleChange'])
const slots = useSlots()

const ele = document.body

const dialog = ref()
const header = ref()
const baseWidth = ref(props.width || 400)
const baseHeight = ref(props.height || 100)
const baseLeft = ref(100)
const baseTop = ref(100)

const styles = computed(() => {
  return {
    top: getFixed(baseTop.value) + 'px',
    left: getFixed(baseLeft.value) + 'px',
    width: getFixed(baseWidth.value) + 'px',
    height: getFixed(baseHeight.value) + 'px'
  }
})

const getFixed = (val: number) => {
  return Number(val.toFixed(2))
}

const onDrag = () => {
  let active = false
  let initialX: number
  let initialY: number
  let initialWindowX: number
  let initialWindowY: number

  header.value.addEventListener('mousedown', (e: MouseEvent) => {
    active = true

    initialX = e.clientX
    initialY = e.clientY

    initialWindowX = dialog.value.offsetLeft
    initialWindowY = dialog.value.offsetTop
  })

  document.addEventListener('mouseup', () => {
    active = false
  })

  document.addEventListener('mousemove', (e) => {
    if (active) {
      const dx = e.clientX - initialX
      const dy = e.clientY - initialY

      baseLeft.value = initialWindowX + dx
      baseTop.value = initialWindowY + dy
    }
  })
}

const handleClear = () => {
  document.onmouseup = () => {
    document.onmousemove = null
    document.onmouseup = null
  }
}

const rangeMove = (e: MouseEvent, position: string) => {
  //移动的方向
  let x: boolean = false
  let y: boolean = false
  //移动的位置
  let xp: boolean = false
  let yp: boolean = false
  //移动的正负
  let xc: boolean = false
  let yc: boolean = false
  let disX = e.clientX
  let disY = e.clientY
  document.onmousemove = e => {
    if (position === 'drag-bottom-right') {
      x = true
      y = true
    } else if (position === 'drag-bottom-left') {
      x = true
      y = true
      xp = true
      xc = true
    } else if (position === 'drag-top-right') {
      x = true
      y = true
      yp = true
      yc = true
    } else if (position === 'drag-top-left') {
      x = true
      y = true
      xp = true
      xc = true
      yp = true
      yc = true
    }
    let left = e.clientX - disX
    let top = e.clientY - disY
    disX = e.clientX
    disY = e.clientY
    if (x) {
      let calc = left

      if (xc) {
        calc = -calc
      }

      if (xp) {
        baseLeft.value = baseLeft.value - calc
      }

      const width = baseWidth.value + calc

      baseWidth.value = width <= props.dragRang[0] ? props.dragRang[0] : width
    }
    if (y) {
      let calc = top
      if (yc) {
        calc = -calc
      }

      if (yp) {
        baseTop.value = baseTop.value - calc
      }

      const height = baseHeight.value + calc

      baseHeight.value = height <= props.dragRang[1] ? props.dragRang[1] : height

      emits('heightChange', baseHeight.value)
    }
  }
  handleClear()
}

const onCancel = () => {
  emits("cancel")
  emits('visibleChange', false)
}

const onOk = () => {
  emits("ok")
  emits('visibleChange', true)
}

onMounted(() => {
  if (dialog.value && header.value) {
    onDrag()
  }
  if (ele) {
    const data = ele?.getBoundingClientRect()
    baseLeft.value = (data?.right - baseWidth.value) / 2 || 0
    baseTop.value = data?.top + 200 || 0
  }
})

watch(() => props.height, () => {
  if (props.height > baseHeight.value) {
    baseHeight.value = props.height
  }
})
</script>
