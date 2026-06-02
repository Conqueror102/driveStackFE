import { z } from 'zod';
import { byteStringSchema } from './shared';

export const uploadStatusSchema = z.enum([
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED',
  'FAILED',
  'EXPIRED',
]);

export const uploadSessionSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  accountId: z.string(),
  sessionUri: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  fileType: z.string(),
  fileSize: byteStringSchema,
  status: uploadStatusSchema,
  bytesUploaded: byteStringSchema,
  driveFileId: z.string().nullable().optional(),
  verifiedAt: z.string().nullable().optional(),
  expiresAt: z.string(),
  completedAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
});

export const completeUploadSessionRequestSchema = z.object({
  driveFileId: z.string().min(1),
  bytesUploaded: byteStringSchema,
});

export const completeUploadSessionResponseSchema = z.union([
  z.object({ queued: z.literal(true) }),
  z.object({ queued: z.literal(false), completed: z.boolean() }),
]);

export type UploadStatus = z.infer<typeof uploadStatusSchema>;
export type UploadSession = z.infer<typeof uploadSessionSchema>;
export type CompleteUploadSessionRequest = z.infer<typeof completeUploadSessionRequestSchema>;
export type CompleteUploadSessionResponse = z.infer<typeof completeUploadSessionResponseSchema>;
