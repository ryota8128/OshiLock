export const SUBSCRIPTION_STATUS = {
  FREE: "FREE",
  TRIAL: "TRIAL",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export type SubscriptionStatus =
  (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

export namespace SubscriptionStatus {
  export function isActive(status: SubscriptionStatus): boolean {
    return status === "FREE" || status === "ACTIVE" || status === "TRIAL";
  }
}
