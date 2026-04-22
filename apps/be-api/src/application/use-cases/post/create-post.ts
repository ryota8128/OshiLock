import type { OshiId, Post, UserId } from '@oshilock/shared';
import { PostId, TIMEZONES, POST_STATUS } from '@oshilock/shared';
import type { IPostRepository } from '../../../domain/repository/post.repository.interface.js';
import type { IAiGateway } from '../../../domain/gateway/ai.gateway.interface.js';
import { PostCreationPolicy } from '../../../domain/service/post-creation-policy.js';
import type { UrlProcessor } from '../../services/post/url-processor.js';

type CreatePostInput = {
  userId: UserId;
  oshiId: OshiId;
  body: string;
  sourceUrls: string[];
};

export class CreatePostUseCase {
  private readonly policy: PostCreationPolicy;

  constructor(
    private readonly postRepository: IPostRepository,
    private readonly aiGateway: IAiGateway,
    private readonly urlProcessor: UrlProcessor,
  ) {
    this.policy = new PostCreationPolicy(postRepository);
  }

  async execute(input: CreatePostInput): Promise<Post> {
    await this.policy.ensureCanCreate(input.userId, input.oshiId);

    return this.postRepository.create({
      postId: PostId.generate(),
      oshiId: input.oshiId,
      userId: input.userId,
      body: input.body,
      sourceUrls: input.sourceUrls,
    });
  }

  async parseInBackground(post: Post): Promise<void> {
    try {
      await this.postRepository.updateStatus(post.oshiId, post.id, POST_STATUS.PARSING);

      const urls = this.urlProcessor.extractUrls(post.body, post.sourceUrls);
      const results = await Promise.all(urls.map((url) => this.urlProcessor.fetchUrlText(url)));
      const sourceTexts = results.filter((text): text is string => text !== null);

      const parseResult = await this.aiGateway.parse({
        postBody: post.body,
        sourceTexts,
        timezone: TIMEZONES.ASIA_TOKYO,
      });

      const parseResultJson = JSON.stringify(parseResult);
      await this.postRepository.saveParseResult(post.oshiId, post.id, parseResultJson);

      // TODO: SQS に postId 送信（A-3 で実装）
    } catch (e) {
      console.error('Post parse failed:', e);
      await this.postRepository.updateStatus(post.oshiId, post.id, POST_STATUS.FAILED);
    }
  }
}
