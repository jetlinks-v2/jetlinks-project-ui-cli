import type { CSSObject } from "ant-design-vue";
import { Keyframes } from "ant-design-vue";
import genCompoentStyle from "../../style/styleRegister";

const JSkeletonSizeLg = '36px';
const JSkeletonSizeSm = '16px';
const JSkeletonSize = '24px';
const JSkeletonBorderRadius = '8px';
const JSkeletonBg = '#f0f2f5';
const JSkeletonBg1 = '#e6e8eb';
const JSkeletonBorder = `4px solid ${JSkeletonBg}`
const JSkeletonFlex = {
  display: 'flex',
  gap: '24px',
  marginBottom: '16px'
}

//动画
const waveKeyframes = new Keyframes('wave', {
  '0%': {
    backgroundPosition: '200% 0',
  },
  '100%': {
    backgroundPosition: '-200% 0',
  },
})
const genSkeletonStyle = (config: any): CSSObject => {
  const { componentCls, token } = config;
  return {
    [`${componentCls}-flex`]: JSkeletonFlex,
    [`${componentCls}-flex-between`]: {
      ...JSkeletonFlex,
      background: JSkeletonBg,
      height: JSkeletonSize,
      borderRadius: JSkeletonBorderRadius,
    },
    [`${componentCls}-flex-column`]: {
      ...JSkeletonFlex,
      justifyContent: 'space-between',
    },
    [`${componentCls}`]: {
      height: '100%',
      [`${componentCls}-item`]: {
        background: 'linear-gradient(90deg, ${JSkeletonBg} 25%, ${JSkeletonBg1} 50%, ${JSkeletonBg} 75%)',
        backgroundSize: '400% 100%',
        borderRadius: JSkeletonBorderRadius,
        height: JSkeletonSize,
      },
      [`${componentCls}-item-active`]: {
        animationName: waveKeyframes,
        animationDuration: '1.8s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'ease-in-out',
      },
      [`${componentCls}-item-lg`]: {
        height: JSkeletonSizeLg,
      },
      [`${componentCls}-item-sm`]: {
        height: JSkeletonSizeSm,
      },
      [`${componentCls}-dashboard-card`]: {
        ...JSkeletonFlex,
        border: JSkeletonBorder,
        borderRadius: JSkeletonBorderRadius,
        height: '100%',
        padding: '24px',
        flexDirection: 'column',
      },
      [`${componentCls}-tabs`]: {
        display: 'flex',
        gap: '16px',
        margin: '60px 0 20px 0',
        borderBottom: JSkeletonBorder,
        padding: '16px 0',
      },
      [`${componentCls}-desc`]: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '24px',
        [`${componentCls}-desc-content`]: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '36px',
          margin: '24px 0 0 0',
        },
        [`${componentCls}-desc-item`]: {
          display: 'flex',
          gap: '16px',
        }
      },
      [`${componentCls}-box`]: {
        borderBottom: JSkeletonBorder,
        padding: '16px 0',
      },
      [`${componentCls}-table-cell`]: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr)) 200px',
        gap: '24px',
        padding: '12px 6px',
        borderRadius: '8px',
      },
      [`${componentCls}-table-header`]: {
        backgroundColor: 'lightgrey',
      },
      [`${componentCls}-table-action`]: {
        width: '200px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))',
        gap: '24px',
      },
      [`${componentCls}-cards`]: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
      },
      [`${componentCls}-card`]: {
        [`${componentCls}-card-content`]: {
          display: 'flex',
          gap: '16px',
          border: '2px solid #f0f2f5',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '16px',
          [`${componentCls}-image`]: {
            width: '100px',
            height: '100px',
          },
          [`${componentCls}-right`]: {
            flex: 1,
            minWidth: '200px',
            [`${componentCls}-right-content`]: {
              display: 'flex',
              gap: '16px',
              marginTop: '16px',
              [`${componentCls}-right-item`]: {
                flex: 1,
                minWidth: '100px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }
            }
          }
        },
        [`${componentCls}-action`]: {
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '16px',
          '.btn': {
            flex: 1,
            minWidth: '100px',
          },
          '.delete': {
            flex: '0 0 100px'
          }
        }
      },
    }
  }
}

export default genCompoentStyle([genSkeletonStyle])