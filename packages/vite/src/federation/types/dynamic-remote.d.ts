// *****************************************************************************
// Copyright (C) 2022 Origin.js and others.
//
// This program and the accompanying materials are licensed under Mulan PSL v2.
// You can use this software according to the terms and conditions of the Mulan PSL v2.
// You may obtain a copy of Mulan PSL v2 at:
//          http://license.coscl.org.cn/MulanPSL2
// THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND,
// EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT,
// MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
// See the Mulan PSL v2 for more details.
//
// SPDX-License-Identifier: MulanPSL-2.0
// *****************************************************************************

/**
 * Dynamic remote loader for runtime
 * Provides utilities to dynamically load and manage remote components at runtime
 */

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
export declare class DynamicRemoteManager {
  private remoteCache: Map<string, any>;
  private loadingPromises: Map<string, Promise<any>>;

  /**
   * Add a remote dynamically at runtime
   * @param name Remote name
   * @param config Remote configuration
   */
  addRemote(name: string, config: RemoteOptions): Promise<void>;

  /**
   * Load a remote component dynamically
   * @param remoteName Remote name
   * @param componentName Component name to load from remote
   * @returns Promise of the loaded component
   */
  loadRemoteComponent(remoteName: string, componentName: string): Promise<any>;

  /**
   * Preload a remote component
   * @param remoteName Remote name
   * @param componentName Component name
   */
  preloadRemoteComponent(remoteName: string, componentName: string): Promise<void>;

  /**
   * Remove a remote component from cache
   * @param remoteName Remote name
   * @param componentName Component name
   */
  clearRemoteComponentCache(remoteName: string, componentName?: string): void;

  /**
   * Get all cached remote components
   */
  getCachedRemotes(): string[];

  /**
   * Check if a remote component is cached
   * @param remoteName Remote name
   * @param componentName Component name
   */
  isRemoteComponentCached(remoteName: string, componentName: string): boolean;
}

// Global instance
export declare const dynamicRemoteManager: DynamicRemoteManager;

/**
 * Convenience function to dynamically load remote component
 * @param config Remote component configuration
 */
export declare function loadDynamicRemoteComponent(config: RemoteComponentConfig): Promise<any>;

/**
 * Vue 3 composable for dynamic remote loading
 * @param remoteName Remote name
 * @param componentName Component name
 */
export declare function useDynamicRemote(remoteName: string, componentName: string): {
  component: any;
  loading: any;
  error: any;
  reload: () => Promise<void>;
};