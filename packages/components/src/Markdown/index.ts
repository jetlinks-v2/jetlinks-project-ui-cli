import Markdown from './Markdown'

import type { App } from 'vue';

Markdown.install = function (app: App) {
  app.component(Markdown.name, Markdown)
}
export default Markdown;
