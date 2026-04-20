import { OshiId, UserId } from '../value-objects/branded';
import { UtcIsoString } from '../value-objects/utc-iso-string';
import { SubscriptionStatus } from '../enum/subscription-status';

export interface UserOshi {
  userId: UserId;
  oshiId: OshiId;
  order: number;
  subscriptionStatus: SubscriptionStatus;
  joinedAt: UtcIsoString;
  expiresAt: UtcIsoString | null;
}
