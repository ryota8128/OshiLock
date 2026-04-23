import { Type, type Schema } from '@google/genai';
import { eventBaseResponseSchema } from './event-base.schema.js';

/** パース専用スキーマ — event-base + isRelevant */
export const parseResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isRelevant: {
      type: Type.BOOLEAN,
      description:
        '投稿が指定の推しに関連する有効な情報かどうか。無関係・イタズラ・意味不明な場合は false',
    },
    ...eventBaseResponseSchema.properties,
  },
  required: ['isRelevant', ...(eventBaseResponseSchema.required ?? [])],
} as const;
