import { defineConfig } from 'vite'
import path from "node:path";
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      // 所有的类型合并到一个 index.d.ts 中
      rollupTypes: true,
      cleanVueFileName: true,
      // 指定入口文件，只处理这些文件及其依赖
      include: ['index.ts', 'src/**/*.ts'],
      // 排除不需要的目录
      exclude: ['node_modules', 'dist', '**/*.spec.ts', '**/*.test.ts'],
      // 输出目录
      outDir: 'dist',
      // 指定 tsconfig
      tsconfigPath: './tsconfig.json',
    })
  ],
  build: {
    lib: {
      entry: [path.resolve(__dirname, 'index.ts'), './src/federation/src/utils/semver/satisfy.ts', './src/federation/src/runtime/dynamic-remote.ts'] ,
      name: 'JetlinksVite',
      formats: ['es', 'cjs']
    },
    target: 'node20',
    minify: false,
    rollupOptions: {
      external: ['fs', 'path', 'crypto', 'magic-string', 'child_process', 'sharp', 'node:fs', 'node:path', 'node:crypto', 'virtual:__federation__', 'vue', 'esbuild'],
      output: {
        minifyInternalExports: false
      }
    }
  }
})
