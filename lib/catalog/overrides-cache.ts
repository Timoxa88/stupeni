import type { Product, ProductPromo, ProductSpecs } from "./types";

/**
 * Кэш переопределений каталога для СИНХРОННОЙ логики листингов.
 *
 * Модуль намеренно без `server-only` и без импорта БД: его тянет
 * `lib/catalog/queries.ts`, который используется и клиентскими компонентами.
 * Наполняет кэш серверный `lib/store/products.ts` (там же чтение из БД);
 * на клиенте кэш всегда пуст, и `applyOverrideCached` возвращает сид как есть.
 */

export type PriceOverride = {
  elements?: Record<string, number>;
  formats?: Record<string, { sqm?: number; pcs?: number }>;
};

export type ProductOverride = {
  id: string;
  active: boolean;
  collection: string | null;
  prices: PriceOverride | null;
  specs: Partial<ProductSpecs> | null;
  photos: string[] | null;
  promo: ProductPromo | null;
  stockStatus: "in_stock" | "on_order" | null;
  leadTimeWeeks: number | null;
  seo: Partial<Product["seo"]> | null;
  sortOrder: number;
  updatedAt: string;
};

let cache: Map<string, ProductOverride> = new Map();
let cachedAt = 0;

export function setOverridesCache(map: Map<string, ProductOverride>): void {
  cache = map;
  cachedAt = Date.now();
}

export function overridesCacheAge(): number {
  return cachedAt === 0 ? Infinity : Date.now() - cachedAt;
}

export function invalidateOverridesCache(): void {
  cachedAt = 0;
}

/** Применяет переопределение к артикулу сида (иммутабельно). */
export function applyOverride(p: Product, o: ProductOverride | undefined): Product {
  if (!o) return p;
  const out: Product = { ...p };

  // Скрытое в сиде (например, нет своего фото) остаётся скрытым: админка может
  // только убрать артикул с витрины, но не вернуть снятый генератором.
  out.active = p.active && o.active;
  if (o.collection) out.collection = o.collection;
  if (o.specs) out.specs = { ...p.specs, ...o.specs };
  if (o.photos?.length) out.photos = o.photos;
  // Промо: строка-оверрайд появляется и при правке цены, поэтому «акции нет» —
  // это явный маркер { off: true }, а не NULL (иначе любая правка гасила бы акцию).
  const promo = o.promo as (ProductPromo & { off?: boolean }) | null;
  if (promo) out.promo = promo.off ? undefined : promo;
  if (o.stockStatus) out.stock_status = o.stockStatus;
  if (o.leadTimeWeeks != null) out.lead_time_weeks = o.leadTimeWeeks;
  if (o.seo) out.seo = { ...p.seo, ...o.seo };

  if (o.prices?.elements && p.elements) {
    out.elements = p.elements.map((e) => {
      const v = o.prices?.elements?.[e.code];
      return typeof v === "number" && v >= 0 ? { ...e, price_rub: Math.round(v) } : e;
    });
  }
  if (o.prices?.formats && p.formats) {
    out.formats = p.formats.map((f) => {
      const v = o.prices?.formats?.[f.code];
      if (!v) return f;
      return {
        ...f,
        ...(typeof v.sqm === "number" && v.sqm >= 0 ? { price_rub_sqm: Math.round(v.sqm) } : {}),
        ...(typeof v.pcs === "number" && v.pcs > 0 ? { price_rub_pcs: Math.round(v.pcs) } : {}),
      };
    });
  }
  return out;
}

/** Синхронное применение из кэша — точка входа для `queries.ts`. */
export function applyOverrideCached(p: Product): Product {
  if (cache.size === 0) return p;
  return applyOverride(p, cache.get(p.id));
}
