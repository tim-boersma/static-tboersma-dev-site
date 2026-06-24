import {
  useMutation,
  useQuery,
  useQueryCache,
  type _EmptyObject,
  type UseMutationOptions,
  type UseMutationReturn,
  type UseQueryOptions,
  type UseQueryReturn
} from '@pinia/colada'

export function useClientSafeQuery<
  TData = unknown,
  TError = Error,
  TDataInitial extends TData | undefined = undefined
>(
  options: UseQueryOptions<TData, TError, TDataInitial>
): UseQueryReturn<TData, TError, TDataInitial> {
  if (!import.meta.client) {
    return {
      data: ref(undefined),
      pending: ref(true),
      isLoading: ref(true),
      isPending: ref(true),
      error: ref(null),
      status: ref('pending'),
      refetch: async () => undefined,
    } as unknown as UseQueryReturn<TData, TError, TDataInitial>
  }

  return useQuery(options)
}

export function useClientSafeMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- matches type from library
  TContext extends Record<any, any> = _EmptyObject
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationReturn<TData, TError, TVariables, TContext> {
  if (!import.meta.client) {
    return {
      data: ref(undefined),
      pending: ref(true),
      isLoading: ref(false),
      isPending: ref(false),
      error: ref(null),
      status: ref('pending'),

      isIdle: ref(true),
      isSuccess: ref(false),
      isError: ref(false),

      mutate: () => { },
      mutateAsync: async () => null as TData,

      reset: () => { }
    } as unknown as UseMutationReturn<
      TData,
      TError,
      TVariables,
      TContext
    >
  }

  return useMutation(options)
}

export function useClientSafeQueryCache() {
  if (!import.meta.client) {
    return {
      invalidateQueries: async () => { },
    }
  }

  return useQueryCache()
}