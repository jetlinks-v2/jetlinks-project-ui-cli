const assert = require('node:assert/strict')
const test = require('node:test')
const { readFileSync } = require('node:fs')
const { createRequire } = require('node:module')
const { resolve } = require('node:path')
const root = resolve(__dirname, '..')
const deps = createRequire(process.env.JETLINKS_TEST_DEPS || resolve(root, 'package.json'))
const { transformSync } = deps('esbuild')

function harness(t, filename) {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'], now: 1700000000000 })
  const original = Object.getOwnPropertyDescriptors(globalThis)
  const events = new Map(), sockets = [], notices = [], network = { onLine: true }
  class Socket {
    readyState = 0
    sent = []
    constructor(url) { this.url = url; sockets.push(this) }
    send(value) { this.sent.push(JSON.parse(value)) }
    open() { this.readyState = 1; this.onopen?.({}) }
    receive(value) { this.onmessage?.({ data: JSON.stringify(value) }) }
    close(code = 1000, reason = '') { this.readyState = 3; this.onclose?.({ code, reason, wasClean: code === 1000 }) }
  }
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { navigator: network,
    setTimeout: (...args) => setTimeout(...args), clearTimeout: id => clearTimeout(id),
    addEventListener(name, callback) { if (!events.has(name)) events.set(name, []); events.get(name).push(callback) },
  } })
  Object.defineProperty(globalThis, 'WebSocket', { configurable: true, value: Socket })
  const module = { exports: {} }
  new Function('require', 'module', 'exports', transformSync(readFileSync(filename, 'utf8'), { loader: filename.endsWith('.ts') ? 'ts' : 'js', format: 'cjs' }).code)(id => id === 'ant-design-vue' ? { notification: { error: value => notices.push(value) } } : deps(id), module, module.exports)
  const client = new module.exports.WebSocketClient()
  t.after(() => {
    client.disconnect(); t.mock.timers.reset()
    for (const name of ['window', 'WebSocket']) if (original[name]) Object.defineProperty(globalThis, name, original[name]); else delete globalThis[name]
  })
  client.initWebSocket('ws://localhost/monitor')
  const online = value => { network.onLine = value; events.get(value ? 'online' : 'offline')?.forEach(callback => callback()) }
  const topics = socket => socket.sent.filter(message => message.type === 'sub')
  return { client, sockets, notices, online, topics }
}

const targets = [['source', resolve(root, 'packages/core/src/websocket.ts')]]
if (process.env.JETLINKS_WS_BUNDLE) targets.push(['bundle', process.env.JETLINKS_WS_BUNDLE])
for (const [name, filename] of targets) {
  test(`${name}: lazy subscription shares one topic until the last consumer leaves`, t => {
    const h = harness(t, filename), values = [], stream = h.client.getWebSocket('a', '/a', { node: 1 })
    h.client.connect(); h.sockets[0].open(); assert.equal(h.topics(h.sockets[0]).length, 0)
    const first = stream.subscribe(value => values.push(['first', value.payload])), second = stream.subscribe(value => values.push(['second', value.payload]))
    assert.equal(h.topics(h.sockets[0]).length, 1)
    h.sockets[0].receive({ type: 'result', requestId: 'a', payload: 1 })
    assert.deepEqual(values, [['first', 1], ['second', 1]])
    first.unsubscribe(); assert.equal(h.sockets[0].sent.filter(m => m.type === 'unsub').length, 0)
    h.sockets[0].receive({ type: 'result', requestId: 'a', payload: 2 }); assert.deepEqual(values.at(-1), ['second', 2])
    second.unsubscribe(); assert.equal(h.sockets[0].sent.filter(m => m.type === 'unsub').length, 1)
    stream.subscribe(() => {}); assert.equal(h.topics(h.sockets[0]).length, 2, 'the observable can start a fresh ownership period')
  })

  test(`${name}: live topics recover after transport loss without user action`, t => {
    const h = harness(t, filename), values = [], events = []
    h.client.connectionEvents$.subscribe(event => events.push(event.type))
    h.client.getWebSocket('a', '/resources', { interval: '2s' }).subscribe(value => values.push(value.payload))
    const cancelled = h.client.getWebSocket('b', '/cancelled').subscribe(() => {})
    h.client.connect(); h.sockets[0].open()
    h.sockets[0].receive({ type: 'result', requestId: 'a', payload: 1 })
    h.online(false); cancelled.unsubscribe(); h.online(true); t.mock.timers.tick(0)
    h.sockets[1].open(); h.sockets[1].receive({ type: 'result', requestId: 'a', payload: 2 })
    assert.deepEqual(values, [1, 2]); assert.deepEqual(events, ['connected', 'disconnected', 'reconnected'])
    assert.deepEqual(h.topics(h.sockets[1]), [{ type: 'sub', id: 'a', topic: '/resources', parameter: { interval: '2s' } }])
  })

  test(`${name}: offline changes replay current owners before work triggered by reconnection`, t => {
    const h = harness(t, filename), sequence = [], failed = []
    h.client.connectionEvents$.subscribe(event => { sequence.push(event.type); if (event.type === 'reconnected') h.client.send({ type: 'resync' }) })
    const a = h.client.getWebSocket('a', '/a').subscribe(() => {})
    h.client.getWebSocket('completed', '/done').subscribe(() => {})
    h.client.getWebSocket('failed', '/failed').subscribe({ error: error => failed.push(error) })
    h.client.connect(); h.sockets[0].open()
    h.sockets[0].receive({ type: 'complete', requestId: 'completed' })
    h.sockets[0].receive({ type: 'error', requestId: 'failed', status: 503 })
    h.online(false); a.unsubscribe(); h.client.getWebSocket('new', '/new', { node: 2 }).subscribe(() => {})
    h.online(true); t.mock.timers.tick(0); h.sockets[1].open()
    assert.deepEqual(h.topics(h.sockets[1]), [{ type: 'sub', id: 'new', topic: '/new', parameter: { node: 2 } }])
    assert.equal(sequence.at(-1), 'reconnected'); assert.equal(failed.length, 1)
    assert.deepEqual(h.sockets[1].sent.filter(m => m.type !== 'ping').map(m => m.type), ['sub', 'resync'])
  })

  test(`${name}: routed errors retire their owner before a synchronous replacement subscribes`, t => {
    const h = harness(t, filename), errors = [], values = []
    h.client.getWebSocket('a', '/a').subscribe({ error(error) { errors.push(error); h.client.getWebSocket('a', '/replacement').subscribe(value => values.push(value.payload)) } })
    h.client.connect(); h.sockets[0].open()
    h.sockets[0].receive({ type: 'error', requestId: 'a', status: 403, message: 'Denied' })
    h.sockets[0].receive({ type: 'result', requestId: 'a', payload: 7 })
    assert.equal(errors[0].status, 403); assert.deepEqual(values, [7]); assert.equal(h.notices.length, 0)
    h.sockets[0].receive({ type: 'error', message: 'Connection failure' }); assert.equal(h.notices.length, 1, 'unmatched errors retain global reporting')
  })

  test(`${name}: explicit disconnect completes old consumers and removes queued work`, t => {
    const h = harness(t, filename), completed = [], values = []
    const old = h.client.getWebSocket('a', '/old').subscribe({ next: value => values.push(['old', value.payload]), complete: () => completed.push('old') })
    h.client.send({ type: 'custom', id: 'old-work' }); h.client.disconnect()
    h.client.getWebSocket('a', '/new').subscribe(value => values.push(['new', value.payload]))
    h.client.connect(); h.sockets[0].open(); old.unsubscribe()
    assert.deepEqual(completed, ['old']); assert.deepEqual(h.sockets[0].sent.filter(m => m.type !== 'ping'), [{ type: 'sub', id: 'a', topic: '/new', parameter: {} }])
    h.sockets[0].receive({ type: 'result', requestId: 'a', payload: 8 }); assert.deepEqual(values, [['new', 8]])
  })

  test(`${name}: replacing an id completes the old stream without canceling its replacement`, t => {
    const h = harness(t, filename), completed = []
    const old = h.client.getWebSocket('a', '/old').subscribe({ complete: () => completed.push('old') })
    h.client.connect(); h.sockets[0].open()
    h.client.getWebSocket('a', '/new').subscribe(() => {}); old.unsubscribe()
    assert.deepEqual(completed, ['old']); assert.deepEqual(h.sockets[0].sent.filter(m => m.type !== 'ping').map(m => [m.type, m.topic]), [['sub', '/old'], ['unsub', undefined], ['sub', '/new']])
  })

  test(`${name}: authorization rejection stops retry and reports a permanent subscription error`, t => {
    const h = harness(t, filename), errors = []
    h.client.getWebSocket('a', '/a').subscribe({ error: error => errors.push(error) })
    h.client.connect(); h.sockets[0].open(); h.sockets[0].close(4401, 'Expired')
    t.mock.timers.tick(120000)
    assert.equal(h.sockets.length, 1); assert.equal(errors[0].status, 401)
    h.client.getWebSocket('b', '/b').subscribe(() => {}); h.client.connect(); h.sockets[1].open()
    assert.deepEqual(h.topics(h.sockets[1]).map(m => m.id), ['b'], 'explicit reconnect starts a fresh authenticated ownership period')
  })

  test(`${name}: connection timeout retires a connecting socket and preserves bounded retry`, t => {
    const h = harness(t, filename)
    h.client.getWebSocket('a', '/a').subscribe(() => {}); h.client.connect()
    t.mock.timers.tick(10000); t.mock.timers.tick(1000)
    assert.equal(h.sockets.length, 2); assert.equal(h.sockets[0].readyState, 3)
    h.sockets[0].open(); assert.equal(h.topics(h.sockets[0]).length, 0)
    h.sockets[1].open(); assert.deepEqual(h.topics(h.sockets[1]).map(m => m.id), ['a'])
  })
}
