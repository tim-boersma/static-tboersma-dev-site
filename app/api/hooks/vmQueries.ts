import type { UseMutationReturn, UseQueryReturn } from '@pinia/colada';
import vmService from '@/api/services/vmService';
import type { VmState } from '@/types/VmState';
import { useClientSafeMutation, useClientSafeQuery, useClientSafeQueryCache } from '~/app/utilities/safePinia';

export const vmQueryKeys = {
  all: ['vm'] as const,
  status: () => [...vmQueryKeys.all, 'status'] as const,
};

export function useVMStatusQuery(options?: { enabled?: boolean }): UseQueryReturn<VmState, Error> {
  return useClientSafeQuery({
    key: vmQueryKeys.status(),
    query: async () => {
      return await vmService.getStatus() as VmState;
    },
    staleTime: 0,
    gcTime: 0,
    enabled: options?.enabled ?? true,
    placeholderData: (previousData) => previousData
  });
}

export function useToggleVMMutation(): UseMutationReturn<string, boolean, Error> {
  const queryCache = useClientSafeQueryCache();

  return useClientSafeMutation({
    mutation: async (state: boolean) => {
      return await vmService.toggleVM(state);
    },
    onSuccess: async () => {
      await queryCache.invalidateQueries({ key: vmQueryKeys.status(), exact: true });
    },
  });
}
