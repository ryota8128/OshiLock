import { SQSClient } from '@aws-sdk/client-sqs';
import { fromSSO } from '@aws-sdk/credential-providers';
import { awsCredentialsProvider } from '@vercel/functions/oidc';
import { env } from '../../config/env.js';

function createSqsClient(): SQSClient {
  return new SQSClient({
    region: env.AWS_REGION,
    credentials: env.IS_LOCAL
      ? fromSSO({ profile: env.AWS_PROFILE })
      : awsCredentialsProvider({ roleArn: env.AWS_ROLE_ARN }),
  });
}

export const sqsClient = createSqsClient();
