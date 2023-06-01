import { message } from 'jetlinks-ui-components'
/**
 * 静态图片资源处理
 * @param path {String} 路径
 */
export const getImage = (path: string) => {
  return new URL('/images' + path, import.meta.url).href
}

/**
 * 单个message提示，根据类型只提示一次
 * @param message
 * @param type
 */
export const onlyMessage = ( message: string, type: 'success' | 'error' | 'warning' = 'success') => {
  message[type]({
    content: message,
    key: type
  })
}
