import { genComponentStyleHook } from 'ant-design-vue/es/theme/internal'
import { theme } from 'ant-design-vue'
import variableToken from './variable'

const genCompoentStyle = (styleFn:  any[]) => {
  return genComponentStyleHook('jetlinks-components', _token => {
    const { token, hashId } = theme.useToken()
    console.log('======>token.value', token.value)
    const componentToken = {
      token: {
        ..._token,
        ...variableToken,
      },
      hashId: hashId.value,
      componentCls: `.${_token.prefixCls}`,
    };
    console.log('======>componentToken', componentToken)
    return [
      ...styleFn.map(item => item(componentToken))
    ]
  })
}

export default genCompoentStyle
