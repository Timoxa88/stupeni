import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

/** Каркас правовой/контентной страницы (ТЗ B.2). */
export function LegalLayout({
  title,
  intro,
  updated,
  children,
  slug,
}: {
  title: string;
  intro?: string;
  updated?: string;
  children: ReactNode;
  slug: string;
}) {
  return (
    <>
      <Header tone="light" />
      <main id="main" className="pt-[72px]">
        <div className="mx-auto max-w-3xl px-5 py-10">
          <Breadcrumbs items={[{ name: "Главная", url: "/" }, { name: title, url: `/${slug}` }]} />
          <h1 className="mt-6 font-display text-3xl font-extrabold text-ink sm:text-4xl">{title}</h1>
          {updated ? <p className="mt-2 text-sm text-stone/70">Обновлено: {updated}</p> : null}
          {intro ? <p className="mt-4 text-lg text-stone">{intro}</p> : null}
          <div className="legal-prose mt-8 space-y-5 text-stone">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
