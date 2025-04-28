import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: '', // 入口文件由脚本动态指定
  output: {
    dir: '', // 输出目录由脚本动态指定
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    terser(),
  ],
  external: [
    'vue',
    'axios',
    'rxjs',
    '@jetlinks-web/constants',
    '@jetlinks-web/types',
    '@jetlinks-web/utils',
  ],
};