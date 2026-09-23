import type { CSSObject } from 'ant-design-vue'

export const genTokenScrollbarStyle = (token: any): CSSObject => ({
  scrollbarWidth: 'thin',
  scrollbarColor: `${token.colorFillSecondary} ${token.colorFillQuaternary}`,
  '&::-webkit-scrollbar': {
    width: 10,
    height: 10,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: token.colorFillQuaternary,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: token.colorFillSecondary,
    borderRadius: token.borderRadiusLG,
    border: `${token.lineWidth * 2}px solid ${token.colorFillQuaternary}`,
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: token.colorFill,
  },
  '&::-webkit-scrollbar-corner': {
    backgroundColor: token.colorFillQuaternary,
  },
})
