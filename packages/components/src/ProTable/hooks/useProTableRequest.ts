import { onBeforeUnmount, type Ref } from 'vue'

export interface ProTableQueryParams extends Record<string, unknown> {
  pageIndex?: number
  pageSize?: number
  terms?: unknown[]
}

export interface ProTableRequestContext { signal: AbortSignal }
export interface ProTableResponse<T = unknown> { success: boolean; result?: T }

/** Forward context.signal to the HTTP client to cancel superseded network requests. */
export type ProTableRequest<T = unknown> = (
  params: ProTableQueryParams, context: ProTableRequestContext,
) => Promise<ProTableResponse<T>>

interface RequestProps {
  dataSource?: unknown[]
  request?: ProTableRequest
  totalRequest?: ProTableRequest<number>
  defaultParams: ProTableQueryParams
  type: string
}
interface PageState { pageIndex: number; pageSize: number; total: number; loading: boolean }
interface PageResult { data?: unknown[]; pageIndex?: number; pageSize?: number; total?: number }

/** A table owns one query generation, including its optional total request. */
export function useProTableRequest(
  props: RequestProps, page: PageState, loading: Ref<boolean>, dataSource: Ref<unknown[]>,
  onLastPage: () => void, onError: (error: unknown) => void,
) {
  let generation = 0
  let controller: AbortController | undefined
  let disposed = false
  const isCurrent = (id: number, signal: AbortSignal) =>
    !disposed && id === generation && !signal.aborted
  const isCancellation = (error: unknown, signal: AbortSignal) => {
    const candidate = error as { name?: string; code?: string } | null
    return signal.aborted || candidate?.name === 'AbortError' ||
      candidate?.name === 'CanceledError' || candidate?.code === 'ERR_CANCELED'
  }

  // The total shares the query generation; an older total must never overwrite new rows.
  const loadTotal = async (params: ProTableQueryParams, id: number, signal: AbortSignal) => {
    page.loading = true
    try {
      const response = await props.totalRequest!(params, { signal })
      if (isCurrent(id, signal) && response.success) page.total = response.result || 0
    } catch (error) {
      if (isCurrent(id, signal) && !isCancellation(error, signal)) onError(error)
    } finally {
      if (isCurrent(id, signal)) page.loading = false
    }
  }

  /** Confirmed params, pagination and reload enter the same cancellation boundary. */
  const handleSearch = async (params?: ProTableQueryParams): Promise<void> => {
    if (disposed) return
    const id = ++generation
    controller?.abort()
    controller = new AbortController()
    const { signal } = controller
    page.loading = false
    loading.value = false
    if (Array.isArray(props.dataSource)) {
      dataSource.value = props.dataSource
      return
    }
    if (!props.request) {
      dataSource.value = []
      return
    }
    const query: ProTableQueryParams = {
      pageIndex: page.pageIndex, pageSize: Number(page.pageSize),
      ...props.defaultParams, ...params,
      terms: [...(props.defaultParams.terms || []), ...(params?.terms || [])],
    }
    loading.value = true
    try {
      const response = await props.request(query, { signal })
      // Legacy callbacks may ignore signal. Guard every state write against older responses.
      if (!isCurrent(id, signal)) return
      if (!response.success) {
        dataSource.value = []
        page.total = 0
        return
      }
      if (props.type !== 'PAGE') {
        dataSource.value = (response.result || []) as unknown[]
      } else if (props.totalRequest) {
        const rows = (response.result || []) as unknown[]
        if (!rows.length && (query.pageIndex || 0) > 0) {
          onLastPage()
          page.total = page.pageSize * (page.pageIndex > 0 ? page.pageIndex : 1)
          return
        }
        dataSource.value = rows
        page.pageIndex = query.pageIndex || 0
        page.pageSize = query.pageSize || 12
        page.total = rows.length ? page.pageSize * (page.pageIndex + 1) + 1 : 0
      } else {
        const result = (response.result || {}) as PageResult
        const size = result.pageSize || query.pageSize || 12
        if (result.total && !result.data?.length && (query.pageIndex || 0) > 0) {
          // Dataset shrinkage may remove several pages; retry the last valid page directly.
          const pageIndex = Math.min((query.pageIndex || 0) - 1, Math.ceil(result.total / size) - 1)
          return handleSearch({ ...params, pageIndex, pageSize: size })
        }
        dataSource.value = result.data || []
        page.pageIndex = result.pageIndex || 0
        page.pageSize = size
        page.total = result.total || 0
      }
      if (props.totalRequest) void loadTotal(query, id, signal)
    } catch (error) {
      // Cancellation preserves the current rows and is not a user-visible failure.
      if (isCurrent(id, signal) && !isCancellation(error, signal)) onError(error)
    } finally {
      if (isCurrent(id, signal)) loading.value = false
    }
  }

  onBeforeUnmount(() => {
    disposed = true
    generation++
    controller?.abort()
  })
  return { handleSearch }
}
