import { z } from 'zod';
import { DisplayName } from '../../domain/value-objects/display-name';

export const updateProfileRequestSchema = z.object({
  displayName: DisplayName.schema,
  avatarPath: z.string().nullable().optional(),
});

export type UpdateProfileRequest = z.input<typeof updateProfileRequestSchema>;
