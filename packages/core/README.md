# Core WebSocket

`getWebSocket(id, topic, parameter)` 在首个消费者订阅时声明主题，同一 Observable 的多个消费者共享服务端主题，最后一个消费者离开时取消。重新订阅会建立新的消费者周期；同一 id 的替换会结束旧流。

断线时保留当前有效声明，新连接先重放声明，再发送 `connectionEvents$` 的 `reconnected` 事件。已取消、complete 或 error 的主题不会复活，调用方可通过连接事件补拉断线期间的数据。

带 requestId / id 的主题错误进入对应 Observable 的 error 回调，保留原始 status / code；未匹配的错误沿用全局通知或 onError。鉴权/策略拒绝的关闭码 1008、4001、4003、4401、4403 结束消费者并停止自动重连，重新认证后可显式 connect。显式 disconnect 结束当前消费者并清空排队工作，避免旧身份消费恢复后的数据。

回归：`node --test tests/websocketLifecycle.test.cjs`。已有消费工作区可通过 `JETLINKS_TEST_DEPS=/absolute/path/package.json` 提供测试依赖；设置 `JETLINKS_WS_BUNDLE` 时同时验证构建后的 WebSocket 入口。
