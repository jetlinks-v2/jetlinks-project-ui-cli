import type { CSSObject } from 'ant-design-vue'

export const genTopHeaderStyle = (config: any): CSSObject => {
  const { token } = config
  const topNavHeaderCls = `${token.antCls}-pro-top-nav-header`
  const proLayoutGlobalHeaderCls = `${token.antCls}-pro-global-header`
  const isAntdvDarkTheme = ['#000', '#000000'].includes(
    String(token.colorBgLayout).toLowerCase(),
  )
  const darkHeaderBg = isAntdvDarkTheme ? token.colorBgLayout : '#001529'
  const darkHeaderPopupBg = isAntdvDarkTheme ? token.colorBgElevated : '#001529'
  const darkHeaderHoverBg = isAntdvDarkTheme
    ? token.colorFillTertiary
    : 'rgba(255, 255, 255, 0.08)'
  const darkHeaderTextColor = isAntdvDarkTheme
    ? token.colorText
    : 'rgba(255, 255, 255, 0.85)'
  const darkHeaderTextSecondaryColor = isAntdvDarkTheme
    ? token.colorTextSecondary
    : 'rgba(255, 255, 255, 0.65)'
  const darkHeaderTextHoverColor = isAntdvDarkTheme
    ? token.colorTextHeading
    : '#fff'
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
        height: '100%',
      },
      [`${proLayoutGlobalHeaderCls}-coppapsed-button`]: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '16px',
        fontSize: '20px',
      },
      [`${proLayoutGlobalHeaderCls}-layout`]: {
        [`${proLayoutGlobalHeaderCls}-layout-mix`]: {
          backgroundColor: darkHeaderBg,
          [`${proLayoutGlobalHeaderCls}-logo`]: {
            h1: {
              color: darkHeaderTextHoverColor,
            },
          },
          '.anticon': {
            color: darkHeaderTextHoverColor,
          },
        },
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
          },
        },
      },
      [`${proLayoutGlobalHeaderCls}-menu`]: {
        '.anticon': {
          marginRight: '8px',
        },
        [`${token.antCls}-dropdown-menu-item`]: {
          minWidth: '160px',
        },
      },
      '.dark': {
        height: '48px',
        '.action': {
          color: darkHeaderTextColor,
          '> i': {
            color: darkHeaderTextColor,
          },
          '&:hover,&.opend': {
            background: token.colorPrimary,
          },
          [`${token.antCls}-badge`]: {
            color: darkHeaderTextColor,
          },
        },
      },
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
      '&.dark': {
        backgroundColor: darkHeaderBg,
        color: darkHeaderTextColor,
        [`${topNavHeaderCls}-logo`]: {
          h1: {
            color: token.colorPrimary,
          },
        },
        [`${token.antCls}-menu-dark`]: {
          color: darkHeaderTextColor,
          backgroundColor: 'transparent',
          [`${token.antCls}-menu-item, ${token.antCls}-menu-submenu-title`]: {
            color: darkHeaderTextColor,
          },
          [`${token.antCls}-menu-item a`]: {
            color: 'inherit',
          },
          [`${token.antCls}-menu-item .anticon, ${token.antCls}-menu-submenu-title .anticon, ${token.antCls}-menu-submenu-arrow`]:
            {
              color: darkHeaderTextSecondaryColor,
            },
          [`${token.antCls}-menu-item:hover, ${token.antCls}-menu-submenu-title:hover`]:
            {
              color: darkHeaderTextHoverColor,
              backgroundColor: darkHeaderHoverBg,
            },
          [`${token.antCls}-menu-item-selected`]: {
            color: token.colorTextLightSolid,
            backgroundColor: token.colorPrimary,
          },
          [`${token.antCls}-menu-item-selected a, ${token.antCls}-menu-item-selected .anticon`]:
            {
              color: token.colorTextLightSolid,
            },
        },
      },
      '&.light': {
        backgroundColor: token.colorBgContainer,
        [`${topNavHeaderCls}-logo`]: {
          h1: {
            color: token.colorTextHeading,
          },
        },
        '.anticon': {
          color: 'inherit',
        },
      },
      [`${topNavHeaderCls}-main`]: {
        display: 'flex',
        height: '100%',
        paddingLeft: '16px',
        [`${topNavHeaderCls}-main-left`]: {
          display: 'flex',
          minWidth: '192px',
        },
        [`${topNavHeaderCls}-left-content`]: {
          display: 'flex',
          alignItems: 'center',
          marginInlineEnd: '16px',
        },
      },
      '.anticon': {
        color: darkHeaderTextColor,
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
        },
      },
      [`${topNavHeaderCls}-menu`]: {
        minWidth: 0,
        [`${token.antCls}-menu${token.antCls}-meu-horizontal`]: {
          height: '100%',
          border: 'none',
          [`${token.antCls}-menu-item`]: {
            height: '100%',
            [`${token.antCls}-badge`]: {
              color: 'unset',
            },
          },
        },
      },
    },
    [`${token.antCls}-pro-menu-popup`]: {
      [`${token.antCls}-menu, ${token.antCls}-menu-dark`]: {
        background: darkHeaderPopupBg,
        color: darkHeaderTextColor,
      },
      [`${token.antCls}-menu-item, ${token.antCls}-menu-submenu-title`]: {
        color: darkHeaderTextColor,
      },
      [`${token.antCls}-menu-item a`]: {
        color: 'inherit',
      },
      [`${token.antCls}-menu-item:hover, ${token.antCls}-menu-submenu-title:hover`]:
        {
          color: darkHeaderTextHoverColor,
          backgroundColor: darkHeaderHoverBg,
        },
      [`${token.antCls}-menu-item-selected`]: {
        color: token.colorTextLightSolid,
        backgroundColor: token.colorPrimary,
      },
      [`${token.antCls}-badge`]: {
        color: 'unset',
      },
    },
  }
}
