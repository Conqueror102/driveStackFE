import { notificationsSchema } from '@/lib/contracts/notifications';
import { successSchema } from '@/lib/contracts/shared';
import { apiFetch } from './client';

export const notificationsApi = {
  list: () =>
    apiFetch('/api/backend/notifications', {
      schema: notificationsSchema,
    }),

  markRead: (id: string) =>
    apiFetch(`/api/backend/notifications/${id}/read`, {
      method: 'PATCH',
      schema: successSchema,
    }),

  markAllRead: () =>
    apiFetch('/api/backend/notifications/read-all', {
      method: 'PATCH',
      schema: successSchema,
    }),
};
