import type {
  AxiosResponse,
} from 'axios'

export interface AxiosResponseRewrite<T extends any> extends AxiosResponse<T, any> {
  result: T
  success: boolean
}
