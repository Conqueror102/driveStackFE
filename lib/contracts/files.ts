import { z } from 'zod';
import { byteStringSchema, paginationMetaSchema } from './shared';

export const fileTypeSchema = z.enum([
  'DOCUMENT',
  'SPREADSHEET',
  'PRESENTATION',
  'PDF',
  'IMAGE',
  'VIDEO',
  'AUDIO',
  'FOLDER',
  'OTHER',
]);

export const fileSortBySchema = z.enum(['name', 'size', 'modifiedAt']);
export const sortOrderSchema = z.enum(['asc', 'desc']);

export const fileAccountSchema = z.object({
  id: z.string(),
  googleEmail: z.string().email(),
  displayName: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
});

export const fileRecordSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  driveFileId: z.string(),
  name: z.string(),
  mimeType: z.string(),
  fileType: fileTypeSchema,
  sizeBytes: byteStringSchema,
  webViewLink: z.string().nullable().optional(),
  thumbnailLink: z.string().nullable().optional(),
  thumbnailProxyUrl: z.string().nullable().optional(),
  driveParentId: z.string().nullable().optional(),
  isFolder: z.boolean(),
  driveCreatedAt: z.string().optional(),
  driveModifiedAt: z.string(),
  cachedAt: z.string().optional(),
  account: fileAccountSchema,
});

export const paginatedFilesSchema = z.object({
  data: z.array(fileRecordSchema),
  meta: paginationMetaSchema,
});

export const listFilesParamsSchema = z.object({
  accountId: z.string().optional(),
  fileType: fileTypeSchema.optional(),
  search: z.string().optional(),
  parentId: z.string().optional(),
  minSizeBytes: z.string().or(z.number()).optional(),
  maxSizeBytes: z.string().or(z.number()).optional(),
  modifiedAfter: z.string().optional(),
  modifiedBefore: z.string().optional(),
  trashed: z.boolean().optional(),
  sortBy: fileSortBySchema.optional(),
  sortOrder: sortOrderSchema.optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(200).optional(),
});

export const fileLinksSchema = z.object({
  driveFileId: z.string(),
  name: z.string(),
  mimeType: z.string(),
  webViewLink: z.string().nullable().optional(),
  webContentLink: z.string().nullable().optional(),
  exportLinks: z.record(z.string(), z.string()).nullable().optional(),
});

export const createUploadSessionRequestSchema = z.object({
  accountId: z.string().min(1),
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  fileSize: z.number().int().positive(),
  parentId: z.string().optional(),
});

export const moveStatusSchema = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED']);
export const movePhaseSchema = z.enum([
  'PREPARING',
  'COPYING_NATIVE',
  'DOWNLOADING',
  'UPLOADING',
  'CREATING_FOLDER',
  'MOVING_CHILDREN',
  'TRASHING_SOURCE',
  'SYNCING_CACHE',
  'COMPLETED',
]).optional().nullable();

export const moveOperationSchema = z.object({
  id: z.string().optional(),
  operationId: z.string().optional(),
  driveFileId: z.string().optional(),
  fileName: z.string().optional(),
  sourceAccountId: z.string().optional(),
  destinationAccountId: z.string().optional(),
  status: moveStatusSchema,
  phase: movePhaseSchema,
  bytesTransferred: byteStringSchema.optional().default('0'),
  totalBytes: byteStringSchema.optional().default('0'),
  progress: z.number().optional().default(0),
  totalItems: z.number().optional().default(0),
  completedItems: z.number().optional().default(0),
  error: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  completedAt: z.string().nullable().optional(),
});

export const moveStartResponseSchema = z.object({
  operationId: z.string(),
  queued: z.boolean().optional(),
});

export const moveHistorySchema = z.object({
  data: z.array(moveOperationSchema).default([]),
  meta: paginationMetaSchema.optional(),
});

export const duplicateFileSchema = fileRecordSchema.extend({
  accountId: z.string(),
});

export const duplicateGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  sizeBytes: byteStringSchema,
  files: z.array(duplicateFileSchema).default([]),
});

export const duplicatesSchema = z.object({
  summary: z.object({
    groups: z.number().default(0),
    duplicateFiles: z.number().default(0),
    recoverableBytes: byteStringSchema.default('0'),
    lastScannedAt: z.string().nullable().optional(),
  }),
  groups: z.array(duplicateGroupSchema).default([]),
});

export const duplicateCountSchema = z.object({
  count: z.number().default(0),
}).or(z.number().transform((count) => ({ count })));

export const filePreviewSchema = z.object({
  previewUrl: z.string(),
  type: z.enum(['embed', 'stream']),
  mimeType: z.string(),
  name: z.string(),
});

export const cleanupSuggestionsSchema = z.object({
  largestFiles: z.array(fileRecordSchema).default([]),
  duplicates: z.array(duplicateGroupSchema).default([]),
  nearQuotaAccounts: z.array(z.any()).default([]),
  oldLargeVideos: z.array(fileRecordSchema).default([]),
});

export type FileType = z.infer<typeof fileTypeSchema>;
export type FileRecord = z.infer<typeof fileRecordSchema>;
export type PaginatedFiles = z.infer<typeof paginatedFilesSchema>;
export type ListFilesParams = z.infer<typeof listFilesParamsSchema>;
export type FileLinks = z.infer<typeof fileLinksSchema>;
export type CreateUploadSessionRequest = z.infer<typeof createUploadSessionRequestSchema>;
export type MoveOperation = z.infer<typeof moveOperationSchema>;
export type DuplicatesResponse = z.infer<typeof duplicatesSchema>;
export type DuplicateGroup = z.infer<typeof duplicateGroupSchema>;
export type FilePreview = z.infer<typeof filePreviewSchema>;
