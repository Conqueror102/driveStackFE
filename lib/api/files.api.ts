import {
  createUploadSessionRequestSchema,
  fileLinksSchema,
  listFilesParamsSchema,
  paginatedFilesSchema,
} from '@/lib/contracts/files';
import {
  completeUploadSessionRequestSchema,
  completeUploadSessionResponseSchema,
  uploadSessionSchema,
} from '@/lib/contracts/uploads';
import { successSchema } from '@/lib/contracts/shared';
import type { CreateUploadSessionRequest, ListFilesParams } from '@/lib/contracts/files';
import type { CompleteUploadSessionRequest } from '@/lib/contracts/uploads';
import { apiFetch, toSearchParams } from './client';

export const filesApi = {
  list: (params: ListFilesParams = {}) => {
    const clean = listFilesParamsSchema.parse(params);
    return apiFetch(`/api/backend/files${toSearchParams(clean)}`, {
      schema: paginatedFilesSchema,
    });
  },

  links: (accountId: string, fileId: string) =>
    apiFetch(`/api/backend/files/${accountId}/${fileId}/links`, {
      schema: fileLinksSchema,
    }),

  createSession: (payload: CreateUploadSessionRequest) =>
    apiFetch('/api/backend/files/upload-session', {
      method: 'POST',
      body: createUploadSessionRequestSchema.parse(payload),
      schema: uploadSessionSchema,
    }),

  completeUpload: (id: string, payload: CompleteUploadSessionRequest) =>
    apiFetch(`/api/backend/files/upload-session/${id}`, {
      method: 'PATCH',
      body: completeUploadSessionRequestSchema.parse(payload),
      schema: completeUploadSessionResponseSchema,
    }),

  getUploadSession: (id: string) =>
    apiFetch(`/api/backend/files/upload-session/${id}`, {
      schema: uploadSessionSchema,
    }),

  delete: (accountId: string, fileId: string) =>
    apiFetch(`/api/backend/files/${accountId}/${fileId}`, {
      method: 'DELETE',
      schema: successSchema,
    }),
};
