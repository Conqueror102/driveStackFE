import { useQuery } from '@tanstack/react-query';
import { storageApi } from '@/lib/api/storage.api';
import { QUERY_KEYS } from '@/lib/constants/query-keys';

export function useStorage() {
  return useQuery({
    queryKey: QUERY_KEYS.storage.summary(),
    queryFn: () => storageApi.summary(),
    staleTime: 60 * 1000,
    refetchInterval: (query) => (query.state.data?.refreshQueued ? 3000 : false),
  });
}
