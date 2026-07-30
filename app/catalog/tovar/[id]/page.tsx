import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductDetail } from "@/components/catalog/ProductDetail";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Reveal } from "@/components/ui/Reveal";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { SEED_PRODUCTS } from "@/lib/catalog/seed";
import { productTitle } from "@/lib/catalog/display";
import {
  getProductById,
  getRelatedProducts,
  productCategory,
} from "@/lib/catalog/queries";
import { getCategory } from "@/lib/content/categories";
import { brandSlugByName } from "@/lib/catalog/brands";
import { productSchema } from "@/lib/jsonld";
import { primeOverrides } from "@/lib/store/products";
import { resolveSeo } from "@/lib/store/seo";
import { ViewTracker } from "@/components/analytics/ViewTracker";

/* Правки из админки (цены, тексты, скрытие) подхватываются за минуту. */
export const revalidate = 60;

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  // Только активные: снятые с витрины товары (нет фото своего артикула — см.
  // scripts/deactivate_without_photo.py) не должны иметь и своей страницы.
  // Иначе они исчезают из листингов и счётчиков, но остаются доступны по прямой
  // ссылке — и попадают в выдачу как страница без картинки.
  return SEED_PRODUCTS.filter((p) => p.active).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  await primeOverrides();
  const { id } = await params;
  const p = getProductById(id);
  if (!p) return {};
  const seo = await resolveSeo(`product:${p.id}`, {
    title: p.seo.title,
    description: p.seo.description,
  });
  return {
    title: seo.title,
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
  if (!product || !product.active) notFound();

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
