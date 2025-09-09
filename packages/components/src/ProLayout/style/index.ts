import genCompoentStyle from '../../style/styleRegister';
import { genBasicLayoutStyle } from '../Basic/BasicLayoutStyle'
import { genHeaderStyle } from '../Basic/HeaderStyle'
import { genPageContainerStyle } from '../PageContainer/style'
import { genSiderMenuStyle } from '../SiderMenu/style';
import { genTopHeaderStyle } from '../TopHeader/style';

export default genCompoentStyle([
  genBasicLayoutStyle,
  genHeaderStyle,
  genPageContainerStyle,
  genSiderMenuStyle,
  genTopHeaderStyle
])
