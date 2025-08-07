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
        backgroundColor: '#f2f3f5',
        transition: 'all 0.3s',
        color: '#333',
        textAlign: 'center',
        cursor: 'pointer',
        
        '&:hover': {
          backgroundColor: token.colorPrimary,
          opacity: 0.85,
          color: '#fff'
        },
        
        '&.selected': {
          backgroundColor: token.colorPrimary,
          color: '#fff'
        },
        
        '&.disabled': {
          backgroundColor: '#f5f5f5',
          color: '#ccc',
          cursor: 'not-allowed',
          
          '&:hover': {
            backgroundColor: '#f5f5f5',
            color: '#ccc',
            opacity: 1
          }
        }
      }
    }
  }
}

export default genComponentStyle([genCheckButtonStyle])
