import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { LeadForm } from "@/components/forms/LeadForm";
import { SITE, CITY_CONTACTS, PLACES } from "@/lib/content/site";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { localBusinessSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Контакты — склады и шоу-румы в Москве и Санкт-Петербурге",
  description:
    "Контакты Hit Ceramics: телефоны Москва и Санкт-Петербург, email, склады и шоу-румы, реквизиты ООО «ЗЕ ВАН».",
  alternates: { canonical: "/contacts" },
};

export default function ContactsPage() {
  return (
    <>
      <Header tone="light" />
      <main id="main" className="pt-[72px]">
        <div className="mx-auto max-w-7xl px-5 py-10">
          <Breadcrumbs items={[{ name: "Главная", url: "/" }, { name: "Контакты", url: "/contacts" }]} />
          <h1 className="mt-6 font-display text-3xl font-extrabold text-ink sm:text-5xl">Контакты</h1>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              {/* Телефоны */}
              <div className="grid gap-4 sm:grid-cols-2">
                {CITY_CONTACTS.map((c) => (
                  <div key={c.phone} className="rounded-card border border-ink/10 bg-white p-6 shadow-card">
                    <div className="eyebrow text-clinker">{c.city}</div>
                    <a href={`tel:${c.phone}`} className="mt-2 block font-display text-2xl font-extrabold text-ink">
                      {c.phoneLabel}
                    </a>
                  </div>
                ))}
              </div>
              <a href={`mailto:${SITE.email}`} className="mt-4 inline-block font-semibold text-clinker">
                {SITE.email}
              </a>

              {/* Точки */}
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {PLACES.map((p) => (
                  <div key={`${p.city}-${p.kind}-${p.address}`} className="rounded-card border border-ink/10 bg-white p-6 shadow-card">
                    <div className="eyebrow text-clinker">
                      {p.kind === "showroom" ? "Шоу-рум" : "Склад"}
                    </div>
                    <div className="mt-2 font-display text-lg font-bold text-ink">{p.city}</div>
                    <p className="mt-1 text-stone">{p.address}</p>
                    <p className="mt-1 text-sm text-stone/70">{p.hours}</p>
                  </div>
                ))}
              </div>

              {/* Реквизиты */}
              <div className="mt-10 rounded-card bg-sand-deep p-6 text-sm text-stone">
                <div className="font-semibold text-ink">Реквизиты</div>
                <p className="mt-2">
                  {SITE.legal} · ИНН {SITE.inn} · ОГРН {SITE.ogrn}
                </p>
              </div>
            </div>

            <div className="rounded-card border border-ink/10 bg-white p-6 shadow-card sm:p-8">
              <h2 className="font-display text-2xl font-bold text-ink">Написать нам</h2>
              <p className="mt-2 text-sm text-stone">Ответим в течение 15 минут в рабочее время.</p>
              <div className="mt-5">
                <LeadForm tag="Контакты" submitLabel="Отправить" fields={["email", "comment"]} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <SchemaScript data={localBusinessSchema()} />
    </>
  );
}
