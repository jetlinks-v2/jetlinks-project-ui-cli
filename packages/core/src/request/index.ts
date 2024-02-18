import { Axios } from "./axios";
import type { CreateAxiosOptions } from "./axios";
export { initRequest } from './context'

export const createAxios = (options?: Partial<CreateAxiosOptions>) => {
    return new Axios(options)
}

export const request = createAxios()
