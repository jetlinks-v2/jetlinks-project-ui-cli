import {h, defineComponent, computed} from "vue";
import type { PropType, CSSProperties, ExtractPropTypes } from 'vue'
import { Button, Tooltip, Popconfirm } from 'jetlinks-ui-components'
import {PopconfirmProps, TooltipProps} from "ant-design-vue/es";
import {omit} from "lodash-es";
import {buttonProps} from "ant-design-vue/es/button/button";
import { usePermission } from './hooks'

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
  ...omit(buttonProps(), 'icon')
}

type DefinedPropsType = Partial<ExtractPropTypes<typeof definedProps>>

const PermissionButton = defineComponent({
  name: 'PermissionButton',
  // @ts-ignore
  slots: ['button', 'icon'],
  props: definedProps,
  setup(props, { slots }) {

    const { popConfirm, tooltip } = props
    const { hasPerm } = usePermission(props.hasPermission as PermissionType)

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

    const hasPopConfirm = computed(() => !!popConfirm) // 是否包含确认弹窗
    const hasTooltip = computed(() => !!tooltip) // 是否包含文字提示

    return () => {
      const { popConfirm, tooltip, hasPermission, ...buttonProps } = props
      const button = !slots.button ?
        h(Button, {...buttonProps, disabled: isPermission.value }, {
          default: () => slots?.default(),
          icon: () => slots?.icon?.()
        }) :
        slots.button()

      // 文字提示
      const _tooltip = tooltip ? h(Tooltip, { ...tooltip, disabled: isPermission.value }, { default: () => button}) : undefined

      // 无权限
      const noPermissionButton = !permission.value ? h(Tooltip, { title: '暂无权限，请联系管理员' }, { default: () => button}) : undefined

      // 二次确认
      const _popConfirm = popConfirm ?
        h(Popconfirm,
          {
            ...popConfirm,
            disabled: !permission.value || buttonProps.disabled,
            overlayStyle: { width: '220px' }
          }, { default: () => tooltip ? _tooltip : button })
        : undefined

      if (permission.value) {
        if(hasPopConfirm.value) {
          return _popConfirm
        }

        if (hasTooltip.value) {
          return _tooltip
        }

        return button
      }
      return noPermissionButton
    }
  }
})

export default PermissionButton
