import { FirebaseAuthGateway } from '../infrastructure/firebase/auth.gateway.js';
import { DynamoUserRepository } from '../infrastructure/dynamo/repository/user.repository.js';
import { S3StorageGateway } from '../infrastructure/s3/storage.gateway.js';
import { SignInUseCase } from '../application/use-cases/auth/sign-in.js';
import { UpdateProfileUseCase } from '../application/use-cases/user/update-profile.js';
import { GenerateAvatarUploadUrlsUseCase } from '../application/use-cases/user/generate-avatar-upload-urls.js';

// Infrastructure
const authGateway = new FirebaseAuthGateway();
const userRepository = new DynamoUserRepository();
const storageGateway = new S3StorageGateway();

// Use Cases
export const signInUseCase = new SignInUseCase(authGateway, userRepository);
export const updateProfileUseCase = new UpdateProfileUseCase(userRepository, storageGateway);
export const generateAvatarUploadUrlsUseCase = new GenerateAvatarUploadUrlsUseCase(storageGateway);
