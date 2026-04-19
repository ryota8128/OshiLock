import { Section, SectionHeading } from "./section";
import { PhoneMockup, AppScreenDetail } from "./phone-mockup";

export function CardFeatureSection() {
  return (
    <Section bg="#F3EFE4" padY={120}>
      <div
        className="grid gap-16 items-center grid-responsive"
        style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)" }}
      >
        <div>
          <SectionHeading
            align="left"
            eyebrow="CORE FEATURE"
            title={
              <>
                情報がまとまる。
                <br />
                そこで、語れる。
              </>
            }
            maxSubWidth={460}
          />
          <div className="mt-6 max-w-[460px]">
            <p className="m-0 text-[16px] leading-[1.9] text-ink font-sans font-normal mb-7">
              推しに関する情報は、すべて「イベントカード」として整理される。日時・場所・ソース・確度まで構造化。
            </p>
            <div
              className="font-sans"
              style={{
                padding: "20px 22px",
                background: "#fff",
                borderRadius: 12,
                border: "1px solid rgba(43,42,40,0.08)",
              }}
            >
              <div className="text-[14px] text-ink-soft leading-[1.8] mb-2">
                Xだと、感想が流れて埋もれる。
              </div>
              <div className="text-[16px] text-ink font-medium leading-[1.7]">
                OshiLockなら、そのトピックだけで盛り上がれる。
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center relative">
          <PhoneMockup scale={0.72}>
            <AppScreenDetail />
          </PhoneMockup>
        </div>
      </div>
    </Section>
  );
}
