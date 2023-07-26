import type { ProxyOptions } from "vite";
import { isObject, isString } from 'lodash-es'
import type { Lib } from 'vite-plugin-style-import/dist/index'

export interface ViteEnv {
  VITE_PUBLIC_PATH: string;
  VITE_PROXY: [string, string][];
  VITE_GLOB_APP_TITLE: string;
  VITE_USE_HTTPS: boolean;

  VITE_DROP_CONSOLE: boolean
  VITE_GLOB_APP_SHORT_NAME: string
  VITE_PORT: number
}

const handleRealName = (name: any): any => {
    if (['true', 'false'].includes(name)) {
        return name === 'true'
    }

    return name
}

export const wrapperEnv = (envConf: Record<string, any>): ViteEnv => {
    const viteEnv: Partial<ViteEnv> = {}

    Object.keys(envConf).forEach(key => {
        let realName = envConf[key].replace(/\\n/g, '\n')
        realName = handleRealName(realName)


        if (key === 'VITE_PROXY' && realName) {
            try {
                realName = JSON.parse(realName.replace(/'/g, '"'))
              } catch (error) {
                realName = ''
              }
        }

        viteEnv[key] = realName

        if (isString(realName)) {
            process.env[key] = realName
        } else if (isObject(realName)) {
            process.env[key] = JSON.stringify(realName)
        }
    })

    return viteEnv as ViteEnv
}

export const resolveProxy = (proxyList: [string, string][] = []) => {
    const proxy: Record<string, ProxyOptions> = {}
    for (const [prefix, target] of proxyList) {
        // const isHttps = /^https:\/\//.test(target)
        proxy[prefix] = {
          target: target,
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
          // https is require secure=false
        //   ...(isHttps ? { secure: false } : {}),
        }
      }
      return proxy
}

export function JetLinksStyleResolve(): Lib {
  return {
    ensureStyleFile: true,
    libraryName: 'jetlinks-ui-components',
    esModule: true,
    resolveStyle: (name) => {
      return `jetlinks-ui-components/es/${name}/style/index`
    },
  }
}
