type ENV = Record<string, any>

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