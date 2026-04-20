import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { fromSSO } from '@aws-sdk/credential-providers';
import { awsCredentialsProvider } from '@vercel/functions/oidc';
import { env } from '../../config/env.js';

// DynamoDB Local（テスト時に global-setup が設定する）
const localEndpoint = process.env.DYNAMODB_LOCAL_ENDPOINT;

function createDynamoClient(): DynamoDBClient {
  if (localEndpoint) {
    return new DynamoDBClient({
      endpoint: localEndpoint,
      region: env.AWS_REGION,
      credentials: { accessKeyId: 'dummy', secretAccessKey: 'dummy' },
    });
  }

  return new DynamoDBClient({
    region: env.AWS_REGION,
    credentials: env.IS_LOCAL
      ? fromSSO({ profile: env.AWS_PROFILE })
      : awsCredentialsProvider({ roleArn: env.AWS_ROLE_ARN }),
  });
}

export const dynamoClient = createDynamoClient();
export const TABLE_NAME = env.DYNAMODB_TABLE_NAME;
