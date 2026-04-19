import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const BASE_URL = "https://oshilock.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "OshiLock — 推し活専用の情報コミュニティ",
    template: "%s | OshiLock",
  },
  description:
    "「え、昨日出てたの。」はもう、おわり。ファンが見つけて、AIが届ける。推しの情報を一元管理する、推し活専用の情報コミュニティアプリ。先着100名は永久無料。",
  keywords: [
    "推し活",
    "推し",
    "ファン",
    "情報コミュニティ",
    "推し活アプリ",
    "OshiLock",
    "オシロック",
    "推し活情報",
    "ファンコミュニティ",
    "アイドル",
    "推し活管理",
  ],
  authors: [{ name: "OshiLock" }],
  creator: "OshiLock",
  publisher: "OshiLock",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "ja-JP": BASE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: BASE_URL,
    siteName: "OshiLock",
    title: "OshiLock — 推し活専用の情報コミュニティ",
    description:
      "ファンが見つけて、AIが届ける。推しの情報を一元管理する、推し活専用の情報コミュニティアプリ。先着100名は永久無料。",
  },
  twitter: {
    card: "summary_large_image",
    title: "OshiLock — 推し活専用の情報コミュニティ",
    description:
      "「え、昨日出てたの。」はもう、おわり。ファンが見つけて、AIが届ける。推し活専用の情報コミュニティ。",
    creator: "@oshilock",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "OshiLock",
    applicationCategory: "SocialNetworkingApplication",
    operatingSystem: "iOS",
    description:
      "ファンが見つけて、AIが届ける。推しの情報を一元管理する、推し活専用の情報コミュニティアプリ。",
    offers: {
      "@type": "Offer",
      price: "500",
      priceCurrency: "JPY",
      description: "月額500円 / コミュニティごと。先着100名は永久無料。",
    },
    aggregateRating: undefined,
    url: BASE_URL,
    inLanguage: "ja",
  };

  return (
    <html lang="ja" className={`${notoSansJP.variable} antialiased`}>
      <head>
        <link rel="canonical" href={BASE_URL} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KVXCSQR4');`,
          }}
        />
      </head>
      <body className="bg-paper text-ink font-sans">{children}</body>
    </html>
  );
}
