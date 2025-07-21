import { genEditTableBodyStyle } from "./body";
import { genEditTableFormItemStyle } from './form';
import { genEditTableGroupStyle } from './group';
import { genEditTableHeaderStyle } from './header'
import { genTableStyle } from './table';
import { genMenuStyle } from './menu';
import genCompoentStyle from "../../style/styleRegister";
import type { CSSObject } from "ant-design-vue";

const genEditTableStyle = (config: any): CSSObject => {
  const { token } = config;
  return {
    '.edit-table-search-header': {
      display: 'flex',
      justifyContent: 'space-between',
    },
    '.edit-table-search-result-total': {
      color: token.colorPrimary,
    },
    '.jetlinks-edit-table-horizontal-scroll': {
      height: 17,
      width: 100,
      display: 'flex',
      position: 'relative',
      zIndex: 4,
      '.jetlinks-edit-table-horizontal-scroll-viewport': {
        overflowY: 'hidden',
        overflowX: 'scroll',
        position: 'relative',
        flex: '1 1 0',
        height: '17px',
        width: '100%',
        '> div': {
          height: '17px',
        }
      },
      '.jetlinks-edit-table-horizontal-scroll-hidden': {
        height: '100%',
        overflowX: 'hidden',
      }
    },
  }
}
export default genCompoentStyle([
  genEditTableStyle,
  genEditTableBodyStyle, 
  genEditTableFormItemStyle,
  genEditTableGroupStyle,
  genEditTableHeaderStyle,
  genTableStyle,
  genMenuStyle
])