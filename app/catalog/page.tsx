import type { Metadata } from "next";
import Link from "next/link";
import { Img as Image } from "@/components/ui/Img";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubHero } from "@/components/sections/SubHero";
import { Reveal } from "@/components/ui/Reveal";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { CATEGORIES } from "@/lib/content/categories";
import { BRANDS } from "@/lib/catalog/brands";
import { activeProducts, getProductsByCategory, getProductsByBrand } from "@/lib/catalog/queries";
import { IMAGES } from "@/lib/images";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { collectionPageSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Каталог — клинкерные ступени и керамогранит 20 мм для улицы",
  description:
    "Каталог уличной керамики: террасный клинкер, крупноформатные пластины 20 мм и керамогранит под дерево. Шесть производителей, цены, поэлементный расчёт.",
  alternates: { canonical: "/catalog" },
};

/**
 * Хаб каталога. Раньше /catalog отдавал 404, а чип «Весь каталог» на главной вёл
 * в категорию клинкера — то есть индекса каталога у сайта не было вовсе.
 * Хаб не дублирует листинги: он только разводит по трём категориям и брендам.
 */
export default function CatalogPage() {
  const total = activeProducts().length;
  const popular = activeProducts().slice(0, 8);

  return (
    <>
      <Header />
      <main id="main">
        <SubHero
          image={IMAGES.catSlab.src}
          alt={IMAGES.catSlab.alt}
          eyebrow="Каталог"
          h1="Каталог уличной керамики"
          intro={`Клинкерные ступени, крупноформатные пластины 20 мм и керамогранит под дерево — ${total} позиций от шести производителей. Выберите категорию или бренд, а комплект в штуках посчитает калькулятор.`}
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

        {/* Три категории */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <Reveal>
            <p className="eyebrow text-clinker">Категории</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold text-ink sm:text-5xl">
              Три направления
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.slug} delay={i * 120}>
                <Link
                  href={`/${c.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-card border border-ink/10 bg-white shadow-card transition duration-500 hover:-translate-y-1.5 hover:shadow-lift"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={c.heroImage}
                      alt={c.heroAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading="lazy"
                      className="img-rich object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      aria-hidden
                      style={{ background: "linear-gradient(180deg, transparent 55%, rgba(18,20,19,0.35) 100%)" }}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1.5" style={{ background: c.accent }} />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="font-display text-2xl font-bold text-ink">{c.h1}</h3>
                    <p className="mt-3 flex-1 text-stone">{c.description}</p>
                    <span className="mt-6 inline-flex items-center gap-2 font-semibold text-clinker">
                      {getProductsByCategory(c.slug).length} позиций
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Производители */}
        <section className="bg-sand-deep">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
            <Reveal>
              <p className="eyebrow text-clinker">Производители</p>
              <h2 className="mt-3 font-display text-4xl font-extrabold text-ink sm:text-5xl">
                Шесть заводов
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BRANDS.map((b, i) => (
                <Reveal key={b.slug} delay={(i % 3) * 80}>
                  <Link
                    href={`/producers/${b.slug}`}
                    className="group flex h-full flex-col rounded-card border border-ink/10 bg-white p-6 shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-lift"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-xl font-bold text-ink transition group-hover:text-clinker">
                        {b.name}
                      </h3>
                      <span className="text-xs text-stone/70">
                        {b.country}
                        {b.founded ? ` · с ${b.founded}` : ""}
                      </span>
                    </div>
                    <p className="mt-2 flex-1 text-sm text-stone">{b.tagline}</p>
                    <span className="mt-4 text-sm font-semibold text-clinker">
                      {getProductsByBrand(b.name).length} позиций →
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Популярное */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <Reveal>
            <p className="eyebrow text-clinker">Популярное</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold text-ink sm:text-5xl">
              Часто выбирают
            </h2>
          </Reveal>
          <div className="mt-10">
            <ProductGrid products={popular} />
          </div>
        </section>
      </main>
      <Footer />

      <SchemaScript
        data={collectionPageSchema({
          name: "Каталог уличной керамики",
          description:
            "Клинкерные ступени, крупноформатные пластины 20 мм и керамогранит под дерево.",
          url: "/catalog",
          items: popular.map((p) => ({
            id: p.id,
            name: `${p.brand} ${p.collection} ${p.specs.color}`,
          })),
        })}
      />
    </>
  );
}
