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
import {
  getProductById,
  getRelatedProducts,
  productCategory,
} from "@/lib/catalog/queries";
import { getCategory } from "@/lib/content/categories";
import { brandSlugByName } from "@/lib/catalog/brands";
import { productSchema } from "@/lib/jsonld";

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return SEED_PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const p = getProductById(id);
  if (!p) return {};
  return {
    title: p.seo.title,
    description: p.seo.description,
    alternates: { canonical: `/catalog/${p.id}` },
  };
}

export default async function ProductPage({ params }: Params) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const cat = getCategory(productCategory(product));
  const brandSlug = brandSlugByName(product.brand);
  const related = getRelatedProducts(product);

  return (
    <>
      <Header />
      <main id="main" className="pt-[72px]">
        <div className="mx-auto max-w-7xl px-5 pt-6">
          <Breadcrumbs
            items={[
              { name: "Главная", url: "/" },
              ...(cat ? [{ name: cat.h1, url: `/${cat.slug}` }] : []),
              ...(brandSlug ? [{ name: product.brand, url: `/producers/${brandSlug}` }] : []),
              { name: `${product.collection} ${product.specs.color}`, url: `/catalog/${product.id}` },
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
    </>
  );
}
