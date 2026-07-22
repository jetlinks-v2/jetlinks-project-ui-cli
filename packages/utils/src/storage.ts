import { TOKEN_KEY } from '@jetlinks-web/constants'

export interface ProjectStorageInfo {
  domain?: string
  apiUrl?: string
  token?: string
  name?: string
  runtime?: string
}

export const PROJECT_STORAGE_PREFIX = 'project_'

const PROJECT_RESERVED_PATHS = new Set([
  'api',
  'assets',
  'static',
  'public',
  'dist',
  'login',
  'console',
  'application',
  'developer',
  'account',
  'docs',
  'oauth',
  'share',
  'identity-result',
  'init-home',
  'edge',
  'weixin',
])

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

export const isProjectStorageEnabled = () => !!import.meta.env.VITE_APP_ENVIRONMENT

const isProjectStorageInfo = (value: unknown): value is ProjectStorageInfo => {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

export const getProjectStorageKey = (projectCode: string) => {
  return `${PROJECT_STORAGE_PREFIX}${normalizeProjectCode(projectCode)}`
}

const normalizeProjectCode = (projectCode: unknown) => {
  return typeof projectCode === 'string' ? projectCode.trim() : ''
}

const normalizeSegment = (value: unknown) => {
  if (typeof value !== 'string') return ''
  return decodeURIComponent(value).trim()
}

export const getProjectStorage = (projectCode?: string): ProjectStorageInfo | undefined => {
  const code = normalizeProjectCode(projectCode)
  if (!code || typeof localStorage === 'undefined') {
    return undefined
  }

  const raw = localStorage.getItem(getProjectStorageKey(code))
  if (!raw) {
    return undefined
  }

  try {
    const parsed = JSON.parse(raw)
    return isProjectStorageInfo(parsed) ? parsed : undefined
  } catch {
    return undefined
  }
}

export const getProjectIdFromPathname = (
  pathname = typeof window === 'undefined' ? '' : window.location.pathname,
) => {
  const [first] = pathname.split('/').filter(Boolean)
  const projectId = normalizeSegment(first)

  if (!projectId || PROJECT_RESERVED_PATHS.has(projectId)) {
    return ''
  }

  return projectId
}

export const getProjectToken = () => {
  if (isProjectStorageEnabled()) { // saas环境
    const projectId = getProjectIdFromPathname()
    if (projectId) {
      return getProjectStorage(projectId)?.token
    } else {
      return LocalStore.get(TOKEN_KEY)
    }
  }
  return LocalStore.get(TOKEN_KEY);
}

export const getToken = () => {
  return getProjectToken()
}
export const setToken = (value: string) => {
  if (isProjectStorageEnabled()) { // saas环境,先获取当前环境token
    const projectId = getProjectIdFromPathname()
    if (!projectId) {
      LocalStore.set(TOKEN_KEY, value)
      return
    }

    const obj = getProjectStorage(projectId) || {}
    obj.token = value
    localStorage.setItem(getProjectStorageKey(projectId), JSON.stringify(obj))
    return
  }

  LocalStore.set(TOKEN_KEY, value)
}

export const removeToken = () => {
  if (isProjectStorageEnabled()) { // saas环境,先获取当前环境token
    const projectId = getProjectIdFromPathname()
    if (!projectId) {
      LocalStore.remove(TOKEN_KEY)
      return
    }

    const obj = getProjectStorage(projectId)
    if (obj) {
      delete obj.token
      localStorage.setItem(getProjectStorageKey(projectId), JSON.stringify(obj))
    }
    return
  }
  LocalStore.remove(TOKEN_KEY)
}
