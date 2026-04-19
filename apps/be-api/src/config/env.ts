import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number(),
  AWS_REGION: z.string().min(1).default("ap-northeast-1"),
  AWS_PROFILE: z.string().optional(),
  AWS_ROLE_ARN: z.string().optional(),
  IS_LOCAL: z.coerce.boolean().default(false),
  DYNAMODB_TABLE_NAME: z.string().min(1),
});

const parsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  AWS_REGION: process.env.AWS_REGION,
  AWS_PROFILE: process.env.AWS_PROFILE,
  AWS_ROLE_ARN: process.env.AWS_ROLE_ARN,
  IS_LOCAL: process.env.IS_LOCAL,
  DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME,
});

if (!parsed.success) {
  console.error("❌ 環境変数の検証に失敗しました:", parsed.error.flatten());
  throw new Error(parsed.error.message);
}

export const env = parsed.data;
