import {h, defineComponent, computed, inject, getCurrentInstance, toRefs} from "vue";
import type { PropType, CSSProperties, ExtractPropTypes, App } from 'vue'
import { Button, Tooltip, Modal } from 'ant-design-vue'
import { PopconfirmProps, TooltipProps } from "ant-design-vue/es";
import { omit } from "lodash-es";
import { buttonProps } from "ant-design-vue/es/button/button";
import { usePermission } from '@jetlinks-web/hooks'
import confirm from './confirm'
import {PermissionButtonConfig} from "../utils/constants";
import {useLocaleReceiver} from "../LocaleReciver";

type PermissionType = string | Array<string> | boolean

const definedProps = {
    tooltip: {
        type: Object as PropType<TooltipProps>,
    },
    popConfirm: {
        type: Object as PropType<PopconfirmProps>,
    },
    hasPermission: {
        type: [String, Array, Boolean] as PropType<PermissionType>,
        default: undefined
    },
    style: {
        type: Object as PropType<CSSProperties>
    },
    noPermissionTitle: {
        type: String
    },
    popConfirmBefore: {
        type: Function
    },
    ...omit(buttonProps(), 'icon')
}

export type DefinedPropsType = Partial<ExtractPropTypes<typeof definedProps>>

export const destroyFns = [];

const PermissionButton = defineComponent({
    name: 'JPermissionButton',
    // @ts-ignore
    slots: ['button', 'icon'],
    props: definedProps,
    setup(props, {slots}) {
        const instance = getCurrentInstance()
        const propsRef = toRefs(props)
        const {hasPerm} = usePermission(propsRef.hasPermission)
      const [contextLocale] = useLocaleReceiver('PermissionButton');

        const context = inject(PermissionButtonConfig, { components: undefined })
        const permission = computed(() => {
          const hasOwnPrototype = Object.prototype.hasOwnProperty.call(instance.props, 'hasPermission')
            if (props.hasPermission === true || !hasOwnPrototype) {
                return true
            }
            return hasPerm.value
        })

        const isPermission = computed(() => {
            if ('hasPermission' in props && permission.value) {
                return 'disabled' in props ? !!props.disabled : false
            }
            return true
        })

        // const hasPopConfirm = computed(() => !!props.popConfirm) // 是否包含确认弹窗
        const hasTooltip = computed(() => !!props.tooltip) // 是否包含文字提示

        return () => {
            const {popConfirm, tooltip, hasPermission, noPermissionTitle, ...buttonProps} = props

            if (popConfirm) {
              buttonProps.onClick = async () => {

                const _popConfirm = await (props.popConfirmBefore?.() || popConfirm)

                if (context.components) {
                  confirm({
                    ..._popConfirm as any,
                    danger: buttonProps.danger
                  }, context.components)
                } else {
                  Modal.confirm({
                    title: _popConfirm.title,
                    content: _popConfirm.content,
                    onOk() {
                      return _popConfirm.onConfirm?.()
                    },
                    onCancel() {
                      _popConfirm.onCancel?.()
                    }
                  })
                }
              }
            }

            const button = !slots.button ?
                h(Button,
                    {
                        ...buttonProps,
                        disabled: isPermission.value,
                    },
                    {
                        default: () => slots?.default?.(),
                        icon: () => slots?.icon?.()
                    }) :
                slots.button()

            // 文字提示
            const _tooltip = tooltip ? h(Tooltip, Object.assign(tooltip, {disabled: isPermission.value}), {default: () => button}) : undefined

            // 无权限
            const noPermissionButton = !permission.value ? h(Tooltip, {title: noPermissionTitle || contextLocale.value.hasPermission}, {default: () => button}) : undefined

            if (permission.value) {

                if (hasTooltip.value) {
                    return _tooltip
                }

                return button
            }
            return noPermissionButton
        }
    }
})

PermissionButton.install = function (app: App) {
  app.component(PermissionButton.name, PermissionButton)
}
export default PermissionButton
