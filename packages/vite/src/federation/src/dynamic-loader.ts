import type { RemotesConfig } from '../types'

/**
 * 动态加载远程模块的工具类
 * 提供更友好的API来加载远程组件而不需要预先配置remotes
 */
export class DynamicRemoteLoader {
  private static loadedRemotes = new Map<string, boolean>()

  /**
   * 动态加载远程组件
   * @param remoteName 远程应用名称
   * @param componentName 组件名称 (如 './Button')
   * @param remoteUrl 远程应用的URL
   * @param options 可选配置
   */
  static async loadComponent(
    remoteName: string,
    componentName: string,
    remoteUrl: string,
    options?: Partial<RemotesConfig>
  ) {
    try {
      // 运行时动态导入federation模块（避免构建时解析）
      const federationModule = await import(/* @vite-ignore */ 'virtual:__federation__')
      
      // 使用新的动态加载方法
      return await (federationModule as any).__federation_method_loadRemoteComponent(
        remoteName,
        componentName,
        remoteUrl,
        {
          format: 'esm',
          from: 'vite',
          externalType: 'url',
          shareScope: 'default',
          ...options
        } as RemotesConfig
      )
    } catch (error) {
      console.error(`Failed to load remote component ${remoteName}/${componentName}:`, error)
      throw error
    }
  }

  /**
   * 预加载远程应用（不加载具体组件）
   */
  static async preloadRemote(
    remoteName: string,
    remoteUrl: string,
    options?: Partial<RemotesConfig>
  ) {
    try {
      const federationModule = await import(/* @vite-ignore */ 'virtual:__federation__')
      
      await (federationModule as any).__federation_method_add_origin_setRemote(
        remoteName,
        remoteUrl,
        {
          format: 'esm',
          from: 'vite',
          externalType: 'url',
          shareScope: 'default',
          ...options
        } as RemotesConfig
      )
      
      this.loadedRemotes.set(remoteName, true)
    } catch (error) {
      console.error(`Failed to preload remote ${remoteName}:`, error)
      throw error
    }
  }

  /**
   * 检查远程应用是否已经预加载
   */
  static isRemoteLoaded(remoteName: string): boolean {
    return this.loadedRemotes.has(remoteName)
  }

  /**
   * 清除已加载的远程应用记录
   */
  static clearLoadedRemotes(): void {
    this.loadedRemotes.clear()
  }
}

// 导出便捷方法
export const loadRemoteComponent = DynamicRemoteLoader.loadComponent.bind(DynamicRemoteLoader)
export const preloadRemote = DynamicRemoteLoader.preloadRemote.bind(DynamicRemoteLoader)