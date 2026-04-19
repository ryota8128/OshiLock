"use server";

import { z } from "zod";
import { appendRow } from "@/lib/google-sheets";

export const waitlistSchema = z.object({
  email: z.string().email("メールアドレスの形式が正しくありません"),
  oshi: z.string().min(1, "推しの名前を入力してください"),
  sns: z.string(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;

export type WaitlistResult =
  | { success: true }
  | { success: false; error: string };

export async function submitWaitlist(
  data: WaitlistInput
): Promise<WaitlistResult> {
  const parsed = waitlistSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: "入力内容を確認してください。" };
  }

  const { email, oshi, sns } = parsed.data;
  const registeredAt = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

  try {
    await appendRow([email, oshi, sns, registeredAt]);
    return { success: true };
  } catch (e) {
    console.error("Waitlist submission failed:", e);
    return { success: false, error: "登録に失敗しました。もう一度お試しください。" };
  }
}
