import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductDetail } from "@/components/catalog/ProductDetail";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Reveal } from "@/components/ui/Reveal";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { SEED_PRODUCTS } from "@/lib/catalog/seed";
import { productTitle } from "@/lib/catalog/display";
import { clampTitle } from "@/lib/seo/title";
import {
  getProductById,
  getRelatedProducts,
  productCategory,
} from "@/lib/catalog/queries";
import { getCategory } from "@/lib/content/categories";
import { brandSlugByName } from "@/lib/catalog/brands";
import { productSchema } from "@/lib/jsonld";
import { primeOverrides } from "@/lib/store/products";
import { applyOverrideCached } from "@/lib/catalog/overrides-cache";
import { resolveSeo } from "@/lib/store/seo";
import { ViewTracker } from "@/components/analytics/ViewTracker";

/* Правки из админки (цены, тексты, скрытие) подхватываются за минуту. */
export const revalidate = 60;

type Params = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  // Только активные: снятые с витрины товары (нет фото своего артикула — см.
  // scripts/deactivate_without_photo.py) не должны иметь и своей страницы.
  // Иначе они исчезают из листингов и счётчиков, но остаются доступны по прямой
  // ссылке — и попадают в выдачу как страница без картинки.
  // Артикулы, скрытые в админке, тоже не пререндерим.
  await primeOverrides();
  return SEED_PRODUCTS.map(applyOverrideCached)
    .filter((p) => p.active)
    .map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  await primeOverrides();
  const { id } = await params;
  const p = getProductById(id);
  if (!p) return {};
  // Снятый с витрины артикул из индекса убираем, страницу оставляем «заглушкой».
  if (!p.active) {
    return {
      title: `${productTitle(p)} — снят с витрины`,
      robots: { index: false, follow: false },
      alternates: { canonical: `/catalog/tovar/${p.id}` },
    };
  }
  const seo = await resolveSeo(`product:${p.id}`, {
    title: p.seo.title,
    description: p.seo.description,
  });
  return {
    // absolute: clampTitle сам решает, влезает ли « — Hit Ceramics»,
    // иначе шаблон лейаута добавил бы его поверх лимита.
    title: { absolute: clampTitle(seo.title) },
    description: seo.description,
    alternates: { canonical: `/catalog/tovar/${p.id}` },
    ...(seo.ogImage ? { openGraph: { images: [seo.ogImage] } } : {}),
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function ProductPage({ params }: Params) {
  await primeOverrides();
  const { id } = await params;
  const product = getProductById(id);
  // Несуществующий артикул — честный 404.
  if (!product) notFound();

  /*
   * Артикул, скрытый в админке, отдаём страницей-заглушкой (noindex), а не 404.
   * Причина техническая: notFound() бросает ошибку, а при ошибке ревалидации
   * Next «продолжает отдавать последнюю успешно сгенерированную страницу»
   * (docs → guides/incremental-static-regeneration, «Handling uncaught
   * exceptions»). То есть после скрытия карточка навсегда осталась бы в кэше
   * со старым содержимым. Заглушка рендерится штатно — кэш обновляется, из
   * листингов, карты сайта и цветовых чипов артикул уже убран.
   */
  if (!product.active) {
    return (
      <>
        <Header tone="light" />
        <main id="main" className="pt-[72px]">
          <section className="mx-auto max-w-3xl px-5 py-24 text-center">
            <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
              {productTitle(product)} — снят с витрины
            </h1>
            <p className="mt-4 text-stone">
              Этой позиции сейчас нет в продаже. Подберём замену в том же цвете и формате —
              посмотрите каталог или напишите нам.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/catalog"
                className="rounded-full bg-clinker px-6 py-3 font-semibold text-white transition hover:bg-clinker-hover"
              >
                В каталог
              </Link>
              <Link
                href="/podbor"
                className="rounded-full border border-ink/15 px-6 py-3 font-semibold text-ink transition hover:border-ink/40"
              >
                Подобрать замену
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const cat = getCategory(productCategory(product));
  const brandSlug = brandSlugByName(product.brand);
  const related = getRelatedProducts(product);

  return (
    <>
      <Header tone="light" />
      <main id="main" className="pt-[72px]">
        <div className="mx-auto max-w-7xl px-5 pt-6">
          <Breadcrumbs
            items={[
              { name: "Главная", url: "/" },
              ...(cat ? [{ name: cat.h1, url: `/${cat.slug}` }] : []),
              ...(brandSlug ? [{ name: product.brand, url: `/producers/${brandSlug}` }] : []),
              { name: productTitle(product), url: `/catalog/tovar/${product.id}` },
            ]}
          />
        </div>

        <section className="mx-auto max-w-7xl px-5 py-10">
          <ProductDetail product={product} />
        </section>

        {/* Похожие */}
        {related.length > 0 ? (
          <section className="bg-sand-deep">
            <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
              <Reveal>
                <p className="eyebrow text-clinker">Похожие</p>
                <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
                  Смотрят также
                </h2>
              </Reveal>
              <div className="mt-10">
                <ProductGrid products={related} />
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
      <SchemaScript data={productSchema(product)} />
      <ViewTracker id={product.id} />
    </>
  );
}
