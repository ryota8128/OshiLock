import { DynamoDB, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

function getEndpoint(): string {
  const endpoint = process.env.DYNAMODB_LOCAL_ENDPOINT;
  if (!endpoint) {
    throw new Error('DYNAMODB_LOCAL_ENDPOINT is not set. Is globalSetup running?');
  }
  return endpoint;
}

const dummyCredentials = { accessKeyId: 'dummy', secretAccessKey: 'dummy' };

export function createTestDynamoDBClient(): DynamoDBClient {
  return new DynamoDBClient({
    endpoint: getEndpoint(),
    region: 'ap-northeast-1',
    credentials: dummyCredentials,
  });
}

export function createTestDocumentClient(): DynamoDBDocument {
  const baseClient = new DynamoDB({
    endpoint: getEndpoint(),
    region: 'ap-northeast-1',
    credentials: dummyCredentials,
  });

  return DynamoDBDocument.from(baseClient, {
    marshallOptions: {
      convertEmptyValues: true,
      removeUndefinedValues: true,
      convertClassInstanceToMap: true,
    },
  });
}
