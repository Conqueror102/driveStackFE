import { z } from 'zod';
import { byteStringSchema } from './shared';

export const accountStatusSchema = z.enum([
  'ACTIVE',
  'REAUTH_REQUIRED',
  'SYNC_FAILED',
  'DISCONNECTED',
]);

export const connectedAccountSchema = z.object({
  id: z.string(),
  googleEmail: z.string().email(),
  displayName: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  storageLimit: byteStringSchema,
  storageUsed: byteStringSchema,
  quotaUpdatedAt: z.string(),
  status: accountStatusSchema,
  lastSyncAt: z.string().nullable().optional(),
  lastSyncError: z.string().nullable().optional(),
  reauthRequiredAt: z.string().nullable().optional(),
  createdAt: z.string(),
});

export const connectedAccountsSchema = z.array(connectedAccountSchema);

export type AccountStatus = z.infer<typeof accountStatusSchema>;
export type ConnectedAccount = z.infer<typeof connectedAccountSchema>;
