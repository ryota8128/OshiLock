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
import { CreatePostUseCase } from '../application/use-cases/post/create-post.js';

// Infrastructure
const authGateway = new FirebaseAuthGateway();
const userRepository = new DynamoUserRepository();
const userSettingsRepository = new DynamoUserSettingsRepository();
const storageGateway = new S3StorageGateway();
const postRepository = new DynamoPostRepository();

// Use Cases
export const signInUseCase = new SignInUseCase(authGateway, userRepository);
export const getProfileUseCase = new GetProfileUseCase(userRepository, storageGateway);
export const updateProfileUseCase = new UpdateProfileUseCase(userRepository, storageGateway);
export const generateAvatarUploadUrlsUseCase = new GenerateAvatarUploadUrlsUseCase(storageGateway);
export const getSettingsUseCase = new GetSettingsUseCase(userSettingsRepository);
export const updateSettingsUseCase = new UpdateSettingsUseCase(userSettingsRepository);
export const createPostUseCase = new CreatePostUseCase(postRepository);
