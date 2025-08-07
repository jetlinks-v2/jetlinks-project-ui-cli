import type { CSSObject } from "ant-design-vue";

export const genHeaderStyle = (config: any) => {
  const { componentCls, token } = config;
  const proLayoutFixedHeaderPrefixCls = `${token.antCls}-pro-fixed-header`

  return {
    [`${proLayoutFixedHeaderPrefixCls}`]: {
      zIndex: 9,
      width: '100%'
    }
  }
}