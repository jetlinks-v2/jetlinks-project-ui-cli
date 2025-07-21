import { defineConfig } from 'vite'
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      // entry: ['./federation/src/index.ts', './federation/src/utils/semver/satisfy.ts'],
      entry: {
        index: path.resolve(__dirname, 'index.ts'),
        federation: path.resolve(__dirname, 'federation/src/index.ts'),
        monacoEditor: path.resolve(__dirname, 'monaco-editor/index.ts'),
      },
      formats: ['es', 'cjs']
    },
    target: 'node14',
    minify: false,
    rollupOptions: {
      external: ['fs', 'path', 'crypto', 'magic-string', 'child_process'],
      output: {
        minifyInternalExports: false,
        entryFileNames: '[name].js'
      }
    }
  }
})
