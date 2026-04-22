export const MATCH_TYPE = {
  NEW: 'NEW',
  DUPLICATE: 'DUPLICATE',
  UPDATE: 'UPDATE',
} as const;

export type MatchType = (typeof MATCH_TYPE)[keyof typeof MATCH_TYPE];
