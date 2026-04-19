"use client";

import { OshiLogo } from "./oshi-logo";
import { PrimaryCTA } from "./primary-cta";

type NavProps = {
  scrollTarget: string;
};

export function Nav({ scrollTarget }: NavProps) {
  const handleScroll = () => {
    document.getElementById(scrollTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="sticky top-0 z-[100]"
      style={{
        background: "rgba(250,248,244,0.88)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(43,42,40,0.06)",
      }}
    >
      <div className="max-w-[1200px] mx-auto py-4 px-6 flex justify-between items-center">
        <OshiLogo size={18} />
        <div className="flex gap-6 items-center">
          <a href="#how" className="text-[13px] text-ink no-underline font-sans hidden sm:inline">
            仕組み
          </a>
          <a href="#pricing" className="text-[13px] text-ink no-underline font-sans hidden sm:inline">
            料金
          </a>
          <PrimaryCTA size="sm" arrow={false} onClick={handleScroll}>
            事前登録
          </PrimaryCTA>
        </div>
      </div>
    </div>
  );
}
