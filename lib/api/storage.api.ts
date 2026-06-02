import { storageSummarySchema } from '@/lib/contracts/storage';
import { apiFetch } from './client';

export const storageApi = {
  summary: () =>
    apiFetch('/api/backend/storage/summary', {
      schema: storageSummarySchema,
    }),
};

export type { StorageSummary } from '@/lib/contracts/storage';
