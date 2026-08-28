### Markdown

Markdown 渲染组件，基于 `markdown-it` 并预装常用插件（锚点、任务列表、脚注、TOC、代码高亮、上下标、删除线等）。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| source | Markdown 源文本 | `string` | `''` |
| html | 是否渲染内联 HTML | `boolean` | `false` |
| breaks | 换行符是否转为 `<br>` | `boolean` | `false` |
| linkify | 自动识别链接 | `boolean` | `false` |
| typographer | 排版化（引号、破折号等） | `boolean` | `false` |
| quotes | 排版引号字符 | `string` | `'"“”‘’'` |
| xhtmlOut | 输出 XHTML 兼容标签 | `boolean` | `false` |
| langPrefix | 代码块语言类名前缀 | `string` | `'language-'` |
| anchor | 锚点插件配置（`markdown-it-anchor`） | `object` | `{}` |
| highlight | 代码高亮配置（`markdown-it-highlightjs`） | `object` | `{}` |
| tasklists | 任务列表配置（`markdown-it-task-lists`） | `object` | `{}` |
| toc | 目录插件配置（`markdown-it-toc-done-right`） | `object` | `{}` |
| emoji | 表情插件配置 | `object` | `{}` |
| plugins | 额外插件数组 `{ plugin, options }[]` | `array` | `[]` |

#### 用法

```vue
<template>
  <JMarkdown :source="markdownText" />
</template>

<script setup lang="ts">
const markdownText = '# 设备说明书\n\n- [x] 支持任务列表\n- [ ] 待办项'
</script>
```

#### Rules

- 预装插件：abbr / anchor / deflist / footnote / highlightjs / ins / mark / sub / sup / task-lists / toc。
- 额外插件通过 `plugins` 传入 `{ plugin, options }`，渲染时按顺序 `markdown.use`。
- 渲染输出包在高度 100% 的容器中；`source` 变化时自动重新渲染（`onUpdated`）。
