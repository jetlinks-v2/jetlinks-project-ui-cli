import genCompoentStyle from '../../style/styleRegister';
import type { CSSObject } from 'ant-design-vue';

const genDragModalStyle = (config: any): CSSObject => {
  const { componentCls, token } = config;

  return {
    [componentCls]: {
      position: 'fixed',
      zIndex: 1000,
      [`${componentCls}-sprite`]: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 23456765435,
        backgroundColor: token.colorBgElevated,
        borderRadius: 4,
        border: `${token.lineWidth}px solid ${token.colorPrimaryBorder}`,
        boxShadow: token.boxShadowSecondary,
          header: {
          padding: '5px 15px',
          fontSize: 18,
          fontWeight: 700,
          color: token.colorTextHeading,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `${token.lineWidth}px solid ${token.colorSplit}`,
          cursor: 'move',
        },
        [`${componentCls}-body`]: {
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: '24px 20px',
        },
        [`${componentCls}-footer`]: {
          borderTop: `${token.lineWidth}px solid ${token.colorSplit}`,
          padding: '5px 15px',
        }
      },
      [`${componentCls}-range`]: {
        position: 'absolute',
        width: '16px',
        height: '16px',
        borderRadius: '100%',
        zIndex: 23456765436,
        ['drag-bottom-right']: {
          bottom: '-6px',
          right: '-6px',
          ['&:hover']: {
            cursor: 'nwse-resize',
          }
        },
        ['drag-bottom-left']: {
          bottom: '-6px',
          left: '-6px',
          ['&:hover']: {
            cursor: 'nesw-resize'
          }
        },
        ['drag-top-right']: {
          top: '-6px',
          right: '-6px'
        },
        ['drag-top-left']: {
          top: '-6px',
          left: '-6px'
        },
      }
    },
  };
};

export default genCompoentStyle([genDragModalStyle]);
