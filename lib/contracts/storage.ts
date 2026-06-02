import { z } from 'zod';
import { byteStringSchema } from './shared';

export const storageAccountSummarySchema = z.object({
  accountId: z.string(),
  googleEmail: z.string().email(),
  limit: byteStringSchema,
  used: byteStringSchema,
  free: byteStringSchema,
  status: z.string().optional(),
  quotaUpdatedAt: z.string().optional(),
});

export const storageSummarySchema = z.object({
  totalLimit: byteStringSchema,
  totalUsed: byteStringSchema,
  totalFree: byteStringSchema.optional(),
  refreshQueued: z.boolean().optional(),
  accounts: z.array(storageAccountSummarySchema).default([]),
});

export type StorageSummary = z.infer<typeof storageSummarySchema>;
