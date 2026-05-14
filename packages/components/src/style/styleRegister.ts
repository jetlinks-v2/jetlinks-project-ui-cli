import { genComponentStyleHook } from 'ant-design-vue/es/theme/internal'
import variableToken from './variable'

const genCompoentStyle = (styleFn:  any[]) => {
  return genComponentStyleHook('jetlinks-components', (_token, info) => {
    const componentToken = {
      token: {
        ..._token,
        ...variableToken,
      },
      hashId: info.hashId,
      componentCls: `.${_token.prefixCls}`,
    };
    return [
      ...styleFn.map(item => item(componentToken))
    ]
  })
}

export default genCompoentStyle
