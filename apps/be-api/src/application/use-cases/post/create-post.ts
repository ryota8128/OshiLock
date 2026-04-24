import type { OshiId, Post, UserId } from '@oshilock/shared';
import { PostId, UtcIsoString, TIMEZONES, POST_STATUS } from '@oshilock/shared';
import type { IPostRepository } from '../../../domain/repository/post.repository.interface.js';
import type { IAiGateway } from '../../../domain/gateway/ai.gateway.interface.js';
import type { ISqsGateway } from '../../../domain/gateway/sqs.gateway.interface.js';
import { PostCreationPolicy } from '../../../domain/service/post-creation-policy.js';
import { ParseResultJson } from '../../../domain/value-objects/parse-result-json.js';
import type { UrlProcessor } from '../../services/post/url-processor.js';
import type { PostEligibilityFilter } from '../../../domain/service/post-eligibility-filter.js';

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
    private readonly sqsGateway: ISqsGateway,
    private readonly eligibilityFilter: PostEligibilityFilter,
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
      await this.postRepository.updateStatus(post.id, POST_STATUS.PARSING);

      const urls = this.urlProcessor.extractUrls(post.body, post.sourceUrls);
      const results = await Promise.all(urls.map((url) => this.urlProcessor.fetchUrlText(url)));
      const sourceTexts = results.filter((text): text is string => text !== null);

      const parseResult = await this.aiGateway.parse({
        oshiName: 'UVERworld', // TODO: ポストのオシIDからオシ名を取得する
        postBody: post.body,
        sourceTexts,
        timezone: TIMEZONES.ASIA_TOKYO,
      });

      if (!parseResult) {
        await this.postRepository.updateStatus(post.id, POST_STATUS.REJECTED);
        return;
      }

      await this.postRepository.saveParseResult(post.id, ParseResultJson.stringify(parseResult));

      const sortDate = parseResult.startDate
        ? UtcIsoString.fromDateAndTime(
            parseResult.startDate,
            parseResult.startTime,
            TIMEZONES.ASIA_TOKYO,
          )
        : post.createdAt;
      if (!this.eligibilityFilter.shouldProcess({ sortDate })) {
        await this.postRepository.updateStatus(post.id, POST_STATUS.SKIPPED);
        return;
      }

      await this.sqsGateway.sendPostProcessing(post.id, post.oshiId);
    } catch (e) {
      console.error('Post parse failed:', e);
      await this.postRepository.updateStatus(post.id, POST_STATUS.FAILED);
    }
  }
}
