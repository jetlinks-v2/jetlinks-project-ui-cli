type ENV = Record<string, any>
interface ModuleRoutes {
  [key: string]: () => Promise<any>;
}

export const getAppConfigFileName = (env: ENV) => {
    return `__PRODUCTION__${env.VITE_GLOB_APP_SHORT_NAME || '__APP'}__CONF__`
      .toUpperCase()
      .replace(/\s/g, '')
  }

  const getAppConfig = (env: ENV) => {
    const ENV_NAME = getAppConfigFileName(env)
    return env.DEV ? env : window[ENV_NAME]
  }

export const getGlobalConfig = (env: ENV) => {
    const { VITE_APP_BASE_API } = getAppConfig(env)

    const glob: Readonly<Record<string, string>> = {
      apiUrl: VITE_APP_BASE_API
    }

    return glob
}

/**
 * 获取子模块下的拓展组件
 * @param name 模块名称
 * @param modules
 */
export const getModulesComponents = (name: string, modules: Record<string, any>) =>{
  const components: any = {}
  Object.values(modules).forEach(item => {
    const c = (item as any).default.getComponents?.()
    if (c) {
      Object.keys(c).forEach((key: string) => {
        components[key] = [...(components[key] || []), ...c[key]]
      })
    }
  })

  return components[name]
}

/**
 * 获取子模块下的约定式路由
 * @param routerModules
 */
export const getModuleRoutesMap = (routerModules: Record<string, any>) => {
  return Object.entries(routerModules).reduce((modules: ModuleRoutes, [path, component]) => {
    const code = path.replace(/^\.\/views\/(.*)\/index\.vue$/, '$1');
    modules[code] = component;
    return modules;
  }, {});
}
