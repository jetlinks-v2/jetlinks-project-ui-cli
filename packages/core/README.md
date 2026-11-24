# Core WebSocket

`getWebSocket(id, topic, parameter)` 在首个消费者订阅时声明主题，同一 Observable 的多个消费者共享服务端主题，最后一个消费者离开时取消。重新订阅会建立新的消费者周期；同一 id 的替换会结束旧流。

断线时保留当前有效声明，新连接先重放声明，再发送 `connectionEvents$` 的 `reconnected` 事件。已取消、complete 或 error 的主题不会复活，调用方可通过连接事件补拉断线期间的数据。

带 requestId / id 的主题错误进入对应 Observable 的 error 回调，保留原始 status / code；未匹配的错误沿用全局通知或 onError。鉴权/策略拒绝的关闭码 1008、4001、4003、4401、4403 结束消费者并停止自动重连，重新认证后可显式 connect。显式 disconnect 结束当前消费者并清空排队工作，避免旧身份消费恢复后的数据。

回归：`node --test tests/websocketLifecycle.test.cjs`。已有消费工作区可通过 `JETLINKS_TEST_DEPS=/absolute/path/package.json` 提供测试依赖；设置 `JETLINKS_WS_BUNDLE` 时同时验证构建后的 WebSocket 入口。

## 原始文本解析

`getWebSocket(id, topic, parameter, { deserializer })` 为每个结果订阅选择原始 JSON 文本解析器；`createNdJson({ deserializer })` 在响应拦截器前解析原始行。默认仍使用 `JSON.parse`，共享库不依赖业务数字库或订阅 ID 规则。WebSocket 解析器须保留信封的 `type` 和 `requestId`；解析选项随订阅重放和微前端委托保留，不发送到服务端。单个结果解析失败只结束对应订阅，不回退到默认解析或断开兄弟订阅。

NDJSON 的 `validateResponse(response)` 在 HTTP 状态处理及获取 reader 之前执行，支持异步校验；取消后不会继续获取 reader。调用方可在此保留响应格式和服务端错误提示的校验，reader、取消和错误传播仍由共享实现负责。
