"use client";

import { Section, SectionHeading } from "./section";

type PricingSectionProps = {
  scrollTarget: string;
};

export function PricingSection({ scrollTarget }: PricingSectionProps) {
  const handleScroll = () => {
    document.getElementById(scrollTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Section bg="#F3EFE4" padY={120}>
      <SectionHeading
        eyebrow="PRICING"
        title={
          <>
            1コミュニティ、
            <br />
            月500円。
          </>
        }
      />
      <div
        className="mx-auto grid gap-6 grid-responsive"
        style={{
          marginTop: 64,
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          maxWidth: 860,
        }}
      >
        {/* Standard */}
        <div className="bg-white border border-black/[.08] rounded-2xl font-sans" style={{ padding: "40px 36px" }}>
          <div className="text-[12px] font-semibold tracking-[2px] text-ink-soft mb-4">STANDARD</div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-[48px] font-light text-ink" style={{ letterSpacing: -1.5 }}>
              ¥500
            </span>
            <span className="text-[14px] text-ink-soft">/ 月</span>
          </div>
          <div className="text-[13px] text-ink-soft mb-7">コミュニティごと</div>
          <ul className="list-none p-0 m-0 flex flex-col gap-3 text-[14px] text-ink leading-relaxed">
            {["推しグループごとに参加", "7日間の無料トライアル", "推しが増えたらコミュニティを追加"].map(
              (t, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-1">
                    <path d="M3 7l2.5 2.5L11 4" stroke="#2B2A28" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Founding Members */}
        <div
          className="relative overflow-hidden rounded-2xl text-paper font-sans"
          style={{
            background: "linear-gradient(180deg, #2B2A28 0%, #1a1917 100%)",
            padding: "40px 36px",
          }}
        >
          <div
            className="absolute top-4 right-4 text-[10px] font-semibold tracking-[1.5px] rounded-full"
            style={{
              padding: "5px 10px",
              background: "rgba(184,154,48,0.2)",
              color: "#D4B84A",
              border: "1px solid rgba(184,154,48,0.4)",
            }}
          >
            LIMITED
          </div>
          <div className="text-[12px] font-semibold tracking-[2px] mb-4" style={{ color: "#D4B84A" }}>
            FOUNDING MEMBERS
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[42px] font-light" style={{ letterSpacing: -1 }}>
              永久無料
            </span>
          </div>
          <div className="text-[13px] opacity-70 mb-7">先着100名 · コミュニティごと</div>
          <ul className="list-none p-0 m-0 mb-7 flex flex-col gap-3 text-[14px] leading-relaxed">
            {["スタンダードの全機能", "月額 0円 · ずっと", "先行アクセス権"].map((t, i) => (
              <li key={i} className="flex gap-2.5 items-start">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-1">
                  <path d="M3 7l2.5 2.5L11 4" stroke="#D4B84A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
          <button
            onClick={handleScroll}
            className="w-full py-3.5 px-5 bg-paper text-ink border-none rounded-xl text-[15px] font-medium font-sans cursor-pointer hover:opacity-90 transition-opacity"
          >
            無料枠を確保する
          </button>
        </div>
      </div>
    </Section>
  );
}
