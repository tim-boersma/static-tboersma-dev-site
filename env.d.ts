import {
  useQuery,
  type UseQueryOptions,
  type UseQueryReturn
} from '@pinia/colada'

export function useClientSafeQuery<
  TData = unknown,
  TError = Error,
  TSelected = TData
>(
  options: UseQueryOptions<TData, TError, TSelected>
): UseQueryReturn<TData, TError, TSelected> {
  if (import.meta.server) {
    return {
      data: ref(null) as Ref<TSelected | null>,
      pending: ref(false),
      error: ref(null) as Ref<TError | null>,

      refresh: async () => { },
      execute: async () => { },
      suspense: async () => { },

      status: ref('idle')
    } as unknown as UseQueryReturn<TData, TError, TSelected>
  }

  return useQuery(options)
}

export function useTestClientSafeQuery(
  options: UseQueryOptions<unknown, Error, undefined>
): UseQueryReturn<unknown, Error, undefined> {
  if (import.meta.server) {
    return {
      data: ref(null) as Ref<undefined | null>,
      pending: ref(false),
      error: ref(null) as Ref<Error | null>,

      refresh: async () => { },
      execute: async () => { },
      suspense: async () => { },

      status: ref('idle')
    } as unknown as UseQueryReturn<unknown, Error, undefined>
  }

  return useQuery(options)
}