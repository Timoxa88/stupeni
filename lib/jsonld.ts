/**
 * Построители Schema.org (ТЗ §4): Organization, LocalBusiness, BreadcrumbList,
 * Product, FAQPage, Article, HowTo. Возвращают plain-объекты — рендерятся через
 * <SchemaScript> в <script type="application/ld+json">.
 */

import { SITE } from "@/lib/content/site";
import type { Product } from "@/lib/catalog/types";
import { activePromo, basePrice } from "@/lib/catalog/queries";

const abs = (path: string) =>
  path.startsWith("http") ? path : `${SITE.baseUrl}${path}`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    legalName: SITE.legal,
    url: SITE.baseUrl,
    telephone: SITE.phone,
    taxID: SITE.inn,
    identifier: SITE.ogrn,
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.name,
    url: SITE.baseUrl,
    telephone: SITE.phone,
    address: [
      { "@type": "PostalAddress", addressLocality: "Москва", streetAddress: "Подольск, Домодедовское ш., 1В" },
      { "@type": "PostalAddress", addressLocality: "Санкт-Петербург", streetAddress: "Тосненский р-н, Фёдоровское" },
    ],
    openingHours: "Mo-Fr 09:00-19:00",
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.url),
    })),
  };
}

export function productSchema(p: Product) {
  const promo = activePromo(p);
  const price = promo?.old_price && promo.discount_percent
    ? Math.round(promo.old_price * (1 - promo.discount_percent / 100))
    : basePrice(p);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.seo.h1,
    sku: p.sku,
    brand: { "@type": "Brand", name: p.brand },
    category: p.product_type === "step_system" ? "Клинкерные ступени" : "Керамогранит 20 мм",
    image: p.photos.map(abs),
    description: p.seo.description,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "RUB",
      availability:
        p.stock_status === "on_order"
          ? "https://schema.org/PreOrder"
          : "https://schema.org/InStock",
      ...(promo?.ends_at
        ? { priceValidUntil: promo.ends_at.slice(0, 10) }
        : p.price_updated_at
          ? { priceValidUntil: p.price_updated_at }
          : {}),
    },
  };
}

/** ItemList товаров для листингов (ТЗ B.3). */
export function itemListSchema(
  items: { id: string; name: string }[],
  pathPrefix = "/catalog/",
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: abs(`${pathPrefix}${it.id}`),
      name: it.name,
    })),
  };
}

/** CollectionPage + встроенный ItemList для категорий/брендов/решений (ТЗ B.3). */
export function collectionPageSchema(c: {
  name: string;
  description: string;
  url: string;
  items: { id: string; name: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: c.name,
    description: c.description,
    url: abs(c.url),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: c.items.length,
      itemListElement: c.items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: abs(`/catalog/${it.id}`),
        name: it.name,
      })),
    },
  };
}

/** OfferCatalog услуг (ТЗ B.3 — Service/OfferCatalog на §10). */
export function servicesCatalogSchema(services: { title: string; desc: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Услуги Hit Ceramics",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.desc },
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function articleSchema(a: {
  title: string;
  description: string;
  image: string;
  date: string;
  dateModified?: string;
  author?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    image: abs(a.image),
    datePublished: a.date,
    dateModified: a.dateModified ?? a.date,
    ...(a.author ? { author: { "@type": "Person", name: a.author } } : {}),
    mainEntityOfPage: abs(a.url),
    publisher: { "@type": "Organization", name: SITE.name },
  };
}

export function howToSchema(h: {
  name: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: h.name,
    step: h.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}
