import genCompoentStyle from "../../style/styleRegister";
import { genSearchStyle } from "./search";
import { genItemStyle } from "./item";

export default genCompoentStyle([genSearchStyle, genItemStyle])