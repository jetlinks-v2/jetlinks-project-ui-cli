import type { CSSObject } from "ant-design-vue";

export const genSearchStyle = (config: any): CSSObject => {
  const { componentCls, token } = config
  return {
    [`${componentCls}-warp`]: {
      padding: '24px',
      backgroundColor: '#fff',
      marginBottom: '24px',
      '.pack-up': {
        [`${componentCls}-items`]: {
          flex: '1 1 auto',
          '.left': {
            minWidth: '380px',
            maxWidth: '610px'
          }
        }
      },
      '&.senior': {
        [`> ${componentCls}-content`]: {
          display: 'flex',
          [`${componentCls}-footer`]: {
            display: 'flex',
            gap: '64px',
            position: 'relative',
            '.more-btn': {
              '.more-text': {
                paddingRight: '24px',
              },
              '.more-icon': {
                transition: 'transform 0.3s',
                transform: 'rotateZ(90deg)',
                fontSize: '14px',
                '&.more-up': {
                  transform: 'rotateZ(-90deg)',
                }
              }
            },
            '&.expand': {
              marginTop: '16px',
              width: '100%',
              justifyContent: 'space-between',
            },
            [`${componentCls}-footer--btns`]: {
              display: 'flex',
              gap: '12px'
            }
          },
          '.items-expand': {
            display: 'flex',
            gap: '16px',
            '.left,& .right': {
              minWidth: 0,
              flex: '1 1 0'
            },
            '.left-items, & .right-items': {
              display: 'flex',
              gap: '16px',
              flexDirection: 'column'
            },
            '.center': {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            },
            '&.vertical': {
              flexDirection: 'column',
              '.center': {
                flexDirection: 'row',
                justifyContent: 'center'
              }
            }
          },
          '&.senior-expand': {
            flexDirection: 'column'
          },
          '&.small': {
            gap: '12px',
            [`${componentCls}-footre`]: {
              gap: '4px'
            }
          }
        }
      },
      [`${componentCls}-content`]: {
        '&.simple': {
          [`${componentCls}-footer--btns`]: {
            display: 'flex',
          },
          [`${componentCls}-item`]: {
            gap: '8px',
            [`${componentCls}-item--label`]: {
              textAlign: 'right'
            }
          }
        }
      },
      '.no-radius': {
        borderRadius: 0,
        borderColor: '#f1f1f1',
      },
      '.search-history-warp': {
        position: 'relative',
        '.search-history-button': {
          paddingRight: '32px',
        },
        '.search-history-button-icon': {
          position: 'absolute',
          width: '24px',
          height: '18px',
          right: '6px',
          top: '8px',
          color: '#fff',
          lineHeight: '18px',
          textAlign: 'center',
          fontWeight: 'bold',
          '> span': {
            fontSize: '14px'
          }
        }
      }
    },
    '.search-history-empty': {
      padding: '12px 12px 6px 12px',
      backgroundColor: '#fff',
    },
    '.search-history-items': {
      width: '120px',
      maxHeight: '300px',
      overflowY: 'auto',
      '.search-history-item': {
        display: 'flex',
        padding: '4px 0px 4px 4px',
        alignItems: 'center',
        gap: '4px',
        '&:hover': {
          backgroundColor: '#f1f1f1',
        },
        '.history-item--title': {
          width: 'calc(100% - 30px)',
          cursor: 'pointer',
        },
        '.delete': {
          padding: '0 6px',
          flex: '0 0 28px',
        }
      }
    },
    '.search-history-list-pop': {
      '.ant-popover-inner-content': {
        padding: 0,
      }
    }
  }
}