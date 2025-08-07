import type { CSSObject } from 'ant-design-vue';
import genCompoentStyle from '../../style/styleRegister';

const genRadioButtonStyle = (config: any): CSSObject => {
  const { token } = config;
  return {
    '.j-radio-button': {
      display: 'grid',
      gap: '16px',

      '.j-radio-button-item': {
        padding: '6px 12px',
        textAlign: 'center',
        height: '100%',
        borderRadius: '2px',
        backgroundColor: '#f5f5f5',
        cursor: 'pointer',

        '&.active': {
          color: '#fff',
          backgroundColor: token.colorPrimary,
        }
      }
    }
  }
}

export default genCompoentStyle([genRadioButtonStyle])