import type { CSSObject } from "ant-design-vue";
import genCompoentStyle from "../../style/styleRegister";

const genTitleStyle = (config: any): CSSObject => {
  const { componentCls, token } = config;
  return {
    [componentCls]: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      marginBottom: '16px',
      [`${componentCls}-content`]: {
        position: 'relative',
        paddingLeft: '10px',
        color: token.colorTextHeading,
        fontWeight: 600,
        lineHeight: 1,
        '&::before': {
          position: 'absolute',
          top: 0,
          left: 0,
          width: 4,
          height: '100%',
          background: token.colorPrimary,
          borderRadius: '0 3px 3px 0',
          content: '""',
        }
      }
    }
  }
}

export default genCompoentStyle([genTitleStyle])
