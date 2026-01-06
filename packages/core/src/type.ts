import type {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from "axios";

export interface AxiosResponseRewrite<T = any>
  extends AxiosResponse<T, any> {
  result: T
  success: boolean
}


export interface Options {
  tokenExpiration: (err?: AxiosError<any>, response?: AxiosResponseRewrite) => void
  handleReconnect: () => Promise<any>
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
  handleResponse?: (response: AxiosResponseRewrite) => void
  /**
   * 错误处理函数
   * @param msg 错误消息
   * @param status 错误code
   * @param error 错误实例
   */
  handleError?: (msg: string, status: string | number, error: AxiosError<any>) => void
  requestOptions?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Record<string, any>
  isCreateTokenRefresh?: boolean
}

export interface ExpandRequestConfig extends InternalAxiosRequestConfig {
  __requestKey?: string
  _retry?: boolean
}

export interface ExpandAxiosResponse<T = any> extends AxiosResponseRewrite<T> {
  config: ExpandRequestConfig
  message: string
}

export interface ExpandAxiosError<T = any> extends Omit<AxiosError<T>, 'config'> {
  config?: ExpandRequestConfig
  response?: ExpandAxiosResponse<T>
}

export interface PageResult<T> {
  data: T[],
  total: number
  pageIndex: number
  pageSize: number
}

export interface UpdateResult {
  added: number
  total: number
  updated: number
}

export interface RequestOptions {
  url?: string
  method?: string
  params?: any
  data?: any
  [key: string]: any
}
