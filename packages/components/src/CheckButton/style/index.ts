import type { CSSObject } from 'ant-design-vue'
import genComponentStyle from '../../style/styleRegister'

const genCheckButtonStyle = (config: any): CSSObject => {
  const { componentCls, token } = config
  
  return {
    [componentCls]: {
      display: 'flex',
      gap: '16px',
      width: '100%',
      
      [`${componentCls}-item`]: {
        flex: 1,
        minWidth: 0,
        padding: '8px',
        borderRadius: token.borderRadius,
        backgroundColor: token.colorFillTertiary,
        transition: 'all 0.3s',
        color: token.colorText,
        textAlign: 'center',
        cursor: 'pointer',
        
        '&:hover': {
          backgroundColor: token.colorPrimaryHover,
          opacity: 0.85,
          color: token.colorTextLightSolid
        },
        
        '&.selected': {
          backgroundColor: token.colorPrimary,
          color: token.colorTextLightSolid
        },
        
        '&.disabled': {
          backgroundColor: token.colorBgContainerDisabled,
          color: token.colorTextDisabled,
          cursor: 'not-allowed',
          
          '&:hover': {
            backgroundColor: token.colorBgContainerDisabled,
            color: token.colorTextDisabled,
            opacity: 1
          }
        }
      }
    }
  }
}

export default genComponentStyle([genCheckButtonStyle])
