import { z } from 'zod';

export const notificationSchema = z.object({
  id: z.string(),
  type: z.string(),
  message: z.string(),
  read: z.boolean().default(false),
  createdAt: z.string(),
});

export const notificationsSchema = z.array(notificationSchema);

export type Notification = z.infer<typeof notificationSchema>;
