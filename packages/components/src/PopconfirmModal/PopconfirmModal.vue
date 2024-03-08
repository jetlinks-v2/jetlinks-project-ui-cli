<template>
  <Popover
      :data-id="modalDataId"
      :get-popup-container="getPopupContainer"
      :overlay-class-name="`${modalWarpName} modal-${modalDataId}`"
      :placement="placement || 'top'"
      :visible="myVisible"
      trigger="click"
      @visibleChange="() => {}"
  >
    <template #title>
      <slot name="title"/>
    </template>
    <template #content>
      <div
          v-if="destroy"
          :style="bodyStyle"
          class="popconfirm-modal-body"
      >
        <slot name="content" v-bind="{ parentMask: modalDataId }"/>
      </div>
      <slot name="footer">
        <div v-if="myVisible" class="popconfirm-modal-footer">
          <Button
              v-if="showCancel"
              size="small"
              @click.stop="cancel"
          >{{ cancelText }}
          </Button
          >
          <Button
              v-if="showOk"
              :loading="loading"
              size="small"
              type="primary"
              @click.stop="confirm"
          >{{ okText }}
          </Button>
        </div>
      </slot>
    </template>
    <span @click="() => visibleChange(true)">
            <slot/>
        </span>
  </Popover>
</template>

<script lang="ts" name="JPopconfirmModal" setup>
import { popoverProps } from 'ant-design-vue/lib/popover';
import { Button, Popover } from 'ant-design-vue';
import { ref, computed, inject, provide } from 'vue';
import type { CSSProperties, PropType } from 'vue';
import { isPromise, randomString } from '@jetlinks-web/utils';
import { createMaskNode, hideMask } from './util';

type Emit = {
  (e: 'update:visible', data: Boolean): void;
  (e: 'visibleChange', data: Boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
};

const props = defineProps({
  ...popoverProps(),
  bodyStyle: {
    type: [String, Object] as PropType<CSSProperties>,
    default: undefined,
  },
  cancelText: {
    type: String,
    default: '取消',
  },
  okText: {
    type: String,
    default: '确认',
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  showOk: {
    type: Boolean,
    default: true,
  },
  visible: {
    type: Boolean,
    default: undefined,
  },
  confirmLoading: {
    type: Boolean,
    default: false,
  },
  destroyOnClose: {
    type: Boolean,
    default: false,
  },
  onConfirm: Function as PropType<(e: MouseEvent) => void | Promise<any>>,
});

const emit = defineEmits<Emit>();

const myVisible = ref(false);
const loading = ref(false);

const modalWarpName = 'popconfirm-modal-warp';
const modalDataId = ref(randomString(12));

const parentMask = inject<string>('parent-mask');

provide('parent-mask', modalDataId.value);

const destroy = computed(() => {
  if (props.destroyOnClose !== false) {
    return myVisible.value;
  }

  return true;
});

const visibleChange = (e: boolean) => {
  myVisible.value = e;
  if (e) {
    setTimeout(() => {
      createMaskNode(modalDataId.value);
    }, 100);
  } else {
    hideMask(modalDataId.value, parentMask);
  }
  emit('update:visible', e);
  emit('visibleChange', e);
};

const cancel = () => {
  visibleChange(false);
  loading.value = false;
  emit('cancel');
};

const confirm = async (e) => {
  loading.value = true;
  const fn = props.onConfirm?.(e);
  if (isPromise(fn)) {
    (fn as Promise<any>)
        .then(() => {
          visibleChange(false);
        })
        .finally(() => {
          console.log('finally');
          loading.value = false;
        })
        .catch(() => {
          console.log('catch');
          loading.value = false;
        });
  } else {
    loading.value = false;
    visibleChange(false);
  }
};
</script>

<style lang="less">
.popconfirm-modal-warp {
  .popconfirm-modal-body {
    min-width: 220px;
    margin-bottom: 12px;
  }

  .popconfirm-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}

.popconfirm-modal-mask {
  position: fixed;
  height: 100vh;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1030;
  background-color: rgba(#000, 0.2);

  &.hide,
  &.close {
    position: relative;
    height: 0;
  }
}
</style>
