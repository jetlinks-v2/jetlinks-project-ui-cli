import type { PluginHooks } from '../../types/pluginHooks'
import { NAME_CHAR_REG, parseSharedOptions, removeNonRegLetter } from '../utils'
import { parsedOptions } from '../public'
import type { ConfigTypeSet, VitePluginFederationOptions } from '../../types'
import { basename, join, resolve } from 'path'
import { readdirSync, readFileSync, statSync } from 'fs'
// @ts-ignore
import federation_fn_import from './federation_fn_import.js?raw'

const sharedFilePathReg = /__federation_shared_(.+)-.{8}\.js$/

export function prodSharedPlugin(
  options: VitePluginFederationOptions
): PluginHooks {
  parsedOptions.prodShared = parseSharedOptions(options)
  const shareName2Prop = new Map<string, any>()
  parsedOptions.prodShared.forEach((value) =>
    shareName2Prop.set(removeNonRegLetter(value[0], NAME_CHAR_REG), value[1])
  )
  let isHost
  let isRemote
  const id2Prop = new Map<string, any>()


  function negotiateManualChunksCompatibility(inputOptions: any) {
    if (!inputOptions.output) return

    const outputs = Array.isArray(inputOptions.output)
      ? inputOptions.output
      : [inputOptions.output]

    outputs.forEach(output => {
      if (!output.manualChunks) return

      const sharedModuleNames = [...shareName2Prop.keys()]
      const conflictModules = new Set<string>()

      // 检测冲突模块
      if (typeof output.manualChunks === 'object') {
        Object.values(output.manualChunks).flat().forEach(mod => {
          // @ts-ignore
          if (sharedModuleNames.some(shared => mod.includes(shared) || mod === shared)) {
            conflictModules.add(mod as string)
          }
        })
      }

      if (conflictModules.size > 0) {
        console.info(
          `[Federation] 检测到模块 [${Array.from(conflictModules).join(', ')}] ` +
          `同时配置在 shared 和 manualChunks 中，启用协商共存模式`
        )

        // 协商策略：修改 shared 配置以适配 manualChunks
        adaptSharedToManualChunks(conflictModules)
      }
    })
  }

  function adaptSharedToManualChunks(conflictModules: Set<string>) {
    // 为冲突模块调整 federation 共享策略
    parsedOptions.prodShared.forEach((sharedItem, index) => {
      // @ts-ignore
      const [moduleName, config] = sharedItem

      if (conflictModules.has(moduleName)) {
        // 保持 federation 共享逻辑，但标记为兼容模式
        config.manualChunkCompat = true
        config.chunkLoading = 'defer' // 延迟加载，让 manualChunk 先处理

        console.info(
          `[Federation] 模块 "${moduleName}" 设置为兼容模式：` +
          `manualChunks 负责分块，federation 负责运行时共享`
        )
      }
    })
  }

  return {
    name: 'originjs:shared-production',
    virtualFile: {
      __federation_fn_import: federation_fn_import
    },
    options(inputOptions) {
      isRemote = !!parsedOptions.prodExpose.length
      isHost = options.isHost

      if (shareName2Prop.size) {
        // remove item which is both in external and shared
        inputOptions.external = (
          inputOptions.external as (string | RegExp)[]
        )?.filter((item) => {
          if (item instanceof RegExp)
            return ![...shareName2Prop.keys()].some((key) => item.test(key))
          return !shareName2Prop.has(removeNonRegLetter(item, NAME_CHAR_REG))
        })
      }

      // 协商共存：处理 manualChunks 与 shared 的兼容
      negotiateManualChunksCompatibility(inputOptions)

      return inputOptions
    },
    async buildStart() {
      // Cannot emit chunks after module loading has finished, so emitFile first.
      if (parsedOptions.prodShared.length && isRemote) {
        this.emitFile({
          name: '__federation_fn_import',
          type: 'chunk',
          id: '__federation_fn_import',
          preserveSignature: 'strict'
        })
      }

      // forEach and collect dir
      const collectDirFn = (filePath: string, collect: string[]) => {
        const files = readdirSync(filePath)
        files.forEach((name) => {
          const tempPath = join(filePath, name)
          const isDir = statSync(tempPath).isDirectory()
          if (isDir) {
            collect.push(tempPath)
            collectDirFn(tempPath, collect)
          }
        })
      }

      const monoRepos: { arr: string[]; root: string | ConfigTypeSet }[] = []
      const dirPaths: string[] = []
      const currentDir = resolve()
      //  try to get every module package.json file
      for (const arr of parsedOptions.prodShared) {
        if (isHost && !arr[1].version && !arr[1].manuallyPackagePathSetting) {
          const packageJsonPath = (
            await this.resolve(`${arr[1].packagePath}/package.json`)
          )?.id
          if (packageJsonPath) {
            const packageJson = JSON.parse(
              readFileSync(packageJsonPath, { encoding: 'utf-8' })
            )
            arr[1].version = packageJson.version
          } else {
            arr[1].removed = true
            const dir = join(currentDir, 'node_modules', arr[0])
            const dirStat = statSync(dir)
            if (dirStat.isDirectory()) {
              collectDirFn(dir, dirPaths)
            } else {
              this.error(`cant resolve "${arr[1].packagePath}"`)
            }

            if (dirPaths.length > 0) {
              monoRepos.push({ arr: dirPaths, root: arr })
            }
          }

          if (!arr[1].removed && !arr[1].version) {
            this.error(
              `No description file or no version in description file (usually package.json) of ${arr[0]}. Add version to description file, or manually specify version in shared config.`
            )
          }
        }
      }
      parsedOptions.prodShared = parsedOptions.prodShared.filter(
        (item) => !item[1].removed
      )
      // assign version to monoRepo
      if (monoRepos.length > 0) {
        for (const monoRepo of monoRepos) {
          for (const id of monoRepo.arr) {
            try {
              const idResolve = await this.resolve(id)
              if (idResolve?.id) {
                (parsedOptions.prodShared as any[]).push([
                  `${monoRepo.root[0]}/${basename(id)}`,
                  {
                    id: idResolve?.id,
                    import: monoRepo.root[1].import,
                    shareScope: monoRepo.root[1].shareScope,
                    root: monoRepo.root
                  }
                ])
              }
            } catch (e) {
              //    ignore
            }
          }
        }
      }

      if (parsedOptions.prodShared.length && isRemote) {
        for (const prod of parsedOptions.prodShared) {
          id2Prop.set(prod[1].id, prod[1])
        }
      }
    },

    outputOptions: function (outputOption) {
      // remove rollup generated empty imports,like import './filename.js'
      outputOption.hoistTransitiveImports = false

      const manualChunkFunc = (id: string) => {
        //  if id is in shared dependencies, return id ,else return vite function value
        const find = parsedOptions.prodShared.find((arr) =>
          arr[1].dependencies?.has(id)
        )
        return find ? find[0] : undefined
      }

      // only active when manualChunks is function,array not to solve
      if (typeof outputOption.manualChunks === 'function') {
        outputOption.manualChunks = new Proxy(outputOption.manualChunks, {
          apply(target, thisArg, argArray) {
            const result = manualChunkFunc(argArray[0])
            return result ? result : target(argArray[0], argArray[1])
          }
        })
      }

      // The default manualChunk function is no longer available from vite 2.9.0
      if (outputOption.manualChunks === undefined) {
        outputOption.manualChunks = manualChunkFunc
      }

      return outputOption
    },

    generateBundle(options, bundle) {
      if (!isRemote) {
        return
      }
      const needRemoveShared = new Set<string>()
      for (const key in bundle) {
        const chunk = bundle[key]
        if (chunk.type === 'chunk') {
          if (!isHost) {
            const regRst = sharedFilePathReg.exec(chunk.fileName)
            if (
              regRst &&
              shareName2Prop.get(removeNonRegLetter(regRst[1], NAME_CHAR_REG))
                ?.generate === false
            ) {
              needRemoveShared.add(key)
            }
          }
        }
      }
      if (needRemoveShared.size !== 0) {
        for (const key of needRemoveShared) {
          delete bundle[key]
        }
      }
    }
  }
}
