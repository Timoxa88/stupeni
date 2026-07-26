import type { Metadata, Viewport } from "next";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import { WebVitals } from "@/components/analytics/WebVitals";
import { CookieBanner } from "@/components/sections/CookieBanner";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { SITE, IS_PREVIEW } from "@/lib/content/site";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  adjustFontFallback: true,
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f1ec" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0e0d" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.baseUrl),
  // Превью на домене агентства не должно индексироваться (правильный домен — TBD).
  ...(IS_PREVIEW ? { robots: { index: false, follow: false } } : {}),
  title: {
    default:
      "Клинкерные ступени и крупноформат для крыльца, лестниц и террас — Hit Ceramics",
    template: "%s — Hit Ceramics",
  },
  description:
    "Клинкерные ступени и крупноформатный керамогранит 20 мм для улицы: морозостойко, не скользит, открытые цены, расчёт комплекта онлайн, доставка по РФ и СНГ.",
  keywords: [
    "клинкерные ступени",
    "ступени для крыльца",
    "ступени для уличной лестницы",
    "керамогранит для террасы 20 мм",
    "террасные пластины",
    "керамогранит под дерево",
    "плитка на регулируемые опоры",
    "морозостойкие ступени",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Hit Ceramics",
    title:
      "Клинкерные ступени и крупноформат для крыльца, лестниц и террас — Hit Ceramics",
    description:
      "Клинкерные ступени и керамогранит 20 мм для улицы: морозостойко, не скользит, расчёт комплекта онлайн.",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${unbounded.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-sand text-ink">
        <a href="#main" className="skip-link">
          К основному содержимому
        </a>
        {children}
        <div className="grain" aria-hidden="true" />
        <MobileCtaBar />
        <CookieBanner />
        <WebVitals />
      </body>
    </html>
  );
}
