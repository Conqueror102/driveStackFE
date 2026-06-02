import { connectedAccountSchema, connectedAccountsSchema } from '@/lib/contracts/accounts';
import { successSchema } from '@/lib/contracts/shared';
import { apiFetch } from './client';

export const accountsApi = {
  list: () =>
    apiFetch('/api/backend/google-accounts', {
      schema: connectedAccountsSchema,
    }),

  connect: () => {
    window.location.href = '/api/google-accounts/connect';
  },

  disconnect: (id: string) =>
    apiFetch(`/api/backend/google-accounts/${id}`, {
      method: 'DELETE',
      schema: successSchema,
    }),

  refreshQuota: (id: string) =>
    apiFetch(`/api/backend/google-accounts/${id}/quota`, {
      schema: connectedAccountSchema,
    }),
};
