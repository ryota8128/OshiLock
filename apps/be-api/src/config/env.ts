import { z } from "zod";

const commonSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number(),
  AWS_REGION: z.string().min(1).default("ap-northeast-1"),
  DYNAMODB_TABLE_NAME: z.string().min(1),
});

type CommonEnv = z.infer<typeof commonSchema>;

const localSchema = z.object({
  IS_LOCAL: z.literal(true),
  AWS_PROFILE: z.string().min(1),
  FIREBASE_SERVICE_ACCOUNT_PATH: z.string().min(1),
});

type LocalEnv = z.infer<typeof localSchema>;

const remoteSchema = z.object({
  IS_LOCAL: z.literal(false),
  AWS_ROLE_ARN: z.string().min(1),
  FIREBASE_SERVICE_ACCOUNT_JSON: z.string().min(1),
});

type RemoteEnv = z.infer<typeof remoteSchema>;

type Env = CommonEnv & (LocalEnv | RemoteEnv);

function getEnv(): Env {
  const parsedCommon = commonSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    AWS_REGION: process.env.AWS_REGION,
    DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME,
  });

  const isLocal = process.env.IS_LOCAL === "true";

  const extendsEnv = isLocal
    ? localSchema.parse({
        IS_LOCAL: true,
        AWS_PROFILE: process.env.AWS_PROFILE,
        FIREBASE_SERVICE_ACCOUNT_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
      })
    : remoteSchema.parse({
        IS_LOCAL: false,
        AWS_ROLE_ARN: process.env.AWS_ROLE_ARN,
        FIREBASE_SERVICE_ACCOUNT_JSON: process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
      });

  return { ...parsedCommon, ...extendsEnv };
}

export const env = getEnv();
