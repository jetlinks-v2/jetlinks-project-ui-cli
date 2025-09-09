import type { CSSObject } from "ant-design-vue";

export const genEditTableHeaderStyle = (config: any): CSSObject => {
  const { token } = config;
  return {
    ['.jetlinks-edit-table-header-container']: {
      height: '100%',
      position: 'relative',
      ['.jetlinks-edit-table-header-cell']: {
        height: '100%',
        display: 'inline-flex',
        alignItems: 'center',
        float: 'left',
        overflow: 'visible',
        position: 'absolute',
        top: 0,
        ['.jetlinks-edit-table-header-cell-box']: {
          padding: '0 12px',
          width: '100%',
          ['&.header-cell-box-tool']: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          ['.table-header-cell-title']: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            fontWeight: 600,
            gap: 4,
            ['.cell-title-box']: {
              flex: '1 1 auto',
            }
          },
          ['.header-cell-required']: {
            color: token.colorError,
            paddingLeft: 8,
            transform: 'translateY(3px)',
            fontWeight: 500,
          },
          ['&::before']: {
            position: 'absolute',
            top: '50%',
            right: '1px',
            width: '1px',
            height: '1.6em',
            pointerEvents: 'none',
            backgroundColor: 'rgba(0,0,0,.06)',
            transform: 'translateY(-50%)',
            transition: 'background-color .3s',
            content: '""',
          },
          ['&:not(:last-child)']: {
            '&::before': {
              backgroundColor: 'transparent',
            }
          } 
        },
      }
    },
    ['jetlinks-table-search']: {
      ['.jetlinks-table-search-header']: {
        display: 'flex',
        justifyContent: 'space-between',

        ['.jetlinks-drag-modal-footer']: {
          display: 'none',
        },

        ['.jetlinks-table-search-result-total']: {
          color: '@primary-color',
        }
      }
    }
  }
}