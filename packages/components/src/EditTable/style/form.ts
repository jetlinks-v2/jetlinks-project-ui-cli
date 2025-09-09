import type { CSSObject } from 'ant-design-vue';

export const genEditTableFormItemStyle = (config: any): CSSObject => {
  const { componentCls, token } = config;
  return {
    ['.jetlinks-table-form-error-target']: {
      position: 'absolute',
      right: '2px',
      top: '-9px',
      border: '16px solid transparent',
      borderTopColor: token.colorError,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    ['.jetlinks-edit-table-form-has-error']: {
      ['.select-no-value']: {
        ['.ant-select-selector']: {
          borderColor: `${token.colorError} !important`,
          ['&:focus']: {
            boxShadow: '0 0 0 2px var(--ant-error-color-outlined) !important'
          }
        }
      },
      ['> input']: {
        borderColor: `${token.colorError} !important`,
        ['&:focus']: {
          boxShadow: '0 0 0 2px var(--ant-error-color-outlined) !important'
        }
      },
      ['.jetlinks-table-form-required-aicon']: {
        color: token.colorError
      }
    }
  }
}