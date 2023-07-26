import type { PluginOption } from "vite";
import type { ViteEnv } from "../utils";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import VueSetupExtend from "vite-plugin-vue-setup-extend";
import AutoImport from "unplugin-auto-import/vite";
import Components from 'unplugin-vue-components/vite'
import { createStyleImportPlugin, AndDesignVueResolve } from 'vite-plugin-style-import'
import { VueAmapResolver } from '@vuemap/unplugin-resolver'

import { configVisualizerConfig } from "./visualizer";
import { createConfigPlugin } from "./config";
import { configHttpsPlugin } from "./https";
import { optimizeDeps } from './optimize'
import { JetlinksVueResolver } from 'jetlinks-ui-components/es/plugin'
import { JetLinksStyleResolve } from '../utils'

import monacoEditorPlugin from "vite-plugin-monaco-editor";

export async function configVitePlugins(
  root: string,
  viteEnv: ViteEnv,
  isBuild: boolean,
  extraPlugins?: PluginOption[]
) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    vue(),

    vueJsx(),

    VueSetupExtend(),

    AutoImport({
      imports: ["vue", "vue-router"],
      dts: "src/auto-imports.d.ts",
      resolvers: [VueAmapResolver()]
    }),

    optimizeDeps(),

    Components({
        resolvers: [JetlinksVueResolver({ importStyle: 'less' }), VueAmapResolver()],
        directoryAsNamespace: true
    }),

    createStyleImportPlugin({
      resolves: [
        AndDesignVueResolve(),
        JetLinksStyleResolve()
      ]
    }),
  ];

  vitePlugins.push(createConfigPlugin());

  // rollup-plugin-visualizer 需要时再开启
  // vitePlugins.push(configVisualizerConfig())

  // http2
  if (viteEnv.VITE_USE_HTTPS) {
    vitePlugins.push(configHttpsPlugin(viteEnv));
  }
  // monacoEditorPlugin
  vitePlugins.push(monacoEditorPlugin({}));

  if (extraPlugins) {
    return vitePlugins.concat(extraPlugins)
  }
  return vitePlugins;
}
