const assert = require('node:assert/strict')
const test = require('node:test')
const { readFileSync } = require('node:fs')
const { createRequire } = require('node:module')
const { resolve } = require('node:path')
const root = resolve(__dirname, '..'), deps = createRequire(process.env.JETLINKS_TEST_DEPS || resolve(root, 'package.json'))
const { transformSync } = deps('esbuild'), { parse, isSafeNumber } = deps('lossless-json')
const { lastValueFrom, firstValueFrom, toArray } = deps('rxjs')
const targets = [['source', resolve(root, 'packages/core/src/fetch.ts')]]
if (process.env.JETLINKS_CORE_BUNDLE) targets.push(['bundle', process.env.JETLINKS_CORE_BUNDLE])
function load(file) {
  const module = { exports: {} }
  new Function('require', 'module', 'exports', 'window', transformSync(readFileSync(file, 'utf8'), { loader: 'ts', format: 'cjs' }).code)(id => {
    if (id === '@jetlinks-web/constants') return { TOKEN_KEY: 'token', BASE_API: '/', LOCAL_BASE_API: 'base' }
    if (id === '@jetlinks-web/utils') return { getToken: () => '', randomString: () => 'test' }
    if (id === 'ant-design-vue') return { notification: { error() {} } }
    return deps(id)
  }, module, module.exports, { addEventListener() {}, navigator: { onLine: true } })
  return module.exports.createNdJson
}
const precise = text => parse(text, undefined, value => isSafeNumber(value) ? Number(value) : value)
for (const [name, file] of targets) {
  test(`${name}: original lines reach the parser before interceptors, including split UTF8 and a final line`, async t => {
    const previous = globalThis.fetch; t.after(() => { globalThis.fetch = previous })
    const bytes = new TextEncoder().encode('data: {"value":18446744073709551615,"text":"温度"}\r\n{"value":0.1234567890123456789,"zero":0,"enabled":false}')
    globalThis.fetch = async () => new Response(new ReadableStream({ start(controller) { for (const byte of bytes) controller.enqueue(Uint8Array.of(byte)); controller.close() } }))
    const createNdJson = load(file), parsed = [], client = createNdJson({ baseURL: '/api', deserializer: precise })
    client.interceptors.response.use(value => { parsed.push(value.value); return value })
    const rows = await lastValueFrom(client.post('/read', {}).pipe(toArray()))
    assert.deepEqual(parsed, ['18446744073709551615', '0.1234567890123456789'])
    assert.equal(rows[0].text, '温度'); assert.equal(rows[1].zero, 0); assert.equal(rows[1].enabled, false)
    const defaults = await lastValueFrom(createNdJson({ baseURL: '/api' }).post('/read', {}).pipe(toArray()))
    assert.equal(typeof defaults[0].value, 'number')
  })
  test(`${name}: cancellation closes the shared reader and parser failures stay visible`, async t => {
    const previous = globalThis.fetch; t.after(() => { globalThis.fetch = previous })
    let cancelled = 0, signal, parsed = 0, response
    globalThis.fetch = async (url, config) => { signal = config.signal; response = new Response(new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('{"value":18446744073709551615}\n{"value":2}\n')) }, cancel() { cancelled++ } })); return response }
    const createNdJson = load(file)
    assert.equal((await firstValueFrom(createNdJson({ baseURL: '/api', deserializer: text => { parsed++; return precise(text) } }).post('/read', {}))).value, '18446744073709551615')
    assert.equal(signal.aborted, true); assert.equal(cancelled, 1)
    await new Promise(resolve => setImmediate(resolve)); assert.equal(parsed, 1, 'buffered rows stop parsing as soon as their consumer leaves')
    assert.equal(response.body.locked, false)
    await assert.rejects(lastValueFrom(createNdJson({ baseURL: '/api', deserializer: () => { throw new Error('Parse failure') } }).post('/read', {})), /Parse failure/)
    assert.equal(cancelled, 2)
  })
  test(`${name}: response validation can be cancelled before a reader is acquired`, async t => {
    const previous = globalThis.fetch; t.after(() => { globalThis.fetch = previous })
    let release, readers = 0
    globalThis.fetch = async () => ({ status: 200, body: { getReader() { readers++; throw new Error('late reader') } } })
    const createNdJson = load(file), sub = createNdJson({ baseURL: '/api', validateResponse: () => new Promise(resolve => { release = resolve }) }).get('/read').subscribe({ error: assert.fail })
    while (!release) await new Promise(resolve => setImmediate(resolve))
    sub.unsubscribe(); release(); await new Promise(resolve => setImmediate(resolve)); assert.equal(readers, 0)
  })
}
