import { storageHistorySchema, storageSummarySchema } from '@/lib/contracts/storage';
import { apiFetch, toSearchParams } from './client';

export const storageApi = {
  summary: (fileSize?: number) =>
    apiFetch(`/api/backend/storage/summary${toSearchParams({ fileSize })}`, {
      schema: storageSummarySchema,
    }),

  history: (days: 7 | 30 | 90) =>
    apiFetch(`/api/backend/storage/history${toSearchParams({ days })}`, {
      schema: storageHistorySchema,
    }),
};

export type { StorageHistory, StorageSummary } from '@/lib/contracts/storage';
