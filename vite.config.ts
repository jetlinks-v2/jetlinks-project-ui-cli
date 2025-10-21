import type { AliasOptions } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx'
import {theme} from 'ant-design-vue/lib'
import convertLegacyToken from 'ant-design-vue/lib/theme/convertLegacyToken'

const {defaultAlgorithm, defaultSeed} = theme;

const mapToken = defaultAlgorithm(defaultSeed);
const v3Token = convertLegacyToken(mapToken);

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
                    ...v3Token
                },
                javascriptEnabled: true,
            },
        },
    },
    optimizeDeps: {
        exclude: ['@storybook/manager-api', '@storybook/theming'],
    },
})
