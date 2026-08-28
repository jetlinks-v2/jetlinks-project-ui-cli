### LocaleReceiver

国际化接收 Hook（目录名 `LocaleReciver`），在组合式 API 中读取 `JLocaleProvider` 注入的语言包片段，供组件消费多语言文案。

#### 签名

```ts
useLocaleReceiver<T extends string>(
  componentName: T,
  defaultLocale?: Record<string, any>[T] | Function | ComputedRef,
  propsLocale?: Ref<Record<string, any>[T]>,
): [ComputedRef<Record<string, any>[T]>]
```

| 参数 | 说明 |
| --- | --- |
| componentName | 语言包分组名（如 `'DragModal'`、`'Empty'`），对应 `locale/zh-CN` 中的键 |
| defaultLocale | 兜底文案，可传对象 / 函数 / 响应式值 |
| propsLocale | 组件 props 上的语言覆盖 |

#### 返回值

| 返回值 | 说明 |
| --- | --- |
| `[componentLocale]` | 响应式文案对象：`defaultLocale ⊕ 上下文中 componentName 分组 ⊕ propsLocale`（后者覆盖前者） |

#### 用法

```vue
<script setup lang="ts">
import { useLocaleReceiver } from '../LocaleReciver'

const [contextLocale] = useLocaleReceiver('DragModal')
// contextLocale.value.cancel / contextLocale.value.confirm
</script>
```

#### Rules

- 未注入 `JLocaleProvider` 时回退到内置 `zh-CN` 语言包，组件可安全单独使用。
- 三个来源合并顺序：`defaultLocale` → 上下文语言包 → `propsLocale`，越靠后优先级越高。
- 该文件是 hook 而非组件，不参与 `app.component` 注册。
