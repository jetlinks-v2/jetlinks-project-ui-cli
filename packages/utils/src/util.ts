import type { Slots } from 'vue'
import { message } from 'ant-design-vue';
import { regular } from './regular'
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
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0987654321';
  const maxPos = chars.length;
  let pwd = '';
  for (let i = 0; i < length; i += 1) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};

/**
 * 生成随机数数字
 * @returns
 */
export const randomNumber = () => {
  const randomStr = Math.random().toString().substring(2, 10)
  const time = (new Date().getTime()).toString().substring(8)

  return Number(randomStr) + Number(time)
}

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

/**
 * 16进制转rgb
 * @param hex
 */
export const hexToRgb = (hex: string) => {
  // 判断是否是有效的16进制颜色代码
  if (!regular.isColorReg(hex)) {
    return null;
  }

  let _hex = hex.replace('#', '');
  // 如果是3位的颜色代码，则将其扩展为6位
  if (_hex.length === 3) {
    _hex = _hex[0] + _hex[0] + _hex[1] + _hex[1] + _hex[2] + _hex[2];
  }

  // 分离RGB值
  const r = parseInt(_hex.slice(0, 2), 16);
  const g = parseInt(_hex.slice(2, 4), 16);
  const b = parseInt(_hex.slice(4, 6), 16);

  return `${r}, ${g}, ${b}`
}

export const generateSerialNumber = (length) => {
  let serialNumber = Math.floor(Math.random() * (900 - 100 + 1)) + 100;
  return serialNumber.toString().padStart(length, '0');
}

/**
 * 树形数据，过滤节点，并返回父节点
 * @param tree
 * @param condition
 * @param key
 */
export const filterTreeNodes = (tree, condition, key) => {
  return tree.filter(item => {
    if (item[key] && item[key].includes(condition)) {
      return true
    }

    if (item.children) {
      item.children = filterTreeNodes(item.children, condition, key)
      return !!item.children.length
    }

    return false
  })
}

export const EventEmitter = {
  list: {},
  subscribe: function(events: string[], fn: Function) {
    const list = this.list
    events.forEach(event => {
      (list[event] || (list[event] = [])).push(fn)
    })
    return this
  },
  emit: function(events:string, data?: any) {
    const list = this.list
    const fns: Function[] = list[events] ? [...list[events]] : []

    if (!fns.length) return false;

    fns.forEach(fn => {
      fn(data)
    })

    return this
  },
  unSubscribe: function(events:string[], fn: Function) {
    const list = this.list
    events.forEach(key => {
      if (key in list) {
        const fns = list[key]
        for (let i = 0; i < fns.length; i++) {
          if (fns[i] === fn) {
            fns.splice(i, 1)
            break;
          }
        }
      }
    })
    return this
  }
}

export const accessConfigTypeFilter = (data: any[]): any[] => {
  if (!data) return []
  return data.map( item => ({ ...item, label: item.name, value: item.id}))
}

export const isFullScreen = () => {
  return !!((document as any).fullscreen ||
    (document as any).mozFullScreen ||
    (document as any).webkitIsFullScreen ||
    (document as any).webkitFullScreen ||
    (document as any).msFullScreen)
}

export const isNoCommunity = !(localStorage.getItem('version_code') === 'community');
