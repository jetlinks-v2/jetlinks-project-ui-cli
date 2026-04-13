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

export const getCloudProjectId = () => location.pathname.split('/')[1];

const isEnvironmentEnabled = () => {
  const env = `${import.meta.env.VITE_APP_ENVIRONMENT ?? ''}`.trim().toLowerCase()
  return !!env && !['false', '0', 'null', 'undefined'].includes(env)
}

const getTokenKey = (key: string) => {
    const domain = getCloudProjectId()
  if (isEnvironmentEnabled() && key && domain) {
    return `${key}_${domain}`
  }
  return key
}

export const getToken = () => {
  return LocalStore.get(getTokenKey(VITE_STORE_TOKEN_KEY || TOKEN_KEY))
}
export const setToken = (value: string) => {
  LocalStore.set(getTokenKey(VITE_STORE_TOKEN_KEY || TOKEN_KEY), value)
}

export const removeToken = () => {
  LocalStore.remove(getTokenKey(VITE_STORE_TOKEN_KEY || TOKEN_KEY))
}
