export const POST_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  PROCESSED: 'PROCESSED',
  FAILED: 'FAILED',
} as const;

export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS];
