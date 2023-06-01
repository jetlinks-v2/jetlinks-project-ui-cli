import dayjs from "dayjs";
import { resolve } from "path";
import type { UserConfig } from "vite";
import { loadEnv, mergeConfig } from "vite";
import { resolveProxy, wrapperEnv } from "./utils";
import { configVitePlugins } from "./plugins";
import { OUTPUT_DIR } from "./constants";
import { createPreset } from "./presets";

export * from "./constants";

type commandType = "build" | "serve";

export const createViteConfig = async (
  command: commandType,
  mode: string,
  cwd: string
): Promise<UserConfig> => {
  const preset = "jetlinks";
  const root = cwd;
  const env = loadEnv(mode, root);

  const viteEnv = wrapperEnv(env);
  const { VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE, VITE_USE_HTTPS } =
    viteEnv;

  const commonConfig: UserConfig = {
    root,
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        '@': `${resolve(root, 'src')}`,
      },
    },
    server: {
      port: 8080,
      host: true,
      proxy: resolveProxy(VITE_PROXY),
    },
    esbuild: {
      pure: VITE_DROP_CONSOLE ? ["console.log", "debugger"] : [],
    },
    build: {
      outDir: OUTPUT_DIR,
      sourcemap: false,
      cssCodeSplit: false,
      manifest: true,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2048,
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].${new Date().getTime()}.js`,
          chunkFileNames: `assets/[name].${new Date().getTime()}.js`,
          assetFileNames: `assets/[name].${new Date().getTime()}.[ext]`,
          compact: true,
          manualChunks: {
            vue: ["vue", "pinia", "vue-router"],
          },
        },
      },
    },
    optimizeDeps: {
      include: ["dayjs/locale/zh-cn"],
    },
    plugins: await configVitePlugins(root, viteEnv, command === "build"),
  };
  
  return mergeConfig(commonConfig, await createPreset(preset)());
};
