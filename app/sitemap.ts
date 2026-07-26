import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content/site";
import { CATEGORIES } from "@/lib/content/categories";
import { SOLUTIONS } from "@/lib/content/solutions";
import { BLOG_POSTS } from "@/lib/content/blog";
import { BRANDS } from "@/lib/catalog/brands";
import { SEED_PRODUCTS } from "@/lib/catalog/seed";

// Дата последней правки контента (обновлять при релизах; реальный lastmod —
// из CMS при наличии, ТЗ B.4).
const BUILD_DATE = new Date("2026-06-18");

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.baseUrl;
  const url = (p: string) => `${base}${p}`;

  const staticPages = ["/", "/calculator", "/services", "/blog", "/contacts", "/payment-delivery"].map(
    (p) => ({
      url: url(p),
      lastModified: BUILD_DATE,
      changeFrequency: "weekly" as const,
      priority: p === "/" ? 1 : 0.7,
    }),
  );

  const categories = CATEGORIES.map((c) => ({ url: url(`/${c.slug}`), lastModified: BUILD_DATE, priority: 0.9 }));
  const solutions = SOLUTIONS.map((s) => ({ url: url(`/resheniya/${s.slug}`), lastModified: BUILD_DATE, priority: 0.8 }));
  const producers = BRANDS.map((b) => ({ url: url(`/producers/${b.slug}`), lastModified: BUILD_DATE, priority: 0.7 }));
  const products = SEED_PRODUCTS.filter((p) => p.active).map((p) => ({
    url: url(`/catalog/${p.id}`),
    lastModified: p.price_updated_at ? new Date(p.price_updated_at) : BUILD_DATE,
    priority: 0.6,
  }));
  const posts = BLOG_POSTS.map((p) => ({
    url: url(`/blog/${p.slug}`),
    lastModified: new Date(p.dateModified ?? p.date),
    priority: 0.6,
  }));

  return [...staticPages, ...categories, ...solutions, ...producers, ...products, ...posts];
}
