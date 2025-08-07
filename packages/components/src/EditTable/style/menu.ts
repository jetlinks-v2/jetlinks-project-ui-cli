import type { CSSObject } from "ant-design-vue";

export const genMenuStyle = (config: any): CSSObject => {
  const { token } = config;
  return {
    '.jetlinks-edit-table-context-menu': {
      position: 'fixed',
      boxShadow: '0 0 12px rgba(0, 0, 0 ,.2)',
      borderRadius: '4px',
      overflow: 'hidden',
      width: '192px',
      padding: '4px',
      backgroundColor: '#fff',
      '.ant-menu': {
        borderRight: 'none',

        '.ant-menu-item': {
          margin: 0,
          height: '32px',

          '&.danger': {
            color: token.colorError,
          },
        },
      },
      '.ant-menu-item-active': {
        backgroundColor: 'var(--ant-primary-1)',
      },
    }
  }
}