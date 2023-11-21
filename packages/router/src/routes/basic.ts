import { Exception } from '../page'

export const NOT_FIND_ROUTE = {
    path: '/:pathMatch(.*)',
    name: 'error',
    component: () => Exception
}
