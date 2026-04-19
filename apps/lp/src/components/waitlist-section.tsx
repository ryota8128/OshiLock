"use client";

import { useState, useRef } from "react";
import { Section, SectionHeading } from "./section";
import { PrimaryCTA } from "./primary-cta";

export function WaitlistSection() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [oshi, setOshi] = useState("");
  const [sns, setSns] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !oshi) return;
    setSubmitted(true);
  };

  return (
    <Section bg="#F3EFE4" padY={120} id="waitlist">
      <div ref={formRef} />
      <div className="max-w-[640px] mx-auto">
        <SectionHeading
          eyebrow="JOIN THE WAITLIST"
          title={
            <>
              リリース前に、
              <br />
              無料枠をロックしよう。
            </>
          }
          sub="先着100名は永久無料。あなたの推し、教えてください。2026年リリース予定。"
        />

        {/* Counter */}
        <div
          className="mt-10 flex items-center justify-between flex-wrap gap-2 font-sans text-[13px]"
          style={{
            padding: "16px 20px",
            background: "#fff",
            border: "1px solid rgba(184,154,48,0.3)",
            borderRadius: 12,
          }}
        >
          <span className="text-ink-soft leading-snug">
            永久無料枠
            <span className="text-ink-muted ml-2 text-[12px]">コミュニティごとに先着100名</span>
          </span>
          <span className="text-gold-dark font-semibold inline-flex items-center gap-1.5">
            <span className="rounded-full" style={{ width: 6, height: 6, background: "#B89A30" }} />
            あなたの推しコミュニティで先着枠受付中
          </span>
        </div>

        {/* Form */}
        {!submitted ? (
          <form
            onSubmit={onSubmit}
            className="mt-5 bg-white border border-black/[.08] rounded-2xl p-8 font-sans"
          >
            <Field label="メールアドレス" required>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full py-[13px] px-4 text-[15px] border-[1.5px] border-black/[.12] rounded-[10px] bg-paper text-ink font-sans transition-colors"
              />
            </Field>
            <Field label="あなたの推し" required hint="グループ名・アーティスト名・キャラ名など">
              <input
                value={oshi}
                onChange={(e) => setOshi(e.target.value)}
                placeholder="例: 〇〇グループ、〇〇さん"
                required
                className="w-full py-[13px] px-4 text-[15px] border-[1.5px] border-black/[.12] rounded-[10px] bg-paper text-ink font-sans transition-colors"
              />
            </Field>
            <Field label="拡散してくれたSNSアカウント" hint="任意 · X / Threads のみ">
              <input
                value={sns}
                onChange={(e) => setSns(e.target.value)}
                placeholder="@your_account（X / Threads）"
                className="w-full py-[13px] px-4 text-[15px] border-[1.5px] border-black/[.12] rounded-[10px] bg-paper text-ink font-sans transition-colors"
              />
            </Field>
            <PrimaryCTA full size="lg" type="submit" arrow style={{ marginTop: 12 }}>
              無料枠を確保する
            </PrimaryCTA>
            <div className="mt-4 text-[11px] text-ink-soft text-center leading-[1.7]">
              登録いただいた情報は、リリース通知・先着枠の確認にのみ使用します。
            </div>
          </form>
        ) : (
          <div
            className="mt-5 bg-white text-center font-sans"
            style={{
              border: "1px solid rgba(212,80,42,0.3)",
              borderRadius: 16,
              padding: 40,
            }}
          >
            <div
              className="mx-auto mb-5 flex items-center justify-center rounded-full"
              style={{
                width: 56,
                height: 56,
                background: "rgba(212,80,42,0.1)",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path d="M6 13l5 5 10-10" stroke="#D4502A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-[22px] font-normal text-ink mb-2.5" style={{ letterSpacing: -0.3 }}>
              登録ありがとうございます
            </div>
            <div className="text-[14px] text-ink-muted leading-[1.8] mb-7">
              リリース時にメールでお知らせします。
            </div>
            <div
              className="text-left text-[13px] leading-[1.8] text-ink"
              style={{
                padding: "16px 20px",
                background: "#F3EFE4",
                borderRadius: 12,
              }}
            >
              <div className="text-[11px] font-semibold tracking-[1.5px] text-ink-soft mb-2">SHARE</div>
              「え、昨日出てたの？」をゼロにする推し活アプリ、OshiLockのWLに登録しました。先着100名は永久無料。 #OshiLock
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <label className="flex items-center gap-1.5 text-[13px] font-medium text-ink mb-2">
        {label}
        {required && <span className="text-[10px] text-terracotta font-semibold">必須</span>}
      </label>
      {children}
      {hint && <div className="text-[11px] text-ink-soft mt-1.5">{hint}</div>}
    </div>
  );
}
