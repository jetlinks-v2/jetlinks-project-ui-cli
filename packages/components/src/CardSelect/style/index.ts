import genCompoentStyle from '../../style/styleRegister';
import type { CSSObject } from 'ant-design-vue';

const genCardSelectStyle = (config: any): CSSObject => {
  const { componentCls, token } = config

  return {
    [componentCls]: {
      display: 'grid',
      gap: '12px',
      [`${componentCls}-item`]: {
        padding: '12px',
        border: '1px solid #e6e6e6',
        borderRadius: '@border-radius-base',
        cursor: 'pointer',
        '&.active': {
          borderColor: token.colorPrimary,
        },
        '&.disabled': {
          cursor: 'not-allowed',
          opacity: 0.7
        },
        [`${componentCls}-describe`]: {
          color: token.textColorSubtitle
        }
      }
    },
  }
}

export default genCompoentStyle([genCardSelectStyle])
