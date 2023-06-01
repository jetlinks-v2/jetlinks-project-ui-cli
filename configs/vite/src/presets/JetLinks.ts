import type { UserConfig } from 'vite'

export const createJetLinksPreset = async () : Promise<UserConfig> => {
    return {
        optimizeDeps: {
            include: [
                '@ant-design/icons-vue',
                'dayjs',
                'dayjs/locale/zh-cn'
            ]
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        dayjs: ['dayjs']
                    }
                }
            }
        },
        css: {
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true
                }
            }
        }
    }
}