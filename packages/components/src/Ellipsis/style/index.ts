import type { CSSObject } from "ant-design-vue";
import genCompoentStyle from "../../style/styleRegister";

const genEllipsisStyle = (config: any): CSSObject => {
  const { token } = config;
  return {
    '.j-ellipsis': {
      overflow: 'hidden',
      verticalAlign: 'bottom'
    },
    '.j-ellipsis-cursor': {
      cursor: 'pointer',
    },
    '.j-ellipsis-line-clamp': {
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      wordBreak: 'break-all',
    },
    '.j-ellipsis-deep': {
      maxHeight: '380px',
      '-webkit-line-clamp': 17,
      textOverflow: 'ellipsis',
    }
  }
}

export default genCompoentStyle([genEllipsisStyle])