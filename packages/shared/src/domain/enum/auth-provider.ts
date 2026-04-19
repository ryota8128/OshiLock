export const AUTH_PROVIDER = {
  APPLE: "APPLE",
  GOOGLE: "GOOGLE",
} as const;

export type AuthProvider =
  (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER];
