import { Section } from "./section";

export function CreatorSection() {
  return (
    <Section bg="#FAF8F4" padY={120}>
      <div
        className="mx-auto bg-white border border-black/[.08] rounded-2xl flex gap-8 items-center creator-card"
        style={{
          maxWidth: 720,
          padding: "48px 44px",
          boxShadow: "0 2px 8px rgba(43,42,40,0.04)",
        }}
      >
        <div
          className="shrink-0 flex items-center justify-center rounded-full"
          style={{
            width: 120,
            height: 120,
            background: "linear-gradient(135deg, #E8DDC6, #D4C8AE)",
            border: "1px solid rgba(43,42,40,0.1)",
            fontFamily: '"Caveat", cursive',
            fontSize: 52,
            fontWeight: 600,
            color: "#2B2A28",
          }}
        >
          T
        </div>
        <div className="flex-1 font-sans">
          <div className="text-[11px] font-semibold tracking-[2px] text-ink-soft mb-3.5">CREATOR</div>
          <div className="text-[24px] font-light text-ink mb-3.5 leading-snug" style={{ letterSpacing: -0.5 }}>
            自分が欲しくて、作りました。
          </div>
          <p className="m-0 text-[14px] leading-[1.9] text-ink-muted mb-[18px]">
            推し活歴の長い、ひとりのエンジニア。チケット先行を3回連続で見逃して、「もうアプリ作るしかない」と決意。ひとりで開発中。あなたの推しの情報、届けます。
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-[13px] text-terracotta no-underline font-medium"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <path d="M1 1h3l6 12h3" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
            Xアカウントをフォロー
          </a>
        </div>
      </div>
    </Section>
  );
}
