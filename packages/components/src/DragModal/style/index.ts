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
        backgroundColor: '#ffffff',
        borderRadius: 4,
        border: '1px solid #91CAFF',
        boxShadow: '0 3px 8px 0 rgba(22, 119, 255, 0.24)',
          header: {
          padding: '5px 15px',
          fontSize: 18,
          fontWeight: 700,
          color: '#333',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #f0f0f0',
          cursor: 'move',
        },
        [`${componentCls}-body`]: {
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: '24px 20px',
        },
        [`${componentCls}-footer`]: {
          borderTop: '1px solid #f0f0f0',
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
