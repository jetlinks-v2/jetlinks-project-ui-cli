import { createVNode, render as vueRender, h } from 'vue';
import type { ModalFuncProps } from 'ant-design-vue/lib/modal/Modal'
import { destroyFns } from './index'
import { omit } from 'lodash-es'

const confirm = (config: ModalFuncProps, components: string) => {
  const container = document.createDocumentFragment();

  let confirmDialogInstance = null;

  let currentConfig = {
    ...config,
    visible: true,
  } as any;

  function destroy(...args: any[]) {
    if (confirmDialogInstance) {
      // destroy
      vueRender(null, container as any);
      confirmDialogInstance.component.update();
      confirmDialogInstance = null;
    }

    const triggerCancel = args.some(param => param && param.triggerCancel);

    if (config.onCancel && triggerCancel) {
      config.onCancel(...args);
    }

    for (let i = 0; i < destroyFns.length; i++) {
      const fn = destroyFns[i];
      if (fn === close) {
        destroyFns.splice(i, 1);
        break;
      }
    }
  }

  function close(this: typeof close, ...args: any[]) {
    currentConfig = {
      ...currentConfig,
      visible: false,
      afterClose: () => {
        if (typeof config.afterClose === 'function') {
          config.afterClose();
        }
        destroy.apply(this, args);
      },
    };
    update(currentConfig);
  }

  function update(configUpdate: ModalFuncProps) {
    if (typeof configUpdate === 'function') {
      currentConfig = configUpdate(currentConfig);
    } else {
      currentConfig = {
        ...currentConfig,
        ...configUpdate,
      };
    }
    if (confirmDialogInstance) {
      Object.assign(confirmDialogInstance.component.props, currentConfig);
      confirmDialogInstance.component.update();
    }
  }

  const Wrapper = (p: ModalFuncProps) => {
    return h(components, {...p})
  };
  function render(props: ModalFuncProps) {
    const vm = createVNode(Wrapper, { ...props });
    vm.appContext = config.parentContext || config.appContext || vm.appContext;
    vueRender(vm, container as any);
    return vm;
  }

  confirmDialogInstance = render(currentConfig);
  destroyFns.push(close);
  return {
    destroy: close,
    update,
  };
}

export default confirm
