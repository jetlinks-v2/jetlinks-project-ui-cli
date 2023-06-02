import Mkcert from 'vite-plugin-mkcert'
import Proxy from 'vite-plugin-http2-proxy'
import { PluginOption } from 'vite'
import type { ViteEnv } from '../utils'

type ProxyItem = [string, string]
type ProxyList = ProxyItem[]

/**
 * 用于https和http2
 */
interface Http2ProxyOptions {
  [regexp: string]: {
    target: string
    rewrite?: (url: string) => string
    headers?: Record<string, number | string | string[] | undefined>
    secure?: boolean
    changeOrigin?: boolean,
    ws?: string
  }
}

const createHttp2Proxy = (list: ProxyList = []) => {
    const ret: Http2ProxyOptions = {}
    for (const [prefix, target] of list) {
      const wsUrl = target.replace('http', 'ws')
      ret[`^${prefix}`] = {
        target,
        changeOrigin: true,
        ws: wsUrl,
        rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
      }
    }
    return ret
}

export function configHttpsPlugin(env: ViteEnv) {
    const { VITE_USE_HTTPS, VITE_PROXY } = env
  
    const plugins: PluginOption[] = []
  
    if (VITE_USE_HTTPS) {
      plugins.push(Mkcert())
      plugins.push(Proxy(createHttp2Proxy(VITE_PROXY)))
    }
    return plugins
  }
