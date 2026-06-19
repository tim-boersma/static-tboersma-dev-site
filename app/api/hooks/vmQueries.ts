import { useMutation, useQuery, useQueryCache, type UseMutationReturn, type UseQueryReturn } from '@pinia/colada';
import vmService from '@/api/services/vmService';
import type { VmState } from '@/types/VmState';

export const vmQueryKeys = {
  all: ['vm'] as const,
  status: () => [...vmQueryKeys.all, 'status'] as const,
};

export function useVMStatusQuery(options?: { enabled?: boolean }): UseQueryReturn<VmState, Error> {
  return useQuery({
    key: vmQueryKeys.status(),
    query: async () => {
      return await vmService.getStatus() as VmState;
    },
    staleTime: 0,
    gcTime: 0,
    enabled: options?.enabled ?? import.meta.client,
    placeholderData: (previousData) => previousData
  });
}

export function useToggleVMMutation(): UseMutationReturn<string, boolean, Error> {
  const queryCache = useQueryCache();

  return useMutation({
    mutation: async (state: boolean) => {
      return await vmService.toggleVM(state);
    },
    onSuccess: async () => {
      await queryCache.invalidateQueries({ key: vmQueryKeys.status(), exact: true });
    },
  });
}
