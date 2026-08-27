import type { CSSObject } from "ant-design-vue";

export const genMenuStyle = (config: any): CSSObject => {
  const { token } = config;
  return {
    '.jetlinks-edit-table-context-menu': {
      position: 'fixed',
      borderRadius: '4px',
      overflow: 'hidden',
      width: '192px',
      padding: '4px',
      backgroundColor: token.colorBgElevated,
      boxShadow: token.boxShadowSecondary,
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
        backgroundColor: token.colorPrimaryBg,
      },
    }
  }
}
