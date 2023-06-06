import type { PluginOption } from "vite";
import { writeFileSync, mkdirp, readFileSync } from "fs-extra";
import { GLOB_CONFIG_FILE_NAME, OUTPUT_DIR, APP_NAME } from "../constants";
import { resolve } from "path";
import dotenv from "dotenv";
import { getAppConfigFileName } from "@jetlinks/utils";

interface Options {
  configName: string;
  config: any;
  configFileName?: string;
}

/**
 * 获取当前环境下生效的配置文件名
 * @returns {Array}
 */
const getConfFiles = () => {
  const script = process.env.npm_lifecycle_script;
  const reg = new RegExp("--mode ([a-z_\\d]+)");
  const result = reg.exec(script as string) as any;
  if (result) {
    const mode = result[1] as string;
    return [".env", `.env.${mode}`];
  }
  return [".env", ".env.production"];
};

const getEnvConfig = (match = "VITE_GLOB_", confFiles = getConfFiles()) => {
  let envConfig: Record<string, string> = {};
  confFiles.forEach((item) => {
    try {
      const env = dotenv.parse(readFileSync(resolve(process.cwd(), item)));
      envConfig = { ...envConfig, ...env };
    } catch (e) {
      console.error(`Error in parsing ${item}`, e);
    }
  });

  const reg = new RegExp(`^(${match})`);

  Object.keys(envConfig).forEach((key) => {
    if (!reg.test(key)) {
      Reflect.deleteProperty(envConfig, key);
    }
  });
  return envConfig;
};

const createConfig = (params: Options) => {
  const { config, configName, configFileName } = params;

  try {
    const windowConf = `window.${configName}`;
    // Ensure that the variable will not be modified
    const configStr = `${windowConf}=${JSON.stringify(config)};
           Object.freeze(${windowConf});
           Object.defineProperty(window, "${configName}", {
             configurable: false,
             writable: false,
           });
         `.replace(/\s/g, "");
    mkdirp(resolve(process.cwd(), OUTPUT_DIR));
    writeFileSync(
      resolve(process.cwd(), `${OUTPUT_DIR}/${configFileName}`),
      configStr
    );

    console.log(`${OUTPUT_DIR}/${configFileName}`);
  } catch (error) {
    console.warn(
      "configuration file configuration file failed to package:\n" + error
    );
  }
};

export const runBuildConfig = () => {
  const config = getEnvConfig();
  // const configFileName = getAppConfigFileName(config);
  createConfig({
    config,
    configName: '__PRODUCTION__JetLinks-Admin__APP__CONF__',
    configFileName: GLOB_CONFIG_FILE_NAME,
  });
};

export function createConfigPlugin(): PluginOption {
    return {
      name: 'generate-config',
      closeBundle() {
        try {
          const argvList = process.argv.splice(2)
  
          // Generate configuration file
          if (!argvList.includes('disabled-config')) {
            runBuildConfig()
          }
  
          console.log(`✨${APP_NAME} - build successfully!`)
        } catch (error) {
          console.log('vite build error:\n' + error)
          process.exit(1)
        }
      },
    }
  }
