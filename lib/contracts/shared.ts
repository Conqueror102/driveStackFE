import { z } from 'zod';

export const byteStringSchema = z.string().regex(/^\d+$/, 'Expected a numeric string');

export const successSchema = z.object({
  success: z.boolean(),
});

export const apiErrorSchema = z.object({
  statusCode: z.number(),
  message: z.union([z.string(), z.array(z.string())]),
  error: z.string().optional(),
  timestamp: z.string().optional(),
  path: z.string().optional(),
});

export type ApiErrorBody = z.infer<typeof apiErrorSchema>;

export const paginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  lastPage: z.number(),
});

export function normalizeApiMessage(error: unknown, fallback = 'Request failed') {
  const parsed = apiErrorSchema.safeParse(error);
  if (!parsed.success) {
    if (error && typeof error === 'object' && 'message' in error) {
      const message = (error as { message?: unknown }).message;
      if (Array.isArray(message)) return message.join('\n');
      if (typeof message === 'string') return message;
    }

    return fallback;
  }

  const { message } = parsed.data;
  return Array.isArray(message) ? message.join('\n') : message;
}
