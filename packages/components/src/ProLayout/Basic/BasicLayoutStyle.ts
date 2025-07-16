import type { CSSObject } from "ant-design-vue";

export const genBasicLayoutStyle = (config: any): CSSObject => {
  const { componentCls, token } = config;
  console.log(token, '123123123123')
  const basicLayoutPrefixCls = `${token.antCls}-pro-basicLayout`;
  const proLayoutHeaderHeight = '48px';
  return {
    [`${basicLayoutPrefixCls}`]: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minHeight: '100%',
      [`${token.antCls}-layout-header`]: {
        [`&${token.antCls}-pro-fixed-header`]: {
          position: 'fixed',
          top: 0,
        }
      },
      [`${basicLayoutPrefixCls}-content`]: {
        position: 'relative',
        margin: '24px',
        [`${token.antCls}-pro-page-container`]: {
          margin: '-24px -24px 0',
        },
        [`${basicLayoutPrefixCls}-content-disable-margin`]: {
          margin: 0,
          [`${token.antCls}-pro-page-container`]: {
            margin: 0,
          }
        },
        [`> ${token.antCls}-layout`]: {
          maxHeight: '100%'
        }
      },
      [`${basicLayoutPrefixCls}-is-children${basicLayoutPrefixCls}-fix-siderbar`]: {
        height: '100vh',
        overflow: 'hidden',
        transform: 'rotate(0)'
      },
      [`${basicLayoutPrefixCls}-has-header`]: {
        '.tech-page-container': {
          height: `calc(100vh - ${proLayoutHeaderHeight} - ${proLayoutHeaderHeight})`
        },
        [`${basicLayoutPrefixCls}-is-children`]: {
          minHeight: `calc(100vh - ${proLayoutHeaderHeight})`,
          [`&${basicLayoutPrefixCls}-fix-siderbar`]: {
            height: `calc(100vh - ${proLayoutHeaderHeight})`
          }
        }
      },
    }
  }
}