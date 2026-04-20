import { Hono } from 'hono';
import type { AuthEnv } from '../../middleware/auth.js';
import {
  type UpdateProfileResponse,
  type AvatarPresignedUrlsResponse,
  updateProfileRequestSchema,
} from '@oshilock/shared';
import {
  updateProfileUseCase,
  generateAvatarUploadUrlsUseCase,
} from '../../../composition/dependencies.js';
import { validate } from '../../middleware/validate.js';

const user = new Hono<AuthEnv>();

user.post('/me/avatar/presigned-urls', async (c) => {
  const { userId } = c.get('auth');
  const result = await generateAvatarUploadUrlsUseCase.execute(userId);
  const response: AvatarPresignedUrlsResponse = result;
  return c.json(response);
});

user.put('/me/profile', validate({ body: updateProfileRequestSchema }), async (c) => {
  const { userId } = c.get('auth');
  const { displayName, avatarPath } = c.get('validated');

  const result = await updateProfileUseCase.execute({
    userId,
    displayName,
    avatarPath,
  });

  const response: UpdateProfileResponse = { user: result };
  return c.json(response);
});

export { user };
