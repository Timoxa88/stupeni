import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubHero } from "@/components/sections/SubHero";
import { Reveal } from "@/components/ui/Reveal";
import { BrandShowcase } from "@/components/catalog/BrandShowcase";
import { BRANDS } from "@/lib/catalog/brands";
import { activeProducts, getProductsByBrand } from "@/lib/catalog/queries";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Каталог — клинкерные ступени и керамогранит 20 мм для улицы",
  description:
    "Каталог уличной керамики: шесть производителей, клинкерные ступени и керамогранит 20 мм. Цены по элементам системы, поэлементный расчёт комплекта.",
  alternates: { canonical: "/catalog" },
};

/**
 * Каталог = список брендов сверху вниз.
 *
 * До 29.07.2026 страница была навигацией без товара: «Шаг 1 — назначение»,
 * «Три типа покрытия» и плашки заводов, а до карточек надо было провалиться
 * на два уровня. Выбор по назначению остался единственной развилкой на главной
 * (SceneCards) и на /resheniya — дублировать его в каталоге незачем; типы
 * покрытия переехали на главную следом за сценариями.
 *
 * Порядок брендов — по числу активных позиций: у Paradyz их больше половины
 * каталога, и он должен открывать список.
 */
export default function CatalogPage() {
  const total = activeProducts().length;
  const brands = [...BRANDS]
    .map((b) => ({ brand: b, count: getProductsByBrand(b.name).length }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <>
      <Header />
      <main id="main">
        <SubHero
          image={IMAGES.catSlab.src}
          alt={IMAGES.catSlab.alt}
          eyebrow="Каталог"
          h1="Каталог уличной керамики"
          intro={`${total} позиций от шести производителей. Клинкерные ступени поэлементно — с капиносом и с насечками, угловые, напольная плитка 30×30 и 30×60. Комплект в штуках посчитает калькулятор.`}
          breadcrumbs={[
            { name: "Главная", url: "/" },
            { name: "Каталог", url: "/catalog" },
          ]}
        >
          <Link
            href="/calculator"
            className="sheen rounded-full bg-clinker px-7 py-4 font-semibold text-white shadow-glow transition hover:bg-clinker-hover"
          >
            Рассчитать комплект →
          </Link>
        </SubHero>

        {/* Производители — первым экраном, отсюда якорями к витринам ниже */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
          <Reveal>
            <p className="eyebrow text-clinker">Производители</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold text-ink sm:text-5xl">
              Шесть заводов
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map(({ brand, count }, i) => (
              <Reveal key={brand.slug} delay={(i % 3) * 80}>
                <a
                  href={`#${brand.slug}`}
                  className="group flex h-full flex-col rounded-card border border-ink/10 bg-white p-6 shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-xl font-bold text-ink transition group-hover:text-clinker">
                      {brand.name}
                    </h3>
                    <span className="text-xs text-stone/70">
                      {brand.country}
                      {brand.founded ? ` · с ${brand.founded}` : ""}
                    </span>
                  </div>
                  <p className="mt-2 flex-1 text-sm text-stone">{brand.tagline}</p>
                  <span className="mt-4 text-sm font-semibold text-clinker">
                    {count} позиций ↓
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Витрины брендов списком вниз */}
        <div className="bg-sand-deep">
          <div className="mx-auto flex max-w-7xl flex-col gap-16 px-5 py-16 sm:gap-24 sm:py-24">
            {brands.map(({ brand }) => (
              <BrandShowcase key={brand.slug} brand={brand} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
