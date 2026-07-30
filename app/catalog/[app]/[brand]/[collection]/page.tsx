import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubHero } from "@/components/sections/SubHero";
import { Reveal } from "@/components/ui/Reveal";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { LeadForm } from "@/components/forms/LeadForm";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { collectionPageSchema } from "@/lib/jsonld";
import { productTitle } from "@/lib/catalog/display";
import { plural } from "@/lib/format";
import {
  getApplication,
  brandBySlug,
  collectionBySlug,
  colorLabel,
  allPaths,
} from "@/lib/catalog/taxonomy";
import { primeOverrides } from "@/lib/store/products";

/* Правки из админки (цены, тексты, скрытие) подхватываются за минуту. */
export const revalidate = 60;

type Props = { params: Promise<{ app: string; brand: string; collection: string }> };

export function generateStaticParams() {
  return allPaths()
    .filter((p) => p.collection)
    .map((p) => ({ app: p.app, brand: p.brand!, collection: p.collection! }));
}

async function resolve(params: Props["params"]) {
  const { app, brand, collection } = await params;
  const node = getApplication(app);
  const name = node && brandBySlug(node.code, brand);
  const coll = node && name && collectionBySlug(node.code, name, collection);
  return { app, brand, collection, node, name, coll };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await primeOverrides();
  const { app, brand, collection, node, name, coll } = await resolve(params);
  if (!node || !name || !coll) return {};
  const colors = coll.products.map(colorLabel).join(", ");
  return {
    title: `${name} ${coll.base} — цвета и цены, ${node.title.toLowerCase()}`,
    description: `Коллекция ${name} ${coll.base}: ${coll.products.length} ${plural(coll.products.length, "цвет", "цвета", "цветов")} (${colors}). Состав элементов, цены и расчёт комплекта.`,
    alternates: { canonical: `/catalog/${app}/${brand}/${collection}` },
  };
}

/** Четвёртый уровень: цвета коллекции. Дальше — карточка товара. */
export default async function CollectionLevel({ params }: Props) {
  await primeOverrides();
  const { app, brand, collection, node, name, coll } = await resolve(params);
  if (!node || !name || !coll) notFound();

  return (
    <>
      <Header />
      <main id="main">
        <SubHero
          image={coll.cover ?? node.image}
          alt={coll.coverAlt ?? node.imageAlt}
          eyebrow={`${node.title} · ${name}`}
          h1={`${name} ${coll.base}`}
          intro={`${coll.products.length} ${plural(coll.products.length, "цвет и исполнение", "цвета и исполнения", "цветов и исполнений")} коллекции. Цвета одной серии совпадают по формату и составу элементов — проступь, угол, подступёнок и базовая плитка считаются одинаково.`}
          breadcrumbs={[
            { name: "Главная", url: "/" },
            { name: "Каталог", url: "/catalog" },
            { name: node.title, url: `/catalog/${node.code}` },
            { name, url: `/catalog/${node.code}/${brand}` },
            { name: coll.base, url: `/catalog/${node.code}/${brand}/${collection}` },
          ]}
        >
          <Link
            href="/calculator"
            className="sheen rounded-full bg-clinker px-7 py-4 font-semibold text-white shadow-glow transition hover:bg-clinker-hover"
          >
            Рассчитать комплект →
          </Link>
        </SubHero>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <Reveal>
            <p className="eyebrow text-clinker">Шаг 4 — цвет</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold text-ink sm:text-5xl">
              Цвета коллекции
            </h2>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {coll.products.map((p) => (
                <span
                  key={p.id}
                  className="inline-flex items-center gap-2 rounded-full border border-ink/12 bg-white px-3.5 py-1.5 text-sm text-stone"
                >
                  <span
                    aria-hidden
                    className="h-3.5 w-3.5 rounded-full border border-ink/15"
                    style={{ background: p.specs.color_hex || "#C9B79C" }}
                  />
                  {colorLabel(p)}
                </span>
              ))}
            </div>
          </Reveal>
          <div className="mt-10">
            <ProductGrid products={coll.products} />
          </div>
        </section>

        <section className="bg-graphite-deep text-sand">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
                Нужен цвет, которого нет в списке?
              </h2>
              <p className="mt-4 max-w-md text-sand/80">
                Привозим под заказ всю линейку производителя. Напишите, какой оттенок нужен —
                проверим наличие и сроки.
              </p>
            </div>
            <div className="rounded-xl2 bg-white/[0.06] p-7 sm:p-9">
              <LeadForm
                tag="Подбор цвета"
                source="product"
                data={{ product: `${name} ${coll.base}`, collection: coll.base, brand: name }}
                variant="dark"
                submitLabel="Проверить наличие"
                fields={["comment"]}
                comment={`Интерес: ${name} ${coll.base} (${node.title})`}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <SchemaScript
        data={collectionPageSchema({
          name: `${name} ${coll.base}`,
          description: `Цвета коллекции ${name} ${coll.base} для сценария «${node.title.toLowerCase()}».`,
          url: `/catalog/${app}/${brand}/${collection}`,
          items: coll.products.map((p) => ({
            id: p.id,
            name: `${p.brand} ${productTitle(p)}`,
          })),
        })}
      />
    </>
  );
}
