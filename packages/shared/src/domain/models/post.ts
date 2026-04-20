import { OshiId, PostId, UserId } from '../../types/branded';
import { UtcIsoString } from '../value-objects/utc-iso-string';

export interface Post {
  id: PostId;
  oshiId: OshiId;
  userId: UserId;
  body: string;
  sourceUrls: string[];
  createdAt: UtcIsoString;
}
