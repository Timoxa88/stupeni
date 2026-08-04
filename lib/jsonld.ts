/**
 * Построители Schema.org (ТЗ §4): Organization, LocalBusiness, BreadcrumbList,
 * Product, FAQPage, Article, HowTo. Возвращают plain-объекты — рендерятся через
 * <SchemaScript> в <script type="application/ld+json">.
 */

import { SITE, PLACES, CITY_CONTACTS } from "@/lib/content/site";
import type { Product } from "@/lib/catalog/types";
import { activePromo, basePrice } from "@/lib/catalog/queries";
import { priceView } from "@/lib/catalog/pricing";
import { REVIEWS, REVIEWS_SUMMARY } from "@/lib/content/reviews";

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
    // Связь сущности бренда с внешними профилями: YandexGPT и нейроответы сверяют
    // сайт с карточками организации, без sameAs связь не читается. Только реально
    // существующие профили — выдумывать нельзя.
    sameAs: [
      "https://yandex.ru/maps/org/khit_keramiks/73097266609",
      "https://yandex.ru/maps/org/khit_keramiks/1343837569",
    ],
    // Цифры обязаны совпадать с видимым блоком отзывов (components/sections/Reviews.tsx):
    // Яндекс сверяет разметку с текстом страницы. Источник — тот же пул отзывов.
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(REVIEWS_SUMMARY.ratingValue),
      reviewCount: REVIEWS_SUMMARY.reviewCount,
      bestRating: String(REVIEWS_SUMMARY.bestRating),
      worstRating: String(REVIEWS_SUMMARY.worstRating),
    },
    review: REVIEWS.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      datePublished: r.date,
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(r.rating),
        bestRating: String(REVIEWS_SUMMARY.bestRating),
        worstRating: String(REVIEWS_SUMMARY.worstRating),
      },
      reviewBody: r.text,
    })),
  };
}

/**
 * LocalBusiness — по одной сущности на точку (ТЗ B.3).
 *
 * Раньше отдавалась ОДНА сущность с массивом в `address`: по schema.org там
 * одно значение, две точки описываются двумя объектами с разными `@id`.
 * Координаты и часы берутся из PLACES, телефон — городской из CITY_CONTACTS.
 */
export function localBusinessSchema() {
  const phoneByCity = new Map<string, string>(
    CITY_CONTACTS.map((c) => [c.city as string, c.phone as string]),
  );
  return PLACES.map((pl) => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": abs(`/#${pl.kind}-${pl.city === "Москва" ? "msk" : "spb"}-${slugifyPlace(pl.address)}`),
    name: `${SITE.name} — ${pl.kind === "showroom" ? "шоу-рум" : "склад"}, ${pl.city}`,
    url: SITE.baseUrl,
    telephone: phoneByCity.get(pl.city) ?? SITE.phone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: pl.city,
      streetAddress: pl.address,
      addressCountry: "RU",
    },
    geo: { "@type": "GeoCoordinates", latitude: pl.coords[0], longitude: pl.coords[1] },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "19:00",
    },
    parentOrganization: { "@type": "Organization", name: SITE.legal, taxID: SITE.inn },
  }));
}

const slugifyPlace = (s: string) =>
  s.toLowerCase().replace(/[^a-zа-я0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24);

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
  // Цена в разметке обязана совпадать с видимой на странице → тот же источник.
  const { price } = priceView(p, basePrice(p));
  const promo = activePromo(p);
  // priceValidUntil должен быть в БУДУЩЕМ: дедлайн акции, иначе +7 дней от сегодня
  // (политика §B.9). Прежде сюда попадала прошедшая price_updated_at.
  const validUntil = (() => {
    const now = Date.now();
    if (promo?.ends_at) {
      const end = Date.parse(promo.ends_at);
      if (Number.isFinite(end) && end > now) return new Date(end);
    }
    return new Date(now + 7 * 24 * 60 * 60 * 1000);
  })()
    .toISOString()
    .slice(0, 10);
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
      url: abs(`/catalog/tovar/${p.id}`),
      // Наличие размечаем ТОЛЬКО когда оно известно (источник — 1С, ТЗ B.9).
      // Раньше при отсутствии данных подставлялось InStock — это заявление о
      // наличии товара, которого мы не знаем.
      ...(p.stock_status
        ? {
            availability:
              p.stock_status === "on_order"
                ? "https://schema.org/PreOrder"
                : "https://schema.org/InStock",
          }
        : {}),
      priceValidUntil: validUntil,
      seller: { "@type": "Organization", name: SITE.name },
    },
  };
}

/** ItemList товаров для листингов (ТЗ B.3). */
export function itemListSchema(
  items: { id: string; name: string }[],
  pathPrefix = "/catalog/tovar/",
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
        url: abs(`/catalog/tovar/${it.id}`),
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

/**
 * Калькулятор как веб-приложение. Единственная страница сайта, у которой не было
 * микроразметки, — а это ровно тот тип страницы, который поисковики показывают
 * расширенным сниппетом («рассчитать онлайн»).
 */
export function calculatorSchema(c: { name: string; description: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: c.name,
    description: c.description,
    url: abs(c.url),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    browserRequirements: "Требуется JavaScript",
    inLanguage: "ru-RU",
    isAccessibleForFree: true,
    // Расчёт бесплатный — без Offer поисковик считает приложение платным.
    offers: { "@type": "Offer", price: 0, priceCurrency: "RUB" },
    provider: { "@type": "Organization", name: SITE.name, url: SITE.baseUrl },
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
