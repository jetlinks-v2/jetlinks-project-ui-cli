import type { CSSObject } from "ant-design-vue";

export const genTopHeaderStyle = (config: any): CSSObject => {
  const { token } = config;
  const topNavHeaderCls = `${token.antCls}-pro-top-nav-header`
  const proLayoutGlobalHeaderCls = `${token.antCls}-pro-global-header`
  const proLayoutHeaderBg = token.colorBgContainer
  const proLayoutHeaderHoverBg = token.colorBgContainer
  const proLayoutHeaderBoxShadow = '0 1px 4px rgba(0, 21, 41, 0.08)'
  return {
    [proLayoutGlobalHeaderCls]: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      padding: '0 16px',
      backgroundColor: proLayoutHeaderBg,
      boxShadow: proLayoutHeaderBoxShadow,
      '> *': {
        height: '100%'
      },
      [`${proLayoutGlobalHeaderCls}-coppapsed-button`]: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '16px',
        fontSize: '20px',
      },
      [`${proLayoutGlobalHeaderCls}-layout`]: {
        [`${proLayoutGlobalHeaderCls}-layout-mix`]: {
          backgroundColor: '#001529',
          [`${proLayoutGlobalHeaderCls}-logo`]: {
            'h1': {
              color: '#fff'
            }
          },
          '.anticon': {
            color: '#fff'
          }
        }
      },
      [`${proLayoutGlobalHeaderCls}-logo`]: {
        position: 'relative',
        overflow: 'hidden',
        a: {
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            img: {
              height: '28px',
            },
            h1: {
              height: '32px',
              margin: '0 0 0 12px',
              color: token.colorPrimary,
              fontWeight: 600,
              fontSize: '18px',
              lineHeight: '32px',
            }
        }
      },
      [`${proLayoutGlobalHeaderCls}-menu`]: {
        '.anticon': {
          marginRight: '8px'
        },
        [`${token.antCls}-dropdown-menu-item`]: {
          minWidth: '160px'
        }
      },
      '.dark': {
        height: '48px',
        '.action': {
          color: 'rgba(255, 255, 255, 0.85)',
          '> i': {
            color: 'rgba(255, 255, 255, 0.85)'
          },
          '&:hover,&.opend': {
            background: token.colorPrimary
          },
          [`${token.antCls}-badge`]: {
            color: 'rgba(255, 255, 255, 0.85)'
          }
        }
      }
    },
    [topNavHeaderCls]: {
      position: 'relative',
      width: '100%',
      height: '100%',
      boxShadow: '0 1px 4px 0 rgba(0, 21, 41, 0.12)',
      transition: 'background 0.3s, width 0.2s',
      [`${token.antCls}-menu`]: {
        backgroundColor: 'transparent',
      },
      '&.light': {
        backgroundColor: token.colorBgContainer,
        [`${topNavHeaderCls}-logo`]: {
          h1: {
            color: token.colorTextHeading
          }
        },
        '.anticon': {
          color: 'inherit'
        }
      },
      [`${topNavHeaderCls}-main`]: {
        display: 'flex',
        height: '100%',
        paddingLeft: '16px',
        [`${topNavHeaderCls}-main-left`]: {
          display: 'flex',
          minWidth: '192px',
        }
      },
      '.anticon': {
        color: '#fff'
      },
      [`${topNavHeaderCls}-logo`]: {
        position: 'relative',
        minWidth: '165px',
        height: '100%',
        overflow: 'hidden',
        img: {
          display: 'inline-block',
          height: '32px',
          verticalAlign: 'middle',
        },
        h1: {
          display: 'inline-block',
          margin: '0 0 0 12px',
          color: token.colorPrimary,
          fontWeight: 600,
          fontSize: '16px',
          verticalAlign: 'top',
        }
      },
      [`${topNavHeaderCls}-menu`]: {
        minWidth: 0,
        [`${token.antCls}-menu${token.antCls}-meu-horizontal`]: {
          height: '100%',
          border: 'none',
          [`${token.antCls}-menu-item`]: {
            height: '100%',
            [`${token.antCls}-badge`]: {
              color: 'unset'
            }
          }
        }
      }
    },
    [`${token.antCls}-pro-menu-popup`]: {
      [`${token.antCls}-badge`]: {
        color: 'unset'
      }
    }
  }
}