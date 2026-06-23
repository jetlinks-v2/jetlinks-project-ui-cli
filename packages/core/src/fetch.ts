import { getToken } from "@jetlinks-web/utils";
import { BASE_API, LOCAL_BASE_API, TOKEN_KEY } from "@jetlinks-web/constants";
import { Observable, Subscriber } from "rxjs";

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
  /** 语言字段名 */
  langKey?: string;
}

interface RequestContext {
  controller: AbortController;
  isActive: boolean;
  reader?: ReadableStreamDefaultReader<Uint8Array>;
}

type HttpMethod = "GET" | "POST";
type RequestData = BodyInit | Record<string, unknown>;

export interface NdJsonRequestConfig {
  url: string;
  method: HttpMethod;
  data?: RequestData;
  config: RequestInit;
}

export type NdJsonInterceptorFulfilled<T> = (value: T) => T | Promise<T>;
export type NdJsonInterceptorRejected = (error: unknown) => unknown | Promise<unknown>;

interface NdJsonInterceptorHandler<T> {
  fulfilled?: NdJsonInterceptorFulfilled<T>;
  rejected?: NdJsonInterceptorRejected;
}

const NDJSON_CONTENT_TYPE = "application/x-ndjson";

const isObjectLike = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (!isObjectLike(value)) {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

const isFunction = (value: unknown): value is (...args: unknown[]) => unknown =>
  typeof value === "function";

const isAbortMessage = (message: unknown): boolean =>
  typeof message === "string" && message.toLowerCase().includes("aborted");

export class NdJsonInterceptorManager<T> {
  private handlers: Array<NdJsonInterceptorHandler<T> | null> = [];

  use(
    fulfilled?: NdJsonInterceptorFulfilled<T>,
    rejected?: NdJsonInterceptorRejected
  ): number {
    this.handlers.push({ fulfilled, rejected });
    return this.handlers.length - 1;
  }

  eject(id: number): void {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  clear(): void {
    this.handlers = [];
  }

  run(value: T): Promise<T> {
    let chain: Promise<T> = Promise.resolve(value) as Promise<T>;

    for (const handler of this.handlers) {
      if (!handler) {
        continue;
      }

      chain = chain.then(
        handler.fulfilled,
        handler.rejected as ((error: unknown) => T | Promise<T>) | undefined
      );
    }

    return chain;
  }
}

export class NdJson {
  private options: NdJsonOptions = {
    code: 200,
    codeKey: "status",
    langKey: "lang"
  };

  interceptors = {
    request: new NdJsonInterceptorManager<NdJsonRequestConfig>(),
    response: new NdJsonInterceptorManager<unknown>()
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
    const baseURL = this.options.baseURL ?? this.getLocalBaseApi() ?? BASE_API;
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
    let buffer = "";

    const read = async (): Promise<void> => {
      try {
        while (context.isActive) {
          const { done, value } = await reader.read();
          if (done) {
            const finalText = decoder.decode();
            if (finalText) {
              buffer += finalText;
            }
            await this.flushBuffer(buffer, observer);
            if (!observer.closed) {
              observer.complete();
            }
            return;
          }

          buffer += decoder.decode(value, { stream: true });
          buffer = await this.parseLines(buffer, observer);
          if (observer.closed) {
            return;
          }
        }
      } catch (error) {
        if (!this.shouldIgnoreRequestError(error, context) && !observer.closed) {
          observer.error(error);
        }
      }
    };

    void read();
  }

  /**
   * 解析缓冲区中的完整行
   */
  private async parseLines<T>(buffer: string, observer: Subscriber<T>): Promise<string> {
    let start = 0;
    let lineEnd = buffer.indexOf("\n");

    while (lineEnd !== -1) {
      const line = buffer.slice(start, lineEnd).trim();
      if (line.length > 0 && !await this.emitLine(line, observer)) {
        return "";
      }

      start = lineEnd + 1;
      lineEnd = buffer.indexOf("\n", start);
    }

    return buffer.slice(start);
  }

  /**
   * 刷新剩余缓冲区
   */
  private async flushBuffer<T>(buffer: string, observer: Subscriber<T>): Promise<void> {
    const trimmed = buffer.trim();
    if (trimmed.length > 0) {
      await this.emitLine(trimmed, observer);
    }
  }

  private async emitLine<T>(line: string, observer: Subscriber<T>): Promise<boolean> {
    const data = line.startsWith("data:") ? line.slice(5).trimStart() : line;
    try {
      const intercepted = await this.interceptors.response.run(JSON.parse(data));
      observer.next(this.handleResponse(intercepted) as T);
      return true;
    } catch (error) {
      observer.error(error);
      return false;
    }
  }

  /**
   * 创建请求的 Observable
   */
  private request<T>(
    method: HttpMethod,
    url: string,
    data?: RequestData,
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

      const requestConfig = this.createRequestConfig(
        fullUrl,
        method,
        data,
        extra,
        controller.signal
      );

      this.interceptors.request.run(requestConfig)
        .then(interceptedConfig => {
          if (!context.isActive || controller.signal.aborted || observer.closed) {
            return;
          }

          const requestInit = this.mergeRequestInit(
            interceptedConfig.config,
            {
              method: interceptedConfig.method,
              signal: controller.signal
            }
          );

          return fetch(interceptedConfig.url, requestInit);
        })
        .then(resp => {
          if (!resp) {
            return;
          }

          if (!context.isActive || controller.signal.aborted || observer.closed) {
            return;
          }

          if (resp.status !== this.options.code) {
            if (!this.isAbortError(resp)) {
              observer.error(resp);
            }
            return;
          }

          const reader = resp.body?.getReader();

          if (!reader) {
            observer.error(new Error("No readable stream available"));
            return;
          }

          context.reader = reader;
          if (!context.isActive || controller.signal.aborted || observer.closed) {
            this.cancelReader(context);
            return;
          }

          context.isActive = true;
          this.processStream(reader, observer, context);
        })
        .catch(e => {
          if (!this.shouldIgnoreRequestError(e, context)) {
            observer.error(e);
          }
        });

      // 返回清理函数
      return () => this.cleanupRequest(context);
    });
  }

  get<T = unknown>(url: string, _data = "{}", extra: RequestInit = {}): Observable<T> {
    return this.request<T>("GET", url, undefined, extra);
  }

  post<T = unknown>(url: string, data: RequestData = {}, extra: RequestInit = {}): Observable<T> {
    return this.request<T>("POST", url, data, extra);
  }

  private createRequestConfig(
    url: string,
    method: HttpMethod,
    data: RequestData | undefined,
    extra: RequestInit,
    signal: AbortSignal
  ): NdJsonRequestConfig {
    const config = this.mergeRequestInit(
      {
        method,
        signal
      },
      this.handleRequest(url, method),
      extra,
      {
        method,
        signal
      }
    );

    // POST 请求添加 body
    if (method === "POST" && data !== undefined && config.body === undefined) {
      config.body = isPlainObject(data) ? JSON.stringify(data) : (data as BodyInit);
    }

    return {
      url,
      method,
      data,
      config
    };
  }

  private handleRequest(url: string, method: HttpMethod): RequestInit {
    const headers: Record<string, string> = {};

    // 只有 POST 请求才设置 Content-Type
    if (method === "POST") {
      headers["Content-Type"] = NDJSON_CONTENT_TYPE;
    }

    const config: RequestInit = { headers };
    const token = getToken();
    const langKey = this.options.langKey || "lang";
    const lang = this.getLocalStorageItem(langKey);

    if (lang) {
      headers[langKey] = lang;
    }

    if (!token && !this.options.filter_url?.some(_url => url.includes(_url))) {
      this.options.tokenExpiration?.();
      return config;
    }

    if (token) {
      headers[TOKEN_KEY] = token;
    }

    if (isFunction(this.options.requestOptions)) {
      const extraOptions = this.options.requestOptions(config);
      if (isObjectLike(extraOptions)) {
        return this.mergeRequestInit(config, extraOptions as RequestInit);
      }
    }

    return config;
  }

  private getLocalBaseApi(): string | undefined {
    return this.getLocalStorageItem(LOCAL_BASE_API);
  }

  private getLocalStorageItem(key: string): string | undefined {
    if (typeof localStorage === "undefined") {
      return undefined;
    }

    try {
      return localStorage.getItem(key) || undefined;
    } catch {
      return undefined;
    }
  }

  handleResponse<T>(response: T): T {
    if (isFunction(this.options.handleResponse)) {
      return this.options.handleResponse(response);
    }
    return response;
  }

  private mergeRequestInit(...configs: Array<RequestInit | undefined>): RequestInit {
    const merged: RequestInit = {};
    const mergedHeaders = new Headers();
    let hasHeaders = false;

    configs.forEach((config) => {
      if (!config) {
        return;
      }

      const { headers, ...rest } = config;
      Object.assign(merged, rest);
      hasHeaders = this.mergeHeaders(mergedHeaders, headers) || hasHeaders;
    });

    if (hasHeaders) {
      merged.headers = mergedHeaders;
    }

    return merged;
  }

  private mergeHeaders(target: Headers, source?: HeadersInit): boolean {
    if (!source) {
      return false;
    }

    let merged = false;
    new Headers(source).forEach((value, key) => {
      target.set(key, value);
      merged = true;
    });

    return merged;
  }

  private cancelReader(context: RequestContext): void {
    const reader = context.reader;
    if (!reader) {
      return;
    }

    context.reader = undefined;
    void reader.cancel().catch(() => undefined);
  }

  private shouldIgnoreRequestError(error: unknown, context: RequestContext): boolean {
    return !context.isActive || context.controller.signal.aborted || this.isAbortError(error);
  }

  private isAbortError(error: unknown): boolean {
    if (!isObjectLike(error)) {
      return false;
    }

    const name = error["name"];
    const code = error["code"];
    const message = error["message"];

    return name === "AbortError" || code === "ABORT_ERR" || isAbortMessage(message);
  }

  private cleanupRequest(context: RequestContext): void {
    if (!context.isActive && !this.activeRequests.has(context)) {
      return;
    }

    context.isActive = false;
    if (!context.controller.signal.aborted) {
      context.controller.abort();
    }
    this.cancelReader(context);

    this.activeRequests.delete(context);
  }

  /**
   * 取消所有活跃的请求
   */
  cancelAll(): void {
    Array.from(this.activeRequests).forEach(context => {
      this.cleanupRequest(context);
    });
  }

  /**
   * 兼容旧示例中的取消方法
   */
  cancel(): void {
    this.cancelAll();
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
