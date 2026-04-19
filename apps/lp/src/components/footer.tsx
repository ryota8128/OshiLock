import { OshiLogo } from "./oshi-logo";

export function Footer() {
  return (
    <footer className="font-sans" style={{ background: "#2B2A28", color: "#FAF8F4", padding: "56px 24px 32px" }}>
      <div className="max-w-[1080px] mx-auto">
        <div
          className="flex justify-between items-start flex-wrap gap-10 pb-8"
          style={{ borderBottom: "1px solid rgba(250,248,244,0.1)" }}
        >
          <div>
            <OshiLogo size={22} color="#FAF8F4" />
            <div className="text-[13px] mt-2.5 leading-[1.7]" style={{ color: "rgba(250,248,244,0.5)" }}>
              推し活専用の、情報コミュニティ。
              <br />
              2026年6月リリース予定。
            </div>
          </div>
          <div className="flex gap-8">
            <div>
              <div className="text-[11px] font-semibold tracking-[1.5px] mb-3.5" style={{ color: "rgba(250,248,244,0.5)" }}>
                FOLLOW
              </div>
              <div className="flex flex-col gap-2.5 text-[13px]">
                <a href="#" className="no-underline" style={{ color: "#FAF8F4" }}>
                  X (Twitter)
                </a>
                <a href="#" className="no-underline" style={{ color: "#FAF8F4" }}>
                  Threads
                </a>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold tracking-[1.5px] mb-3.5" style={{ color: "rgba(250,248,244,0.5)" }}>
                INFO
              </div>
              <div className="flex flex-col gap-2.5 text-[13px]">
                <a href="#waitlist" className="no-underline" style={{ color: "#FAF8F4" }}>
                  事前登録
                </a>
                <a href="#" className="no-underline" style={{ color: "#FAF8F4" }}>
                  お問い合わせ
                </a>
              </div>
            </div>
          </div>
        </div>
        <div
          className="pt-6 text-[11px] flex justify-between flex-wrap gap-3"
          style={{ color: "rgba(250,248,244,0.4)" }}
        >
          <span>&copy; 2026 OshiLock</span>
          <span>oshilock.com</span>
        </div>
      </div>
    </footer>
  );
}
