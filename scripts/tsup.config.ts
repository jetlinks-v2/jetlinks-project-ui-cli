// tsup.config.ts
import { defineConfig } from 'tsup'
import path from 'path'
import fs from 'fs/promises'
import corePkg from '../packages/core/package.json'
import hooksPkg from '../packages/hooks/package.json'
import utilsPkg from '../packages/utils/package.json'
import vitePkg from '../packages/vite/package.json'

const external = [
  'vue',
  'lodash-es',
  'vue-router',
  '@vueuse/core',
  "jsencrypt",
  'pubsub-js',
  '@vue/shared',
  "ant-design-vue"
]


// esbuild 插件：把 `?raw` 资源当作纯文本加载，避免解析内部 import
const rawQueryPlugin = {
  name: 'raw-query-loader',
  setup(build) {
    // 匹配以 ?raw 结尾的导入
    build.onResolve({ filter: /\?raw$/ }, (args) => {
      const withoutQuery = args.path.replace(/\?raw$/, '')
      const resolved = path.isAbsolute(withoutQuery)
        ? withoutQuery
        : path.join(args.resolveDir, withoutQuery)
      return { path: resolved, namespace: 'raw-file' }
    })

    build.onLoad({ filter: /.*/, namespace: 'raw-file' }, async (args) => {
      const contents = await fs.readFile(args.path, 'utf8')
      return { contents, loader: 'text' }
    })
  }
}


const config: any = {
    format: ['esm'],
    dts: true,
    clean: true,
    target: 'esnext',
    splitting: false,
    outExtension({ format }) {
      return { js: '.mjs' }
    },
    minify: true,
    esbuildPlugins: [rawQueryPlugin],
}

export default defineConfig([
  {
    entry: ['../packages/core/index.ts'],
    outDir: '../packages/core/dist',
    external: [...(Object.keys(corePkg.dependencies || {})), ...external],
    ...config,
  },
  {
    entry: ['../packages/hooks/index.ts'],
    outDir: '../packages/hooks/dist',
    external: [...(Object.keys(hooksPkg.dependencies || {})), ...external],
    ...config,
  },
  {
    entry: ['../packages/utils/index.ts'],
    outDir: '../packages/utils/dist',
    external: [...(Object.keys(utilsPkg.dependencies || {})), ...external],
    ...config,
  }
])
