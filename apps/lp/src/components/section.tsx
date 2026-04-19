import type { ReactNode, CSSProperties } from "react";

type SectionProps = {
  children: ReactNode;
  bg?: string;
  maxWidth?: number;
  padY?: number;
  id?: string;
  style?: CSSProperties;
};

export function Section({
  children,
  bg = "#FAF8F4",
  maxWidth = 1080,
  padY = 120,
  id,
  style,
}: SectionProps) {
  return (
    <section
      id={id}
      style={{
        padding: `${padY}px 24px`,
        background: bg,
        ...style,
      }}
    >
      <div style={{ maxWidth }} className="mx-auto">
        {children}
      </div>
    </section>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  sub?: string;
  align?: "center" | "left";
  maxSubWidth?: number;
};

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "center",
  maxSubWidth = 580,
}: SectionHeadingProps) {
  return (
    <div style={{ textAlign: align }}>
      {eyebrow && (
        <div className="text-[11px] tracking-[3px] uppercase text-ink-soft mb-5 font-sans font-medium">
          {eyebrow}
        </div>
      )}
      <h2 className="m-0 text-ink font-sans font-light text-[clamp(28px,4vw,40px)] leading-[1.35] tracking-tight">
        {title}
      </h2>
      {sub && (
        <p
          className="text-[15px] leading-[1.9] text-ink-muted font-sans font-normal"
          style={{
            margin: align === "center" ? "20px auto 0" : "20px 0 0",
            maxWidth: maxSubWidth,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
