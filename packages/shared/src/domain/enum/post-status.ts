/**
 * 投稿ステータスの状態遷移:
 *
 * PENDING → PARSING → PARSED → PROCESSING → SUCCESS
 *               ↓   ↘    ↓          ↓
 *            FAILED  SKIPPED     FAILED     FAILED
 *
 * PENDING:    投稿直後（DB保存済み）
 * PARSING:    waitUntil で URL fetch + AI パース中
 * PARSED:     パース完了、parseResult 保存済み、SQS 送信済み
 * SKIPPED:    パース後フィルタで除外（古いイベント等）
 * PROCESSING: SQS ワーカーが重複チェック + merge + EventInfo 作成中
 * SUCCESS:    全処理完了
 * FAILED:     いずれかのステージで失敗
 */
export const POST_STATUS = {
  PENDING: 'PENDING',
  PARSING: 'PARSING',
  PARSED: 'PARSED',
  SKIPPED: 'SKIPPED',
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS];
