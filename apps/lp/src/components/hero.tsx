"use client";

import { PrimaryCTA } from "./primary-cta";
import { PhoneMockup } from "./phone-mockup";

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
      <div className="text-[13px] font-semibold text-ink mb-0.5 font-sans">
        {label}
      </div>
      <div className="text-[11px] text-ink-soft leading-snug font-sans">
        {sub}
      </div>
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
      <span className="text-[12px] text-ink-soft font-sans">
        2026年6月リリース予定
      </span>
    </div>
  );
}

function MiniCard({
  cat,
  time,
  title,
  meta,
  urgent,
}: {
  cat: string;
  time: string;
  title: string;
  meta: string;
  urgent?: boolean;
}) {
  return (
    <div
      className="flex gap-3 items-start"
      style={{
        background: "#fff",
        border: `1px solid ${urgent ? "rgba(212,80,42,0.3)" : "rgba(43,42,40,0.08)"}`,
        borderRadius: 12,
        padding: "12px 14px",
      }}
    >
      <div
        className="self-stretch"
        style={{
          width: 3,
          borderRadius: 2,
          background: urgent ? "#D4502A" : "#2B2A28",
        }}
      />
      <div className="flex-1">
        <div className="flex gap-2 items-center mb-1">
          <span className="text-[9px] font-bold tracking-wider text-ink-soft">
            {cat}
          </span>
          <span
            className="text-[10px]"
            style={{
              color: urgent ? "#D4502A" : "#7A756C",
              fontWeight: urgent ? 600 : 400,
            }}
          >
            {time}
          </span>
        </div>
        <div className="text-[13px] font-semibold text-ink mb-0.5">{title}</div>
        <div className="text-[10px] text-ink-soft">{meta}</div>
      </div>
    </div>
  );
}

function PhoneContent() {
  return (
    <div className="relative font-sans h-full" style={{ background: "#FAF8F4" }}>
      <div style={{ paddingBottom: 70 }}>
        {/* Header */}
        <div className="flex items-center justify-between" style={{ padding: "16px 16px 12px" }}>
          <div>
            <div className="text-[11px] text-ink-soft">こんばんは、Sakuraさん</div>
            <div className="text-[24px] font-bold text-ink" style={{ letterSpacing: -0.4 }}>今日の推し</div>
          </div>
          <div className="rounded-full" style={{ width: 36, height: 36, background: "#E8DDC6", border: "1px solid rgba(43,42,40,0.15)" }} />
        </div>

        {/* Coverage */}
        <div className="flex items-center gap-4 mx-4 mb-[18px]" style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(43,42,40,0.1)", padding: 16 }}>
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="30" stroke="rgba(43,42,40,0.1)" strokeWidth="6" fill="none" />
            <circle cx="36" cy="36" r="30" stroke="#D4502A" strokeWidth="6" fill="none" strokeDasharray="188.5" strokeDashoffset="47" strokeLinecap="round" transform="rotate(-90 36 36)" />
            <text x="36" y="41" textAnchor="middle" fontSize="16" fontWeight="700" fill="#2B2A28">75%</text>
          </svg>
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-ink mb-0.5">情報カバー率</div>
            <div className="text-[11px] text-ink-soft leading-snug">
              9/12件 チェック済<br />
              <span className="text-terracotta font-semibold">3件 未チェック</span>
            </div>
          </div>
        </div>

        {/* Today list */}
        <div className="flex justify-between items-baseline px-4 pb-2">
          <div className="text-[13px] font-semibold text-ink">今日の予定</div>
          <div className="text-[10px] text-ink-soft">4月20日(日)</div>
        </div>
        <div className="flex flex-col gap-2 px-4">
          <MiniCard cat="TV" time="21:00" title="バラエティ 出演" meta="フジテレビ · 60分" />
          <MiniCard cat="LIVE" time="14:00" title="配信アーカイブ公開" meta="YouTube · 45分" />
          <MiniCard cat="MAGAZINE" time="4/21" title="雑誌インタビュー掲載" meta="月刊誌 · 6ページ特集" />
        </div>

        <div className="flex justify-between items-baseline px-4 pt-[18px] pb-2">
          <div className="text-[13px] font-semibold text-ink">要チェック</div>
          <div className="text-[10px] text-ink-soft">締切間近</div>
        </div>
        <div className="px-4">
          <MiniCard cat="GOODS" time="4/22まで" title="コラボグッズ予約" meta="完売予測 · あと2日" urgent />
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="absolute bottom-0 left-0 right-0 flex justify-around items-center border-t"
        style={{ height: 56, background: "#FAF8F4", borderColor: "rgba(43,42,40,0.08)", paddingBottom: 6 }}
      >
        {[
          { label: "ホーム", active: true, icon: <path d="M3 7l6-5 6 5v7a1 1 0 01-1 1H4a1 1 0 01-1-1V7z" stroke="currentColor" strokeWidth="1.3" /> },
          { label: "タイムライン", active: false, icon: <><path d="M2 5h14M2 9h14M2 13h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></> },
          { label: "検索", active: false, icon: <><circle cx="8" cy="7" r="5" stroke="currentColor" strokeWidth="1.3" fill="none" /><path d="M12 11l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></> },
          { label: "通知", active: false, icon: <><path d="M4 7a5 5 0 0110 0v3l2 2H2l2-2V7z" stroke="currentColor" strokeWidth="1.3" /><path d="M7 14a2 2 0 004 0" stroke="currentColor" strokeWidth="1.3" /></> },
          { label: "設定", active: false, icon: <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.3" fill="none" /> },
        ].map((tab, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-0.5"
            style={{ color: tab.active ? "#D4502A" : "#B8B0A0", fontSize: 9, fontWeight: tab.active ? 600 : 400 }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">{tab.icon}</svg>
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroA({ scrollTarget }: HeroProps) {
  const handleScroll = () => {
    document
      .getElementById(scrollTarget)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="bg-paper relative overflow-hidden"
      style={{ padding: "clamp(60px, 8vw, 100px) 24px 80px" }}
    >
      <div className="max-w-[1180px] mx-auto">
        <div
          className="grid gap-12 items-center grid-responsive"
          style={{ gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 0.9fr)" }}
        >
          {/* Left */}
          <div>
            <HeroMeta />
            <h1
              className="m-0 font-sans mb-6"
              style={{
                fontWeight: 300,
                fontSize: "clamp(26px, 4.4vw, 64px)",
                lineHeight: 1.25,
                letterSpacing: -1.5,
                color: "#2B2A28",
              }}
            >
              <span className="whitespace-nowrap lg:ml-[-28px]">
                「え、昨日出てたの。」は
              </span>
              <br />
              {"　"}
              <span
                className="whitespace-nowrap lg:ml-[-32px]"
                style={{
                  color: "#D4502A",
                  fontSize: "clamp(36px, 7vw, 72px)",
                }}
              >
                もう、おわり。
              </span>
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
              <span className="text-[12px] text-ink-soft font-sans">
                簡単登録 30秒
              </span>
            </div>
          </div>

          {/* Right — phone + floating flow nodes (PC only) */}
          <div className="relative justify-center hidden lg:flex" style={{ height: 600 }}>
            <PhoneMockup scale={0.72}>
              <PhoneContent />
            </PhoneMockup>
            <div className="absolute" style={{ top: 40, left: -20, transform: "rotate(-3deg)" }}>
              <FlowNode
                icon={<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 2l2.5 5 5.5.8-4 3.9.9 5.5L10 14.6 5.1 17.2 6 11.7 2 7.8 7.5 7 10 2z" stroke="#D4502A" strokeWidth="1.5" strokeLinejoin="round" /></svg>}
                label="ファンが見つける"
                sub="TV出演、発売、コラボ情報"
              />
            </div>
            <div className="absolute" style={{ top: 200, right: -30, transform: "rotate(2deg)" }}>
              <FlowNode
                icon={<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="#D4502A" strokeWidth="1.5" /><path d="M7 10l2 2 4-4" stroke="#D4502A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                label="AIが整理する"
                sub="重複削除・カテゴリ分け"
              />
            </div>
            <div className="absolute" style={{ bottom: 30, left: -10, transform: "rotate(-2deg)" }}>
              <FlowNode
                icon={<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 8a6 6 0 0112 0v4l2 2H2l2-2V8z" stroke="#D4502A" strokeWidth="1.5" strokeLinejoin="round" /><path d="M8 16a2 2 0 004 0" stroke="#D4502A" strokeWidth="1.5" strokeLinecap="round" /></svg>}
                label="あなたに届く"
                sub="毎朝の見逃しチェック"
              />
            </div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M 130 100 Q 160 130 180 180" stroke="#D4502A" strokeWidth="1.2" fill="none" strokeDasharray="3 4" opacity="0.5" />
              <path d="M 370 280 Q 340 330 300 380" stroke="#D4502A" strokeWidth="1.2" fill="none" strokeDasharray="3 4" opacity="0.5" />
            </svg>
          </div>
        </div>

        {/* Mobile hero visual (SP only) */}
        <MobileHeroVisual />
      </div>
    </div>
  );
}

/* ─── SP用: Phone + 浮遊ノード（デザインA） ─── */
function FloatNode({
  icon,
  label,
  sub,
  step,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  step: string;
}) {
  return (
    <div
      className="bg-white border border-black/10 rounded-xl font-sans"
      style={{
        padding: "10px 12px",
        minWidth: 132,
        maxWidth: 152,
        boxShadow: "0 6px 18px rgba(43,42,40,0.08)",
      }}
    >
      <div className="flex gap-2 items-center mb-1.5">
        <div
          className="flex items-center justify-center"
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            background: "rgba(212,80,42,0.12)",
          }}
        >
          {icon}
        </div>
        <div className="text-[9px] text-terracotta font-bold tracking-wider">STEP {step}</div>
      </div>
      <div className="text-[12px] font-semibold text-ink mb-0.5 leading-snug">{label}</div>
      <div className="text-[10px] text-ink-soft leading-snug">{sub}</div>
    </div>
  );
}

function MobileHeroVisual() {
  return (
    <div className="lg:hidden bg-paper relative overflow-hidden" style={{ padding: "40px 12px 48px" }}>
      <div
        className="relative w-full flex justify-center mx-auto"
        style={{ height: 560 }}
      >
        {/* Phone centered */}
        <div className="relative z-[2]" style={{ marginTop: 40 }}>
          <PhoneMockup scale={0.62}>
            <PhoneContent />
          </PhoneMockup>
        </div>

        {/* Dashed connectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]">
          <path d="M 70 90 Q 110 120 150 160" stroke="#D4502A" strokeWidth="1.2" fill="none" strokeDasharray="3 4" opacity="0.5" />
          <path d="M 300 250 Q 275 285 245 315" stroke="#D4502A" strokeWidth="1.2" fill="none" strokeDasharray="3 4" opacity="0.5" />
          <path d="M 60 470 Q 100 450 140 430" stroke="#D4502A" strokeWidth="1.2" fill="none" strokeDasharray="3 4" opacity="0.5" />
        </svg>

        {/* Floating nodes */}
        <div className="absolute z-[3]" style={{ top: 20, left: 0, transform: "rotate(-2deg)" }}>
          <FloatNode
            step="1"
            icon={<svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 2l2.5 5 5.5.8-4 3.9.9 5.5L10 14.6 5.1 17.2 6 11.7 2 7.8 7.5 7 10 2z" stroke="#D4502A" strokeWidth="1.5" strokeLinejoin="round" /></svg>}
            label="ファンが見つける"
            sub="TV出演・発売情報"
          />
        </div>
        <div className="absolute z-[3]" style={{ top: 220, right: 0, transform: "rotate(2deg)" }}>
          <FloatNode
            step="2"
            icon={<svg width="14" height="14" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="#D4502A" strokeWidth="1.5" /><path d="M7 10l2 2 4-4" stroke="#D4502A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            label="AIが整理する"
            sub="重複削除・分類"
          />
        </div>
        <div className="absolute z-[3]" style={{ bottom: 30, left: 0, transform: "rotate(-1.5deg)" }}>
          <FloatNode
            step="3"
            icon={<svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M4 8a6 6 0 0112 0v4l2 2H2l2-2V8z" stroke="#D4502A" strokeWidth="1.5" strokeLinejoin="round" /><path d="M8 16a2 2 0 004 0" stroke="#D4502A" strokeWidth="1.5" strokeLinecap="round" /></svg>}
            label="あなたに届く"
            sub="毎朝の見逃しチェック"
          />
        </div>
      </div>
    </div>
  );
}
