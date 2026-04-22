import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import type { OshiId } from '@oshilock/shared';
import type { ISummaryGateway } from '../../domain/gateway/summary.gateway.interface.js';
import { s3Client } from './client.js';
import { env } from '../../config/env.js';

export class S3SummaryGateway implements ISummaryGateway {
  async getToonSummary(oshiId: OshiId): Promise<string | null> {
    try {
      const result = await s3Client.send(
        new GetObjectCommand({
          Bucket: env.S3_BUCKET_NAME,
          Key: `summaries/${oshiId}.toon`,
        }),
      );

      return (await result.Body?.transformToString()) ?? null;
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'NoSuchKey') return null;
      throw e;
    }
  }

  async putToonSummary(oshiId: OshiId, toon: string): Promise<void> {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: `summaries/${oshiId}.toon`,
        Body: toon,
        ContentType: 'text/plain; charset=utf-8',
      }),
    );
  }
}
