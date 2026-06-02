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

export type FileType = z.infer<typeof fileTypeSchema>;
export type FileRecord = z.infer<typeof fileRecordSchema>;
export type PaginatedFiles = z.infer<typeof paginatedFilesSchema>;
export type ListFilesParams = z.infer<typeof listFilesParamsSchema>;
export type FileLinks = z.infer<typeof fileLinksSchema>;
export type CreateUploadSessionRequest = z.infer<typeof createUploadSessionRequestSchema>;
