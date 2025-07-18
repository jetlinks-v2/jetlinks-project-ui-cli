import type { CSSObject } from "ant-design-vue";
import genCompoentStyle from "../../style/styleRegister";

const genProTableStyle = (config: any): CSSObject => {
  const { token } = config
  return {
    '.jtable-body-spin': {
      height: '100%',
      width: '100%',
      backgroundColor: '#fff',
      '.ant-spin-nested-loading': {
        height: '100%',
        '.ant-spin-container': {
          height: '100%'
        }
      },
      '.jtable-body': {
        width: '100%',
        boxSizing: 'border-box',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }
    },
    '.jtable-body-header': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      width: '100%',
      gap: '8px',
      '.jtable-body-header-left': {
        flex: 1,
        minWidth: 0,
      },
      '.jtable-body-header-right': {
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        '.jtable-body-header-right-button': {
          width: '62px',
          '.right-button-icon': {
            fontSize: '16px',
            color: '#d9d9d9',
          },
          '.ant-radio-button-wrapper': {
            padding: '0 8px',
          },
          '.ant-radio-button-wrapper-checked': {
            color: token.colorPrimary,
          }
        }
      }
    },
    '.jtable-box': {
      flex: 1,
      minHeight: 0,
      '.jtable-card': {
        height: '100%',
        overflowY: 'auto',
        '.jtable-card-items': {
          display: 'grid',
          gridGap: '26px',
          '.jtable-card-item': {
            display: 'flex',
            minWidth: 0,
          }
        },
        [`j-table-empty`]: {
          marginTop: '100px',
        }
      },
      '.ant-table-wrapper': {
        height: '100%',
        '.ant-table': {
          height: '100%',
          '.ant-table-container': {
            height: '100%',
            '.ant-table-content': {
              height: '100%'
            }
          }
        }
      },
      '.j-table-scroll': {
        '.ant-table-container': {
          display: 'flex',
          flexDirection: 'column'
        },
        '.ant-table-body': {
          flex: 1,
          minHeight: 0,
          overflowY: 'auto'
        }
      }
    },
    '.jtable-alert': {
      marginBottom: '16px',
    },
    '.jtable-pagination': {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '16px',
      '.hide-content': {
        [`${token.antCls}-pagination-item,& ${token.antCls}-pagination-jump-prev, & ${token.antCls}-pagination-jump-next`]: {
          display: 'none'
        }
      }
    }
  }
}

export default genCompoentStyle([genProTableStyle])
