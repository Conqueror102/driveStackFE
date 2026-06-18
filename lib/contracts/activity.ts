import { z } from 'zod';
import { paginationMetaSchema } from './shared';

export const activityEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  message: z.string().optional(),
  actor: z.string().optional(),
  fileName: z.string().optional(),
  accountEmail: z.string().optional(),
  createdAt: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export const activityFeedSchema = z.object({
  data: z.array(activityEventSchema).default([]),
  meta: paginationMetaSchema.optional(),
}).or(z.array(activityEventSchema).transform((data) => ({ data })));

export type ActivityEvent = z.infer<typeof activityEventSchema>;
