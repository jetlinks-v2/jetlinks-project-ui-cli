# JetLinks-web-cli

## Shared request cancellation

The table lifecycle is documented in `packages/components/src/ProTable/ProTable.md`.
`packages/core/src/axios.ts` preserves caller cancellation when duplicate-request
cancellation is enabled, detaches signal listeners after settlement/abort and only
removes the settling request's own pending record. The original caller signal is
retained across token-refresh retries. With duplicate cancellation disabled, the
caller signal passes through unchanged.

Regression entry: `node --test tests/sharedRequestLifecycle.test.cjs`. A consuming
workspace can provide its installed dependencies via `JETLINKS_TEST_DEPS` (an
absolute package.json path), and `JETLINKS_TEST_TARGET=published` tests installed
bundles. `tests/buildRuntimePatches.cjs` generates local consumer patches from the
changed sources before upstream publication.

## 运行

```shell
pnpm run install

# 编译
pnpm run compile-es

# 启动 storybook
pnpm run storybook
```
