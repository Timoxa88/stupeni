import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubHero } from "@/components/sections/SubHero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { SERVICES } from "@/lib/content/services";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { servicesCatalogSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Услуги — образец, расчёт, замер, монтаж, доставка",
  description:
    "Услуги Hit Ceramics: заказ образца, расчёт комплекта, замер, монтаж клинкера и керамогранита, 3D-визуализация, распил, доставка по РФ и СНГ.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main id="main">
        <SubHero
          image="/images/gal-terrace.jpg"
          alt="Монтаж террасы из керамогранита"
          eyebrow="Сервис"
          h1="Услуги под крыльцо, лестницу и террасу"
          intro="От образца и расчёта до замера, монтажа и доставки. Каждая заявка попадает напрямую к менеджеру — ответим в течение 15 минут."
          breadcrumbs={[
            { name: "Главная", url: "/" },
            { name: "Услуги", url: "/services" },
          ]}
        />
        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <ServicesGrid />
        </section>
      </main>
      <Footer />
      <SchemaScript data={servicesCatalogSchema(SERVICES.map((s) => ({ title: s.title, desc: s.desc })))} />
    </>
  );
}
