import { S3Client } from '@aws-sdk/client-s3';
import { fromSSO } from '@aws-sdk/credential-providers';
import { awsCredentialsProvider } from '@vercel/functions/oidc';
import { readFileSync } from 'node:fs';
import { env } from '../../config/env.js';

export const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: env.IS_LOCAL
    ? fromSSO({ profile: env.AWS_PROFILE })
    : awsCredentialsProvider({ roleArn: env.AWS_ROLE_ARN }),
});

export function getCloudFrontPrivateKey(): string {
  if (env.IS_LOCAL) {
    return readFileSync(env.CLOUDFRONT_PRIVATE_KEY_PATH, 'utf-8');
  }
  return env.CLOUDFRONT_PRIVATE_KEY;
}
