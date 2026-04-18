export const SOURCE_RELIABILITY = {
  OFFICIAL: "OFFICIAL",
  SOURCED: "SOURCED",
  UNVERIFIED: "UNVERIFIED",
} as const;

export type SourceReliability =
  (typeof SOURCE_RELIABILITY)[keyof typeof SOURCE_RELIABILITY];