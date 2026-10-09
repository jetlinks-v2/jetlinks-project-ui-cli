const assert = require('node:assert/strict')
const test = require('node:test')
const { readFileSync } = require('node:fs')
const { createRequire } = require('node:module')
const { resolve, dirname } = require('node:path')
const root = resolve(__dirname, '..')
// A consuming workspace can supply its installed dependencies without installing Storybook.
const deps = createRequire(process.env.JETLINKS_TEST_DEPS || resolve(root, 'package.json'))
const vue = deps('vue')
const axios = deps('axios')
const { transformSync } = deps('esbuild')
const { parse, compileScript } = deps('vue/compiler-sfc')
global.window = { addEventListener: () => {}, removeEventListener: () => {} }
global.document = { getElementById: () => null }
global.localStorage = { getItem: () => null }

const boundaries = {
  '@jetlinks-web/constants': { TOKEN_KEY: 'token', BASE_API: '/', LOCAL_BASE_API: 'base' },
  '@jetlinks-web/utils': { getToken: () => 'test', randomString: () => 'key', onlyMessage: () => {} },
  'ant-design-vue': { Spin: {} },
  'ant-design-vue/es/table/Table': { tableProps: () => ({}) },
  'ant-design-vue/es/pagination/Pagination': { paginationProps: () => ({}) },
  '../utils/constants': { TableConfig: Symbol('tableConfig') },
  './hooks': { useTableInject: () => vue.ref() },
  './style': { __esModule: true, default: () => [() => {}, vue.ref('hash')] },
  '../LocaleReciver': { useLocaleReceiver: () => [vue.ref({ pagination: {} })] },
}
const cache = new Map()
function load(file) {
  if (cache.has(file)) return cache.get(file).exports
  const module = { exports: {} }
  cache.set(file, module)
  let target = file
  if (process.env.JETLINKS_TEST_TARGET === 'published') {
    if (file.includes('/packages/components/src/ProTable/')) {
      const packageRoot = dirname(deps.resolve('@jetlinks-web/components/package.json'))
      target = resolve(packageRoot, 'es/ProTable', file.split('/packages/components/src/ProTable/')[1].replace(/\.(vue|ts)$/, '.js'))
    } else if (file.endsWith('/packages/core/src/axios.ts')) {
      target = resolve(dirname(deps.resolve('@jetlinks-web/core/package.json')), 'dist/index.mjs')
    }
  }
  let source = readFileSync(target, 'utf8')
  if (target.endsWith('.vue')) source = compileScript(parse(source, { filename: file }).descriptor, { id: 'test' }).content
  const { code } = transformSync(source, { loader: 'ts', format: 'cjs' })
  const imports = id => {
    if (Object.hasOwn(boundaries, id)) return boundaries[id]
    if (/^\.\/(Header|Alert|Content|Pagination)\.(vue|js)$/.test(id)) return { __esModule: true, default: () => null }
    if (id.endsWith('.vue')) return {}
    if (id.startsWith('.')) return load(resolve(dirname(file), `${id.replace(/\.js$/, '')}.ts`))
    return deps(id)
  }
  new Function('require', 'module', 'exports', code)(imports, module, module.exports)
  return module.exports
}
const { useProTableRequest } = load(resolve(root, 'packages/components/src/ProTable/hooks/useProTableRequest.ts'))
const { AxiosService } = load(resolve(root, 'packages/core/src/axios.ts'))
const renderer = vue.createRenderer({
  createElement: tag => ({ tag, children: [] }), createText: text => ({ text }), createComment: text => ({ text }),
  insert: (child, parent) => parent.children.push(child), remove: () => {},
  setText: () => {}, setElementText: () => {}, patchProp: () => {}, parentNode: () => null, nextSibling: () => null,
})
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b }); return { promise, resolve, reject } }
const settle = async () => { for (let i = 0; i < 5; i++) await new Promise(resolve => setImmediate(resolve)) }
const result = (id, index = 0, total = 30) => ({ success: true, result: { data: [{ id }], pageIndex: index, pageSize: 12, total } })
const queue = () => {
  const calls = []
  const request = (params, context) => { const job = deferred(); calls.push({ ...job, params, signal: context.signal }); return job.promise }
  return { calls, request }
}
function mount(props = {}) {
  const errors = [], lastPages = []
  const page = vue.reactive({ pageIndex: 0, pageSize: 12, total: 0, loading: false })
  const loading = vue.ref(false), rows = vue.ref([{ id: 'existing' }])
  const options = vue.reactive({ defaultParams: {}, type: 'PAGE', ...props })
  let api
  const app = renderer.createApp({ setup() { api = useProTableRequest(options, page, loading, rows, () => lastPages.push(true), e => errors.push(e)); return () => null } })
  app.mount({ children: [] })
  return { ...api, app, page, loading, rows, options, errors, lastPages }
}

test('slow old rows and finally cannot replace or unlock a pending successor', async () => {
  const q = queue(), h = mount(q)
  const a = h.handleSearch({ pageIndex: 2 }), b = h.handleSearch({ pageIndex: 0 })
  assert.equal(q.calls[0].signal.aborted, true)
  q.calls[0].resolve(result('old', 2)); await a
  assert.equal(h.loading.value, true); assert.equal(h.rows.value[0].id, 'existing')
  q.calls[1].resolve(result('new')); await b
  assert.equal(h.rows.value[0].id, 'new'); assert.equal(h.page.pageIndex, 0); assert.equal(h.loading.value, false)
  h.app.unmount()
})
test('old rejection, failed response and empty page cannot affect a newer completed query', async () => {
  for (const old of [j => j.reject(new Error('old failure')), j => j.resolve({ success: false }), j => j.resolve({ success: true, result: { data: [], total: 2, pageIndex: 5 } })]) {
    const q = queue(), h = mount(q), a = h.handleSearch({ pageIndex: 5 }), b = h.handleSearch({ pageIndex: 0 })
    q.calls[1].resolve(result('new')); await b; old(q.calls[0]); await a
    assert.equal(q.calls.length, 2); assert.equal(h.rows.value[0].id, 'new'); assert.equal(h.page.total, 30); assert.deepEqual(h.errors, [])
    h.app.unmount()
  }
})
test('independent totals share cancellation and guard value and loading', async () => {
  const q = queue(), totals = queue(), h = mount({ ...q, totalRequest: totals.request })
  const a = h.handleSearch(); q.calls[0].resolve({ success: true, result: [{ id: 'old' }] }); await a
  const b = h.handleSearch(); assert.equal(totals.calls[0].signal.aborted, true)
  q.calls[1].resolve({ success: true, result: [{ id: 'new' }] }); await b
  totals.calls[0].resolve({ success: true, result: 999 }); await settle()
  assert.equal(h.page.loading, true); assert.notEqual(h.page.total, 999)
  totals.calls[1].resolve({ success: true, result: 7 }); await settle()
  assert.equal(h.page.total, 7); assert.equal(h.page.loading, false); h.app.unmount()
})
test('unmount and controlled data cancel pending work without late updates', async () => {
  const q = queue(), h = mount(q), a = h.handleSearch()
  h.options.dataSource = [{ id: 'local' }]; await h.handleSearch()
  assert.equal(q.calls[0].signal.aborted, true)
  q.calls[0].resolve(result('late')); await a; assert.equal(h.rows.value[0].id, 'local')
  h.options.dataSource = undefined; const b = h.handleSearch(); h.app.unmount()
  assert.equal(q.calls[1].signal.aborted, true)
  q.calls[1].resolve(result('unmounted')); await b; assert.equal(h.rows.value[0].id, 'local')
})
test('empty-page fallback preserves filters and merges defaults only once', async () => {
  const q = queue(), h = mount({ ...q, defaultParams: { terms: [{ column: 'scope' }] } })
  const job = h.handleSearch({ pageIndex: 9, terms: [{ column: 'time' }] })
  q.calls[0].resolve({ success: true, result: { data: [], total: 15, pageSize: 12, pageIndex: 9 } }); await settle()
  assert.equal(q.calls[1].params.pageIndex, 1); assert.equal(q.calls[1].params.terms.length, 2)
  assert.equal(h.loading.value, true); q.calls[1].resolve(result('last', 1, 15)); await job
  assert.equal(h.page.pageIndex, 1); h.app.unmount()
})
test('first empty page is a real empty result; cancellation is quiet, genuine failure emits', async () => {
  const q = queue(), h = mount({ ...q, totalRequest: async () => ({ success: true, result: 0 }) })
  const a = h.handleSearch(); q.calls[0].resolve({ success: true, result: [] }); await a; await settle()
  assert.deepEqual(h.rows.value, []); assert.equal(h.page.total, 0); assert.deepEqual(h.lastPages, [])
  const b = h.handleSearch(); q.calls[1].reject(Object.assign(new Error('cancel'), { code: 'ERR_CANCELED' })); await b
  assert.equal(h.loading.value, false); assert.deepEqual(h.errors, [])
  const c = h.handleSearch(); q.calls[2].reject(new Error('failure')); await c; assert.equal(h.errors.length, 1); h.app.unmount()
})
test('table instances cancel independently; legacy one-argument callbacks remain usable', async () => {
  const qa = queue(), qb = queue(), a = mount(qa), b = mount(qb)
  const aa = a.handleSearch(), ba = b.handleSearch(), ab = a.handleSearch()
  assert.equal(qa.calls[0].signal.aborted, true); assert.equal(qb.calls[0].signal.aborted, false)
  qa.calls[0].resolve(result('old')); qa.calls[1].resolve(result('a')); qb.calls[0].resolve(result('b')); await Promise.all([aa, ba, ab])
  const legacy = mount({ request: async params => result(String(params.pageIndex)) }); await legacy.handleSearch({ pageIndex: 0 })
  assert.equal(legacy.rows.value[0].id, '0'); a.app.unmount(); b.app.unmount(); legacy.app.unmount()
})
test('actual ProTable watcher commits immediately and unmount aborts; Spin excludes header/pagination', async () => {
  const file = resolve(root, 'packages/components/src/ProTable/ProTable.vue')
  const component = load(file).default; component.render = () => null
  const q = queue(), params = vue.ref({ terms: [] })
  const app = renderer.createApp({ setup: () => () => vue.h(component, { request: q.request, params: params.value }) })
  app.mount({ children: [] }); assert.equal(q.calls.length, 1)
  params.value = { terms: [{ column: 'url', value: '/new' }] }; await vue.nextTick()
  assert.equal(q.calls.length, 2); assert.equal(q.calls[0].signal.aborted, true)
  app.unmount(); assert.equal(q.calls[1].signal.aborted, true)
  q.calls.forEach(j => j.resolve(result('unused'))); await settle()
  const ast = parse(readFileSync(file, 'utf8')).descriptor.template.ast
  const spins = []; const walk = node => { if (node.tag === 'Spin') spins.push(node); node.children?.forEach(walk) }; walk(ast)
  assert.equal(spins.length, 1); assert.deepEqual(spins[0].children.filter(n => n.tag).map(n => n.tag), ['Content'])
})

function http(options = {}) {
  const errors = [], calls = [], service = new AxiosService({ ...options, handleError: (...e) => errors.push(e) })
  service.getInstance().defaults.adapter = config => { const job = deferred(); calls.push({ ...job, config }); return job.promise }
  const respond = (job, data = { status: 200 }) => job.resolve({ data, status: 200, statusText: 'OK', headers: {}, config: job.config })
  return { service, calls, errors, respond }
}
function trackedSignal() {
  const source = new AbortController(); const listeners = new Set()
  const add = source.signal.addEventListener.bind(source.signal), remove = source.signal.removeEventListener.bind(source.signal)
  source.signal.addEventListener = (...args) => { if (args[0] === 'abort') listeners.add(args[1]); return add(...args) }
  source.signal.removeEventListener = (...args) => { if (args[0] === 'abort') listeners.delete(args[1]); return remove(...args) }
  return { source, count: () => listeners.size }
}
test('Axios preserves external cancellation with duplicate cancellation on/off and cleans listeners', async () => {
  for (const enabled of [false, true]) {
    const h = http({ cancelDuplicateRequests: enabled }), signal = trackedSignal()
    const p = h.service.post('/query', {}, { signal: signal.source.signal }); const rejection = assert.rejects(p, e => axios.isCancel(e)); await settle()
    signal.source.abort(); h.respond(h.calls[0]); await rejection
    assert.deepEqual(h.errors, []); assert.equal(signal.count(), 0); assert.equal(h.service.getPendingRequestsCount(), 0)
    if (!enabled) assert.equal(h.calls[0].config.signal, signal.source.signal)
  }
})
test('superseded Axios settlement cannot erase the new pending record; abortAll still cancels it', async () => {
  const h = http({ cancelDuplicateRequests: true }), signal = trackedSignal()
  const a = h.service.post('/same', {}, { signal: signal.source.signal }); const rejectedA = assert.rejects(a, e => axios.isCancel(e)); await settle()
  const b = h.service.post('/same', {}); const rejectedB = assert.rejects(b, e => axios.isCancel(e)); await settle()
  assert.equal(signal.count(), 0); h.respond(h.calls[0]); await rejectedA
  assert.equal(h.service.getPendingRequestsCount(), 1)
  h.service.abortAllRequests(); assert.equal(h.calls[1].config.signal.aborted, true); h.respond(h.calls[1]); await rejectedB
  assert.deepEqual(h.errors, [])
})
test('already-aborted signal makes no HTTP request; success removes its listener', async () => {
  const h = http({ cancelDuplicateRequests: true }), a = trackedSignal(); a.source.abort()
  await assert.rejects(h.service.post('/aborted', {}, { signal: a.source.signal }), e => axios.isCancel(e))
  assert.equal(h.calls.length, 0); assert.equal(a.count(), 0)
  const b = trackedSignal(), p = h.service.post('/success', {}, { signal: b.source.signal }); await settle()
  h.respond(h.calls[0]); await p; assert.equal(b.count(), 0); assert.equal(h.service.getPendingRequestsCount(), 0)
})
test('caller abort while awaiting token refresh prevents the retried HTTP request', async () => {
  const login = deferred(), h = http({ cancelDuplicateRequests: true, isCreateTokenRefresh: true, handleReconnect: () => login.promise })
  const signal = trackedSignal(), p = h.service.post('/retry', {}, { signal: signal.source.signal })
  const rejection = assert.rejects(p, e => axios.isCancel(e)); await settle()
  const first = h.calls[0]; first.reject(new axios.AxiosError('Unauthorized', 'ERR_BAD_REQUEST', first.config, null, { status: 401, data: {}, config: first.config }))
  await settle(); signal.source.abort(); login.resolve(true); await rejection
  assert.equal(h.calls.length, 1); assert.equal(h.service.getPendingRequestsCount(), 0); assert.equal(signal.count(), 0)
})
