import { Type, type Schema } from '@google/genai';
import { EVENT_CATEGORY } from '@oshilock/shared';

/** AI parse / merge 共通の Gemini structured output スキーマ */
export const eventBaseResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'イベントや情報のタイトル（30文字以内）' },
    category: {
      type: Type.STRING,
      enum: Object.values(EVENT_CATEGORY),
      description: 'カテゴリ',
    },
    startDate: {
      type: Type.STRING,
      nullable: true,
      description: '開始日（YYYY-MM-DD）。不明な場合は null',
    },
    startTime: {
      type: Type.STRING,
      nullable: true,
      description: '開始時刻（HH:mm）。不明な場合は null',
    },
    endDate: {
      type: Type.STRING,
      nullable: true,
      description: '終了日（YYYY-MM-DD）。開始日と同日または単日なら null',
    },
    endTime: {
      type: Type.STRING,
      nullable: true,
      description: '終了時刻（HH:mm）。不明な場合は null',
    },
    summary: { type: Type.STRING, description: '1行サマリ（50文字以内）' },
    detail: { type: Type.STRING, description: '情報の詳細。日時・場所・条件・注意事項など' },
  },
  required: [
    'title',
    'category',
    'startDate',
    'startTime',
    'endDate',
    'endTime',
    'summary',
    'detail',
  ],
} as const;
