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
import { activeProducts, getProductsByBrand } from "@/lib/catalog/queries";
import { applications, brandShowcase } from "@/lib/catalog/taxonomy";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Каталог — клинкерные ступени и керамогранит 20 мм для улицы",
  description:
    "Каталог уличной керамики по назначению: крыльцо, уличная лестница, терраса, дорожки, укладка на опоры. Шесть производителей, цены, поэлементный расчёт.",
  alternates: { canonical: "/catalog" },
};

/**
 * Первый уровень каталога — назначение.
 *
 * Порядок «назначение → бренд → коллекция → цвет» выбран потому, что покупатель
 * приходит с задачей («облицевать крыльцо»), а не с брендом. Категории по типу
 * материала оставлены ниже вторым входом: они полезны, когда человек уже знает,
 * что ему нужен именно крупноформат 20 мм.
 */
export default function CatalogPage() {
  const total = activeProducts().length;
  const apps = applications();
  // Paradyz — основной поставщик и больше половины каталога, но на /catalog он
  // раньше упоминался только плашкой «N позиций» среди шести заводов: товара на
  // странице не было ни одного. Восемь коллекций сразу под шапкой.
  const paradyz = brandShowcase("Paradyz", 8, "step_system");
  const paradyzCount = getProductsByBrand("Paradyz").length;

  return (
    <>
      <Header />
      <main id="main">
        <SubHero
          image={IMAGES.catSlab.src}
          alt={IMAGES.catSlab.alt}
          eyebrow="Каталог"
          h1="Каталог уличной керамики"
          intro={`${total} позиций от шести производителей. Начните с того, куда укладываете, — дальше бренд, коллекция и цвет. Комплект в штуках посчитает калькулятор.`}
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

        {/* Витрина Paradyz — до навигации по назначениям */}
        {paradyz.length ? (
          <section className="mx-auto max-w-7xl px-5 pt-16 sm:pt-24">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="eyebrow text-clinker">Paradyz · Польша</p>
                  <h2 className="mt-3 font-display text-4xl font-extrabold text-ink sm:text-5xl">
                    Клинкерные ступени Paradyz
                  </h2>
                  <p className="mt-3 max-w-2xl text-stone">
                    Система целиком: ступень с капиносом и с насечками, угловые элементы
                    и напольная плитка 30×30 и 30×60 — в одном цвете и обжиге.
                  </p>
                </div>
                <Link
                  href="/producers/paradyz"
                  className="rounded-full border border-ink/15 px-6 py-3 font-semibold text-ink transition hover:border-clinker hover:text-clinker"
                >
                  Все {paradyzCount} позиций Paradyz →
                </Link>
              </div>
            </Reveal>
            <div className="mt-10">
              <ProductGrid products={paradyz} />
            </div>
          </section>
        ) : null}

        {/* Шаг 1 — назначение */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <Reveal>
            <p className="eyebrow text-clinker">Шаг 1 — назначение</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold text-ink sm:text-5xl">
              Куда укладываем
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((a, i) => (
              <Reveal key={a.code} delay={(i % 3) * 90}>
                <Link
                  href={a.href}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-card border border-ink/10 shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-lift"
                >
                  <Image
                    src={a.image}
                    alt={a.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                    className="img-rich object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    aria-hidden
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(12,14,13,0.05) 30%, rgba(12,14,13,0.82) 100%)",
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-sand">
                    <h3 className="font-display text-2xl font-bold">{a.title}</h3>
                    <p className="mt-1 text-sm text-sand/85">{a.count} позиций</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Второй вход — по типу материала */}
        <section className="bg-sand-deep">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
            <Reveal>
              <p className="eyebrow text-clinker">Если знаете материал</p>
              <h2 className="mt-3 font-display text-4xl font-extrabold text-ink sm:text-5xl">
                Три типа покрытия
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {CATEGORIES.map((c, i) => (
                <Reveal key={c.slug} delay={i * 80}>
                  <Link
                    href={`/${c.slug}`}
                    className="group flex h-full flex-col rounded-card border border-ink/10 bg-white p-6 shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-lift"
                  >
                    <h3 className="font-display text-lg font-bold text-ink transition group-hover:text-clinker">
                      {c.h1}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-stone">{c.description}</p>
                    <span className="mt-4 text-sm font-semibold text-clinker">Смотреть →</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Производители */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
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
        </section>
      </main>
      <Footer />
    </>
  );
}
