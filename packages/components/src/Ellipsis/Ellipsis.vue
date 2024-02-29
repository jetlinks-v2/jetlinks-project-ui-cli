<template>
  <Tooltip
    ref="tooltipRef"
    placement="top"
    v-bind="tooltip"
    :visible="visible"
  >
    <template v-if="tooltip">
      <div :class="[jEllipsisLineClampClass, jEllipsis, 'j-ellipsis-deep']">
        <slot></slot>
        <slot name="tooltip"></slot>
      </div>
    </template>
    <span
      ref="triggerRef"
      v-bind="triggerAttrs()"
      @click="handleClickRef"
      @mouseleave="visible = false"
      @mouseenter="[
                    props.expandTrigger === 'click'
                        ? getTooltipDisabled()
                        : showTooltip(),
                ]"
    >

    </span>
  </Tooltip>
</template>

<script setup>
import {Tooltip} from 'ant-design-vue'
import {computed, mergeProps, ref, useAttrs} from 'vue';

defineOptions({
  name: 'Ellipsis'
})

const props = defineProps({
  expandTrigger: {
    type: String,
    default: undefined,
  },
  /** multiline ellipsis */
  lineClamp: {
    type: [Number, String],
    default: 1,
  },
  tooltip: {
    type: [Boolean, Object],
    default: true
  }
})

// define class name
const jEllipsis = 'j-ellipsis';
const jEllipsisCursorClass = 'j-ellipsis-cursor';
const jEllipsisLineClampClass = 'j-ellipsis-line-clamp';

const expandedRef = ref(false);
const tooltipRef = ref(null);
const triggerRef = ref(null);
const visible = ref(false);

const attrs = useAttrs();

const handleClickRef = computed(() => {
  return props.expandTrigger === 'click'
    ? () => {
      const {value: expanded} = expandedRef;
      expandedRef.value = !expanded;
    }
    : undefined;
});

function triggerAttrs() {
  return {
    ...mergeProps(attrs, {
      class: [
        jEllipsis,
        props.lineClamp !== undefined
          ? jEllipsisLineClampClass
          : undefined,
        props.expandTrigger === 'click'
          ? jEllipsisCursorClass
          : undefined,
      ],
      style: ellipsisStyleRef.value,
    }),
  };
}

const showTooltip = () => {
  const {value: trigger} = triggerRef;
  if (trigger) {
    visible.value = trigger.scrollHeight > trigger.offsetHeight;
  }
};

const ellipsisStyleRef = computed(() => {
  const {lineClamp} = props;
  const {value: expanded} = expandedRef;
  if (lineClamp !== undefined) {
    return {
      textOverflow: '',
      '-webkit-line-clamp': expanded ? '' : lineClamp,
    };
  } else {
    return {
      textOverflow: expanded ? '' : 'ellipsis',
      '-webkit-line-clamp': '',
    };
  }
});

const syncEllipsisStyle = (trigger) => {
  if (!trigger) return;
  const latestStyle = ellipsisStyleRef.value;
  const lineClampClass = jEllipsisLineClampClass;
  if (props.lineClamp !== undefined) {
    syncTriggerClass(trigger, lineClampClass, 'add');
  } else {
    syncTriggerClass(trigger, lineClampClass, 'remove');
  }
  for (const key in latestStyle) {
    if (trigger.style[key] !== latestStyle[key]) {
      trigger.style[key] = latestStyle[key];
    }
  }
}

const syncTriggerClass = (
  trigger,
  styleClass,
  action,
) => {
  if (action === 'add') {
    if (!trigger.classList.contains(styleClass)) {
      trigger.classList.add(styleClass);
    }
  } else {
    if (trigger.classList.contains(styleClass)) {
      trigger.classList.remove(styleClass);
    }
  }
}

const syncCursorStyle = (trigger, tooltipDisabled) => {
  if (props.expandTrigger === 'click' && !tooltipDisabled) {
    syncTriggerClass(trigger, jEllipsisCursorClass, 'add');
  } else {
    syncTriggerClass(trigger, jEllipsisCursorClass, 'remove');
  }
}

const getTooltipDisabled = () => {
  let tooltipDisabled = false;
  const {value: expanded} = expandedRef;

  if (expanded) return true;

  const {value: trigger} = triggerRef;

  if (trigger) {
    syncEllipsisStyle(trigger);
    tooltipDisabled = trigger.scrollHeight <= trigger.offsetHeight;

    syncCursorStyle(trigger, tooltipDisabled);
  }
  return tooltipDisabled;
}

</script>

<style scoped>
.j-ellipsis {
  overflow: hidden;
  vertical-align: bottom;
}

.j-ellipsis-cursor {
  cursor: pointer;
}

.j-ellipsis-line-clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  word-break: break-all;
}

.j-ellipsis-deep {
  max-height: 380px;
  -webkit-line-clamp: 17;
  text-overflow: ellipsis;
}

</style>
