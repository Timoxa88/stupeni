import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubHero } from "@/components/sections/SubHero";
import { Reveal } from "@/components/ui/Reveal";
import { LeadForm } from "@/components/forms/LeadForm";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { BRANDS, getBrand } from "@/lib/catalog/brands";
import { getProductsByBrand } from "@/lib/catalog/queries";
import { Pagination } from "@/components/ui/Pagination";
import { PER_PAGE, pageHref, pageSuffix, paginate, parsePage } from "@/lib/pagination";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { collectionPageSchema } from "@/lib/jsonld";

type Params = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export function generateStaticParams() {
  return BRANDS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params, searchParams }: Params): Promise<Metadata> {
  const { slug } = await params;
  const b = getBrand(slug);
  if (!b) return {};
  const page = parsePage((await searchParams).page);
  const pages = Math.max(1, Math.ceil(getProductsByBrand(b.name).length / PER_PAGE));
  return {
    title: `${b.name} — клинкер и керамогранит купить, цена${pageSuffix(page, pages)}`,
    description: `${b.name} (${b.country}${b.founded ? `, с ${b.founded}` : ""}): ${b.tagline} Каталог коллекций, цены, расчёт комплекта и доставка.`,
    alternates: { canonical: pageHref(`/producers/${b.slug}`, page) },
  };
}

export default async function ProducerPage({ params, searchParams }: Params) {
  const { slug } = await params;
  const b = getBrand(slug);
  if (!b) notFound();

  const products = getProductsByBrand(b.name);
  const paged = paginate(products, parsePage((await searchParams).page));
  const heroImage = products[0]?.photos[0] ?? "/images/cat-clinker.jpg";

  return (
    <>
      <Header />
      <main id="main">
        <SubHero
          image={heroImage}
          alt={`Объект с продукцией ${b.name}`}
          eyebrow={b.country}
          h1={`${b.name} — клинкер и керамогранит`}
          intro={b.tagline}
          breadcrumbs={[
            { name: "Главная", url: "/" },
            { name: b.name, url: `/producers/${b.slug}` },
          ]}
        >
          <Link
            href="#catalog"
            className="sheen rounded-full bg-clinker px-7 py-4 font-semibold text-white shadow-glow transition hover:bg-clinker-hover"
          >
            Смотреть коллекции →
          </Link>
          {b.founded ? (
            <span className="inline-flex items-center rounded-full border border-sand/25 px-6 py-4 font-display font-bold text-sand">
              на рынке с {b.founded}
            </span>
          ) : null}
        </SubHero>

        {/* Бренд-сторителлинг + О производителе */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <div className="flex flex-wrap gap-3">
                <Badge label="Страна" value={b.country} />
                {b.founded ? <Badge label="С года" value={String(b.founded)} /> : null}
                <Badge label="Позиции" value={`${products.length} в каталоге`} />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <p className="eyebrow text-clinker">О производителе</p>
              <div className="mt-3 space-y-4 text-lg text-stone">
                {b.story.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Каталог бренда */}
        <section id="catalog" className="bg-sand-deep">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
            <Reveal>
              <p className="eyebrow text-clinker">Коллекции</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
                Каталог {b.name}
              </h2>
            </Reveal>
            <p className="mt-3 text-stone">
              {paged.total} позиций
              {paged.pages > 1 ? ` · страница ${paged.page} из ${paged.pages}` : ""}
            </p>
            <div className="mt-10">
              <ProductGrid products={paged.items} />
            </div>
            <Pagination
              base={`/producers/${b.slug}`}
              page={paged.page}
              pages={paged.pages}
              className="mt-10 justify-center"
            />
          </div>
        </section>

        {/* Блок «Документы» снят вместе с хабом загрузок: он вёл на страницу,
            где все файлы были заглушками 41–77 байт. Вернуть с реальными тех.
            листами и BIM/CAD — см. lib/content/site.ts. */}

        {/* Форма «Хочу {Бренд}» */}
        <section className="bg-graphite-deep text-sand">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
                Хочу {b.name}
              </h2>
              <p className="mt-4 max-w-md text-sand/80">
                Оставьте контакт — подберём коллекцию {b.name} под ваш объект,
                рассчитаем комплект и доставку.
              </p>
            </div>
            <div className="rounded-card bg-white/[0.06] p-6 sm:p-8">
              <LeadForm
                tag={b.name}
                variant="dark"
                submitLabel={`Запросить ${b.name}`}
                comment={`Бренд: ${b.name}`}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <SchemaScript
        data={collectionPageSchema({
          name: `${b.name} — каталог`,
          description: b.tagline,
          url: pageHref(`/producers/${b.slug}`, paged.page),
          items: paged.items.map((p) => ({ id: p.id, name: `${p.collection} ${p.specs.color}` })),
        })}
      />
    </>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-ink/10 bg-white px-5 py-4 shadow-card">
      <div className="text-xs font-semibold uppercase tracking-wide text-stone/70">
        {label}
      </div>
      <div className="mt-1 font-display text-xl font-extrabold text-ink">{value}</div>
    </div>
  );
}
