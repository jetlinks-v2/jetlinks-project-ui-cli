import { computed, unref } from 'vue'
import { theme } from 'ant-design-vue'
import { useStyleRegister } from 'ant-design-vue/es/theme/internal'
import { useConfigContextInject } from 'ant-design-vue/es/config-provider/context'
import { genCommonStyle } from 'ant-design-vue/es/style'
import variableToken from './variable'

const genCompoentStyle = (styleFn:  any[]) => {
  return (_prefixCls: any) => {
    const prefixCls = computed(() => unref(_prefixCls))
    const { theme: themeRef, token, hashId } = theme.useToken()
    const { getPrefixCls, iconPrefixCls } = useConfigContextInject()
    const rootPrefixCls = computed(() => getPrefixCls())
    const componentInfo = computed(() => ({
      theme: themeRef.value,
      token: token.value,
      hashId: hashId.value,
      path: [
        'jetlinks-components',
        prefixCls.value,
        rootPrefixCls.value,
        iconPrefixCls.value,
      ],
    }))

    const wrapSSR = useStyleRegister(componentInfo, () => {
      const componentCls = `.${prefixCls.value}`
      const componentToken = {
        token: {
          ...token.value,
          ...variableToken,
          componentCls,
          prefixCls: prefixCls.value,
          iconCls: `.${iconPrefixCls.value}`,
          antCls: `.${rootPrefixCls.value}`,
        },
        hashId: hashId.value,
        componentCls,
      };
      return [
        genCommonStyle(token.value, prefixCls.value),
        ...styleFn.map(item => item(componentToken))
      ]
    })

    return [wrapSSR, hashId]
  }
}

export default genCompoentStyle
