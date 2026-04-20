import { UserId } from '../value-objects/branded';
import { UtcIsoString } from '../value-objects/utc-iso-string';
import { Platform } from '../enum/platform';

export interface UserPushToken {
  userId: UserId;
  token: string;
  platform: Platform;
  createdAt: UtcIsoString;
}
