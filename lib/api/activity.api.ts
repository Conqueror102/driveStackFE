import { activityFeedSchema } from '@/lib/contracts/activity';
import { apiFetch, toSearchParams } from './client';

export const activityApi = {
  recent: () =>
    apiFetch('/api/backend/activity/recent', {
      schema: activityFeedSchema,
    }),

  list: (params: { page?: number; limit?: number; type?: string } = {}) =>
    apiFetch(`/api/backend/activity${toSearchParams({ page: 1, limit: 50, ...params })}`, {
      schema: activityFeedSchema,
    }),
};
