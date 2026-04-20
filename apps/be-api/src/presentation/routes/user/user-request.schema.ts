import { z } from 'zod';

export const updateProfileRequestSchema = z.object({
  displayName: z.string().min(2).max(20),
  avatarPath: z.string().nullable().optional(),
});
