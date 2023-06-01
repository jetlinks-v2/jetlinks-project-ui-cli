import type { AliasOptions } from 'vite'
import { defineConfig } from 'vite'

const alias: AliasOptions = {
}

export default defineConfig({
    resolve: {
        alias
    }
})