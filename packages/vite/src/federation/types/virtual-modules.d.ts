declare module "virtual:__federation__" {
  /**
   * Get remote component dynamically
   * @param name Remote name
   * @param url Remote URL or config
   */
  function __federation_method_getRemote(name: string, url: string): Promise<any>
  
  /**
   * Set remote configuration
   * @param name Remote name
   * @param config Remote configuration object
   */
  function __federation_method_setRemote(name: string, config: any): void
  
  /**
   * Add remote with configuration dynamically
   * @param name Remote name
   * @param url Remote URL
   * @param options Remote configuration options
   */
  function __federation_method_add_origin_setRemote(name: string, url: string, options?: {
    external?: string | string[];
    shareScope?: string;
    format?: 'esm' | 'systemjs' | 'var';
    from?: 'vite' | 'webpack';
    externalType?: 'url' | 'promise';
  }): void
  
  /**
   * Unwrap default export from module
   * @param info Module object
   */
  function __federation_method_unwrapDefault(info: any): any
  
  /**
   * Wrap module with default export if needed
   * @param module Module object
   * @param need Whether to wrap with default
   */
  function __federation_method_wrapDefault(module: any, need: boolean): any
  
  /**
   * Ensure remote is loaded and initialized
   * @param remoteName Remote name
   */
  function __federation_method_ensure(remoteName: string): Promise<any>
}
