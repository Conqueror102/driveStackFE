import { useQuery } from '@tanstack/react-query';
import { storageApi } from '@/lib/api/storage.api';
import { QUERY_KEYS } from '@/lib/constants/query-keys';

export function useStorage() {
  return useStorageSummary();
}

export function useStorageSummary(fileSize?: number) {
  return useQuery({
    queryKey: QUERY_KEYS.storage.summary(fileSize),
    queryFn: () => storageApi.summary(fileSize),
    staleTime: 60 * 1000,
    refetchInterval: (query) => (query.state.data?.refreshQueued ? 3000 : false),
  });
}

export function useStorageHistory(days: 7 | 30 | 90) {
  return useQuery({
    queryKey: QUERY_KEYS.storage.history(days),
    queryFn: () => storageApi.history(days),
    staleTime: 60 * 1000,
  });
}
