import type { CSSObject } from "ant-design-vue";

export const genPageContainerStyle = (config: any): CSSObject => {
  const { token } = config;
  const proLayoutPageContainerCls = `${token.antCls}-pro-page-container`
  return {
    [`${proLayoutPageContainerCls}-children-content`]: {
      margin: '24px 24px 0'
    },
    [`${proLayoutPageContainerCls}`]: {
      [`${proLayoutPageContainerCls}-warp`]: {
        backgroundColor: token.colorBgContainer,
        [`${token.antCls}-tabs-bar`]: {
          margin: 0,
        }
      },
      [`${proLayoutPageContainerCls}-ghost`]: {
        [`${proLayoutPageContainerCls}-warp`]: {
          backgroundColor: token.colorBgContainer
        }
      }
    },
    [`${proLayoutPageContainerCls}-main`]: {
      [`${proLayoutPageContainerCls}-detail`]: {
        display: 'flex',
      },
      [`${proLayoutPageContainerCls}-row`]: {
        display: 'flex',
        width: '100%',
      },
      [`${proLayoutPageContainerCls}-title-content`]: {
        marginBottom: '16px',
      },
      [`${proLayoutPageContainerCls}-title,${proLayoutPageContainerCls}-content`]: {
        flex: 'auto',
      },
      [`${proLayoutPageContainerCls}-extraContent,${proLayoutPageContainerCls}-main`]: {
        flex: '0 1 auto',
      },
      [`${proLayoutPageContainerCls}-title`]: {
        marginBottom: '16px'
      },
      [`${proLayoutPageContainerCls}-logo`]: {
        marginBottom: '16px'
      },
      [`${proLayoutPageContainerCls}-extraContent`]: {
        minWidth: '242px',
        marginLeft: '88px',
        textAlign: 'right',
      },
    },
    [`@media screen and (max-width: ${token.screenXl}px)`]: {
      [`${proLayoutPageContainerCls}-main`]: {
        [`${proLayoutPageContainerCls}-extraContent`]: {
          marginLeft: '44px',
        }
      }
    },
    [`@media screen and (max-width: ${token.screenLG}px)`]: {
      [`${proLayoutPageContainerCls}-main`]: {
        [`${proLayoutPageContainerCls}-extraContent`]: {
          marginLeft: '20px',
        }
      }
    },
    [`@media screen and (max-width: ${token.screenMD}px)`]: {
      [`${proLayoutPageContainerCls}-main`]: {
        [`${proLayoutPageContainerCls}-row`]: {
          display: 'block',
        },
        [`${proLayoutPageContainerCls}-extraContent,${proLayoutPageContainerCls}-action`]: {
          marginLeft: 0,
          textAlign: 'left',
        }
      }
    },
    [`@media screen and (max-width: ${token.screenSM}px)`]: {
      [`${proLayoutPageContainerCls}-detail`]: {
        display: 'block',
      },
      [`${proLayoutPageContainerCls}-extraContent`]: {
        marginLeft: 0,
      }
    }
  }
}