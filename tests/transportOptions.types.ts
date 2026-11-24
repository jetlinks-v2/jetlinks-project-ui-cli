import { createNdJson, WebSocketClient, type WebSocketSubscriptionOptions, type NdJsonOptions } from '@jetlinks-web/core'

const parse = (text: string): unknown => JSON.parse(text)
const options: WebSocketSubscriptionOptions = { deserializer: parse }
const client = new WebSocketClient()
client.getWebSocket('native', '/data')
client.getWebSocket('precise', '/data', { interval: 1000 }, options)
const ndjson: NdJsonOptions = {
  deserializer: parse,
  async validateResponse(response) { if (!response.ok) throw new Error(String(response.status)) },
}
createNdJson(ndjson).post('/read', {}, { signal: new AbortController().signal })
// @ts-expect-error The subscription parser receives original text, not an already parsed event.
client.getWebSocket('invalid', '/data', {}, { deserializer: (event: MessageEvent) => event.data })
