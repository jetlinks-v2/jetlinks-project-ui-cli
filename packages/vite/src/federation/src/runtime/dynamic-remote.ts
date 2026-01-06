
export interface RemoteOptions {
  url: string | (() => string | Promise<string>);
  format?: 'esm' | 'systemjs' | 'var';
  from?: 'vite' | 'webpack';
  shareScope?: string;
  external?: string | string[];
  externalType?: 'url' | 'promise';
}

export interface RemoteComponentConfig {
  name: string;
  component: string;
  url: string | (() => string | Promise<string>);
  options?: RemoteOptions;
}

/**
 * Dynamic remote component manager
 */
export class DynamicRemoteManager {
  private remoteCache = new Map<string, any>();
  private loadingPromises = new Map<string, Promise<any>>();

  /**
   * Add a remote dynamically at runtime
   * @param name Remote name
   * @param config Remote configuration
   */
  async addRemote(name: string, config: RemoteOptions): Promise<void> {
    try {
      // 直接导入虚拟模块，避免使用Function构造器
      const federationModule = await import('virtual:__federation__');
      const { __federation_method_add_origin_setRemote } = federationModule;

      // @ts-ignore
      await __federation_method_add_origin_setRemote(name, config.url, {
        format: config.format || 'esm',
        from: config.from || 'vite',
        shareScope: config.shareScope || 'default',
        external: config.external,
        externalType: config.externalType || 'url'
      });
    } catch (error) {
      throw new Error(`Failed to add dynamic remote '${name}': ${error.message}. Make sure to enable dynamic remotes in your plugin configuration with 'enableDynamicRemotes: true'.`);
    }
  }

  /**
   * Load a remote component dynamically
   * @param remoteName Remote name
   * @param componentName Component name to load from remote
   * @returns Promise of the loaded component
   */
  async loadRemoteComponent(remoteName: string, componentName: string): Promise<any> {
    const cacheKey = `${remoteName}/${componentName}`;

    // Check cache first
    if (this.remoteCache.has(cacheKey)) {
      return this.remoteCache.get(cacheKey);
    }

    // Check if already loading
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey);
    }

    // Start loading
    const loadingPromise = this.doLoadRemoteComponent(remoteName, componentName);
    this.loadingPromises.set(cacheKey, loadingPromise);

    try {
      const component = await loadingPromise;
      this.remoteCache.set(cacheKey, component);
      return component;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  private async doLoadRemoteComponent(remoteName: string, componentName: string): Promise<any> {
    try {
      // 直接导入虚拟模块，避免使用Function构造器
      const federationModule = await import('virtual:__federation__');
      const { __federation_method_getRemote } = federationModule;
      return __federation_method_getRemote(remoteName, componentName);
    } catch (error) {
      throw new Error(`Failed to load remote component '${remoteName}/${componentName}': ${error.message}. Make sure to enable dynamic remotes in your plugin configuration with 'enableDynamicRemotes: true'.`);
    }
  }

  /**
   * Preload a remote component
   * @param remoteName Remote name
   * @param componentName Component name
   */
  async preloadRemoteComponent(remoteName: string, componentName: string): Promise<void> {
    try {
      await this.loadRemoteComponent(remoteName, componentName);
    } catch (error) {
      console.warn(`Failed to preload remote component ${remoteName}/${componentName}:`, error);
    }
  }

  /**
   * Remove a remote component from cache
   * @param remoteName Remote name
   * @param componentName Component name
   */
  clearRemoteComponentCache(remoteName: string, componentName?: string): void {
    if (componentName) {
      const cacheKey = `${remoteName}/${componentName}`;
      this.remoteCache.delete(cacheKey);
    } else {
      // Clear all components for this remote
      for (const key of this.remoteCache.keys()) {
        if (key.startsWith(`${remoteName}/`)) {
          this.remoteCache.delete(key);
        }
      }
    }
  }

  /**
   * Get all cached remote components
   */
  getCachedRemotes(): string[] {
    return Array.from(this.remoteCache.keys());
  }

  /**
   * Check if a remote component is cached
   * @param remoteName Remote name
   * @param componentName Component name
   */
  isRemoteComponentCached(remoteName: string, componentName: string): boolean {
    const cacheKey = `${remoteName}/${componentName}`;
    return this.remoteCache.has(cacheKey);
  }
}

// Global instance
export const dynamicRemoteManager = new DynamicRemoteManager();

/**
 * Convenience function to dynamically load remote component
 * @param config Remote component configuration
 */
export async function loadDynamicRemoteComponent(config: RemoteComponentConfig): Promise<any> {
  // Add remote if not already added
  if (config.options) {
    await dynamicRemoteManager.addRemote(config.name, {
      url: config.url,
      ...config.options
    });
  }

  // Load the component
  return dynamicRemoteManager.loadRemoteComponent(config.name, config.component);
}

/**
 * Vue 3 composable for dynamic remote loading
 * @param remoteName Remote name
 * @param componentName Component name
 */
export function useDynamicRemote(remoteName: string, componentName: string) {
  const loading = ref(true);
  // @ts-ignore
  const error = ref<Error | null>(null);
  // @ts-ignore
  const component = ref<any>(null);

  const loadComponent = async () => {
    try {
      loading.value = true;
      error.value = null;
      component.value = await dynamicRemoteManager.loadRemoteComponent(remoteName, componentName);
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to load remote component');
      console.error(`Failed to load remote component ${remoteName}/${componentName}:`, err);
    } finally {
      loading.value = false;
    }
  };

  // Auto-load on mount
  onMounted(() => {
    loadComponent();
  });

  return {
    component: readonly(component),
    loading: readonly(loading),
    error: readonly(error),
    reload: loadComponent
  };
}

// Helper function to check if we're in a Vue environment
function isVueAvailable(): boolean {
  try {
    return typeof ref !== 'undefined' && typeof onMounted !== 'undefined';
  } catch {
    return false;
  }
}

// Import Vue composables only if Vue is available
let ref: any, onMounted: any, readonly: any;
if (isVueAvailable()) {
  try {
    // 使用动态导入而不是 require
    import('vue').then(vue => {
      ref = vue.ref;
      onMounted = vue.onMounted;
      readonly = vue.readonly;
    }).catch(() => {
      // Vue not available, composable won't work
      console.warn('Vue not available for dynamic import');
    });
  } catch {
    // Vue not available, composable won't work
  }
}
