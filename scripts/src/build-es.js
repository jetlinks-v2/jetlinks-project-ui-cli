import path from 'path';
import { execa } from 'execa';
import { fileURLToPath } from 'url';
import { succeed, error } from './helper.js';

const __filename = fileURLToPath(import.meta.url); // 获取当前文件路径
const __dirname = path.dirname(__filename); // 获取当前文件目录

const packages = ['core', 'hooks', 'utils']; // 要打包的模块

async function buildPackage(pkg) {
  const pkgPath = path.resolve(__dirname, '../../packages', pkg);
  const input = path.resolve(pkgPath, 'index.ts');
  const outputDir = path.resolve(pkgPath, 'dist');

  try {
    await execa('rollup', [
      '-c',
      '--input',
      input,
      '--output.dir',
      outputDir,
      '--format',
      'es',
      '--sourcemap',
    ]);
    succeed(`打包成功: ${pkg}`);
  } catch (err) {
    error(`打包失败: ${pkg}`);
    console.error(err);
  }
}

async function buildAll() {
  for (const pkg of packages) {
    await buildPackage(pkg);
  }
}

buildAll();