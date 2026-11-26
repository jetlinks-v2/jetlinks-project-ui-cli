import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import * as vue from 'vue'
import { renderToString } from 'vue/server-renderer'
import { compileScript, parse } from 'vue/compiler-sfc'
import ts from 'typescript'
const { createSSRApp, defineComponent, h, ref } = vue

const filename = new URL('./Content.vue', import.meta.url).pathname
const { descriptor } = parse(readFileSync(filename, 'utf8'), { filename })
const source = compileScript(descriptor, { id: 'pro-table-scroll', inlineTemplate: true }).content
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } })

async function render(scroll) {
  let received
  const Table = defineComponent({ props: ['scroll', 'columns'], setup: props => () => {
    received = props.scroll
    return h('table')
  } })
  const imports = {
    vue,
    './setting': { _contentProps: {
      columns: { type: Array, default: () => [] }, dataSource: { type: Array, default: () => [] },
      mode: String, type: String, scroll: { type: [Object, Boolean], default: () => ({}) }, rowSelection: Object,
    } },
    'ant-design-vue': { Table },
    'ant-design-vue/es/config-provider/hooks/useConfigInject': { default: () => ({ renderEmpty: () => null }), __esModule: true },
    'lodash-es': { get: (value, key) => value[key], omit: (value, keys) => Object.fromEntries(Object.entries(value).filter(([key]) => !keys.includes(key))) },
    './hooks': { useTableInject: () => ref() },
    './style': { default: () => [value => value, ref('')], __esModule: true },
    '../LocaleReciver': { useLocaleReceiver: () => [ref({})] },
    '../VirtualTable': { default: Table, __esModule: true },
  }
  const module = { exports: {} }
  new Function('require', 'module', 'exports', outputText)(id => {
    assert.ok(Object.hasOwn(imports, id), `Unexpected test boundary: ${id}`)
    return imports[id]
  }, module, module.exports)
  const app = createSSRApp(module.exports.default, {
    mode: 'TABLE', type: 'PAGE', scroll,
    columns: [{ dataIndex: 'name' }, { dataIndex: 'category', width: 180 }, { dataIndex: 'action', width: 90, fixed: 'right' }],
  }).component('a-checkbox', { render: () => null })
  await renderToString(app)
  return received
}

test('automatic horizontal sizing preserves intrinsic column width while vertical sizing stays compatible', async () => {
  assert.deepEqual(await render(undefined), { x: 'max-content', y: '100%' })
  assert.deepEqual(await render({ y: 240 }), { x: 'max-content', y: 240 })
})

test('explicit horizontal sizes and opt-outs still belong to the caller', async () => {
  assert.deepEqual(await render({ x: 1200 }), { x: 1200, y: '100%' })
  assert.deepEqual(await render({ x: '120rem', y: '40vh' }), { x: '120rem', y: '40vh' })
  assert.deepEqual(await render({ x: '100%', y: false }), { x: '100%', y: undefined })
  assert.deepEqual(await render({ x: false }), { x: undefined, y: '100%' })
  assert.deepEqual(await render(false), { x: undefined, y: undefined })
})
