import AdvancedSearch from './Advanced/index.vue';
import Search from './Search.vue';
import type { App } from 'vue';

Search.install = function (app: App) {
  app.component(Search.name, Search)
  app.component(AdvancedSearch.name, AdvancedSearch)
}

export { AdvancedSearch };
export default Search;
