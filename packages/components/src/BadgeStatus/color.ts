const colorMap = {
  'success': '36, 178, 118',
  'warning': '255, 144, 0',
  'error': '229, 0, 18',
  'processing': '9, 46, 231',
  'default': '102, 102, 102',
}

export const getHexColor = (code: string, pe: number = 0.1) => {
  const _color = colorMap[code] || colorMap.default
  // if (code === 'default') {
  //   pe = 0.1
  // }
  return `rgba(${_color}, ${pe})`
}

export default colorMap
