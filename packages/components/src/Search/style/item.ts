import type { CSSObject } from "ant-design-vue";

export const genItemStyle = (config: any): CSSObject => {
  const { componentCls } = config
  return {
    [`${componentCls}-item`]: {
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      [`${componentCls}-item--type`]: {
        width: '90px',
        minWidth: '0',
        '> span': {
          lineHeight: '34px',
          fontWeight: 'bold',
        }
      },
      [`${componentCls}-item--column`]: {
        width: '130px',
        minWidth: '0',
      },
      [`${componentCls}-item--termType`]: {
        width: '110px',
        minWidth: '0',
      },
      [`${componentCls}-item--label`]: {
        minWidth: '40px',
      },
      [`${componentCls}-item--value`]: {
        display: 'flex',
        width: '0',
        flexGrow: 1,
      }
    },
  }
}