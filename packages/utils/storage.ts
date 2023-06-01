import { TOKEN_KEY } from '@jetlinks/constants'

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
export const getToken = () => {
  return LocalStore.get(TOKEN_KEY)
}
export const setToken = (value: string) => {
  return LocalStore.set(TOKEN_KEY, value)
}

export const removeToken = () => {
  LocalStore.remove(TOKEN_KEY)
}
