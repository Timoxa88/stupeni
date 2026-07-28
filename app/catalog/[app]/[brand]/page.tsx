import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Img as Image } from "@/components/ui/Img";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubHero } from "@/components/sections/SubHero";
import { Reveal } from "@/components/ui/Reveal";
import { getApplication, brandsOf, brandBySlug, collectionsOf, allPaths } from "@/lib/catalog/taxonomy";
import { brandSlugByName } from "@/lib/catalog/brands";

type Props = { params: Promise<{ app: string; brand: string }> };

export function generateStaticParams() {
  return allPaths()
    .filter((p) => p.brand && !p.collection)
    .map((p) => ({ app: p.app, brand: p.brand! }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { app, brand } = await params;
  const node = getApplication(app);
  const name = node && brandBySlug(node.code, brand);
  if (!node || !name) return {};
  return {
    title: `${name} для сценария «${node.title.toLowerCase()}» — коллекции и цены`,
    description: `Коллекции ${name} под ${node.title.toLowerCase()}: состав, цвета, цены и расчёт комплекта.`,
    alternates: { canonical: `/catalog/${app}/${brand}` },
  };
}

/** Третий уровень каталога: коллекции бренда внутри назначения. */
export default async function BrandLevel({ params }: Props) {
  const { app, brand } = await params;
  const node = getApplication(app);
  const name = node && brandBySlug(node.code, brand);
  if (!node || !name) notFound();

  const collections = collectionsOf(node.code, name);
  const total = brandsOf(node.code).find((b) => b.slug === brand)?.count ?? 0;
  const producerSlug = brandSlugByName(name);

  return (
    <>
      <Header />
      <main id="main">
        <SubHero
          image={collections[0]?.cover ?? node.image}
          alt={collections[0]?.coverAlt ?? node.imageAlt}
          eyebrow={node.title}
          h1={`${name} — коллекции`}
          intro={`${collections.length} коллекций и ${total} позиций ${name} под сценарий «${node.title.toLowerCase()}». В коллекции — цвета одной серии с общим форматом и составом элементов.`}
          breadcrumbs={[
            { name: "Главная", url: "/" },
            { name: "Каталог", url: "/catalog" },
            { name: node.title, url: `/catalog/${node.code}` },
            { name, url: `/catalog/${node.code}/${brand}` },
          ]}
        >
          {producerSlug ? (
            <Link
              href={`/producers/${producerSlug}`}
              className="rounded-full border border-sand/25 px-7 py-4 font-semibold text-sand transition hover:bg-sand/10"
            >
              О производителе →
            </Link>
          ) : null}
        </SubHero>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <Reveal>
            <p className="eyebrow text-clinker">Шаг 3 — коллекция</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold text-ink sm:text-5xl">
              Коллекции {name}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 3) * 80}>
                <Link
                  href={c.href}
                  className="group flex h-full flex-col overflow-hidden rounded-card border border-ink/10 bg-white shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-sand-deep">
                    {c.cover ? (
                      <Image
                        src={c.cover}
                        alt={c.coverAlt ?? c.base}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        loading="lazy"
                        className="img-rich object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-stone/60">
                        фото уточняется
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-xl font-bold text-ink transition group-hover:text-clinker">
                      {c.base}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-stone">
                      {c.products.length} цвет{c.products.length === 1 ? "" : c.products.length < 5 ? "а" : "ов"} и исполнений
                    </p>
                    <span className="mt-4 text-sm font-semibold text-clinker">Смотреть цвета →</span>
                  </div>
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
