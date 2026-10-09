// Compile the changed shared sources into pnpm's extracted package directories.
// Package versions and unrelated published files stay unchanged until upstream release.
const { createRequire } = require('node:module')
const { readFileSync, writeFileSync, mkdirSync, copyFileSync } = require('node:fs')
const { resolve, dirname } = require('node:path')
const root = resolve(__dirname, '..')
const deps = createRequire(process.env.JETLINKS_TEST_DEPS || resolve(root, 'package.json'))
const { transformSync, buildSync } = deps('esbuild')
const { parse, compileScript } = deps('vue/compiler-sfc')
const [componentsDir, coreDir] = process.argv.slice(2)
if (!componentsDir || !coreDir) throw new Error('Usage: node tests/buildRuntimePatches.cjs <components-edit-dir> <core-edit-dir>')
const emit = (file, text) => { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, text) }
const componentRoot = resolve(root, 'packages/components/src/ProTable')
for (const [folder, format] of [['es', 'esm'], ['lib', 'cjs']]) {
  for (const file of ['ProTable.vue', 'setting.ts', 'style/index.ts', 'hooks/useProTableRequest.ts']) {
    const sourceFile = resolve(componentRoot, file)
    let source = readFileSync(sourceFile, 'utf8')
    if (file.endsWith('.vue')) source = compileScript(parse(source, { filename: sourceFile }).descriptor, { id: 'j-pro-table', inlineTemplate: true }).content
    source = source.replace(/from (['"])([^'"]+)\.vue\1/g, 'from $1$2.js$1')
    const { code } = transformSync(source, { loader: 'ts', format, target: 'es2020' })
    emit(resolve(componentsDir, folder, 'ProTable', file.replace(/\.(vue|ts)$/, '.js')), code)
  }
}
// Build against the consuming package's remaining sources; avoid unrelated upstream changes.
for (const file of ['axios.ts', 'type.ts']) copyFileSync(resolve(root, 'packages/core/src', file), resolve(coreDir, 'src', file))
buildSync({
  entryPoints: [resolve(coreDir, 'index.ts')], outfile: resolve(coreDir, 'dist/index.mjs'),
  bundle: true, packages: 'external', platform: 'browser', format: 'esm', target: 'es2020', minify: true,
})
const declarations = resolve(coreDir, 'dist/index.d.ts')
const declarationText = readFileSync(declarations, 'utf8')
if (!declarationText.includes('private clearRequestRecord;')) {
  emit(declarations, declarationText.replace('private requestRecords;', 'private requestRecords;\n    private clearRequestRecord;'))
}
console.log('Built source-based component ES/CJS and core ESM patches')
