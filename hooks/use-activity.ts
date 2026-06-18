import { useQuery } from '@tanstack/react-query';
import { activityApi } from '@/lib/api/activity.api';
import { QUERY_KEYS } from '@/lib/constants/query-keys';

export function useRecentActivity() {
  return useQuery({
    queryKey: QUERY_KEYS.activity.recent(),
    queryFn: activityApi.recent,
    staleTime: 30_000,
  });
}

export function useActivity(type?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.activity.list(type),
    queryFn: () => activityApi.list({ type }),
  });
}
