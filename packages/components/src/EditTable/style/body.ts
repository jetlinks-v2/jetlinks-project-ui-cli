import type { CSSObject } from 'ant-design-vue';

export const genEditTableBodyStyle = (config?: any): CSSObject => {
  const { componentCls, token } = config;

  return {
    ['.jetlinks-edit-table-body-viewport']: {
      maxHeight: '100%',
      width: '100%',
      overflow: 'hidden auto',
      position: 'relative',
      ['.jetlinks-edit-scrollbar']: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        zIndex: -1
      },
      ['.jetlinks-edit-table-body-container']: {
        overflow: 'hidden',
        height: '100%'
      },
      ['.jetlinks-edit-table-center']: {
        position: 'relative',
        flex: '1 1 auto',
        minWidth: 0,
        height: '100%',
        ['.jetlinks-edit-table-row']: {
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          transition: 'top .2s, height .2s, background-color .1s',
          borderBottom: '1px solid #eebebeb',
          ['.jetlinks-edit-table-cell']: {
            position: 'absolute',
            minWidth: 0
          },
          ['&:hover']: {
            backgroundColor: 'rgb(248, 248, 248)', 
          },
          ['&.jetlinks-edit-table-row-selected']: {
            backgroundColor: 'var(--ant-primary-1)'
          },
          ['.body-cell-box']: {
            padding: '0 12px',
            position: 'relative',
          }
        },
        ['.readonly-mask']: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 4
        }
      }
    },
    ['.jetlinks-edit-table-body-empty']: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      paddingTop: 24,
    }
  };
};