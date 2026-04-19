import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "OshiLock — 推し活専用の情報コミュニティ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const logoSvg = await readFile(
    join(process.cwd(), "public", "logo.svg"),
    "utf-8",
  );
  const logoDataUrl = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAF8F4",
      }}
    >
      {/* Logo */}
      <img src={logoDataUrl} width={280} style={{ marginBottom: 40 }} />

      {/* Main copy line 1 */}
      <div
        style={{
          fontSize: 52,
          fontWeight: 300,
          color: "#2B2A28",
          letterSpacing: -1,
          lineHeight: 1.2,
        }}
      >
        「え、昨日出てたの。」は
      </div>

      {/* Main copy line 2 */}
      <div
        style={{
          fontSize: 52,
          fontWeight: 300,
          color: "#D4502A",
          letterSpacing: -1,
          lineHeight: 1.2,
          marginBottom: 32,
        }}
      >
        もう、おわり。
      </div>

      {/* Sub copy */}
      <div
        style={{
          fontSize: 20,
          fontWeight: 400,
          color: "#5A554C",
          lineHeight: 1.8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span>ファンが見つけて、AIが届ける。</span>
        <span>推し活専用の情報コミュニティ、OshiLock。</span>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "#D4502A",
        }}
      />
    </div>,
    { ...size },
  );
}
