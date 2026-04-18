export const PLATFORM = {
  IOS: "ios",
  ANDROID: "android",
} as const;

export type Platform = (typeof PLATFORM)[keyof typeof PLATFORM];
