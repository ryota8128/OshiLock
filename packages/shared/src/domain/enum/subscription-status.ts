import { z } from 'zod';

export const SUBSCRIPTION_STATUS = {
  FREE: 'FREE',
  TRIAL: 'TRIAL',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

export namespace SubscriptionStatus {
  export const schema = z.nativeEnum(SUBSCRIPTION_STATUS);

  export function isActive(status: SubscriptionStatus): boolean {
    return (
      status === SUBSCRIPTION_STATUS.FREE ||
      status === SUBSCRIPTION_STATUS.ACTIVE ||
      status === SUBSCRIPTION_STATUS.TRIAL
    );
  }
}
