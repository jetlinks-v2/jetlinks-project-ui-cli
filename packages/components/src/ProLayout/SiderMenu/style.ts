import type { CSSObject } from 'ant-design-vue'
import { Keyframes } from 'ant-design-vue'

export const genSiderMenuStyle = (config: any): Array<CSSObject | string> => {
  const { token } = config
  const proLayoutSiderMenuCls = `${token.antCls}-pro-sider`
  const proLayoutHeaderHeight = '48px'
  const isAntdvDarkTheme = ['#000', '#000000'].includes(
    String(token.colorBgLayout).toLowerCase(),
  )
  const darkMenuBg = isAntdvDarkTheme ? token.colorBgLayout : '#001529'
  const darkMenuSubBg = isAntdvDarkTheme ? token.colorBgContainer : '#000c17'
  const darkMenuPopupBg = isAntdvDarkTheme ? token.colorBgElevated : '#001529'
  const darkMenuHoverBg = isAntdvDarkTheme
    ? token.colorFillTertiary
    : 'rgba(255, 255, 255, 0.08)'
  const darkMenuActiveBg = isAntdvDarkTheme
    ? token.colorFillSecondary
    : 'rgba(255, 255, 255, 0.12)'
  const darkMenuTextColor = isAntdvDarkTheme
    ? token.colorText
    : 'rgba(255, 255, 255, 0.85)'
  const darkMenuTextSecondaryColor = isAntdvDarkTheme
    ? token.colorTextSecondary
    : 'rgba(255, 255, 255, 0.65)'
  const darkMenuTextHoverColor = isAntdvDarkTheme
    ? token.colorTextHeading
    : '#fff'
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
    },
  })

  return [
    `
      ${proLayoutSiderMenuCls} > ${token.antCls}-layout-sider-children {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    `,
    {
      [`${proLayoutSiderMenuCls}`]: {
        position: 'relative',
        background: darkMenuBg,
        borderRight: 0,
        // FIXME: 临时修正(可能不会做兼容)
        zIndex: 20,
        [`${token.antCls}-menu`]: {
          background: 'transparent',
        },
        [`&${proLayoutSiderMenuCls}-dark, &${token.antCls}-layout-sider-dark`]:
          {
            background: darkMenuBg,
            [`${token.antCls}-layout-sider-children`]: {
              background: darkMenuBg,
            },
            [`${token.antCls}-menu-dark`]: {
              color: darkMenuTextColor,
              background: 'transparent',
              [`${token.antCls}-menu-sub`]: {
                background: darkMenuSubBg,
              },
              [`${token.antCls}-menu-item, ${token.antCls}-menu-submenu-title`]:
                {
                  color: darkMenuTextColor,
                },
              [`${token.antCls}-menu-item a, ${token.antCls}-menu-submenu-title a`]:
                {
                  color: 'inherit',
                },
              [`${token.antCls}-menu-item .anticon, ${token.antCls}-menu-submenu-title .anticon, ${token.antCls}-menu-submenu-arrow`]:
                {
                  color: darkMenuTextSecondaryColor,
                },
              [`${token.antCls}-menu-item:hover, ${token.antCls}-menu-submenu-title:hover`]:
                {
                  color: darkMenuTextHoverColor,
                  backgroundColor: darkMenuHoverBg,
                },
              [`${token.antCls}-menu-item:hover .anticon, ${token.antCls}-menu-submenu-title:hover .anticon, ${token.antCls}-menu-submenu-title:hover ${token.antCls}-menu-submenu-arrow`]:
                {
                  color: darkMenuTextHoverColor,
                },
              [`${token.antCls}-menu-submenu-open > ${token.antCls}-menu-submenu-title`]:
                {
                  color: darkMenuTextHoverColor,
                  backgroundColor: darkMenuActiveBg,
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
        [`&${proLayoutSiderMenuCls}-dark${token.antCls}-layout-sider-dark`]: {
          background: darkMenuBg,
        },
        [`&${proLayoutSiderMenuCls}-dark ${token.antCls}-menu-dark${token.antCls}-menu-inline ${token.antCls}-menu-sub${token.antCls}-menu-inline`]:
          {
            background: darkMenuSubBg,
          },
        [`&${token.antCls}-layout-sider-light`]: {
          [`${token.antCls}-menu-item a`]: {
            color: token.colorTextHeading,
          },
          [`${token.antCls}-menu-item-selected a, ${token.antCls}-menu-item a:hover`]:
            {
              color: token.colorPrimary,
            },
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
          img: {
            display: 'inline-block',
            height: 32,
            verticalAlign: 'middle',
          },
          h1: {
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
          },
        },
        [`${proLayoutSiderMenuCls}-logo-card`]: {
          padding: '16px 0',
          justifyContent: 'center',
        },
        [`${proLayoutSiderMenuCls}-extra`]: {
          marginBottom: '16px',
          padding: '0 16px',
          [`${proLayoutSiderMenuCls}-extra-no-logo`]: {
            marginTop: '16px',
          },
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
          '::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '3px',
            boxShadow: 'inset 0 0 5px rgba(37, 37, 37, 0.05)',
          },
          /* 滚动条滑块 */
          '::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '3px',
            boxShadow: 'inset 0 0 5px rgba(255, 255, 255, 0.05)',
          },
          [`${proLayoutSiderMenuCls}-logo`]: {
            h1: {
              color: darkMenuTextHoverColor,
            },
          },
        },
        [`${proLayoutSiderMenuCls}-body`]: {
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.15)',
          '::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '3px',
          },
          '::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '3px',
          },
        },
        [`&${token.antCls}-layout-sider-collapsed`]: {
          [`${token.antCls}-menu-inline-collapsed`]: {
            width: '48px',
          },
          [`${proLayoutSiderMenuCls}`]: {
            [`${proLayoutSiderMenuCls}-logo`]: {
              padding: '16px 24px',
            },
          },
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
              overflowY: 'auto',
            },
          },
        },
        [`&${proLayoutSiderMenuCls}-light`]: {
          backgroundColor: token.colorBgContainer,
          boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)',
          [`${token.antCls}-layout-sider-children`]: {
            '::-webkit-scrollbar-track': {
              background: 'rgba(0, 0, 0, 0.06)',
              borderRadius: '3px',
              boxShadow: 'inset 0 0 5px rgba(0, 21, 41, 0.05)',
            },
            '::-webkit-scrollbar-thumb': {
              background: 'rgba(0, 0, 0, 0.12)',
              borderRadius: '3px',
              boxShadow: 'inset 0 0 5px rgba(0, 21, 41, 0.05)',
            },
          },
          [`${proLayoutSiderMenuCls}-body`]: {
            scrollbarColor: 'rgba(0, 0, 0, 0.12) rgba(0, 0, 0, 0.06)',
            '::-webkit-scrollbar-track': {
              background: 'rgba(0, 0, 0, 0.06)',
            },
            '::-webkit-scrollbar-thumb': {
              background: 'rgba(0, 0, 0, 0.12)',
            },
          },
          [`${proLayoutSiderMenuCls}-logo`]: {
            h1: {
              color: token.colorPrimary,
            },
          },
          [`${token.antCls}-menu-light`]: {
            borderRightColor: 'transparent',
          },
          [`${proLayoutSiderMenuCls}-collapsed-button`]: {
            borderTop: `${token.lineWidth} solid ${token.colorSplit}`,
          },
        },
        [`${proLayoutSiderMenuCls}-icon`]: {
          width: '14px',
          verticalAlign: 'baseline',
        },
        [`${proLayoutSiderMenuCls}-links`]: {
          width: '100%',
          [`ul${token.antCls}-menu-root`]: {
            height: 'auto',
          },
        },
        [`${proLayoutSiderMenuCls}-collapsed-button`]: {
          borderTop: `${token.lineWidth} solid rgba(0, 0, 0, 0.25)`,
          '.anticon': {
            fontSize: '16px',
          },
        },
        [`.top-nav-menu li${token.antCls}-menu-item`]: {
          height: '100%',
          lineHeight: 1,
        },
        '.drawer .drawer-content': {
          background: darkMenuBg,
        },
      },
      [`${token.antCls}-pro-menu-popup`]: {
        [`${token.antCls}-menu, ${token.antCls}-menu-dark`]: {
          background: darkMenuPopupBg,
          color: darkMenuTextColor,
        },
        [`${token.antCls}-menu-item, ${token.antCls}-menu-submenu-title`]: {
          color: darkMenuTextColor,
        },
        [`${token.antCls}-menu-item a`]: {
          color: 'inherit',
        },
        [`${token.antCls}-menu-item:hover, ${token.antCls}-menu-submenu-title:hover`]:
          {
            color: darkMenuTextHoverColor,
            backgroundColor: darkMenuHoverBg,
          },
        [`${token.antCls}-menu-item-selected`]: {
          color: token.colorTextLightSolid,
          backgroundColor: token.colorPrimary,
        },
      },
      [`${token.antCls}-menu-submenu-popup${token.antCls}-menu-dark${token.antCls}-pro-menu-popup ${token.antCls}-menu`]:
        {
          background: darkMenuPopupBg,
          color: darkMenuTextColor,
        },
      // 修正菜单 collapsed 时，icon 与 title 的间距
      [`${token.antCls}-pro-menu-item`]: {
        [`.anticon${token.antCls}-pro-menu-item-title`]: {
          marginLeft: '10px',
        },
      },
      '.sider-app-menus': {
        width: '100px',
        backgroundColor: token.colorBgContainer,
        cursor: 'pointer',
        padding: '6px',
        transition: 'all .3s',
        borderRadius: '4px',
        color: token.colorText,
        '&:hover': {
          backgroundColor: token.colorFillQuaternary,
        },
      },
    },
  ]
}
