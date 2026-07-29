import Link from "next/link";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Reveal } from "@/components/ui/Reveal";
import type { Brand } from "@/lib/catalog/brands";
import { getProductsByBrand } from "@/lib/catalog/queries";
import { brandShowcase, collectionsOfBrandForLinks } from "@/lib/catalog/taxonomy";

/**
 * Блок бренда в каталоге: заголовок, подводка и до восьми коллекций.
 *
 * На /catalog товара раньше не было вообще — только плитки назначений, типов
 * покрытия и заводов, а до карточек надо было провалиться на два уровня.
 * Теперь страница = список брендов сверху вниз, у каждого своя витрина.
 *
 * Витрина показывает СТУПЕНИ (лендинг про них), если они у бренда есть;
 * керамогранит 20 мм у Paradyz и Stroeher остаётся за ссылкой «Все N позиций».
 */
export function BrandShowcase({ brand, limit = 8 }: { brand: Brand; limit?: number }) {
  const total = getProductsByBrand(brand.name).length;
  const steps = brandShowcase(brand.name, limit, "step_system");
  const products = steps.length ? steps : brandShowcase(brand.name, limit);
  if (!products.length) return null;

  const kind = steps.length ? "Клинкерные ступени" : "Керамогранит 20 мм";
  const collections = collectionsOfBrandForLinks(
    brand.name,
    steps.length ? "step_system" : "slab",
  );

  return (
    <section id={brand.slug} className="scroll-mt-24">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-clinker">
              {brand.country}
              {brand.founded ? ` · с ${brand.founded}` : ""}
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
              {kind} {brand.name}
            </h2>
            <p className="mt-3 max-w-2xl text-stone">{brand.tagline}</p>
          </div>
          <Link
            href={`/producers/${brand.slug}`}
            className="rounded-full border border-ink/15 px-6 py-3 font-semibold text-ink transition hover:border-clinker hover:text-clinker"
          >
            Все {total} позиций {brand.name} →
          </Link>
        </div>
      </Reveal>
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
      {/* Коллекции бренда — единственный вход на страницы коллекций после того,
          как с /catalog убран блок выбора по назначению: без этой строки
          ~130 страниц уровня «назначение → бренд → коллекция» остались бы
          без единой внутренней ссылки. */}
      {collections.length > 1 ? (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-stone/70">Коллекции:</span>
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={c.href}
              className="rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-sm font-medium text-ink transition hover:border-clinker hover:text-clinker"
            >
              {c.base}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
