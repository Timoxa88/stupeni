import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubHero } from "@/components/sections/SubHero";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Reveal } from "@/components/ui/Reveal";
import { LeadForm } from "@/components/forms/LeadForm";
import { getProductsByCategory, type CategoryKey } from "@/lib/catalog/queries";
import { brandSlugByName } from "@/lib/catalog/brands";
import type { CategoryMeta } from "@/lib/content/categories";
import { SOLUTIONS } from "@/lib/content/solutions";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { collectionPageSchema } from "@/lib/jsonld";

/** Применения, релевантные категории, → перелинковка на решения (ТЗ §3). */
const CATEGORY_SOLUTIONS: Record<CategoryKey, string[]> = {
  "terrasnyy-klinker": ["kryltso", "lestnitsa-ulitsa", "bassein"],
  "terrasnye-plastiny": ["terrasa", "dorozhki", "landshaft-opory"],
  "plastiny-pod-derevo": ["terrasa", "dorozhki"],
};

export function CategoryView({ category }: { category: CategoryMeta }) {
  const products = getProductsByCategory(category.slug);
  const brands = Array.from(new Set(products.map((p) => p.brand)));
  const solutions = SOLUTIONS.filter((s) =>
    CATEGORY_SOLUTIONS[category.slug].includes(s.slug),
  );

  return (
    <>
      <Header />
      <main id="main">
        <SubHero
          image={category.heroImage}
          alt={category.heroAlt}
          eyebrow="Категория"
          h1={category.h1}
          intro={category.intro}
          breadcrumbs={[
            { name: "Главная", url: "/" },
            { name: category.h1, url: `/${category.slug}` },
          ]}
        >
          <Link
            href="/calculator"
            className="sheen rounded-full bg-clinker px-7 py-4 font-semibold text-white shadow-glow transition hover:bg-clinker-hover"
          >
            Рассчитать комплект →
          </Link>
          <Link
            href="#catalog"
            className="rounded-full border border-sand/25 px-7 py-4 font-semibold text-sand transition hover:bg-sand/10"
          >
            Смотреть каталог
          </Link>
        </SubHero>

        {/* Каталог категории */}
        <section id="catalog" className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <Reveal>
            <p className="eyebrow text-clinker">Каталог</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
              Коллекции категории
            </h2>
          </Reveal>
          <div className="mt-10">
            <ProductGrid products={products} />
          </div>
        </section>

        {/* Бренды категории */}
        {brands.length > 0 ? (
          <section className="bg-sand-deep">
            <div className="mx-auto max-w-7xl px-5 py-14">
              <p className="eyebrow text-clinker">Производители</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {brands.map((b) => {
                  const slug = brandSlugByName(b);
                  return slug ? (
                    <Link
                      key={b}
                      href={`/producers/${slug}`}
                      className="rounded-full border border-ink/12 bg-white px-5 py-2.5 font-semibold text-ink transition hover:border-clinker hover:text-clinker"
                    >
                      {b}
                    </Link>
                  ) : (
                    <span key={b} className="rounded-full border border-ink/12 bg-white px-5 py-2.5 font-semibold text-ink">
                      {b}
                    </span>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        {/* Решения по применению */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
          <Reveal>
            <p className="eyebrow text-clinker">Где применить</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
              Сценарии применения
            </h2>
          </Reveal>
          <ul className="mt-8 border-t hairline">
            {solutions.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={i * 60}>
                <Link
                  href={`/resheniya/${s.slug}`}
                  className="group flex items-center gap-5 border-b hairline py-5 transition"
                >
                  <span className="flex-1 font-display text-xl font-bold text-ink transition group-hover:text-clinker sm:text-2xl">
                    {s.h1}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border hairline text-stone transition group-hover:border-clinker group-hover:bg-clinker group-hover:text-white">
                    →
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* Лид-форма */}
        <section className="bg-graphite-deep text-sand">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow text-clinker-bright">Подбор</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
                Поможем подобрать под объект
              </h2>
              <p className="mt-4 max-w-md text-sand/80">
                Оставьте контакт — менеджер предложит 2–3 артикула под ваш сценарий,
                посчитает комплект и подскажет по наличию и доставке.
              </p>
            </div>
            <div className="rounded-card bg-white/[0.06] p-6 sm:p-8">
              <LeadForm
                tag="Подбор"
                variant="dark"
                submitLabel="Получить подбор"
                comment={`Категория: ${category.h1}`}
                fields={["comment"]}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <SchemaScript
        data={collectionPageSchema({
          name: category.h1,
          description: category.description,
          url: `/${category.slug}`,
          items: products.map((p) => ({ id: p.id, name: `${p.brand} ${p.collection} ${p.specs.color}` })),
        })}
      />
    </>
  );
}
