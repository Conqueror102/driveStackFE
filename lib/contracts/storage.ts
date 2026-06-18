import { z } from 'zod';
import { byteStringSchema } from './shared';

export const storageAccountSummarySchema = z.object({
  accountId: z.string(),
  googleEmail: z.string().email(),
  limit: byteStringSchema,
  used: byteStringSchema,
  free: byteStringSchema,
  isDefault: z.boolean().optional().default(false),
  status: z.string().optional(),
  quotaUpdatedAt: z.string().optional(),
});

export const storageSummarySchema = z.object({
  totalLimit: byteStringSchema,
  totalUsed: byteStringSchema,
  totalFree: byteStringSchema.optional(),
  recommendedAccountId: z.string().nullable().optional(),
  refreshQueued: z.boolean().optional(),
  accounts: z.array(storageAccountSummarySchema).default([]),
});

export const storageHistorySnapshotSchema = z.object({
  accountId: z.string(),
  usedBytes: byteStringSchema,
  takenAt: z.string(),
});

export const storageHistorySchema = z.object({
  days: z.number(),
  accounts: z.array(storageAccountSummarySchema).default([]),
  snapshots: z.array(storageHistorySnapshotSchema).default([]),
});

export type StorageSummary = z.infer<typeof storageSummarySchema>;
export type StorageHistory = z.infer<typeof storageHistorySchema>;
