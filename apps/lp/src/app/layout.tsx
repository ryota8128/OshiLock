import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OshiLock — 推し活専用の情報コミュニティ",
  description:
    "ファンが見つけて、AIが届ける。推しの情報を一元管理する、推し活専用の情報コミュニティアプリ。先着100名は永久無料。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} antialiased`}>
      <body className="bg-paper text-ink font-sans">{children}</body>
    </html>
  );
}
