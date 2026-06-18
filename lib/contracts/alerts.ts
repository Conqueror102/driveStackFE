import { z } from 'zod';

export const storageAlertSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  threshold: z.union([z.literal(80), z.literal(90)]),
  triggered: z.boolean().optional(),
  sentAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
});

export const storageAlertsSchema = z.array(storageAlertSchema);

export type StorageAlert = z.infer<typeof storageAlertSchema>;
