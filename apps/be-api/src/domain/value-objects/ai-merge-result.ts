import type { z } from 'zod';
import { aiEventBaseSchema } from './ai-event-schema.js';

export const mergeResultZodSchema = aiEventBaseSchema;

export type AiMergeResult = z.output<typeof mergeResultZodSchema>;
