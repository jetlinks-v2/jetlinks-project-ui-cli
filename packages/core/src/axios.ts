import { TOKEN_KEY, BASE_API } from '@jetlinks-web/constants'
import { getToken } from '@jetlinks-web/utils'
import axios from 'axios'
import type {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'
import type { AxiosResponseRewrite } from '@jetlinks-web/types'
import {isFunction, isObject} from 'lodash-es'

interface Options {

  tokenExpiration: (err: AxiosError<any>, response: AxiosResponse) => void
  filter_url?: Array<string>
  code?: number
  codeKey?: string
  timeout?: number
  handleRequest?: () => void
  /**
   * 用以获取localstorage中的lang
   */
  langKey?: string
  /**
   * response处理函数
   * @param response AxiosResponse实例
   */
  handleResponse?: (response: AxiosResponse) => void
  /**
   * 错误处理函数
   * @param msg 错误消息
   * @param status 错误code
   * @param error 错误实例
   */
  handleError?: (msg: string, status: string | number, error: AxiosError<any>) => void
  requestOptions?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Record<string, any>

}

let instance: AxiosInstance

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
}

const controller = new AbortController();

const handleRequest = (config: InternalAxiosRequestConfig) => {
  const token = getToken()
  const lang = localStorage.getItem(_options.langKey)

  if (lang) {
    config.headers[_options.langKey] = lang
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

const handleResponse = (response: AxiosResponse) => {

  if (_options.handleResponse && isFunction(_options.handleResponse)) {
    return _options.handleResponse(response)
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

const errorHandler = (err: AxiosError<any>) => {
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
        description = err.response.data.result.text || '用户未登录'
        _options.tokenExpiration?.(err, err.response)
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



