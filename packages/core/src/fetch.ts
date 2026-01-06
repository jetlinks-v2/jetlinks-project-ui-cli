import { getToken } from "@jetlinks-web/utils";
import { BASE_API, TOKEN_KEY } from "@jetlinks-web/constants";
import { isFunction, isObject } from "lodash-es";
import { Observable, Subscriber } from 'rxjs';

/**
 * NdJson 配置选项
 */
export interface NdJsonOptions {
  /** 成功状态码 */
  code?: number;
  /** 状态码字段名 */
  codeKey?: string;
  /** 不需要 token 的 URL 列表 */
  filter_url?: string[];
  /** token 过期回调 */
  tokenExpiration?: () => void;
  /** 自定义请求配置 */
  requestOptions?: (config: RequestInit) => Record<string, unknown>;
  /** 自定义响应处理 */
  handleResponse?: <T>(response: T) => T;
  /** 基础 API 地址，默认使用 BASE_API 常量 */
  baseURL?: string;
}

interface RequestContext {
  controller: AbortController;
  isActive: boolean;
}

type HttpMethod = 'GET' | 'POST';

export class NdJson {
  private options: NdJsonOptions = {
    code: 200,
    codeKey: 'status'
  };

  private activeRequests = new Set<RequestContext>();

  constructor(options?: NdJsonOptions) {
    if (options) {
      this.options = { ...this.options, ...options };
    }
  }

  /**
   * 初始化/更新配置
   */
  create(options: NdJsonOptions): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * 获取完整 URL
   */
  private getUrl(url: string): string {
    const baseURL = this.options.baseURL ?? BASE_API;
    return baseURL + url;
  }

  /**
   * 处理 NDJSON 流的核心逻辑
   */
  private processStream<T>(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    observer: Subscriber<T>,
    context: RequestContext
  ): void {
    const decoder = new TextDecoder();
    let buffer = '';

    const read = (): void => {
      if (!context.isActive) {
        reader.cancel();
        observer.complete();
        return;
      }

      reader.read()
        .then(({ done, value }) => {
          if (done) {
            this.flushBuffer(buffer, observer);
            observer.complete();
            return;
          }

          buffer += decoder.decode(value, { stream: true });
          buffer = this.parseLines(buffer, observer);
          read();
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            observer.error(err);
          }
        });
    };

    read();
  }

  /**
   * 解析缓冲区中的完整行
   */
  private parseLines<T>(buffer: string, observer: Subscriber<T>): string {
    const lines = buffer.split('\n');

    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (line.length > 0) {
        try {
          const data = line.startsWith('data:') ? line.slice(5) : line;
          observer.next(JSON.parse(data));
        } catch (e) {
          observer.error(e);
          return '';
        }
      }
    }

    return lines[lines.length - 1];
  }

  /**
   * 刷新剩余缓冲区
   */
  private flushBuffer<T>(buffer: string, observer: Subscriber<T>): void {
    const trimmed = buffer.trim();
    if (trimmed.length > 0) {
      try {
        observer.next(JSON.parse(trimmed));
      } catch (e) {
        observer.error(e);
      }
    }
  }

  /**
   * 创建请求的 Observable
   */
  private request<T>(
    method: HttpMethod,
    url: string,
    data?: BodyInit | Record<string, unknown>,
    extra: RequestInit = {}
  ): Observable<T> {
    const fullUrl = this.getUrl(url);

    return new Observable<T>(observer => {
      const controller = new AbortController();
      const context: RequestContext = {
        controller,
        isActive: true
      };

      this.activeRequests.add(context);

      const requestInit: RequestInit = {
        method,
        signal: controller.signal,
        keepalive: true,
        ...extra,
        ...this.handleRequest(fullUrl, method)
      };

      // POST 请求添加 body
      if (method === 'POST' && data !== undefined) {
        requestInit.body = isObject(data) ? JSON.stringify(data) : data as BodyInit;
      }

      fetch(fullUrl, requestInit)
        .then(resp => {
          const reader = resp.body?.getReader();

          if (!reader) {
            observer.error(new Error('No readable stream available'));
            return;
          }

          context.isActive = true;
          this.processStream(reader, observer, context);
        })
        .catch(e => {
          observer.error(e);
        });

      // 返回清理函数
      return () => {
        context.isActive = false;
        controller.abort();
        this.activeRequests.delete(context);
      };
    });
  }

  get<T = unknown>(url: string, _data = '{}', extra: RequestInit = {}): Observable<T> {
    return this.request<T>('GET', url, undefined, extra);
  }

  post<T = unknown>(url: string, data: BodyInit | Record<string, unknown> = {}, extra: RequestInit = {}): Observable<T> {
    return this.request<T>('POST', url, data, extra);
  }

  private handleRequest(url: string, method: HttpMethod): RequestInit {
    const headers: Record<string, string> = {};

    // 只有 POST 请求才设置 Content-Type
    if (method === 'POST') {
      headers['Content-Type'] = 'application/x-ndjson';
    }

    const config: RequestInit = { headers };
    const token = getToken();

    if (!token && this.options.filter_url?.some(_url => url.includes(_url))) {
      this.options.tokenExpiration?.();
      return config;
    }

    if (token) {
      headers[TOKEN_KEY] = token;
    }

    if (this.options.requestOptions && isFunction(this.options.requestOptions)) {
      const extraOptions = this.options.requestOptions(config);
      if (extraOptions && isObject(extraOptions)) {
        Object.assign(config, extraOptions);
      }
    }

    return config;
  }

  handleResponse<T>(response: T): T {
    if (this.options.handleResponse && isFunction(this.options.handleResponse)) {
      return this.options.handleResponse(response);
    }
    return response;
  }

  /**
   * 取消所有活跃的请求
   */
  cancelAll(): void {
    this.activeRequests.forEach(context => {
      context.isActive = false;
      context.controller.abort();
    });
    this.activeRequests.clear();
  }
}

// 默认实例
const defaultNdJson = new NdJson();

/**
 * 创建新的 NdJson 实例
 */
export const createNdJson = (options?: NdJsonOptions): NdJson => {
  return new NdJson(options);
};

/**
 * 初始化默认实例
 */
export const createNdJsonService = (options: NdJsonOptions): void => {
  defaultNdJson.create(options);
};

// 导出默认实例 (保持向后兼容)
export const ndJson = defaultNdJson;
