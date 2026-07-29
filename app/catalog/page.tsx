import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubHero } from "@/components/sections/SubHero";
import { Reveal } from "@/components/ui/Reveal";
import { Img as Image } from "@/components/ui/Img";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { FilterBar } from "@/components/catalog/FilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { PER_PAGE, pageHref, pageSuffix, paginate, parsePage } from "@/lib/pagination";
import {
  COLOR_GROUP_HEX,
  SORT_OPTIONS,
  catalogQueryString,
  facetsOf,
  filterProducts,
  hasActiveFilters,
  parseCatalogQuery,
  sortProducts,
  type CatalogQuery,
} from "@/lib/catalog/facets";
import { BRANDS } from "@/lib/catalog/brands";
import { activeProducts, basePrice, getProductsByBrand } from "@/lib/catalog/queries";
import { diversify } from "@/lib/catalog/diversify";
import { applications, collectionsOfBrandForLinks, slug } from "@/lib/catalog/taxonomy";
import { productTitle } from "@/lib/catalog/display";
import { formatRub } from "@/lib/format";
import { IMAGES, OBJECTS } from "@/lib/images";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { collectionPageSchema } from "@/lib/jsonld";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const pages = Math.max(1, Math.ceil(activeProducts().length / PER_PAGE));
  return {
    title:
      "Каталог — клинкерные ступени и керамогранит 20 мм для улицы" +
      pageSuffix(page, pages),
    description:
      "Каталог уличной керамики: шесть производителей, клинкерные ступени и керамогранит 20 мм. Подбор по цвету и задаче, цены по элементам системы, расчёт комплекта.",
    // Страницы пагинации индексируются с canonical на себя (ТЗ B.3).
    alternates: { canonical: pageHref("/catalog", page) },
    // Фильтрованные выдачи (?color=…, ?q=…) не индексируем.
    ...(hasActiveFilters(parseCatalogQuery(sp)) ? { robots: { index: false, follow: true } } : {}),
  };
}

/** Ссылка на выдачу с изменённым одним фасетом (клик по активному — сброс). */
function facetHref(query: CatalogQuery, key: "color" | "type", value: string): string {
  const next = { ...query, [key]: query[key] === value ? undefined : value };
  const qs = catalogQueryString(next);
  return qs ? `/catalog?${qs}` : "/catalog";
}

/** Врезка «как это выглядит на объекте» между рядами товарной сетки. */
function ObjectBanner({ image }: { image: { src: string; alt: string } }) {
  return (
    <figure className="relative mt-5 overflow-hidden rounded-card border border-ink/10 shadow-card">
      <div className="relative aspect-[21/9] w-full sm:aspect-[3/1]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          loading="lazy"
          className="object-cover"
        />
      </div>
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent px-5 pb-4 pt-10 text-sm font-medium text-white">
        {image.alt}
        <span className="ml-2 text-white/70">— наши работы</span>
      </figcaption>
    </figure>
  );
}

/**
 * Каталог = магазин, а не список заводов: одна сетка всех позиций с фильтрами,
 * поиском и сортировкой. Сверху — два быстрых входа, которыми реально выбирают
 * уличную керамику: задача (крыльцо/терраса/…) и цвет.
 *
 * До 29.07.2026 хаб был стопкой из шести витрин брендов: сравнить товары разных
 * заводов было нельзя (шесть экранов скролла), а FilterBar жил только на
 * листингах уровнем ниже. Бренды и коллекции остались компактной секцией внизу —
 * это единственный вход внутренних ссылок на ~130 страниц коллекций.
 */
export default async function CatalogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const query = parseCatalogQuery(sp);
  const page = parsePage(sp.page);

  const all = diversify(activeProducts());
  const filtered = sortProducts(filterProducts(all, query), query.sort);
  const paged = paginate(filtered, page);
  const facets = facetsOf(all, query);
  const qs = catalogQueryString(query);

  const apps = applications();

  const brands = [...BRANDS]
    .map((b) => {
      const items = getProductsByBrand(b.name);
      const prices = items.map(basePrice).filter((x) => x > 0);
      return {
        brand: b,
        count: items.length,
        minPrice: prices.length ? Math.min(...prices) : 0,
      };
    })
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count);

  // Врезки объектов — только там, где страница достаточно длинная: после 8-й
  // и после 16-й карточки текущей страницы.
  const chunks: { items: typeof paged.items; banner?: (typeof OBJECTS)[number] }[] = [];
  if (paged.items.length > 12) {
    chunks.push({ items: paged.items.slice(0, 8), banner: OBJECTS[2] });
    if (paged.items.length > 20) {
      chunks.push({ items: paged.items.slice(8, 16), banner: OBJECTS[9] });
      chunks.push({ items: paged.items.slice(16) });
    } else {
      chunks.push({ items: paged.items.slice(8) });
    }
  } else {
    chunks.push({ items: paged.items });
  }

  return (
    <>
      <Header />
      <main id="main">
        <SubHero
          image={IMAGES.catSlab.src}
          alt={IMAGES.catSlab.alt}
          eyebrow="Каталог"
          h1="Каталог уличной керамики"
          intro={`${all.length} позиций от шести производителей. Клинкерные ступени поэлементно — с капиносом и с насечками, угловые, напольная плитка 30×30 и 30×60. Комплект в штуках посчитает калькулятор.`}
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

        {/* Быстрые входы: задача и цвет */}
        <section className="mx-auto max-w-7xl px-5 pt-12 sm:pt-16">
          <Reveal>
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm font-medium text-stone/80">Под задачу:</span>
              {apps.map((a) => (
                <Link
                  key={a.code}
                  href={a.href}
                  className="rounded-full border border-ink/12 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-clinker hover:text-clinker"
                >
                  {a.title}
                  <span className="ml-1.5 text-xs font-normal text-stone/60">{a.count}</span>
                </Link>
              ))}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <span className="mr-1 text-sm font-medium text-stone/80">По цвету:</span>
              {facets.colors.map((c) => {
                const active = query.color === c.value;
                return (
                  <Link
                    key={c.value}
                    href={facetHref(query, "color", c.value)}
                    title={`${c.label} — ${c.count} поз.`}
                    className={`group/color flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-sm font-medium transition ${
                      active
                        ? "border-clinker bg-clinker/10 text-clinker"
                        : "border-ink/12 bg-white text-stone hover:border-clinker hover:text-ink"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`h-6 w-6 rounded-full border ${
                        active ? "border-clinker" : "border-ink/15"
                      }`}
                      style={{ background: COLOR_GROUP_HEX[c.value] ?? "#C9B79C" }}
                    />
                    {c.label}
                  </Link>
                );
              })}
            </div>
          </Reveal>
        </section>

        {/* Единая товарная сетка с фильтрами */}
        <section className="mx-auto max-w-7xl px-5 py-10 sm:py-14">
          <Reveal>
            <p className="mt-1 text-stone">
              {paged.total} позиций
              {paged.pages > 1 ? ` · страница ${paged.page} из ${paged.pages}` : ""}
            </p>
          </Reveal>
          <div className="mt-5">
            <FilterBar
              basePath="/catalog"
              query={query}
              facets={facets}
              sortOptions={SORT_OPTIONS}
            />
          </div>
          <div className="mt-8 flex flex-col gap-5">
            {chunks.map((chunk, i) => (
              <div key={i}>
                <ProductGrid products={chunk.items} />
                {chunk.banner ? <ObjectBanner image={chunk.banner} /> : null}
              </div>
            ))}
          </div>
          <Pagination
            base="/catalog"
            page={paged.page}
            pages={paged.pages}
            query={qs}
            className="mt-10 justify-center"
          />
        </section>

        {/* Бренды и коллекции — компактно; единственный вход внутренних ссылок
            на страницы коллекций (~130 адресов «назначение → бренд → коллекция») */}
        <section className="bg-sand-deep">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
            <Reveal>
              <p className="eyebrow text-clinker">Производители</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
                Шесть заводов
              </h2>
            </Reveal>
            <div className="mt-8 flex flex-col gap-5">
              {brands.map(({ brand, count, minPrice }, i) => {
                const steps = collectionsOfBrandForLinks(brand.name, "step_system");
                const collections = steps.length
                  ? steps
                  : collectionsOfBrandForLinks(brand.name);
                return (
                  <Reveal key={brand.slug} delay={(i % 3) * 60}>
                    <div className="rounded-card border border-ink/10 bg-white p-5 shadow-card sm:p-6">
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <Link
                          href={`/producers/${brand.slug}`}
                          className="font-display text-xl font-bold text-ink transition hover:text-clinker"
                        >
                          {brand.name}
                        </Link>
                        <span className="text-xs text-stone/70">
                          {brand.country}
                          {brand.founded ? ` · с ${brand.founded}` : ""}
                        </span>
                        <Link
                          href={`/catalog?brand=${slug(brand.name)}`}
                          className="text-sm font-semibold text-clinker underline-offset-2 hover:underline"
                        >
                          {count} позиций
                        </Link>
                        {minPrice ? (
                          <span className="tabular text-sm text-stone">
                            от {formatRub(minPrice)}
                          </span>
                        ) : null}
                      </div>
                      {collections.length > 1 ? (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {collections.map((c) => (
                            <Link
                              key={c.slug}
                              href={c.href}
                              className="rounded-full border border-ink/10 bg-sand/40 px-3 py-1 text-sm font-medium text-ink transition hover:border-clinker hover:text-clinker"
                            >
                              {c.base}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <SchemaScript
        data={collectionPageSchema({
          name: "Каталог уличной керамики",
          description:
            "Клинкерные ступени и керамогранит 20 мм от шести производителей.",
          // Разметка описывает ТЕКУЩУЮ страницу листинга, а не весь раздел.
          url: pageHref("/catalog", paged.page),
          items: paged.items.map((p) => ({
            id: p.id,
            name: `${p.brand} ${productTitle(p)}`,
          })),
        })}
      />
    </>
  );
}
