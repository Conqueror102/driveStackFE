import { storageAlertsSchema } from '@/lib/contracts/alerts';
import { successSchema } from '@/lib/contracts/shared';
import { apiFetch } from './client';

export const alertsApi = {
  list: () =>
    apiFetch('/api/backend/alerts', {
      schema: storageAlertsSchema,
    }),

  create: (payload: { accountId: string; threshold: 80 | 90 }) =>
    apiFetch('/api/backend/alerts', {
      method: 'POST',
      body: payload,
    }),

  remove: (id: string) =>
    apiFetch(`/api/backend/alerts/${id}`, {
      method: 'DELETE',
      schema: successSchema,
    }),
};
