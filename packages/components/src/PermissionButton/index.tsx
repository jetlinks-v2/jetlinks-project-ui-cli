import {h, defineComponent, computed, inject} from "vue";
import type { PropType, CSSProperties, ExtractPropTypes, App } from 'vue'
import { Button, Tooltip, Modal } from 'ant-design-vue'
import { PopconfirmProps, TooltipProps } from "ant-design-vue/es";
import { omit } from "lodash-es";
import { buttonProps } from "ant-design-vue/es/button/button";
import { usePermission } from '@jetlinks-web/hooks'
import confirm from './confirm'
import {PermissionButtonConfig} from "../utils/constants";

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

        const {hasPerm} = usePermission(props.hasPermission as PermissionType)

        const context = inject(PermissionButtonConfig, { components: undefined })

        const permission = computed(() => {
            if (!props.hasPermission || props.hasPermission === true) {
                return true
            }
            return hasPerm.value
        })

        const isPermission = computed(() => {
            if ('hasPermission' in props && permission.value) {
                return 'disabled' in props ? props.disabled : false
            }
            return true
        })

        // const hasPopConfirm = computed(() => !!props.popConfirm) // 是否包含确认弹窗
        const hasTooltip = computed(() => !!props.tooltip) // 是否包含文字提示

        return () => {
            const {popConfirm, tooltip, hasPermission, noPermissionTitle, ...buttonProps} = props

            if (popConfirm) {
              buttonProps.onClick = () => {
                if (context.components) {
                  confirm({
                    ...popConfirm as any,
                    danger: buttonProps.danger
                  }, context.components)
                } else {
                  Modal.confirm({
                    title: popConfirm.title,
                    content: popConfirm.content,
                    onOk() {
                      return popConfirm.onConfirm?.()
                    },
                    onCancel() {
                      popConfirm.onCancel?.()
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
            const noPermissionButton = !permission.value ? h(Tooltip, {title: noPermissionTitle || '暂无权限，请联系管理员'}, {default: () => button}) : undefined

            // 二次确认
            // const _popConfirm = popConfirm ?
            //     h(Popconfirm,
            //         Object.assign(
            //             {overlayStyle: {width: '220px'}},
            //             popConfirm,
            //             {
            //                 disabled: !permission.value || buttonProps.disabled
            //             }
            //         ),
            //         {default: () => tooltip ? _tooltip : button})
            //     : undefined

            if (permission.value) {
                // if (hasPopConfirm.value) {
                //     return _popConfirm
                // }

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
