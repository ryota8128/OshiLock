import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromSSO } from "@aws-sdk/credential-providers";
import { awsCredentialsProvider } from "@vercel/functions/oidc";
import { env } from "../../config/env.js";

function createCredentialProvider() {
  if (env.IS_LOCAL) {
    return fromSSO({ profile: env.AWS_PROFILE });
  }
  return awsCredentialsProvider({ roleArn: env.AWS_ROLE_ARN });
}

export const dynamoClient = new DynamoDBClient({
  region: env.AWS_REGION,
  credentials: createCredentialProvider(),
});

export const TABLE_NAME = env.DYNAMODB_TABLE_NAME;
