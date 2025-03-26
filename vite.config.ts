import type { AliasOptions } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx'

const alias: AliasOptions = {
}

export default defineConfig({
    resolve: {
        alias
    },
    plugins: [
        vue(),
        vueJsx(),
    ],
    css: {
        preprocessorOptions: {
            less: {
                modifyVars: {
                    'root-entry-name': 'variable',
                    hack: `true; @import (reference) "ant-design-vue/es/style/themes/index.less";`,
                },
                javascriptEnabled: true,
            },
        },
    },
})