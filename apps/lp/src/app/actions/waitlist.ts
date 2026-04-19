"use server";

import { waitlistSchema, type WaitlistInput } from "@/lib/waitlist-schema";
import { appendRow } from "@/lib/google-sheets";

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
