import { Section, SectionHeading } from './section';

const steps = [
  {
    n: '01',
    title: 'ファンが見つける',
    desc: 'TV出演、グッズ発売、コラボ情報。誰かが見つけたらすぐ共有。',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="9" r="4" stroke="#2B2A28" strokeWidth="1.5" />
        <path
          d="M4 20c0-4 4-7 8-7s8 3 8 7"
          stroke="#2B2A28"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    n: '02',
    title: '自動で整理される',
    desc: '重複を消して、カテゴリ分け、信頼度もチェック。情報の交通整理。',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 6h8M4 12h16M4 18h12" stroke="#2B2A28" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="17" cy="6" r="2.5" stroke="#2B2A28" strokeWidth="1.5" />
        <circle cx="7" cy="18" r="2.5" stroke="#2B2A28" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'あなたに届く',
    desc: '通知で見逃さない。毎朝の「見逃しチェック」も一緒に。',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 10a6 6 0 0112 0v4l2 2H4l2-2v-4z"
          stroke="#2B2A28"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M10 19a2 2 0 004 0" stroke="#2B2A28" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function SolutionSection() {
  return (
    <Section bg="#FAF8F4" padY={120}>
      <SectionHeading
        eyebrow="HOW IT WORKS"
        title={
          <>
            ファンが見つけて、
            <br />
            AIが届ける。
          </>
        }
        sub="ファンが集める。AIが届ける。それがOshiLock。"
      />
      <div
        className="mt-16 grid gap-5 grid-responsive"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}
      >
        {steps.map((s, i) => (
          <div
            key={i}
            className="relative bg-white border border-black/[.08] rounded-[14px] px-[30px] py-9"
            style={{ boxShadow: '0 2px 8px rgba(43,42,40,0.04)' }}
          >
            <div className="text-[11px] font-semibold tracking-[2px] text-terracotta font-sans mb-5">
              STEP {s.n}
            </div>
            <div className="mb-5">{s.icon}</div>
            <div className="text-[20px] font-medium text-ink font-sans mb-3 tracking-tight">
              {s.title}
            </div>
            <p className="m-0 text-[14px] leading-[1.75] text-ink-muted font-sans font-normal">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
      <div
        className="mt-12 text-center text-[16px] text-ink font-sans font-medium mx-auto max-w-[640px]"
        style={{
          padding: '24px 32px',
          background: 'rgba(212,80,42,0.06)',
          border: '1px dashed rgba(212,80,42,0.3)',
          borderRadius: 14,
        }}
      >
        もう自分で巡回しなくていい。ここだけ見ればOK。
      </div>
    </Section>
  );
}
