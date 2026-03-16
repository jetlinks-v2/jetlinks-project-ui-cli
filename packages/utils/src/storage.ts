import { TOKEN_KEY, VITE_STORE_TOKEN_KEY } from '@jetlinks-web/constants'

export const LocalStore = {
  set(key: string, data: any) {
    localStorage.setItem(
      key,
      typeof data === 'string' ? data : JSON.stringify(data),
    )
  },
  get(key: string) {
    const dataStr = localStorage.getItem(key)
    try {
      if (dataStr) {
        const data = JSON.parse(dataStr)
        return data && typeof data === 'object' ? data : dataStr
      } else {
        return dataStr
      }
    } catch (e) {
      return dataStr
    }
  },
  remove(key: string) {
    localStorage.removeItem(key)
  },
  removeAll() {
    localStorage.clear()
  },
}

export const getDomain = () => {
  const domain = localStorage.getItem('X-Tenant-Domain')
  const key = import.meta.env.VITE_APP_ENVIRONMENT ? `_${domain}` : ''
  return {
    domain,
    key
  }
}

const hasDomain = (str: string, key: string) => {
  return str && key ? str.indexOf(key) : undefined
}

export const getToken = () => {
  const token = LocalStore.get(VITE_STORE_TOKEN_KEY || TOKEN_KEY)
  const {key} = getDomain()
  const index = hasDomain(token, key)

  if (import.meta.env.VITE_APP_ENVIRONMENT && index !== undefined && index !== -1 ) {
    return token.substring(0, index)
  }
  return token
}
export const setToken = (value: string) => {
  let _value = value
  const {key} = getDomain()
  const index = hasDomain(value, key)
  if (import.meta.env.VITE_APP_ENVIRONMENT && index !== undefined && index === -1 ) {
    _value += key
  }
  LocalStore.set(VITE_STORE_TOKEN_KEY || TOKEN_KEY, _value)
}

export const removeToken = () => {
  LocalStore.remove(VITE_STORE_TOKEN_KEY || TOKEN_KEY)
}
