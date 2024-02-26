const colorMap = {
  'success': '36, 178, 118',
  'warning': '255, 144, 0',
  'error': '229, 0, 18',
  'processing': '9, 46, 231',
  'default': '102, 102, 102',
}

export const getHexColor = (code: string | number, statusNames: Record<string | number, any>,  pe: number = 0.1) => {
  if (!code) {
    return `rgba(102, 102, 102, ${pe})`
  }

  if (colorMap[code]) {
    return `rgba(${colorMap[code]}, ${pe})`
  }

  if (Object.keys(statusNames).length) {
    return statusNames[code]
  }

  return
}

export default colorMap
