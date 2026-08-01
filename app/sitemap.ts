import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content/site";
import { CATEGORIES } from "@/lib/content/categories";
import { SOLUTIONS } from "@/lib/content/solutions";
import { publishedPosts } from "@/lib/store/blog";
import { listSeoOverrides } from "@/lib/store/seo";
import { primeOverrides } from "@/lib/store/products";
import { BRANDS } from "@/lib/catalog/brands";
import { SEED_PRODUCTS } from "@/lib/catalog/seed";
import { productCategory } from "@/lib/catalog/queries";
import { allPaths } from "@/lib/catalog/taxonomy";
import { overrideUpdatedAt } from "@/lib/catalog/overrides-cache";

/**
 * lastmod (ТЗ B.4 — freshness как GEO-сигнал).
 *
 * Раньше на ВСЕХ URL стояла одна захардкоженная дата 18.06.2026, из-за чего
 * sitemap врал о свежести. Теперь дата берётся из самих данных:
 *  - карточка товара — дата прайса (`price_updated_at`);
 *  - статья — `dateModified`/`date`;
 *  - категории, бренды, решения — максимум по их товарам/контенту;
 *  - служебные страницы — дата сборки (меняется при деплое).
 */
const BUILD_DATE = new Date();

/** Самая свежая дата из набора; при пустом наборе — дата сборки. */
const latest = (dates: (string | undefined)[]): Date => {
  const ms = dates
    .filter(Boolean)
    .map((d) => Date.parse(d as string))
    .filter((n) => Number.isFinite(n));
  return ms.length ? new Date(Math.max(...ms)) : BUILD_DATE;
};

/** Карта сайта учитывает правки админки: скрытые артикулы и noindex-страницы. */
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.baseUrl;
  const url = (p: string) => `${base}${p}`;
  await primeOverrides();
  const [posts, seo] = await Promise.all([publishedPosts(), listSeoOverrides()]);
  const noindex = new Set(seo.filter((s) => s.noindex).map((s) => s.key));

  const staticPages = [
    "/",
    "/catalog",
    "/resheniya",
    "/calculator",
    "/podbor",
    "/services",
    "/blog",
    "/contacts",
    "/payment-delivery",
  ].map(
    (p) => ({
      url: url(p),
      lastModified: BUILD_DATE,
      changeFrequency: "weekly" as const,
      priority: p === "/" ? 1 : 0.7,
    }),
  );

  const active = SEED_PRODUCTS.filter((p) => p.active);
  const categories = CATEGORIES.map((c) => ({
    url: url(`/${c.slug}`),
    lastModified: latest(
      active.filter((p) => productCategory(p) === c.slug).map((p) => p.price_updated_at),
    ),
    priority: 0.9,
  }));
  const solutions = SOLUTIONS.map((s) => ({
    url: url(`/resheniya/${s.slug}`),
    lastModified: latest(
      active
        .filter((p) => p.application.includes(s.slug as (typeof p.application)[number]))
        .map((p) => p.price_updated_at),
    ),
    priority: 0.8,
  }));
  const producers = BRANDS.map((b) => ({
    url: url(`/producers/${b.slug}`),
    lastModified: latest(active.filter((p) => p.brand === b.name).map((p) => p.price_updated_at)),
    priority: 0.7,
  }));
  // Иерархия каталога «назначение → бренд → коллекция» (lib/catalog/taxonomy).
  const facets = allPaths().map((p) => ({
    url: url(
      `/catalog/${p.app}${p.brand ? `/${p.brand}` : ""}${p.collection ? `/${p.collection}` : ""}`,
    ),
    lastModified: latest(active.map((x) => x.price_updated_at)),
    priority: p.collection ? 0.7 : p.brand ? 0.75 : 0.85,
  }));
  const products = active
    .filter((p) => !noindex.has(`product:${p.id}`))
    .map((p) => ({
      url: url(`/catalog/tovar/${p.id}`),
      // Позже из двух: дата прайса и дата правки артикула в админке. Правка
      // текста, фото или скидки меняет страницу, даже если цена осталась старой.
      lastModified: latest([p.price_updated_at, overrideUpdatedAt(p.id)]),
      priority: 0.6,
    }));
  const postPages = posts
    .filter((p) => !noindex.has(`blog:${p.slug}`))
    .map((p) => ({
      url: url(`/blog/${p.slug}`),
      lastModified: new Date(p.dateModified ?? p.date),
      priority: 0.6,
    }));

  return [...staticPages, ...facets, ...categories, ...solutions, ...producers, ...products, ...postPages];
}
