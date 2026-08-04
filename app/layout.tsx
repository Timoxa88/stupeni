import type { Metadata, Viewport } from "next";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import { WebVitals } from "@/components/analytics/WebVitals";
import { YandexMetrika } from "@/components/analytics/YandexMetrika";
import { GoalTracker } from "@/components/analytics/GoalTracker";
import { CookieBanner } from "@/components/sections/CookieBanner";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { ExitIntent } from "@/components/marketing/ExitIntent";
import { ContactsProvider } from "@/components/layout/ContactsProvider";
import { SITE, IS_PREVIEW } from "@/lib/content/site";
import { getContent } from "@/lib/store/content";
import { getSettings } from "@/lib/store/settings";

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

/**
 * Метаданные зависят от настроек из админки (коды подтверждения Вебмастера и
 * Search Console), поэтому generateMetadata, а не константа.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
  metadataBase: new URL(SITE.baseUrl),
  // Превью на домене агентства не должно индексироваться (правильный домен — TBD).
  ...(IS_PREVIEW ? { robots: { index: false, follow: false } } : {}),
  title: {
    // Держим в пределах ~70 символов вместе с « — Hit Ceramics»:
    // всё, что длиннее, выдача обрезает вместе с названием магазина.
    default: "Клинкерные ступени для крыльца, лестниц и террас — Hit Ceramics",
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
  ...(settings.yandexVerification || settings.googleVerification
    ? {
        verification: {
          ...(settings.yandexVerification ? { yandex: settings.yandexVerification } : {}),
          ...(settings.googleVerification ? { google: settings.googleVerification } : {}),
        },
      }
    : {}),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [contacts, settings] = await Promise.all([getContent("contacts"), getSettings()]);
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${unbounded.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-sand text-ink">
        <a href="#main" className="skip-link">
          К основному содержимому
        </a>
        <ContactsProvider
          value={{
            phone: contacts.phone,
            phoneLabel: contacts.phoneLabel,
            email: contacts.email,
            cities: contacts.cities,
          }}
        >
          {children}
          <div className="grain" aria-hidden="true" />
          <MobileCtaBar />
        </ContactsProvider>
        <CookieBanner />
        <ExitIntent />
        <WebVitals />
        <YandexMetrika counterId={settings.ymCounterId} />
        <GoalTracker />
      </body>
    </html>
  );
}
