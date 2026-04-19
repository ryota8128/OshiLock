import { Section, SectionHeading } from "./section";

const msgs = [
  { who: "them" as const, text: "昨日のバラエティ見た？推し出てたよ！", time: "00:38" },
  { who: "me" as const, text: "えっ昨日出てたの！？なんで教えてくれないの〜！！", time: "00:42" },
  { who: "them" as const, text: "めっちゃ笑ってて、ほんとにかわいすぎた😭", time: "00:45" },
  { who: "me" as const, text: "なんで推しの情報って、いつも後から知るの。", time: "now", big: true },
];

export function PainSection() {
  return (
    <Section bg="#F3EFE4" padY={120}>
      <SectionHeading
        eyebrow="THE PROBLEM"
        title={
          <>
            推し活、気づいたら
            <br />
            「後追い」ばっかりじゃないですか？
          </>
        }
      />
      <div
        className="flex flex-col gap-3.5 font-sans"
        style={{ marginTop: 56, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}
      >
        {msgs.map((m, i) => {
          const isMe = m.who === "me";
          return (
            <div
              key={i}
              className="flex items-end gap-2"
              style={{ justifyContent: isMe ? "flex-end" : "flex-start" }}
            >
              {!isMe && (
                <div
                  className="flex items-center justify-center shrink-0 rounded-full text-white text-[12px] font-semibold"
                  style={{ width: 32, height: 32, background: "#D4502A" }}
                >
                  友
                </div>
              )}
              <div style={{ maxWidth: "76%" }}>
                <div
                  style={{
                    background: isMe ? "#2B2A28" : "#fff",
                    color: isMe ? "#FAF8F4" : "#2B2A28",
                    padding: m.big ? "18px 22px" : "12px 16px",
                    borderRadius: 18,
                    borderBottomRightRadius: isMe ? 4 : 18,
                    borderBottomLeftRadius: isMe ? 18 : 4,
                    fontSize: m.big ? 18 : 14.5,
                    lineHeight: 1.55,
                    fontWeight: m.big ? 600 : 400,
                    border: isMe ? "none" : "1px solid rgba(43,42,40,0.08)",
                    boxShadow: "0 1px 3px rgba(43,42,40,0.05)",
                  }}
                >
                  {m.text}
                </div>
                <div
                  className="text-ink-faint mt-1"
                  style={{
                    fontSize: 10,
                    textAlign: isMe ? "right" : "left",
                    padding: "0 6px",
                  }}
                >
                  {m.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-14 text-center font-sans">
        <div className="text-[16px] text-terracotta font-semibold">
          その悩み、OshiLockが解決する。
        </div>
      </div>
    </Section>
  );
}
