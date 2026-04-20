import { z } from 'zod';

export const updateUserSettingsRequestSchema = z.object({
  notification: z.object({
    reminder: z.boolean().optional(),
    dailySummary: z.boolean().optional(),
  }),
});

export type UpdateUserSettingsRequest = z.input<typeof updateUserSettingsRequestSchema>;
