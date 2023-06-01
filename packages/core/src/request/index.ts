import { Axios } from "./axios";
import type { CreateAxiosOptions } from "./axios";
import { merge } from 'lodash-es'
import { context } from './context'
export { initRequest } from './context'

export const createAxios = (options?: Partial<CreateAxiosOptions>) => {
    return new Axios(merge(context, options || {} ))
}

export const request = createAxios()
