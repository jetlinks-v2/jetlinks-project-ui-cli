import type { Slots } from 'vue'
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

export function getSlot<T>(slots: Slots, props: Record<string, unknown>, prop = 'default'): T | false {
  if (props[prop] === false) {
    // force not render
    return false
  }
  return (props[prop] || slots[prop]) as T
}

export function getSlotVNode<T>(slots: Slots, props: Record<string, unknown>, prop = 'default'): T | false {
  if (props[prop] === false) {
    return false;
  }
  return (props[prop] || slots[prop]?.()) as T;
}
