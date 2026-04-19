import type { ReactNode } from "react";

type PhoneMockupProps = {
  scale?: number;
  children?: ReactNode;
};

export function PhoneMockup({ scale = 0.72, children }: PhoneMockupProps) {
  const w = 360;
  const h = 740;

  return (
    <div style={{ width: w * scale, height: h * scale, position: "relative" }}>
      <div
        style={{
          width: w,
          height: h,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <div
          className="relative"
          style={{
            width: w + 6,
            height: h + 6,
            borderRadius: 48,
            padding: 3,
            background: "#1a1917",
            boxShadow:
              "0 40px 80px rgba(43,42,40,0.18), 0 12px 30px rgba(43,42,40,0.12)",
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              width: w,
              height: h,
              borderRadius: 45,
              background: "#FAF8F4",
            }}
          >
            {/* Dynamic island */}
            <div
              className="absolute left-1/2 -translate-x-1/2 z-50"
              style={{
                top: 10,
                width: 108,
                height: 30,
                borderRadius: 20,
                background: "#1a1917",
              }}
            />
            {/* Status bar placeholder */}
            <div
              className="flex justify-between items-center px-8 font-sans"
              style={{ height: 48, fontSize: 12, color: "#2B2A28" }}
            >
              <span style={{ fontWeight: 600 }}>9:41</span>
              <div className="flex gap-1 items-center">
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <rect x="0" y="6" width="3" height="6" rx="1" fill="#2B2A28" />
                  <rect x="4.5" y="4" width="3" height="8" rx="1" fill="#2B2A28" />
                  <rect x="9" y="1" width="3" height="11" rx="1" fill="#2B2A28" />
                  <rect x="13" y="0" width="3" height="12" rx="1" fill="#2B2A28" opacity="0.3" />
                </svg>
                <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
                  <path d="M7.5 3C9.8 3 11.8 4 13.2 5.5L7.5 11 1.8 5.5C3.2 4 5.2 3 7.5 3Z" fill="#2B2A28" />
                </svg>
                <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
                  <rect x="0.5" y="0.5" width="19" height="10" rx="2" stroke="#2B2A28" strokeWidth="1" fill="none" />
                  <rect x="2" y="2" width="14" height="7" rx="1" fill="#2B2A28" />
                  <rect x="20.5" y="3.5" width="1.5" height="4" rx="0.75" fill="#2B2A28" />
                </svg>
              </div>
            </div>
            {/* Content area */}
            <div className="absolute left-0 right-0 bottom-0 overflow-hidden" style={{ top: 48 }}>
              {children}
            </div>
            {/* Home indicator */}
            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[60]"
              style={{
                width: 120,
                height: 4,
                borderRadius: 100,
                background: "#2B2A28",
                opacity: 0.35,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Placeholder app screen for the phone mockup */
export function AppScreenHome() {
  return (
    <div className="h-full font-sans" style={{ background: "#FAF8F4", padding: "16px 20px" }}>
      {/* App header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[11px] text-ink-soft tracking-wide">MY OSHI</div>
          <div className="text-[18px] font-medium text-ink mt-0.5">推しグループ</div>
        </div>
        <div
          className="flex items-center justify-center"
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "rgba(43,42,40,0.06)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 8a6 6 0 0112 0v4l2 2H2l2-2V8z" stroke="#2B2A28" strokeWidth="1.2" />
          </svg>
        </div>
      </div>

      {/* Today summary card */}
      <div
        className="mb-4"
        style={{
          background: "#fff",
          border: "1px solid rgba(43,42,40,0.08)",
          borderRadius: 14,
          padding: "18px 16px",
        }}
      >
        <div className="text-[11px] text-ink-soft tracking-wide mb-2">TODAY</div>
        <div className="text-[15px] font-medium text-ink leading-snug">
          3件の新しい情報
        </div>
        <div className="text-[12px] text-ink-soft mt-1">TV出演 · グッズ · コラボ</div>
      </div>

      {/* Event cards */}
      {[
        { cat: "TV出演", title: "バラエティ番組出演決定", time: "今日 22:00", accent: "#D4502A" },
        { cat: "グッズ", title: "コラボカフェ開催", time: "来週月曜〜", accent: "#B89A30" },
        { cat: "雑誌", title: "インタビュー掲載", time: "明日発売", accent: "#2B2A28" },
      ].map((card, i) => (
        <div
          key={i}
          className="mb-3"
          style={{
            background: "#fff",
            border: "1px solid rgba(43,42,40,0.08)",
            borderRadius: 12,
            padding: "14px 16px",
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: card.accent,
              }}
            />
            <span className="text-[10px] font-semibold tracking-wider text-ink-soft uppercase">
              {card.cat}
            </span>
          </div>
          <div className="text-[14px] font-medium text-ink">{card.title}</div>
          <div className="text-[11px] text-ink-soft mt-1">{card.time}</div>
        </div>
      ))}

      {/* Tab bar */}
      <div
        className="absolute bottom-0 left-0 right-0 flex justify-around items-center border-t"
        style={{
          height: 60,
          background: "#FAF8F4",
          borderColor: "rgba(43,42,40,0.08)",
          paddingBottom: 8,
        }}
      >
        {["ホーム", "タイムライン", "通知", "設定"].map((label, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1"
            style={{
              color: i === 0 ? "#D4502A" : "#B8B0A0",
              fontSize: 10,
              fontWeight: i === 0 ? 600 : 400,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              {i === 0 && <path d="M3 7l6-5 6 5v7a1 1 0 01-1 1H4a1 1 0 01-1-1V7z" stroke="currentColor" strokeWidth="1.3" />}
              {i === 1 && <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />}
              {i === 2 && <><path d="M4 7a5 5 0 0110 0v3l2 2H2l2-2V7z" stroke="currentColor" strokeWidth="1.3" /><path d="M7 14a2 2 0 004 0" stroke="currentColor" strokeWidth="1.3" /></>}
              {i === 3 && <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.3" />}
            </svg>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AppScreenDetail() {
  return (
    <div className="h-full font-sans" style={{ background: "#FAF8F4", paddingBottom: 20 }}>
      {/* Top nav */}
      <div className="flex items-center justify-between" style={{ padding: "12px 16px" }}>
        <span className="text-[22px] text-ink cursor-pointer">‹</span>
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center rounded-full" style={{ width: 34, height: 34, background: "rgba(43,42,40,0.05)" }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M8 1v10M8 1L4.5 4.5M8 1l3.5 3.5" stroke="#2B2A28" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 8v6h10V8" stroke="#2B2A28" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex items-center justify-center rounded-full" style={{ width: 34, height: 34, background: "rgba(43,42,40,0.05)" }}>
            <svg width="16" height="4" viewBox="0 0 16 4">
              <circle cx="2" cy="2" r="1.5" fill="#2B2A28" />
              <circle cx="8" cy="2" r="1.5" fill="#2B2A28" />
              <circle cx="14" cy="2" r="1.5" fill="#2B2A28" />
            </svg>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px 14px" }}>
        {/* Category + verified */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold rounded-full px-2.5 py-1" style={{ background: "rgba(212,80,42,0.1)", color: "#D4502A", border: "1px solid rgba(212,80,42,0.2)" }}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M2 2h12v10l-6 3-6-3V2z" stroke="currentColor" strokeWidth="1.5" /></svg>
            イベント
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold rounded-full px-2 py-1" style={{ background: "rgba(76,175,80,0.1)", color: "rgba(56,142,60,1)", border: "1px solid rgba(76,175,80,0.2)" }}>
            ◎ 公式確認済
          </span>
        </div>

        {/* Title */}
        <div className="text-[20px] font-bold text-ink mb-2.5" style={{ lineHeight: 1.35, letterSpacing: -0.4 }}>
          3rd TOUR チケット先行販売
        </div>

        {/* Key/Value info */}
        <div className="bg-white rounded-[10px] mb-3.5" style={{ border: "1px solid rgba(43,42,40,0.1)", padding: "10px 14px" }}>
          {[
            { k: "受付期間", v: "4/22(火) 18:00 〜 4/25(金) 23:59" },
            { k: "公演日", v: "2026/7/20(日) 18:00開演" },
            { k: "会場", v: "東京ガーデンシアター" },
          ].map((r, i, arr) => (
            <div key={i} className="flex py-[7px]" style={{ borderBottom: i < arr.length - 1 ? "1px dashed rgba(43,42,40,0.1)" : "none" }}>
              <div className="text-[11px] text-ink-soft shrink-0" style={{ width: 70 }}>{r.k}</div>
              <div className="text-[12px] text-ink flex-1">{r.v}</div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="text-[10px] font-bold text-ink-soft mb-2" style={{ letterSpacing: 1 }}>詳細</div>
        <div className="bg-white rounded-[10px] mb-3.5 text-[12px] text-ink" style={{ border: "1px solid rgba(43,42,40,0.1)", padding: "12px 14px", lineHeight: 1.65 }}>
          3rd TOUR「静寂の裏側」東京追加公演のチケット先行販売が決定しました。モバイル会員限定、抽選制。1人4枚まで。
        </div>

        {/* Watch button */}
        <div className="flex items-center justify-center gap-2 rounded-xl mb-1.5" style={{ padding: "13px 14px", background: "rgba(212,80,42,0.06)", color: "#D4502A", border: "1px solid rgba(212,80,42,0.15)", fontSize: 14, fontWeight: 700 }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M8 3C4.5 3 2 8 2 8s2.5 5 6 5 6-5 6-5-2.5-5-6-5z" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          気になる
          <span className="text-[11px] font-medium opacity-70 ml-1">· 313</span>
        </div>
        <div className="text-[10px] text-ink-soft text-center mb-5">
          最適なタイミングに通知されます
        </div>

        {/* Source */}
        <div className="text-[10px] font-bold text-ink-soft mb-2" style={{ letterSpacing: 1 }}>ソース</div>
        <div className="bg-white rounded-[10px] mb-4" style={{ border: "1px solid rgba(43,42,40,0.1)", padding: "10px 14px" }}>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-ink-soft flex-1 overflow-hidden text-ellipsis whitespace-nowrap">nogizaka46.com/news/...</span>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M3 1h7v7M10 1L1 10" stroke="#7A756C" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </div>
        </div>

        {/* Fastest TOP3 */}
        <div className="text-[10px] font-bold text-ink-soft mb-2" style={{ letterSpacing: 1 }}>最速投稿 · TOP3</div>
        <div className="bg-white rounded-[10px] overflow-hidden mb-4" style={{ border: "1px solid rgba(43,42,40,0.1)" }}>
          {[
            { r: "🥇", n: "@sakura_mori", t: "12秒" },
            { r: "🥈", n: "@yuki_922", t: "48秒" },
            { r: "🥉", n: "@_noa_", t: "2分31秒" },
          ].map((x, i) => (
            <div key={i} className="flex items-center gap-2.5" style={{ padding: "10px 14px", borderBottom: i < 2 ? "1px solid rgba(43,42,40,0.08)" : "none" }}>
              <span className="text-[14px]">{x.r}</span>
              <div className="flex items-center justify-center rounded-full shrink-0 text-[10px] font-semibold" style={{ width: 24, height: 24, background: "rgba(43,42,40,0.06)", color: "#7A756C" }}>
                {x.n[1].toUpperCase()}
              </div>
              <span className="text-[12px] text-ink flex-1">{x.n}</span>
              <span className="text-[10px] text-ink-soft">{x.t}</span>
            </div>
          ))}
        </div>

        {/* Comments */}
        <div className="text-[10px] font-bold text-ink-soft mb-2" style={{ letterSpacing: 1 }}>コメント · 24</div>
        <div className="flex flex-col gap-2.5">
          {[
            { n: "yuki_922", t: "やばい、絶対取る…!", l: 12 },
            { n: "mika_nk", t: "会場どこにするか迷う", l: 5 },
          ].map((x, i) => (
            <div key={i} className="flex gap-2.5 items-start">
              <div className="flex items-center justify-center rounded-full shrink-0 text-[10px] font-semibold" style={{ width: 28, height: 28, background: "rgba(43,42,40,0.06)", color: "#7A756C" }}>
                {x.n[0].toUpperCase()}
              </div>
              <div className="flex-1 bg-white rounded-[10px]" style={{ border: "1px solid rgba(43,42,40,0.08)", padding: "8px 12px" }}>
                <div className="text-[11px] font-semibold text-ink mb-0.5">@{x.n}</div>
                <div className="text-[12px] text-ink" style={{ lineHeight: 1.4 }}>{x.t}</div>
                <div className="text-[10px] text-ink-soft mt-1 flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M8 14s-5.5-3.5-5.5-7A3.5 3.5 0 018 4a3.5 3.5 0 015.5 3c0 3.5-5.5 7-5.5 7z" stroke="currentColor" strokeWidth="1.3" /></svg>
                  {x.l} · 返信
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
