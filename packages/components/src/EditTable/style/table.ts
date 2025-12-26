import type { CSSObject } from "ant-design-vue";

export const genTableStyle = (config: any): CSSObject => {
  const { token } = config;
  return {
    '.jetlinks-edit-table-wrapper': {
      background: '#fff',
      height: '100%',
      position: 'relative',
      '&.table-full-screen': {
        padding: 24,
      },
      '.jetlinks-edit-table': {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 0,
        flexShrink: 0,
        background: '#fafafa',
        transition: 'background-color .3s ease',
        overflow: 'auto hidden',
        '.jetlinks-edit-table-header': {
          overflow: 'hidden',
          width: '100%',
          position:'relative'
        },
        '.jetlinks-edit-table-body': {
          backgroundColor: '#fff',
          overflowY: 'hidden',
          position: 'relative',
          height: '100%',
          width: '100%',
          flex: '1 1 auto',
          flexDirection: 'row',
        },
        '.jetlinks-table-horizontal-scroll': {
          width: '100%',
          height: '15px',
          minHeight: '15px',
          maxHeight: '15px',
          display: 'flex',
          '.jetlinks-table-horizontal-scroll-bar': {
            height: '100%',
            overflowX: 'scroll',
          }
        }
      }
    },
  }
}
