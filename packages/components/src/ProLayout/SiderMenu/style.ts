import type { CSSObject } from "ant-design-vue";
import { Keyframes } from "ant-design-vue";

export const genSiderMenuStyle = (config: any): CSSObject => {
  const { token } = config;
  const proLayoutSiderMenuCls = `${token.antCls}-pro-sider`
  const proLayoutHeaderHeight = '48px'
  const proLayoutTitleHideKeyframes = new Keyframes('pro-layout-title-hide', {
    '0%': {
      display: 'none',
      opacity: 0,
    },
    '80%': {
      display: 'none',
      opacity: 0,
    },
    '100%': {
      display: 'unset',
      opacity: 1,
    }
  })
  return {
    [`${proLayoutSiderMenuCls}`]: {
      position: 'relative',
      backgroundColor: '#001529',
      borderRight: 0,
      // FIXME: 临时修正(可能不会做兼容)
      zIndex: 20,
      [`${token.antCls}-menu`]: {
        background: 'transparent',
      },
      [`&${token.antCls}-layout-sider-light`]: {
        [`${token.antCls}-menu-item a`]: {
          color: token.colorTextHeading
        },
        [`${token.antCls}-menu-item-selected a, ${token.antCls}-menu-item a:hover`]: {
          color: token.colorPrimary
        }
      },
      [`${proLayoutSiderMenuCls}-logo`]: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: '16px 16px',
        cursor: 'pointer',
        transition: 'padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
        '> a': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 32,
        },
        'img': {
          display: 'inline-block',
          height: 32,
          verticalAlign: 'middle',
        },
        'h1': {
          display: 'inline-block',
            height: '32px',
            margin: '0 0 0 12px',
            color: 'white',
            fontWeight: 600,
            fontSize: '18px',
            lineHeight: '32px',
            verticalAlign: 'middle',
            animationName: proLayoutTitleHideKeyframes,
            animationDuration: '0.3s',
        }
      },
      [`${proLayoutSiderMenuCls}-logo-card`]: {
        padding: '16px 0',
        justifyContent: 'center',
      },
      [`${proLayoutSiderMenuCls}-extra`]: {
        marginBottom: '16px',
        padding: '0 16px',
        [`${proLayoutSiderMenuCls}-extra-no-logo`]: {
          marginTop: '16px'
        }
      },
      [`${proLayoutSiderMenuCls}-menu`]: {
        position: 'relative',
        zIndex: 10,
        minHeight: '100%',
        boxShadow: '2px 0 6px rgba(0, 21, 41, 0.35)',
      },
      [`${token.antCls}-layout-sider-children`]: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        '::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '::webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '3px',
          boxShadow: 'inset 0 0 5px rgba(37, 37, 37, 0.05)',
        },
        /* 滚动条滑块 */
        '::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '3px',
            boxShadow: 'inset 0 0 5px rgba(255, 255, 255, 0.05)',
        }
      },
      [`&${token.antCls}-layout-sider-collapsed`]: {
        [`${token.antCls}-menu-inline-collapsed`]: {
          width: '48px'
        },
        [`${proLayoutSiderMenuCls}`]: {
          [`${proLayoutSiderMenuCls}-logo`]: {
            padding: '16px 24px'
          }
        }
      },
      [`&${token.antCls}-layout-sider${proLayoutSiderMenuCls}-fixed`]: {
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 99, // react pro-components: z-index: 100;
        height: '100%',
        overflow: 'auto',
        overflowX: 'hidden',
        boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)',
        [`> ${token.antCls}-menu-root`]: {
          [`:not${proLayoutSiderMenuCls}-link-menu`]: {
            height: `calc(100vh - ${proLayoutHeaderHeight})`,
            overflowY: 'auto'
          }
        }
      },
      [`${proLayoutSiderMenuCls}-light`]: {
        backgroundColor: token.colorBgContainer,
        boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)',
        [`${token.antCls}-layout-sider-children`]: {
          '::webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.06)',
            borderRadius: '3px',
            boxShadow: 'inset 0 0 5px rgba(0, 21, 41, 0.05)',

            /* 滚动条滑块 */
            '::-webkit-scrollbar-thumb': {
                background: 'rgba(0, 0, 0, 0.12)',
                borderRadius: '3px',
                boxShadow: 'inset 0 0 5px rgba(0, 21, 41, 0.05)',
            }
          }
        },
        [`${proLayoutSiderMenuCls}-logo`]: {
          'h1': {
            color: token.colorPrimary,
          }
        },
        [`${token.antCls}-menu-light`]: {
          borderRightColor: 'transparent',
        },
        [`${proLayoutSiderMenuCls}-collapsed-button`]: {
          borderTop: `${token.lineWidth} solid ${token.colorSplit}`
        }
      },
      [`${proLayoutSiderMenuCls}-icon`]: {
        width: '14px',
        verticalAlign: 'baseline',
      },
      [`${proLayoutSiderMenuCls}-link`]: {
        width: '100%',
        [`ul${token.antCls}-menu-root`]: {
          height: 'auto',
        }
      },
      [`${proLayoutSiderMenuCls}-collapsed-button`]: {
        borderTop: `${token.lineWidth} solid rgba(0, 0, 0, 0.25)`,
        '.anticon': {
          fontSize: '16px',
        }
      },
      [`.top-nav-menu li${token.antCls}-menu-item`]: {
        height: '100%',
        lineHeight: 1,
      },
      '.drawer .drawer-content': {
        background: `#001529`
      }
    },
    // 修正菜单 collapsed 时，icon 与 title 的间距
    [`${token.antCls}-pro-menu-item`]: {
      [`.anticon${token.antCls}-pro-menu-item-title`]: {
        marginLeft: '10px',
      }
    },
    '.sider-app-menus': {
      width: '100px',
      backgroundColor: '#fff',
      cursor: 'pointer',
      padding: '6px',
      transition: 'all .3s',
      borderRadius: '4px',
      color: '#333',
      '&:hover': {
        backgroundColor: '#efefef',
      }
    }
  }
}