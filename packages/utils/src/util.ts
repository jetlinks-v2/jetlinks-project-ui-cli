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
 * @param msg
 * @param type
 */
export const onlyMessage = ( msg: string, type: 'success' | 'error' | 'warning' = 'success') => {
  message[type]({
    content: msg,
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

/**
 * 生成随机数
 * @param length {number} 长度
 * @returns
 */
export const randomString = (length: number = 32) => {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = chars.length;
  let pwd = '';
  for (let i = 0; i < length; i += 1) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};

/**
 * 转换图片为base64
 * @param img
 * @param callback
 */
export const getBase64ByImg = (img: File, callback: (base64Url: string) => void) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.onload = (result: any) => {
    callback(result.target.result)
  }
}
