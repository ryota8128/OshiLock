import { FirebaseAuthGateway } from '../infrastructure/firebase/auth.gateway.js';
import { DynamoUserRepository } from '../infrastructure/dynamo/repository/user.repository.js';
import { DynamoUserSettingsRepository } from '../infrastructure/dynamo/repository/user-settings.repository.js';
import { S3StorageGateway } from '../infrastructure/s3/storage.gateway.js';
import { SignInUseCase } from '../application/use-cases/auth/sign-in.js';
import { GetProfileUseCase } from '../application/use-cases/user/get-profile.js';
import { UpdateProfileUseCase } from '../application/use-cases/user/update-profile.js';
import { GenerateAvatarUploadUrlsUseCase } from '../application/use-cases/user/generate-avatar-upload-urls.js';
import { GetSettingsUseCase } from '../application/use-cases/user/get-settings.js';
import { UpdateSettingsUseCase } from '../application/use-cases/user/update-settings.js';
import { DynamoPostRepository } from '../infrastructure/dynamo/repository/post.repository.js';
import { DynamoEventInfoRepository } from '../infrastructure/dynamo/repository/event-info.repository.js';
import { GeminiAiGateway } from '../infrastructure/gemini/ai.gateway.js';
import { geminiClient } from '../infrastructure/gemini/client.js';
import { SqsGateway } from '../infrastructure/sqs/sqs.gateway.js';
import { sqsClient } from '../infrastructure/sqs/client.js';
import { S3SummaryGateway } from '../infrastructure/s3/summary.gateway.js';
import { UrlProcessor } from '../application/services/post/url-processor.js';
import { UrlDuplicateChecker } from '../application/services/post/url-duplicate-checker.js';
import { PostEligibilityFilter } from '../domain/service/post-eligibility-filter.js';
import { ToonBuilder } from '../application/services/post/toon-builder.js';
import { CreatePostUseCase } from '../application/use-cases/post/create-post.js';
import { ProcessPostUseCase } from '../application/use-cases/post/process-post.js';

// Infrastructure
const authGateway = new FirebaseAuthGateway();
const userRepository = new DynamoUserRepository();
const userSettingsRepository = new DynamoUserSettingsRepository();
const storageGateway = new S3StorageGateway();
const postRepository = new DynamoPostRepository();
const eventInfoRepository = new DynamoEventInfoRepository();
const aiGateway = new GeminiAiGateway(geminiClient);
const sqsGateway = new SqsGateway(sqsClient);
const summaryGateway = new S3SummaryGateway();

// Application Services
const urlProcessor = new UrlProcessor();
const urlDuplicateChecker = new UrlDuplicateChecker(eventInfoRepository);
const eligibilityFilter = new PostEligibilityFilter();
const toonBuilder = new ToonBuilder();

// Use Cases
export const signInUseCase = new SignInUseCase(authGateway, userRepository);
export const getProfileUseCase = new GetProfileUseCase(userRepository, storageGateway);
export const updateProfileUseCase = new UpdateProfileUseCase(userRepository, storageGateway);
export const generateAvatarUploadUrlsUseCase = new GenerateAvatarUploadUrlsUseCase(storageGateway);
export const getSettingsUseCase = new GetSettingsUseCase(userSettingsRepository);
export const updateSettingsUseCase = new UpdateSettingsUseCase(userSettingsRepository);
export const createPostUseCase = new CreatePostUseCase(
  postRepository,
  aiGateway,
  urlProcessor,
  sqsGateway,
  eligibilityFilter,
);
export const processPostUseCase = new ProcessPostUseCase(
  postRepository,
  eventInfoRepository,
  aiGateway,
  summaryGateway,
  urlDuplicateChecker,
  eligibilityFilter,
  toonBuilder,
);
