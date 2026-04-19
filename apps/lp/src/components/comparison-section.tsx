import { Section, SectionHeading } from "./section";

const rows = [
  { before: "誰でも入れる、ノイズが多い", after: "有料だから、本気のファンだけ" },
  { before: "デマ・憶測・煽りが混ざる", after: "確度とソースが見える" },
  { before: "Xで情報が流れて埋もれる", after: "カードごとに整理される" },
  { before: "自分で毎日5サイト巡回", after: "ファンが集めてAIが届ける" },
];

export function ComparisonSection() {
  return (
    <Section bg="#FAF8F4" padY={120}>
      <SectionHeading
        eyebrow="WHY OSHILOCK"
        title={
          <>
            本気のファンだけが集まる。
            <br />
            だから、信頼できる情報がある。
          </>
        }
        sub="有料にしているのは、ノイズを入れないため。本気で推してる人だけが集まるから、情報の質が違う。"
      />
      <div
        className="mx-auto bg-white border border-black/[.08] rounded-2xl overflow-hidden"
        style={{
          marginTop: 64,
          maxWidth: 900,
          boxShadow: "0 2px 8px rgba(43,42,40,0.04)",
        }}
      >
        {/* Header */}
        <div
          className="grid border-b border-black/[.08]"
          style={{ gridTemplateColumns: "1fr 1fr", background: "#F3EFE4" }}
        >
          <div className="py-[18px] px-6 text-[12px] font-semibold tracking-[1.5px] text-ink-soft font-sans">
            今の推し活
          </div>
          <div
            className="py-[18px] px-6 text-[12px] font-semibold tracking-[1.5px] text-terracotta font-sans"
            style={{ borderLeft: "1px solid rgba(43,42,40,0.08)" }}
          >
            OshiLock
          </div>
        </div>
        {/* Rows */}
        {rows.map((r, i) => (
          <div
            key={i}
            className="grid"
            style={{
              gridTemplateColumns: "1fr 1fr",
              borderBottom: i < rows.length - 1 ? "1px solid rgba(43,42,40,0.06)" : "none",
            }}
          >
            <div className="flex items-center gap-2.5 py-[22px] px-6 text-[15px] text-ink-soft font-sans leading-relaxed">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="#B0A89A" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              {r.before}
            </div>
            <div
              className="flex items-center gap-2.5 py-[22px] px-6 text-[15px] text-ink font-sans font-medium leading-relaxed"
              style={{ borderLeft: "1px solid rgba(43,42,40,0.06)" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                <path d="M3 7l2.5 2.5L11 4" stroke="#D4502A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {r.after}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center text-[13px] text-ink-soft font-sans leading-[1.8]">
        ジャンルは問いません。あなたの推しを教えてください。
        <br />
        対応ジャンルから順次ご案内します。
      </div>
    </Section>
  );
}
