import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl as getS3SignedUrl } from '@aws-sdk/s3-request-presigner';
import { getSignedUrl as getCfSignedUrl } from '@aws-sdk/cloudfront-signer';
import { ulid } from 'ulid';
import { UtcIsoString } from '@oshilock/shared';
import type {
  IStorageGateway,
  AvatarPresignedUploadUrls,
  AvatarSignedDisplayUrls,
} from '../../domain/gateway/storage.gateway.interface.js';
import { s3Client, getCloudFrontPrivateKey } from './client.js';
import { env } from '../../config/env.js';

const PRESIGNED_URL_EXPIRY = 600; // 10分
const SIGNED_URL_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24時間

// avatarPath: "avatars/u_xxx/hash"（先頭 / なし）
function toS3Key(path: string, suffix: string): string {
  return `${path}${suffix}`;
}

function toCfUrl(path: string, suffix: string): string {
  return `https://${env.CLOUDFRONT_DOMAIN}/${path}${suffix}`;
}

export class S3StorageGateway implements IStorageGateway {
  private readonly privateKey: string;

  constructor() {
    this.privateKey = getCloudFrontPrivateKey();
  }

  async generateAvatarUploadUrls(userId: string): Promise<AvatarPresignedUploadUrls> {
    const hash = ulid().slice(0, 8).toLowerCase();
    const avatarPath = `avatars/${userId}/${hash}`;

    const [smUploadUrl, lgUploadUrl] = await Promise.all([
      getS3SignedUrl(
        s3Client,
        new PutObjectCommand({
          Bucket: env.S3_BUCKET_NAME,
          Key: toS3Key(avatarPath, '_sm.webp'),
          ContentType: 'image/webp',
        }),
        { expiresIn: PRESIGNED_URL_EXPIRY },
      ),
      getS3SignedUrl(
        s3Client,
        new PutObjectCommand({
          Bucket: env.S3_BUCKET_NAME,
          Key: toS3Key(avatarPath, '_lg.webp'),
          ContentType: 'image/webp',
        }),
        { expiresIn: PRESIGNED_URL_EXPIRY },
      ),
    ]);

    return { avatarPath, smUploadUrl, lgUploadUrl };
  }

  generateAvatarDisplayUrls(avatarPath: string): AvatarSignedDisplayUrls {
    const dateLessThan = UtcIsoString.afterMs(SIGNED_URL_EXPIRY_MS);

    const avatarSmUrl = getCfSignedUrl({
      url: toCfUrl(avatarPath, '_sm.webp'),
      dateLessThan,
      privateKey: this.privateKey,
      keyPairId: env.CLOUDFRONT_KEY_PAIR_ID,
    });

    const avatarLgUrl = getCfSignedUrl({
      url: toCfUrl(avatarPath, '_lg.webp'),
      dateLessThan,
      privateKey: this.privateKey,
      keyPairId: env.CLOUDFRONT_KEY_PAIR_ID,
    });

    return { avatarSmUrl, avatarLgUrl };
  }
}
