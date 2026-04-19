"use client";

import type { ReactNode, CSSProperties } from "react";

type PrimaryCtaProps = {
  children: ReactNode;
  style?: CSSProperties;
  arrow?: boolean;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  full?: boolean;
  type?: "button" | "submit";
};

const sizes = {
  sm: "px-6 py-3 text-sm",
  md: "px-8 py-4 text-base",
  lg: "px-10 py-5 text-[17px]",
} as const;

export function PrimaryCTA({
  children,
  style,
  arrow = true,
  size = "md",
  onClick,
  full = false,
  type = "button",
}: PrimaryCtaProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${sizes[size]} ${full ? "flex w-full" : "inline-flex"} items-center justify-center gap-2.5 bg-ink text-paper border-none rounded-xl font-medium font-sans tracking-wide cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-px`}
      style={{ letterSpacing: 0.3, ...style }}
    >
      {children}
      {arrow && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8h10m0 0L9 4m4 4l-4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
