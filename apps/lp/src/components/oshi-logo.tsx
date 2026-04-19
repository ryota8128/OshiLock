type OshiLogoProps = {
  size?: number;
  color?: string;
};

export function OshiLogo({ size = 24, color = "#2B2A28" }: OshiLogoProps) {
  const iconH = Math.round(size * 1.85);
  const gap = Math.round(size * 0.42);

  const rays = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  return (
    <span
      className="inline-flex items-center leading-none"
      style={{ gap }}
    >
      <svg
        width={iconH}
        height={iconH}
        viewBox="0 0 56 56"
        fill="none"
        className="shrink-0 block"
        aria-label="OshiLock"
      >
        <circle cx="28" cy="28" r="26" stroke={color} strokeWidth="2" fill="none" />
        <path d="M25 28 L42 28" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M38 28 L38 32" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M34 28 L34 33" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        <g transform="translate(19 28)">
          <circle cx="0" cy="0" r="4" stroke="#D4502A" strokeWidth="1.8" fill="none" />
          {rays.map((a, i) => (
            <line
              key={a}
              x1="0"
              y1="-6"
              x2="0"
              y2={i % 2 === 0 ? -9.5 : -7.8}
              stroke="#D4502A"
              strokeWidth="1.4"
              strokeLinecap="round"
              transform={`rotate(${a})`}
            />
          ))}
        </g>
      </svg>
      <span
        className="font-sans leading-none"
        style={{
          fontSize: size,
          fontWeight: 300,
          color,
          letterSpacing: size > 24 ? 1.2 : 0.6,
        }}
      >
        OshiLock
      </span>
    </span>
  );
}
