import type { CSSObject } from "ant-design-vue";
import genCompoentStyle from "../../style/styleRegister";

const scrollbarBgColor = '#909399';
const scrollbarHoverBgColor = '#909399';
const scrollbarHoverOpacity = 0.5;
const scrollbarOpacity = 0.3;
const transitionDuration = '0.3s';

const genScrollbarStyle = (config: any): CSSObject => {
  const { componentCls, token } = config;
  return {
    [componentCls]: {
      overflow: 'hidden',
      position: 'relative',
      height: '100%',
      [`${componentCls}__wrap`]: {
        overflow: 'auto',
        height: '100%',
        [`${componentCls}--hidden-default`]: {
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          }
        }
      },
      [`${componentCls}__thumb`]: {
        position: 'relative',
        display: 'block',
        width: 0,
        height: 0,
        cursor: 'pointer',
        borderRadius: 'inherit',
        backgroundColor: scrollbarBgColor,
        transition: `${transitionDuration} background-color`,
        opacity: scrollbarOpacity,
        '&:hover': {
          backgroundColor: scrollbarHoverBgColor,
          opacity: scrollbarOpacity,
        }
      },
      [`${componentCls}__bar`]: {
        position: 'absolute',
        right: '2px',
        bottom: '2px',
        zIndex: 1,
        borderRadius: '4px',
        [`${componentCls}--vertical`]: {
          width: '6px',
          top: '2px',
          '> div': {
            width: '100%'
          }
        },
        [`${componentCls}--horizontal`]: {
          height: '6px',
          left: '2px',
          '> div': {
            height: '100%'
          }
        }
      }
    },
    [`${componentCls}-fade`]: {
      [`${componentCls}-fade-enter-active`]: {
        transition: 'opacity 340ms ease-out'
      },
      [`${componentCls}-fade-leave-active`]: {
        transition: 'opacity 120ms ease-out'
      },
      [`${componentCls}-fade-enter-from,${componentCls}-fade-leave-active`]: {
        opacity: 0
      }
    }
  }
}

export default genCompoentStyle([genScrollbarStyle])
