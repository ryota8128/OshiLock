import { z } from "zod";

export const waitlistSchema = z.object({
  email: z.string().email("メールアドレスの形式が正しくありません"),
  oshi: z.string().min(1, "推しの名前を入力してください"),
  sns: z.string(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
