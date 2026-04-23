/**
 * 投稿ステータスの状態遷移:
 *
 * PENDING → PARSING → PARSED → PROCESSING → SUCCESS
 *               ↓   ��    ↓          ��
 *            FAILED  SKIPPED     FAILED     FAILED
 *               ↓
 *           REJECTED
 *
 * PENDING:    投��直後（DB保存済��）
 * PARSING:    waitUntil で URL fetch + AI パース中
 * PARSED:     パース完了、parseResult 保存済み、SQS 送信済み
 * SKIPPED:    パース後フィルタ��除外（古いイベント等）
 * REJECTED:   推しと無関係 or 情報価���なしと AI が判定
 * PROCESSING: SQS ワーカーが��複チェック + merge + EventInfo 作成中
 * SUCCESS:    全処理完了
 * FAILED:     いずれかのステージで失敗
 */
export const POST_STATUS = {
  PENDING: 'PENDING',
  PARSING: 'PARSING',
  PARSED: 'PARSED',
  SKIPPED: 'SKIPPED',
  REJECTED: 'REJECTED',
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS];
