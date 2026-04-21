import type { OshiId, Post, UserId } from '@oshilock/shared';
import { PostId } from '@oshilock/shared';
import type { IPostRepository } from '../../../domain/repository/post.repository.interface.js';
import { PostCreationPolicy } from '../../../domain/service/post-creation-policy.js';

type CreatePostInput = {
  userId: UserId;
  oshiId: OshiId;
  body: string;
  sourceUrls: string[];
};

export class CreatePostUseCase {
  private readonly policy: PostCreationPolicy;

  constructor(private readonly postRepository: IPostRepository) {
    this.policy = new PostCreationPolicy(postRepository);
  }

  async execute(input: CreatePostInput): Promise<Post> {
    await this.policy.ensureCanCreate(input.userId);

    return this.postRepository.create({
      postId: PostId.generate(),
      oshiId: input.oshiId,
      userId: input.userId,
      body: input.body,
      sourceUrls: input.sourceUrls,
    });
  }
}
