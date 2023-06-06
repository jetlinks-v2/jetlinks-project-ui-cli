import { TOKEN_KEY } from '@jetlinks/constants'
import { getToken } from '@jetlinks/utils'
import { jumpLogin } from '@jetlinks/router'
import axios from 'axios'
import type {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'
import { notification as Notification } from 'jetlinks-ui-components'
import { isFunction } from 'lodash-es'
import type { AxiosResponseRewrite } from '@jetlinks/types'

export interface ContextOptions {
  filterUrl?: string[]
  handleRequest?: (
    config: InternalAxiosRequestConfig,
  ) => InternalAxiosRequestConfig
  handleResponse?: (response: AxiosResponse) => AxiosResponse
  errorHandler?: (error: AxiosError) => void
}

export interface CreateAxiosOptions extends AxiosRequestConfig, ContextOptions {}

const SUCCESS_CODE = 200 // 成功代码

export class Axios {
  private axiosInstance: AxiosInstance
  private readonly options: CreateAxiosOptions

  constructor(options: CreateAxiosOptions) {
    this.options = options
    const api = import.meta.env.VITE_APP_BASE_API
    this.axiosInstance = axios.create({
      withCredentials: false,
      timeout: 1000 * 15,
      baseURL: api
    })
    this.axiosInstance.interceptors.request.use(
      this.request.bind(this), 
      this.errorHandler.bind(this)
    )
    this.axiosInstance.interceptors.response.use(
      this.response.bind(this),
      this.errorHandler.bind(this),
    )
  }

  request(config: InternalAxiosRequestConfig) {
    const token = getToken()
    const filterUrl = this.options.filterUrl // 不需要token校验接口
    // 没有token，并且该接口需要token校验
    if (!token && !filterUrl?.some((url) => config.url?.includes(url))) {
      // 跳转登录页
      jumpLogin()
      return config
    }

    config.headers[TOKEN_KEY] = token

    if (this.options.handleRequest && isFunction(this.options.handleRequest)) {
      config = this.options.handleRequest(config)
    }

    return config
  }

  response(response: AxiosResponse) {
    if (
      this.options.handleResponse &&
      isFunction(this.options.handleResponse)
    ) { // 自定义处理
      return this.options.handleResponse(response)
    }

    if (response.data instanceof ArrayBuffer) {
      return response
    }

    const { status } = response.data

    // 增加业务接口处理成功判断方式，只需要判断返回参数包含：success为true
    if (
      typeof response.data === 'object' &&
      typeof response.data.success === 'undefined'
    ) {
      response.data.success = status === SUCCESS_CODE
    }

    return response.data
  }

  errorHandler(err: AxiosError<any>) {
    if (this.options.errorHandler && isFunction(this.options.errorHandler)) {
      this.options.errorHandler(err)
    }

    if (err.response) {
      const { data, status } = err.response
      switch(status) {
        case 400:
        case 403:
        case 500:
          const description = (`${data?.message}`).substring(0, 90)
          this.showNotification(description, status)
          break;
        case 401:
          this.showNotification('用户未登录', status)
          jumpLogin()
          break;
        default:
          break;
      }
    } else if (err.response === undefined) {
      const description = err.message.includes('timeout') ? '接口响应超时' : err.message
      this.showNotification(description)
    }

    return Promise.reject(err)
  }

  post<T = any>(url: string, data: any = undefined, ext?: any) {
    return (this.axiosInstance<any, AxiosResponseRewrite<T>>({
      method: 'POST',
      url,
      data,
      ...ext,
    }))
  }

  postParams<T = any>(url: string, data: any = undefined, params = {}, ext?: any) {
    return this.axiosInstance<any, AxiosResponseRewrite<T>>({
      method: 'POST',
      url,
      data,
      params,
      ...ext,
    })
  }

  get<T = any>(url: string, params: any = undefined, ext?: any) {
    return this.axiosInstance<any, AxiosResponseRewrite<T>>({
      method: 'GET',
      url,
      params,
      ...ext,
    })
  }

  put<T = any>(url: string, data: any = undefined, ext?: any) {
    return this.axiosInstance<any, AxiosResponseRewrite<T>>({
      method: 'PUT',
      url,
      data,
      ...ext,
    })
  }

  patch<T = any>(url: string, data: any = undefined, ext?: any) {
    return this.axiosInstance<any, AxiosResponseRewrite<T>>({
      method: 'patch',
      url,
      data,
      ...ext,
    })
  }

  remove<T = any>(url: string, params: any = undefined, ext?: any) {
    return this.axiosInstance<any, AxiosResponseRewrite<T>>({
      method: 'DELETE',
      url,
      params,
      ...ext,
    })
  }

  getStream(url: string, params?: any) {
    return this.get(url, params, { responseType: 'arraybuffer' })
  }

  postStream(url: string, data: any, params: any) {
    return this.postParams(url, data, params, { responseType: 'arraybuffer' })
  }

   private showNotification(description, key?: string | number, show: boolean = true) {
    if (show) {
      Notification.error({
        key,
        description,
        message: '',
      })
    }
  }
}
