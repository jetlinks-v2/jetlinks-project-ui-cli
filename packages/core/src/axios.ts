import { TOKEN_KEY, BASE_API, LOCAL_BASE_API } from '@jetlinks-web/constants'
import { getToken, randomString } from '@jetlinks-web/utils'
import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { isFunction, isObject } from 'lodash-es'

import type {
  Options,
  ExpandRequestConfig,
  ExpandAxiosResponse,
  AxiosResponseRewrite,
  ExpandAxiosError,
  RequestOptions,
  PageResult,
  UpdateResult
} from './type'

/**
 * 扩展的 Options 接口，添加重复请求控制
 */
export interface ExtendedOptions extends Options {
  /**
   * 是否取消重复请求，只保留最后一次
   * @default false
   */
  cancelDuplicateRequests?: boolean
}

/**
 * AxiosService 类 - 封装所有 axios 相关功能
 */
export class AxiosService {
  private instance: AxiosInstance | null = null
  private options: ExtendedOptions
  private failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = []
  private isRefreshing = false
  private pendingRequests = new Map<string, AbortController>()
  private isApp = (window as any).__MICRO_APP_ENVIRONMENT__

  constructor(options?: Partial<ExtendedOptions>) {
    this.options = {
      filter_url: [],
      code: 200,
      codeKey: 'status',
      timeout: 1000 * 15,
      handleRequest: undefined,
      handleResponse: undefined,
      handleError: undefined,
      langKey: 'lang',
      requestOptions: (config) => ({}),
      tokenExpiration: () => {},
      handleReconnect: () => Promise.resolve(),
      isCreateTokenRefresh: false,
      cancelDuplicateRequests: false, // 默认关闭
      ...options
    }

    // 如果已经存在全局实例，使用它
    if ((window as any).JetlinksCore?.instance) {
      this.instance = (window as any).JetlinksCore.instance
    }
  }

  /**
   * 初始化 axios 实例
   */
  initialize(options?: Partial<ExtendedOptions>): void {
    if (options) {
      this.options = { ...this.options, ...options }
    }

    this.instance = axios.create({
      withCredentials: false,
      timeout: this.options.timeout,
      baseURL: BASE_API
    })

    this.instance.interceptors.request.use(
      (config) => this.handleRequest(config as ExpandRequestConfig),
      (error) => this.errorHandler(error)
    )

    this.instance.interceptors.response.use(
      (response) => this.handleResponse(response as unknown as ExpandAxiosResponse),
      (error) => this.errorHandler(error as ExpandAxiosError<any>)
    )
  }

  /**
   * 获取 axios 实例
   */
  getInstance(): AxiosInstance {
    if (!this.instance) {
      this.initialize()
    }
    return this.instance!
  }

  /**
   * 生成请求的唯一标识
   * 如果启用了 cancelDuplicateRequests，则基于 method + url + params/data
   * 否则使用随机字符串
   */
  private generateRequestKey(config: ExpandRequestConfig): string {

    // 统一接口请求的唯一标识
    const method = config.method?.toUpperCase() || 'GET'
    const url = config.url || ''

    // 序列化参数，用于判断是否为同一请求
    const params = config.params || {}
    const data = config.data || {}
    const payload = method === 'GET' ? params : data

    // 生成稳定的请求标识
    let payloadStr = ''
    try {
      payloadStr = JSON.stringify(payload, Object.keys(payload).sort())
    } catch {
      payloadStr = randomString(16) // 降级为随机标识
    }

    return `${method}:${url}:${payloadStr}`
  }

  /**
   * 记录请求 - 支持 AbortController
   */
  private requestRecords(config: ExpandRequestConfig): void {
    if (!this.options.cancelDuplicateRequests) {
      return
    }

    const key = this.generateRequestKey(config)

    // 如果启用了取消重复请求，且存在相同的请求，则取消前一个
    if (this.pendingRequests.has(key)) {
      this.pendingRequests.get(key)?.abort()
      this.pendingRequests.delete(key)
    }

    const controller = new AbortController()
    config.signal = controller.signal
    config.__requestKey = key

    this.pendingRequests.set(key, controller)
  }

  /**
   * 请求拦截器处理
   */
  private handleRequest(config: ExpandRequestConfig): ExpandRequestConfig {
    this.requestRecords(config)
    const token = getToken()
    const lang = localStorage.getItem(this.options.langKey!)
    const localBaseApi = localStorage.getItem(LOCAL_BASE_API)

    if (lang) {
      config.headers[this.options.langKey!] = lang
    }

    if (localBaseApi && !config.baseURL) {
      const _url = config.url!.startsWith('/') ? config.url : `/${config.url}`
      config.url = localBaseApi + _url
    }

    // 没有token，并且该接口需要token校验
    if (!token && !this.options.filter_url?.some((url) => config.url?.includes(url))) {
      this.options.tokenExpiration?.()
      return config
    }

    if (!config.headers[TOKEN_KEY]) {
      config.headers[TOKEN_KEY] = token
    }

    if (this.options.requestOptions && isFunction(this.options.requestOptions)) {
      const extraOptions = this.options.requestOptions(config)
      if (extraOptions && isObject(extraOptions)) {
        for (const key in extraOptions) {
          config[key] = extraOptions[key]
        }
      }
    }

    return config
  }

  /**
   * 响应拦截器处理
   */
  private handleResponse(response: ExpandAxiosResponse): any {
    const __key = response.config?.__requestKey
    if (__key) {
      this.pendingRequests.delete(__key)
    }

    if (this.options.handleResponse && isFunction(this.options.handleResponse)) {
      return this.options.handleResponse(response)
    }

    if (response.data instanceof ArrayBuffer) {
      return response
    }

    const status = response.data[this.options.codeKey || 'status']

    // 增加业务接口处理成功判断方式，只需要判断返回参数包含：success为true
    if (
      typeof response.data === 'object' &&
      typeof response.data.success === 'undefined'
    ) {
      response.data.success = status === this.options.code
    }

    return response.data
  }

  /**
   * Token 刷新处理
   */
  private async createTokenRefreshHandler(err: ExpandAxiosError<any>): Promise<any> {
    const originalRequest = err.config!

    if (this.isRefreshing) {
      // 记录之后失败的请求
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject })
      })
        .then((_token) => {
          if (originalRequest.signal?.aborted) {
            return Promise.reject(new axios.Cancel('Request aborted'))
          }

          originalRequest.headers[TOKEN_KEY] = _token
          return this.instance!(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    this.isRefreshing = true

    try {
      const loginResult = await this.options.handleReconnect?.()
      if (loginResult) {
        const token = getToken() // 更新请求头, 修改全部的token
        originalRequest.headers[TOKEN_KEY] = token
        this.failedQueue.forEach((a) => a.resolve(token))
        return this.instance!(originalRequest)
      }
    } catch (err) {
      this.failedQueue.forEach((cb) => cb.reject(err))
      throw err
    } finally {
      this.failedQueue = []
      this.isRefreshing = false
    }
  }

  /**
   * 错误处理
   */
  private async errorHandler(err: ExpandAxiosError<any>): Promise<any> {
    // 清理请求记录
    const __key = err.config?.__requestKey
    if (__key) {
      this.pendingRequests.delete(__key)
    }

    // 如果是用户主动取消的请求，不做错误处理
    if (axios.isCancel(err as any)) {
      return Promise.reject(err)
    }

    let description = err.response?.message || 'Error'
    let _status: string | number = 0

    const response = err.response
    if (response) {
      const { data, status } = response
      _status = status

      switch (status) {
        case 400:
        case 403:
        case 500:
          description = `${data?.message}`.substring(0, 90)
          break
        case 401:
          description = (data as any)?.result?.text || '用户未登录'
          this.options.tokenExpiration?.(err as any)
          if (this.options.isCreateTokenRefresh) {
            return this.createTokenRefreshHandler(err)
          }
          break
        case 404:
          description = data?.message || `${(data as any)?.error} ${(data as any)?.path}`
          break
        default:
          break
      }
    } else {
      const errAny = err as any
      if (errAny.message) {
        description = errAny.message.includes('timeout') ? '接口响应超时' : errAny.message
        _status = 'timeout'
      }
    }

    if (this.options.handleError && isFunction(this.options.handleError)) {
      const result = this.options.handleError(description, _status, err as any)
      // 如果 handleError 返回了 Promise，则返回它以替换原始错误
      if (result && typeof result.then === 'function') {
        return result
      }
    }

    return Promise.reject(err)
  }

  /**
   * 取消所有进行中的请求
   */
  abortAllRequests(): void {
    this.pendingRequests.forEach((controller) => controller.abort())
    this.pendingRequests.clear()
  }

  /**
   * 取消特定请求
   */
  abortRequest(requestKey: string): void {
    const controller = this.pendingRequests.get(requestKey)
    if (controller) {
      controller.abort()
      this.pendingRequests.delete(requestKey)
    }
  }

  /**
   * 获取当前进行中的请求数量
   */
  getPendingRequestsCount(): number {
    return this.pendingRequests.size
  }

  /**
   * HTTP 方法封装 - POST
   */
  post<T = any>(url: string, data: any = {}, ext?: any): Promise<AxiosResponseRewrite<T>> {
    return this.getInstance()<any, AxiosResponseRewrite<T>>({
      method: 'POST',
      url,
      data,
      ...ext
    })
  }

  /**
   * HTTP 方法封装 - GET
   */
  get<T = any>(url: string, params: any = undefined, ext?: any): Promise<AxiosResponseRewrite<T>> {
    return this.getInstance()<any, AxiosResponseRewrite<T>>({
      method: 'GET',
      url,
      params,
      ...ext
    })
  }

  /**
   * HTTP 方法封装 - PUT
   */
  put<T = any>(url: string, data: any = {}, ext?: any): Promise<AxiosResponseRewrite<T>> {
    return this.getInstance()<any, AxiosResponseRewrite<T>>({
      method: 'PUT',
      url,
      data,
      ...ext
    })
  }

  /**
   * HTTP 方法封装 - PATCH
   */
  patch<T = any>(url: string, data: any = {}, ext?: any): Promise<AxiosResponseRewrite<T>> {
    return this.getInstance()<any, AxiosResponseRewrite<T>>({
      method: 'PATCH',
      url,
      data,
      ...ext
    })
  }

  /**
   * HTTP 方法封装 - DELETE
   */
  remove<T = any>(url: string, params: any = undefined, ext?: any): Promise<AxiosResponseRewrite<T>> {
    return this.getInstance()<any, AxiosResponseRewrite<T>>({
      method: 'DELETE',
      url,
      params,
      ...ext
    })
  }

  /**
   * 获取流数据 - GET
   */
  getStream(url: string, params?: any, ext?: any): Promise<any> {
    return this.get(url, params, { responseType: 'arraybuffer', ...ext })
  }

  /**
   * 获取流数据 - POST
   */
  postStream(url: string, data: any, ext?: any): Promise<any> {
    return this.post(url, data, { responseType: 'arraybuffer', ...ext })
  }
}

// 创建默认的 AxiosService 实例
const defaultAxiosService = new AxiosService()

// 导出默认实例和工厂函数
export const createAxiosService = (options?: Partial<ExtendedOptions>): AxiosService => {
  const service = new AxiosService(options)
  service.initialize()
  return service
}


/**
 * Request 类 - 业务请求封装
 * 默认使用全局共享的 axios 实例，特殊情况可传入自定义实例
 */
export class Request {
  private _instance?: AxiosInstance

  constructor(public basePath: string, instance?: AxiosInstance) {
    this.basePath = basePath.startsWith('/') ? basePath : `/${basePath}`
    this._instance = instance
  }

  /**
   * 获取 axios 实例
   * 延迟获取以确保全局实例已初始化
   */
  private get instance(): AxiosInstance {
    return this._instance || defaultAxiosService.getInstance()
  }

  private requestWrapper<T = any>(
    defaultUrl: string,
    defaultMethod: 'post' | 'get' | 'put' | 'patch' | 'remove' | 'getStream' | 'postStream',
    dataOrParams: any = {},
    options: RequestOptions = {}
  ): Promise<AxiosResponseRewrite<T>> {
    const { url = defaultUrl, method = defaultMethod, ...rest } = options
    const fn = this[method] as (url: string, dataOrParams: any, options?: any) => Promise<AxiosResponseRewrite<T>>
    return fn.call(this, url, dataOrParams, rest)
  }

  /**
   * 分页查询
   * @param data 查询参数
   * @param options 请求配置
   */
  page<T = any>(
    data: any = {},
    options: RequestOptions = {
      url: undefined,
      method: undefined
    }
  ): Promise<AxiosResponseRewrite<PageResult<T>>> {
    return this.requestWrapper<PageResult<T>>('/_query', 'post', data, options)
  }

  /**
   * 不分页查询
   * @param data 查询参数
   * @param options 请求配置
   */
  noPage<T = any>(
    data: any = {},
    options: RequestOptions = {
      url: undefined,
      method: undefined
    }
  ): Promise<AxiosResponseRewrite<T[]>> {
    return this.requestWrapper<T[]>('/_query/no-paging', 'post', { paging: false, ...data }, options)
  }

  /**
   * 详情查询
   * @param id 详情ID
   * @param params 查询参数
   * @param options 请求配置
   */
  detail<T = any>(
    id: string,
    params?: any,
    options: RequestOptions = {
      url: undefined,
      method: undefined
    }
  ): Promise<AxiosResponseRewrite<T>> {
    return this.requestWrapper<T>(`/${id}/detail`, 'get', params, options)
  }

  /**
   * 保存
   * @param data 保存参数
   * @param options 请求配置
   */
  save<T = any>(
    data: any = {},
    options: RequestOptions = {
      url: undefined,
      method: undefined
    }
  ): Promise<AxiosResponseRewrite<T>> {
    return this.requestWrapper<T>('', 'post', data, options)
  }

  /**
   * 更新
   * @param data 更新参数
   * @param options 请求配置
   */
  update<T extends UpdateResult>(
    data: any = {},
    options: RequestOptions = {
      url: undefined,
      method: undefined
    }
  ): Promise<AxiosResponseRewrite<T>> {
    return this.requestWrapper<T>('', 'patch', data, options)
  }

  /**
   * 删除
   * @param id 删除ID
   * @param params 请求参数
   * @param options 请求配置
   * @example ${basePath}/${id}
   */
  delete<T = any>(
    id: string,
    params?: any,
    options: RequestOptions = {
      url: undefined,
      method: undefined
    }
  ): Promise<AxiosResponseRewrite<T>> {
    return this.requestWrapper<T>(`/${id}`, 'remove', params, options)
  }

  /**
   * 批量操作
   * @param data
   * @param type
   * @param options
   */
  batch<T = any>(data = {}, type?: string, options?: RequestOptions): Promise<AxiosResponseRewrite<T>> {
    const url = `/_batch${type ? '/' + type : ''}`
    return this.requestWrapper<T>(url, 'post', data, options)
  }

  post<T = any>(url: string, data?: any, options?: any): Promise<AxiosResponseRewrite<T>> {
    return this.instance<any, AxiosResponseRewrite<T>>({
      method: 'POST',
      url: `${this.basePath}${url}`,
      data,
      ...options
    })
  }

  get<T = any>(url: string, params?: any, options?: any): Promise<AxiosResponseRewrite<T>> {
    return this.instance<any, AxiosResponseRewrite<T>>({
      method: 'GET',
      url: `${this.basePath}${url}`,
      params,
      ...options
    })
  }

  put<T = any>(url: string, data?: any, options?: any): Promise<AxiosResponseRewrite<T>> {
    return this.instance<any, AxiosResponseRewrite<T>>({
      method: 'PUT',
      url: `${this.basePath}${url}`,
      data,
      ...options
    })
  }

  patch<T = any>(url: string, data?: any, options?: any): Promise<AxiosResponseRewrite<T>> {
    return this.instance<any, AxiosResponseRewrite<T>>({
      method: 'PATCH',
      url: `${this.basePath}${url}`,
      data,
      ...options
    })
  }

  remove<T = any>(url: string, params?: any, options?: any): Promise<AxiosResponseRewrite<T>> {
    return this.instance<any, AxiosResponseRewrite<T>>({
      method: 'DELETE',
      url: `${this.basePath}${url}`,
      params,
      ...options
    })
  }

  getStream(url: string, params?: any, options?: any): Promise<any> {
    return this.get(`${url}`, params, { responseType: 'arraybuffer', ...options })
  }

  postStream(url: string, data?: any, options?: any): Promise<any> {
    return this.post(`${url}`, data, { responseType: 'arraybuffer', ...options })
  }
}

// 导出默认 request 对象（保持向后兼容）
export const request = {
  post: defaultAxiosService.post.bind(defaultAxiosService),
  get: defaultAxiosService.get.bind(defaultAxiosService),
  put: defaultAxiosService.put.bind(defaultAxiosService),
  patch: defaultAxiosService.patch.bind(defaultAxiosService),
  remove: defaultAxiosService.remove.bind(defaultAxiosService),
  getStream: defaultAxiosService.getStream.bind(defaultAxiosService),
  postStream: defaultAxiosService.postStream.bind(defaultAxiosService)
}

// 导出便捷函数（保持向后兼容）
export const post = defaultAxiosService.post.bind(defaultAxiosService)
export const get = defaultAxiosService.get.bind(defaultAxiosService)
export const put = defaultAxiosService.put.bind(defaultAxiosService)
export const patch = defaultAxiosService.patch.bind(defaultAxiosService)
export const remove = defaultAxiosService.remove.bind(defaultAxiosService)
export const getStream = defaultAxiosService.getStream.bind(defaultAxiosService)
export const postStream = defaultAxiosService.postStream.bind(defaultAxiosService)

// 导出工具函数
export const abortAllRequests = () => defaultAxiosService.abortAllRequests()

export const getInstance = () => defaultAxiosService.getInstance()

// 导出 axios 实例（兼容旧代码）
export let instance: AxiosInstance

// 导出初始化函数（兼容旧代码）
export const crateAxios = (options: ExtendedOptions) => {
  defaultAxiosService.initialize(options)
  instance = defaultAxiosService.getInstance()
}

// 导出默认服务实例
export default defaultAxiosService
