import { FirebaseAuthGateway } from '../infrastructure/firebase/auth.gateway.js';
import { DynamoUserRepository } from '../infrastructure/dynamo/repository/user.repository.js';
import { SignInUseCase } from '../application/use-cases/auth/sign-in.js';

// Infrastructure
const authGateway = new FirebaseAuthGateway();
const userRepository = new DynamoUserRepository();

// Use Cases
export const signInUseCase = new SignInUseCase(authGateway, userRepository);
