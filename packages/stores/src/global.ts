import { assign } from 'lodash-es'

interface Store {
  UserInfoStore?: any
  MenuStore?: any
  SystemStore?: any
  AuthStore?: any

  [key: string]: any
}
export const store: Store = {}
export const initStore = <T extends Store>(s: T) => {
  assign(store as T, s)
}
