'use client';

import { useState, useRef, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Section, SectionHeading } from './section';
import { PrimaryCTA } from './primary-cta';
import { submitWaitlist } from '@/app/actions/waitlist';
import { waitlistSchema } from '@/lib/waitlist-schema';

type FormValues = {
  email: string;
  oshi: string;
};

export function WaitlistSection() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { email: '', oshi: '' },
  });

  const onSubmit = (data: FormValues) => {
    setServerError('');
    startTransition(async () => {
      const result = await submitWaitlist(data);
      if (result.success) {
        setSubmitted(true);
      } else {
        setServerError(result.error);
      }
    });
  };

  return (
    <Section bg="#FAF8F4" padY={120} id="waitlist">
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
            padding: '16px 20px',
            background: '#fff',
            border: '1px solid rgba(184,154,48,0.3)',
            borderRadius: 12,
          }}
        >
          <span className="text-ink-soft leading-snug">
            永久無料枠
            <span className="text-ink-muted ml-2 text-[12px]">コミュニティごとに先着100名</span>
          </span>
          <span className="text-gold-dark font-semibold inline-flex items-center gap-1.5">
            <span className="rounded-full" style={{ width: 6, height: 6, background: '#B89A30' }} />
            あなたの推しコミュニティで先着枠受付中
          </span>
        </div>

        {/* Form */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-5 bg-white border border-black/[.08] rounded-2xl p-8 font-sans"
          >
            <Field label="メールアドレス" required error={errors.email?.message}>
              <input
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                className="w-full py-[13px] px-4 text-[15px] border-[1.5px] border-black/[.12] rounded-[10px] bg-paper text-ink font-sans transition-colors"
              />
            </Field>
            <Field
              label="あなたの推しコミュニティに投票"
              required
              hint="グループ名・アーティスト名・キャラ名など"
              error={errors.oshi?.message}
            >
              <input
                {...register('oshi')}
                placeholder="例: ○○グループ、○○さん（投票数が多い推しから開設！）"
                className="w-full py-[13px] px-4 text-[15px] border-[1.5px] border-black/[.12] rounded-[10px] bg-paper text-ink font-sans transition-colors"
              />
            </Field>
            {serverError && (
              <div className="text-terracotta text-[13px] font-medium mb-3">{serverError}</div>
            )}
            <PrimaryCTA
              full
              size="lg"
              type="submit"
              arrow
              style={{ marginTop: 12, opacity: isPending ? 0.6 : 1 }}
            >
              {isPending ? '送信中...' : '無料枠を確保する'}
            </PrimaryCTA>
            <div className="mt-4 text-[11px] text-ink-soft text-center leading-[1.7]">
              登録いただいた情報は、リリース通知・先着枠の確認にのみ使用します。
            </div>
          </form>
        ) : (
          <div
            className="mt-5 bg-white text-center font-sans"
            style={{
              border: '1px solid rgba(212,80,42,0.3)',
              borderRadius: 16,
              padding: 40,
            }}
          >
            <div
              className="mx-auto mb-5 flex items-center justify-center rounded-full"
              style={{
                width: 56,
                height: 56,
                background: 'rgba(212,80,42,0.1)',
              }}
            >
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path
                  d="M6 13l5 5 10-10"
                  stroke="#D4502A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div
              className="text-[22px] font-normal text-ink mb-2.5"
              style={{ letterSpacing: -0.3 }}
            >
              登録ありがとうございます
            </div>
            <div className="text-[14px] text-ink-muted leading-[1.8] mb-7">
              リリース時にメールでお知らせします。
            </div>
            <div
              className="text-left text-[13px] leading-[1.8] text-ink"
              style={{
                padding: '16px 20px',
                background: '#F3EFE4',
                borderRadius: 12,
              }}
            >
              <div className="text-[11px] font-semibold tracking-[1.5px] text-ink-soft mb-2">
                SHARE
              </div>
              「え、昨日出てたの？」をゼロにする推し活アプリ、OshiLockのWLに登録しました。
              <br />
              先着100名は永久無料。
              <br />
              #OshiLock
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
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <label className="flex items-center gap-1.5 text-[13px] font-medium text-ink mb-2">
        {label}
        {required && <span className="text-[10px] text-terracotta font-semibold">必須</span>}
      </label>
      {children}
      {error && <div className="text-terracotta text-[11px] mt-1.5">{error}</div>}
      {hint && !error && <div className="text-[11px] text-ink-soft mt-1.5">{hint}</div>}
    </div>
  );
}
