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
    <div className="h-full font-sans" style={{ background: "#FAF8F4", padding: "16px 20px" }}>
      {/* Back nav */}
      <div className="flex items-center gap-2 mb-4">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 4L6 9l5 5" stroke="#2B2A28" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[13px] text-ink-soft">戻る</span>
      </div>

      {/* Detail card */}
      <div
        style={{
          background: "#fff",
          border: "1px solid rgba(43,42,40,0.08)",
          borderRadius: 16,
          padding: "20px 18px",
          marginBottom: 16,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-[10px] font-semibold tracking-wider uppercase px-2 py-1 rounded"
            style={{ background: "rgba(212,80,42,0.1)", color: "#D4502A" }}
          >
            TV出演
          </span>
          <span className="text-[10px] text-ink-faint">信頼度 高</span>
        </div>
        <div className="text-[17px] font-medium text-ink leading-snug mb-2">
          バラエティ番組出演決定
        </div>
        <div className="text-[13px] text-ink-muted leading-relaxed mb-3">
          今夜22:00〜放送のバラエティ番組にゲスト出演。トークコーナーに登場予定。
        </div>
        <div className="flex gap-4 text-[11px] text-ink-soft">
          <span>📅 今日 22:00</span>
          <span>📺 テレビ東京</span>
        </div>
      </div>

      {/* Comments section */}
      <div className="text-[12px] font-semibold text-ink-soft tracking-wider uppercase mb-3">
        COMMENTS · 5
      </div>
      {[
        { name: "推し活民A", text: "予約録画した！", time: "2分前" },
        { name: "推し活民B", text: "リアタイする！", time: "5分前" },
      ].map((c, i) => (
        <div
          key={i}
          className="flex gap-3 mb-3"
          style={{ fontSize: 13 }}
        >
          <div
            className="flex items-center justify-center shrink-0 rounded-full font-semibold text-[11px]"
            style={{
              width: 28,
              height: 28,
              background: "rgba(43,42,40,0.06)",
              color: "#7A756C",
            }}
          >
            {c.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-ink text-[12px]">{c.name}</span>
              <span className="text-[10px] text-ink-faint">{c.time}</span>
            </div>
            <div className="text-ink-muted text-[13px] mt-0.5">{c.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
