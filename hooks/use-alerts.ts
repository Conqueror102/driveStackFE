import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { alertsApi } from '@/lib/api/alerts.api';
import { QUERY_KEYS } from '@/lib/constants/query-keys';

export function useAlerts() {
  return useQuery({
    queryKey: QUERY_KEYS.alerts.list(),
    queryFn: alertsApi.list,
  });
}

export function useToggleAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { accountId: string; threshold: 80 | 90; alertId?: string; enabled: boolean }) => {
      if (payload.enabled) return alertsApi.create({ accountId: payload.accountId, threshold: payload.threshold });
      if (!payload.alertId) return null;
      return alertsApi.remove(payload.alertId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.alerts.list() });
      toast.success('Storage alert updated');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Unable to update storage alert');
    },
  });
}
