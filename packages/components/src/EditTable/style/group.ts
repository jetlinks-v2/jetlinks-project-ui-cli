import type { CSSObject } from "ant-design-vue"

export const genEditTableGroupStyle = (config: any): CSSObject => {
  const { token } = config;
  return {
    ['.jetlinks-table-group-wrap']: {
      ['.ant-tabs-nav']: {
        marginBottom: 0,
        ['.ant-tabs-tab']: {
          overflow: 'hidden',
          position: 'relative'
        },
        ['.ant-tabs-tab-active']: {
          backgroundColor: '#BAE0FF !important',
          borderColor: '#91CAFF !important',
        },
        ['.ant-tabs-nav-add']: {
          border: 'none',
        }
      }
    },
    ['.jetlinks-table-group-error-wrap']: {
      color: '#1a1a1a !important',
      ['.table-group-error-target']: {
        position: 'absolute',
        right: 0,
        top: 0,
        border: '16px solid transparent',
        borderTopColor: token.colorError,
        borderRightWidth: 0,
        borderBottomWidth: 0,
      }
    }
  }
}