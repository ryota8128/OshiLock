import { z } from 'zod';
import { DisplayName } from '@oshilock/shared';

export const updateProfileRequestSchema = z.object({
  displayName: DisplayName.schema,
  avatarPath: z.string().nullable().optional(),
});
