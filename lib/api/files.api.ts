import {
  createUploadSessionRequestSchema,
  fileLinksSchema,
  cleanupSuggestionsSchema,
  duplicateCountSchema,
  duplicatesSchema,
  filePreviewSchema,
  listFilesParamsSchema,
  moveHistorySchema,
  moveOperationSchema,
  moveStartResponseSchema,
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

  move: (payload: { driveFileId: string; sourceAccountId: string; destinationAccountId: string }) =>
    apiFetch('/api/backend/files/move', {
      method: 'POST',
      body: payload,
      schema: moveStartResponseSchema,
    }),

  getMoveStatus: (operationId: string) =>
    apiFetch(`/api/backend/files/move/${operationId}`, {
      schema: moveOperationSchema,
    }),

  moveHistory: () =>
    apiFetch('/api/backend/files/move/history?page=1&limit=50', {
      schema: moveHistorySchema,
    }),

  bulkDelete: (payload: { files: Array<{ accountId: string; driveFileId: string }> }) =>
    apiFetch('/api/backend/files/bulk/delete', {
      method: 'POST',
      body: payload,
    }),

  bulkRestore: (payload: { files: Array<{ accountId: string; driveFileId: string }> }) =>
    apiFetch('/api/backend/files/bulk/restore', {
      method: 'POST',
      body: payload,
    }),

  bulkMove: (payload: { destinationAccountId: string; files: Array<{ sourceAccountId: string; driveFileId: string }> }) =>
    apiFetch('/api/backend/files/bulk/move', {
      method: 'POST',
      body: payload,
    }),

  duplicates: () =>
    apiFetch('/api/backend/files/duplicates', {
      schema: duplicatesSchema,
    }),

  duplicateCount: () =>
    apiFetch('/api/backend/files/duplicates/count', {
      schema: duplicateCountSchema,
    }),

  triggerDuplicateScan: () =>
    apiFetch('/api/backend/files/duplicates/scan', {
      method: 'POST',
    }),

  preview: (accountId: string, fileId: string) =>
    apiFetch(`/api/backend/files/preview/${accountId}/${fileId}`, {
      schema: filePreviewSchema,
    }),

  streamUrl: (accountId: string, fileId: string) =>
    `/api/backend/files/stream/${accountId}/${fileId}`,

  uploadFromUrl: (payload: { url: string; accountId: string; fileName?: string }) =>
    apiFetch('/api/backend/files/upload-from-url', {
      method: 'POST',
      body: payload,
    }),

  large: (params: { accountId?: string; minSizeBytes?: string | number; limit?: number } = {}) =>
    apiFetch(`/api/backend/files/large${toSearchParams(params)}`, {
      schema: paginatedFilesSchema,
    }),

  cleanupSuggestions: () =>
    apiFetch('/api/backend/files/cleanup-suggestions', {
      schema: cleanupSuggestionsSchema,
    }),

  trash: () =>
    apiFetch('/api/backend/files/trash?page=1&limit=100', {
      schema: paginatedFilesSchema,
    }),
};
