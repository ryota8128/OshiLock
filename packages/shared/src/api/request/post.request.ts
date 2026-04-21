import { z } from 'zod';
import { OshiId } from '../../domain/value-objects/branded';
import { PostBody } from '../../domain/value-objects/post-body';

export const createPostRequestSchema = z.object({
  oshiId: OshiId.schema,
  body: PostBody.schema,
  sourceUrls: z.array(z.string().url()).max(3).default([]),
});

export type CreatePostRequest = z.input<typeof createPostRequestSchema>;
