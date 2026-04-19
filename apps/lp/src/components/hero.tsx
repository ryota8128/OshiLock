"use client";

import { PrimaryCTA } from "./primary-cta";
import { PhoneMockup, AppScreenHome } from "./phone-mockup";

type HeroProps = {
  scrollTarget: string;
};

function FlowNode({
  icon,
  label,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <div
      className="bg-white border border-black/10 rounded-[14px] px-[18px] py-4 min-w-[180px]"
      style={{ boxShadow: "0 2px 8px rgba(43,42,40,0.04)" }}
    >
      <div
        className="flex items-center justify-center mb-2.5"
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "rgba(212,80,42,0.08)",
        }}
      >
        {icon}
      </div>
      <div className="text-[13px] font-semibold text-ink mb-0.5 font-sans">{label}</div>
      <div className="text-[11px] text-ink-soft leading-snug font-sans">{sub}</div>
    </div>
  );
}

function HeroMeta() {
  return (
    <div className="flex items-center gap-2.5 flex-wrap mb-7">
      <span
        className="inline-flex items-center gap-2 py-[7px] px-3.5 rounded-full text-[12px] font-semibold font-sans"
        style={{
          background: "rgba(184,154,48,0.12)",
          color: "#8A7320",
          border: "1px solid rgba(184,154,48,0.3)",
          letterSpacing: 0.3,
        }}
      >
        <span
          className="rounded-full"
          style={{ width: 6, height: 6, background: "#B89A30" }}
        />
        先着100名 永久無料
      </span>
      <span className="text-[12px] text-ink-soft font-sans">2026年リリース予定</span>
    </div>
  );
}

export function HeroA({ scrollTarget }: HeroProps) {
  const handleScroll = () => {
    document.getElementById(scrollTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-paper relative overflow-hidden" style={{ padding: "clamp(60px, 8vw, 100px) 24px 80px" }}>
      <div className="max-w-[1180px] mx-auto">
        <div
          className="grid gap-12 items-center grid-responsive"
          style={{ gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 0.9fr)" }}
        >
          {/* Left */}
          <div>
            <HeroMeta />
            <h1
              className="m-0 font-sans whitespace-nowrap mb-6"
              style={{
                fontWeight: 300,
                fontSize: "clamp(44px, 6.5vw, 96px)",
                lineHeight: 1.15,
                letterSpacing: -2,
                color: "#2B2A28",
              }}
            >
              昨日出てた。
              <br />
              <span style={{ color: "#D4502A" }}>知らなかった。</span>
            </h1>
            <p className="text-ink-muted font-sans font-normal text-[17px] leading-[1.8] max-w-[480px] mb-9">
              ファンが見つけて、AIが届ける。
              <br />
              推し活専用の情報コミュニティ、OshiLock。
            </p>
            <div className="flex gap-3 flex-wrap items-center">
              <PrimaryCTA size="lg" onClick={handleScroll}>
                無料枠を確保する
              </PrimaryCTA>
              <span className="text-[12px] text-ink-soft font-sans">簡単登録 30秒</span>
            </div>
          </div>

          {/* Right — phone + floating flow nodes */}
          <div className="relative flex justify-center" style={{ height: 600 }}>
            <PhoneMockup scale={0.72}>
              <AppScreenHome />
            </PhoneMockup>
            {/* Floating nodes */}
            <div className="absolute hidden lg:block" style={{ top: 40, left: -20, transform: "rotate(-3deg)" }}>
              <FlowNode
                icon={
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 2l2.5 5 5.5.8-4 3.9.9 5.5L10 14.6 5.1 17.2 6 11.7 2 7.8 7.5 7 10 2z"
                      stroke="#D4502A"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                label="ファンが見つける"
                sub="TV出演、発売、コラボ情報"
              />
            </div>
            <div className="absolute hidden lg:block" style={{ top: 200, right: -30, transform: "rotate(2deg)" }}>
              <FlowNode
                icon={
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="7" stroke="#D4502A" strokeWidth="1.5" />
                    <path d="M7 10l2 2 4-4" stroke="#D4502A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
                label="AIが整理する"
                sub="重複削除・カテゴリ分け"
              />
            </div>
            <div className="absolute hidden lg:block" style={{ bottom: 30, left: -10, transform: "rotate(-2deg)" }}>
              <FlowNode
                icon={
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M4 8a6 6 0 0112 0v4l2 2H2l2-2V8z" stroke="#D4502A" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M8 16a2 2 0 004 0" stroke="#D4502A" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                }
                label="あなたに届く"
                sub="毎朝の見逃しチェック"
              />
            </div>
            {/* Connecting dashed lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block">
              <path d="M 130 100 Q 160 130 180 180" stroke="#D4502A" strokeWidth="1.2" fill="none" strokeDasharray="3 4" opacity="0.5" />
              <path d="M 370 280 Q 340 330 300 380" stroke="#D4502A" strokeWidth="1.2" fill="none" strokeDasharray="3 4" opacity="0.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
