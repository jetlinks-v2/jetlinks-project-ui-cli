import { TOKEN_KEY, BASE_API, LOCAL_BASE_API } from '@jetlinks-web/constants'
import {getToken, randomString} from '@jetlinks-web/utils'
import axios from 'axios'
import type {
  AxiosInstance,
} from 'axios'
import type { AxiosResponseRewrite } from '@jetlinks-web/types'
import {isFunction, isObject} from 'lodash-es'
import type { Options, ExpandRequestConfig, ExpandAxiosResponse, ExpandAxiosError, RequestOptions, PageResult, UpdateResult } from './type'

export let instance: AxiosInstance = (window as any).JetlinksCore?.instance || null

let _options: Options = {
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
  isCreateTokenRefresh: false
}

let failedQueue = [];
let isRefreshing = false;

const isApp = (window as any).__MICRO_APP_ENVIRONMENT__

const pendingRequests = new Map<string, AbortController>();
const requestRecords = (config: ExpandRequestConfig) => {
  const key = randomString(32)

  // 取消重复请求
  if (pendingRequests.has(key)) {
    pendingRequests.get(key)?.abort()
  }

  const controller = new AbortController()
  config.signal = controller.signal;
  config.__requestKey = key;

  pendingRequests.set(key, controller)
}

const handleRequest = (config: ExpandRequestConfig) => {
  requestRecords(config)
  const token = getToken();
  const lang = localStorage.getItem(_options.langKey)
  const localBaseApi = localStorage.getItem(LOCAL_BASE_API)

  if (lang) {
    config.headers[_options.langKey] = lang
  }

  if (localBaseApi && !config.baseURL) {
    const _url = config.url.startsWith('/') ? config.url : `/${config.url}`
    config.url = localBaseApi + _url
  }

  // 没有token，并且该接口需要token校验
  if (!token && !_options.filter_url?.some((url) => config.url?.includes(url))) {
    // 跳转登录页
    _options.tokenExpiration?.()
    return config
  }

  if (!config.headers[TOKEN_KEY]) {
    config.headers[TOKEN_KEY] = token
  }

  if (_options.requestOptions && isFunction(_options.requestOptions)) {
    const extraOptions = _options.requestOptions(config)
    if (extraOptions && isObject(extraOptions)) {
      for (const key in extraOptions) {
        config[key] = extraOptions[key]
      }
    }
  }

  return config
}

const handleResponse = (response: ExpandAxiosResponse) => {
  if (_options.handleResponse && isFunction(_options.handleResponse)) {
    return _options.handleResponse(response)
  }

  const __key = response.config?.__requestKey
  if(__key){
    pendingRequests.delete(__key)
  }

  if (response.data instanceof ArrayBuffer) {
    return response
  }

  const status = response.data[_options.codeKey || 'status']

// 增加业务接口处理成功判断方式，只需要判断返回参数包含：success为true
  if (
    typeof response.data === 'object' &&
    typeof response.data.success === 'undefined'
  ) {
    response.data.success = status === _options.code
  }

  return response.data
}

const createTokenRefreshHandler = async (err) => {
  const originalRequest = err.config;
  if (isRefreshing) { // 记录之后失败的请求
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then((_token) => {
      originalRequest.headers[TOKEN_KEY] = _token;
      return instance(originalRequest)
    }).catch(err => Promise.reject(err))
  }
  originalRequest._retry = true;
  isRefreshing = true;
  try {
    const loginResult = await _options.handleReconnect?.()
    if(loginResult){
      const token = getToken() // 更新请求头, 修改全部的token
      originalRequest.headers[TOKEN_KEY] = token;
      failedQueue.forEach(a => a.resolve(token));
      return instance(originalRequest);
    }
  } catch (err) {
    failedQueue.forEach(cb => cb.reject(err));
    throw err;
  } finally {
    failedQueue = [];
    isRefreshing = false;
  }
}
const errorHandler = async (err: ExpandAxiosError<any>) => {
  let description = err.response?.message || 'Error'
  let _status: string | number = 0
  if (err.response) {
    const {data, status} = err.response
    _status = status
    switch (status) {
      case 400:
      case 403:
      case 500:
        description = (`${data?.message}`).substring(0, 90)
        break;
      case 401:
        description = err.response.data.result?.text || '用户未登录';
        _options.tokenExpiration?.(err)
        if(_options.isCreateTokenRefresh){
          return createTokenRefreshHandler(err)
        }
        break;
      case 404:
        description = err?.response?.data?.message || `${data?.error} ${data?.path}`
        break;
      default:
        break;
    }
  } else if (err.response === undefined) {
    description = err.message.includes('timeout') ? '接口响应超时' : err.message
    _status = 'timeout'
  }

  if (_options.handleError && isFunction(_options.handleError)) {
    _options.handleError(description, _status, err)
  }

  return Promise.reject(err)
}

export const abortAllRequests = () => {
  pendingRequests.forEach(controller => controller.abort())
  pendingRequests.clear()
}

export const crateAxios = (options: Options) => {
  if (options) {
    _options = Object.assign(_options, options)
  }

  instance = axios.create({
    withCredentials: false,
    timeout: _options.timeout,
    baseURL: BASE_API
  })

  instance.interceptors.request.use(
    handleRequest,
    errorHandler
  )

  instance.interceptors.response.use(
    handleResponse,
    errorHandler
  )
}

export const post = <T = any>(url: string, data: any = {}, ext?: any) => {
  return (instance<any, AxiosResponseRewrite<T>>({
    method: 'POST',
    url,
    data,
    ...ext,
  }))
}

export const get = <T = any>(url: string, params: any = undefined, ext?: any) => {
  return instance<any, AxiosResponseRewrite<T>>({
    method: 'GET',
    url,
    params,
    ...ext,
  })
}

export const put = <T = any>(url: string, data: any = {}, ext?: any) => {
  return instance<any, AxiosResponseRewrite<T>>({
    method: 'PUT',
    url,
    data,
    ...ext,
  })
}

export const patch = <T = any>(url: string, data: any = {}, ext?: any) => {
  return instance<any, AxiosResponseRewrite<T>>({
    method: 'patch',
    url,
    data,
    ...ext,
  })
}

export const remove = <T = any>(url: string, params: any = undefined, ext?: any) => {
  return instance<any, AxiosResponseRewrite<T>>({
    method: 'DELETE',
    url,
    params,
    ...ext,
  })
}

export const getStream = (url: string, params?: any, ext?: any) => {
  return get(url, params, { responseType: 'arraybuffer', ...ext })
}

export const postStream = (url: string, data: any, ext?: any) => {
  return post(url, data, { responseType: 'arraybuffer', ...ext })
}

export const request = {
  post, get, put, patch, remove, getStream, postStream
}

export class Request {

  constructor(public basePath: string) {
    this.basePath = basePath.startsWith('/') ? basePath : `/${basePath}`
  }

  private requestWrapper<T = any>(
    defaultUrl: string,
    defaultMethod: 'post'| 'get'| 'put'| 'patch'| 'remove'| 'getStream'| 'postStream',
    dataOrParams: any = {},
    options: RequestOptions = {}
  ): Promise<AxiosResponseRewrite<T>> {
    const { url = defaultUrl, method = defaultMethod, ...rest } = options
    return request[method]<T>(`${this.basePath}${url}`, dataOrParams, rest)
  }

  /**
   * 分页查询
   * @param {object} data 查询参数
   * @param {object} options 请求配置
   */
  page<T = any>(data: any={}, options: RequestOptions= {
    url: undefined,
    method: undefined,
  }) {
    return this.requestWrapper<PageResult<T>>('/_query', 'post', data, options)
  }

  /**
   * 不分页查询
   * @param {object} data 查询参数
   * @param {object} options 请求配置
   */
  noPage<T = any>(data: any={}, options: RequestOptions = {
    url: undefined,
    method: undefined,
  }) {
    return this.requestWrapper<T[]>('/_query/no-paging', 'post', { paging: false, ...data }, options)
  }

  /**
   * 详情查询
   * @param {string} id 详情ID
   * @param {object} params 查询参数
   * @param {object} options 请求配置
   */
  detail<T = any>(id: string, params?: any, options: RequestOptions= {
    url: undefined,
    method: undefined,
  }) {
    return this.requestWrapper<T>(`/${id}/detail`, 'get', params, options)
  }

  /**
   * 保存
   * @param {object} data 保存参数
   * @param {object} options 请求配置
   */
  save<T = any>(data: any={}, options: RequestOptions = {
    url: undefined,
    method: undefined,
  }) {
    return this.requestWrapper<T>('', 'post', data, options)
  }

  /**
   * 更新
   * @param {object} data 更新参数
   * @param {object} options 请求配置
   */
  update<T extends UpdateResult>(data: any={}, options: RequestOptions = {
    url: undefined,
    method: undefined,
  }) {
    return this.requestWrapper<T>('', 'patch', data, options)
  }

  /**
   * 删除
   * @param {string} id 删除ID
   * @param {object} params 请求参数
   * @param {object} options 请求配置
   * @example ${basePath}/${id}
   */
  delete<T = any>(id: string, params?: any, options: RequestOptions = {
    url: undefined,
    method: undefined,
  }) {
    return this.requestWrapper<T>(`/${id}`, 'post', params, options)
  }

  /**
   * 批量操作
   * @param data
   * @param type
   * @param options
   */
  batch<T = any>(data = {}, type?: string, options?: RequestOptions) {
    const url = `/_batch${type ? '/' + type : ''}`
    return this.requestWrapper<T>(url, 'post', data, options)
  }

  post<T = any>(url: string, data?: any, options?: any) {
    return post<T>(`${this.basePath}${url}`, data, options)
  }

  get<T = any>(url: string, params?: any, options?: any) {
    return get<T>(`${this.basePath}${url}`, params, options)
  }

  put<T = any>(url: string, data?: any, options?: any) {
    return put<T>(`${this.basePath}${url}`, data, options)
  }

  patch<T = any>(url: string, data?: any, options?: any) {
    return patch<T>(`${this.basePath}${url}`, data, options)
  }

  remove<T = any>(url: string, params?: any, options?: any) {
    return remove<T>(`${this.basePath}${url}`, params, options)
  }

  getStream(url: string, params?: any, options?: any) {
    return get(`${this.basePath}${url}`, params, { responseType: 'arraybuffer', ...options })
  }

  postStream(url: string, data?: any, options?: any) {
    return post(`${this.basePath}${url}`, data, { responseType: 'arraybuffer', ...options })
  }
}



