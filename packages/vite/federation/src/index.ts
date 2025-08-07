import type {
  ConfigEnv,
  Plugin,
  UserConfig,
  ViteDevServer,
  ResolvedConfig
} from 'vite'
import virtual from '@rollup/plugin-virtual'
import { dirname } from 'path'
import { prodRemotePlugin } from './prod/remote-production'
import type { VitePluginFederationOptions } from '../types'
import {builderInfo, DEFAULT_ENTRY_FILENAME, DEFAULT_ORIGIN_NAME, parsedOptions} from './public'
import type { PluginHooks } from '../types/pluginHooks'
import type { ModuleInfo } from 'rollup'
import { prodSharedPlugin } from './prod/shared-production'
import { prodExposePlugin } from './prod/expose-production'
import { devSharedPlugin } from './dev/shared-development'
import { devRemotePlugin } from './dev/remote-development'
import { devExposePlugin } from './dev/expose-development'

export default function federation(
  options: VitePluginFederationOptions
): Plugin {
  options.filename = options.filename
    ? options.filename
    : DEFAULT_ENTRY_FILENAME

  options.name = options.isHost ? DEFAULT_ORIGIN_NAME : undefined

  options.shared = options.shared ? options.shared : [
    'vue',
    'pinia',
    'axios',
    'vue-router',
    'vue-i18n',
    '@jetlinks-web/constants',
    '@jetlinks-web/core',
    '@jetlinks-web/hooks',
    '@jetlinks-web/types',
    '@jetlinks-web/utils',
    'ant-design-vue',
  ].reduce((prev, key) => {
    prev[key] = {
      singleton: true, // 确保只有一个实例，这对 UI 库至关重要
      eager: true,     // 宿主应用启动时就加载并共享，避免按需加载时的延迟
    }
    return prev
  }, {})

  options.remotes = options.remotes ? options.remotes : options.isHost ? {} : undefined

  let pluginList: PluginHooks[] = []
  let virtualMod
  let registerCount = 0

  function registerPlugins(mode: string, command: string) {
    if (mode === 'production' || command === 'build') {
      pluginList = [
        prodSharedPlugin(options),
        prodExposePlugin(options),
        prodRemotePlugin(options)
      ]
    } else if (mode === 'development' || command === 'serve') {
      pluginList = [
        devSharedPlugin(options),
        devExposePlugin(options),
        devRemotePlugin(options)
      ]
    }  else {
      pluginList = []
    }
    builderInfo.isHost = options.isHost || !!(
      parsedOptions.prodRemote.length || parsedOptions.devRemote.length
    )
    builderInfo.isRemote = !!(
      parsedOptions.prodExpose.length || parsedOptions.devExpose.length
    )
    builderInfo.isShared = !!(
      parsedOptions.prodShared.length || parsedOptions.devShared.length
    )

    let virtualFiles = {}
    pluginList.forEach((plugin) => {
      if (plugin.virtualFile) {
        virtualFiles = Object.assign(virtualFiles, plugin.virtualFile)
      }
    })
    virtualMod = virtual(virtualFiles)
  }

  return {
    name: 'originjs:federation',
    // for scenario vite.config.js build.cssCodeSplit: false
    // vite:css-post plugin will summarize all the styles in the style.xxxxxx.css file
    // so, this plugin need run after vite:css-post in post plugin list
    enforce: 'post',
    // apply:'build',
    options(_options) {
      // rollup doesnt has options.mode and options.command
      if (!registerCount++) {
        registerPlugins((options.mode = options.mode ?? 'production'), '')
      }

      if (typeof _options.input === 'string') {
        _options.input = { index: _options.input }
      }
      _options.external = _options.external || []
      if (!Array.isArray(_options.external)) {
        _options.external = [_options.external as string]
      }
      for (const pluginHook of pluginList) {
        pluginHook.options?.call(this, _options)
      }
      return _options
    },
    config(config: UserConfig, env: ConfigEnv) {
      options.mode = options.mode ?? env.mode
      registerPlugins(options.mode, env.command)
      registerCount++
      for (const pluginHook of pluginList) {
        pluginHook.config?.call(this, config, env)
      }

      // only run when builder is vite,rollup doesnt has hook named `config`
      builderInfo.builder = 'vite'
      builderInfo.assetsDir = config?.build?.assetsDir ?? 'assets'
    },
    configureServer(server: ViteDevServer) {
      for (const pluginHook of pluginList) {
        pluginHook.configureServer?.call(this, server)
      }
    },
    configResolved(config: ResolvedConfig) {
      for (const pluginHook of pluginList) {
        pluginHook.configResolved?.call(this, config)
      }
    },
    buildStart(inputOptions) {
      for (const pluginHook of pluginList) {
        pluginHook.buildStart?.call(this, inputOptions)
      }
    },

    async resolveId(...args) {
      const v = virtualMod.resolveId.call(this, ...args)
      if (v) {
        return v
      }
      if (args[0] === '\0virtual:__federation_fn_import') {
        return {
          id: '\0virtual:__federation_fn_import',
          moduleSideEffects: true
        }
      }
      if (args[0] === '__federation_fn_satisfy') {
        const federationId = (
          await this.resolve('@originjs/vite-plugin-federation')
        )?.id
        return await this.resolve(`${dirname(federationId!)}/satisfy.mjs`)
      }
      if (args[0] === 'virtual:__federation__') {
        return {
          id: '\0virtual:__federation__',
          moduleSideEffects: true
        }
      }
      return null
    },

    load(...args) {
      const v = virtualMod.load.call(this, ...args)
      if (v) {
        return v
      }
      return null
    },

    transform(code: string, id: string) {
      for (const pluginHook of pluginList) {
        const result = pluginHook.transform?.call(this, code, id)
        if (result) {
          return result
        }
      }
      return code
    },
    moduleParsed(moduleInfo: ModuleInfo): void {
      for (const pluginHook of pluginList) {
        pluginHook.moduleParsed?.call(this, moduleInfo)
      }
    },

    outputOptions(outputOptions) {
      for (const pluginHook of pluginList) {
        pluginHook.outputOptions?.call(this, outputOptions)
      }
      return outputOptions
    },

    renderChunk(code, chunkInfo, _options) {
      for (const pluginHook of pluginList) {
        const result = pluginHook.renderChunk?.call(
          this,
          code,
          chunkInfo,
          _options
        )
        if (result) {
          return result
        }
      }
      return null
    },

    generateBundle: function (_options, bundle, isWrite) {
      for (const pluginHook of pluginList) {
        pluginHook.generateBundle?.call(this, _options, bundle, isWrite)
      }
    }
  }
}
