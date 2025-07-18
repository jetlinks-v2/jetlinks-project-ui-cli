// tsup.config.ts
import { defineConfig } from 'tsup'
import corePkg from '../packages/core/package.json'
import hooksPkg from '../packages/hooks/package.json'
import utilsPkg from '../packages/utils/package.json'

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
