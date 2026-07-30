import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubHero } from "@/components/sections/SubHero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { getContent } from "@/lib/store/content";
import { resolveSeo } from "@/lib/store/seo";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { servicesCatalogSchema } from "@/lib/jsonld";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await resolveSeo("static:services", {
    title: "Услуги — образец, расчёт, замер, монтаж, доставка",
    description:
      "Услуги Hit Ceramics: заказ образца, расчёт комплекта, замер, монтаж клинкера и керамогранита, 3D-визуализация, распил, доставка по РФ и СНГ.",
  });
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/services" },
    ...(seo.ogImage ? { openGraph: { images: [seo.ogImage] } } : {}),
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function ServicesPage() {
  const { items: services } = await getContent("services");
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
          <ServicesGrid items={services} />
        </section>
      </main>
      <Footer />
      <SchemaScript data={servicesCatalogSchema(services.map((s) => ({ title: s.title, desc: s.desc })))} />
    </>
  );
}
