import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '@/lib/api/accounts.api';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { getAccountColor } from '@/lib/utils/account-colors';
import { toast } from 'sonner';

export function useAccounts() {
  return useQuery({
    queryKey: QUERY_KEYS.accounts.list(),
    queryFn: async () => {
      const data = await accountsApi.list();
      return data.map((acc, index) => ({
        ...acc,
        colorIndex: index,
        colorInfo: getAccountColor(index)
      }));
    },
  });
}

export function useConnectAccount() {
  return useMutation({
    mutationFn: async () => {
      accountsApi.connect();
    },
  });
}

export function useDisconnectAccount() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => accountsApi.disconnect(id),
    onSuccess: () => {
      toast.success('Account disconnected');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts.list() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files.root() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.storage.summary() });
    },
    onError: () => {
      toast.error('Failed to disconnect account');
    }
  });
}

export function useRefreshQuota() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => accountsApi.refreshQuota(id),
    onSuccess: () => {
      toast.success('Quota refreshed');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts.list() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.storage.summary() });
    },
  });
}
