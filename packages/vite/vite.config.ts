import { defineConfig } from 'vite'
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: [path.resolve(__dirname, 'index.ts'), 'src/federation/src/utils/semver/satisfy.ts'] ,
      name: 'JetlinksVite',
      formats: ['es', 'cjs']
    },
    target: 'node14',
    minify: false,
    rollupOptions: {
      external: ['fs', 'path', 'crypto', 'magic-string', 'child_process', 'sharp', 'node:fs', 'node:path', 'node:crypto', 'virtual:__federation__'],
      output: {
        minifyInternalExports: false
      }
    }
  }
})
