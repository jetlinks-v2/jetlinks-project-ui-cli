---
"@jetlinks-web/components": patch
"@jetlinks-web/core": patch
---

Limit ProTable loading to its content region and cancel superseded queries while
protecting rows, totals, pagination and loading from stale responses. Preserve
caller AbortSignal when duplicate cancellation and token-refresh retries are used.
