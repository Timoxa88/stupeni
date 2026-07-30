import "server-only";
import { eq } from "drizzle-orm";
import { db, hasDb, schema } from "@/lib/db/client";
import { SEED_PRODUCTS } from "@/lib/catalog/seed";
import type { Product, ProductPromo, ProductSpecs } from "@/lib/catalog/types";
import {
  applyOverride,
  invalidateOverridesCache,
  overridesCacheAge,
  setOverridesCache,
  type PriceOverride,
  type ProductOverride,
} from "@/lib/catalog/overrides-cache";

export type { PriceOverride, ProductOverride };
export { applyOverride };

/**
 * Каталог = сгенерированный сид (`lib/catalog/generated/*`) ⊕ переопределения
 * из БД. Сид остаётся источником структуры (элементы, форматы, фото, документы),
 * админка правит цены, тексты, фото, промо, наличие, SEO и видимость.
 *
 * Листинги, фасеты и пагинация синхронные и построены на `SEED_PRODUCTS`
 * (см. `lib/catalog/queries.ts`), а чтение БД асинхронное. Поэтому оверрайды
 * держатся в модульном кэше: серверная страница один раз вызывает
 * `primeOverrides()`, после чего вся синхронная логика листингов видит правки
 * через `applyOverrideCached()`. TTL кэша совпадает с ISR-окном страниц,
 * так что лишних запросов почти нет.
 *
 * Все чтения устойчивы к недоступной БД: возвращают чистый сид, чтобы сборка
 * и сайт не падали.
 */

function rowToOverride(r: typeof schema.productOverrides.$inferSelect): ProductOverride {
  return {
    id: r.id,
    active: r.active,
    collection: r.collection,
    prices: (r.prices ?? null) as PriceOverride | null,
    specs: (r.specs ?? null) as Partial<ProductSpecs> | null,
    photos: (r.photos ?? null) as string[] | null,
    promo: (r.promo ?? null) as ProductPromo | null,
    stockStatus: (r.stockStatus ?? null) as ProductOverride["stockStatus"],
    leadTimeWeeks: r.leadTimeWeeks,
    seo: (r.seo ?? null) as Partial<Product["seo"]> | null,
    sortOrder: r.sortOrder,
    updatedAt: (r.updatedAt instanceof Date ? r.updatedAt : new Date(r.updatedAt)).toISOString(),
  };
}

/** Свежие переопределения из БД (админка читает мимо кэша). */
export async function getOverrides(): Promise<Map<string, ProductOverride>> {
  if (!hasDb()) return new Map();
  try {
    const rows = await db().select().from(schema.productOverrides);
    return new Map(rows.map((r) => [r.id, rowToOverride(r)]));
  } catch {
    return new Map();
  }
}

// ── Наполнение кэша для синхронной логики листингов ─────────────────────────

const CACHE_TTL_MS = 30_000;
let inflight: Promise<void> | null = null;

/**
 * Подтягивает переопределения в кэш. Вызывается серверными страницами перед
 * обращением к каталогу; параллельные вызовы схлопываются в один запрос.
 */
export async function primeOverrides(force = false): Promise<void> {
  if (!hasDb()) return;
  if (!force && overridesCacheAge() < CACHE_TTL_MS) return;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      setOverridesCache(await getOverrides());
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

/** Сбросить кэш (после сохранения в админке). */
export function invalidateOverrides(): void {
  invalidateOverridesCache();
}

// ── Админка ─────────────────────────────────────────────────────────────────

/** Все артикулы (включая скрытые) с применёнными оверрайдами. */
export async function allProducts(): Promise<Product[]> {
  const overrides = await getOverrides();
  return SEED_PRODUCTS.map((p) => applyOverride(p, overrides.get(p.id)));
}

export async function productById(id: string): Promise<Product | undefined> {
  const p = SEED_PRODUCTS.find((x) => x.id === id);
  if (!p) return undefined;
  return applyOverride(p, (await getOverrides()).get(id));
}

type Patch = Partial<Omit<ProductOverride, "id" | "updatedAt">>;

/** upsert переопределения: пишем только переданные поля. */
async function upsert(id: string, patch: Patch): Promise<void> {
  const values: Record<string, unknown> = { id, ...patch };
  const set: Record<string, unknown> = { ...patch, updatedAt: new Date() };
  await db()
    .insert(schema.productOverrides)
    .values(values as typeof schema.productOverrides.$inferInsert)
    .onConflictDoUpdate({ target: schema.productOverrides.id, set });
  invalidateOverrides();
}

export async function setActive(id: string, active: boolean): Promise<void> {
  await upsert(id, { active });
}

export async function setPrices(id: string, prices: PriceOverride | null): Promise<void> {
  const clean: PriceOverride = {};
  if (prices?.elements && Object.keys(prices.elements).length) clean.elements = prices.elements;
  if (prices?.formats && Object.keys(prices.formats).length) clean.formats = prices.formats;
  await upsert(id, { prices: Object.keys(clean).length ? clean : null });
}

export async function setContent(
  id: string,
  patch: {
    collection?: string | null;
    specs?: Partial<ProductSpecs> | null;
    photos?: string[] | null;
    seo?: Partial<Product["seo"]> | null;
  },
): Promise<void> {
  await upsert(id, patch);
}

/** promo=null → маркер «акции нет» (см. applyOverride). */
export async function setPromo(id: string, promo: ProductPromo | null): Promise<void> {
  await upsert(id, { promo: promo ?? ({ off: true } as unknown as ProductPromo) });
}

export async function setStock(
  id: string,
  stockStatus: "in_stock" | "on_order" | null,
  leadTimeWeeks: number | null,
): Promise<void> {
  await upsert(id, { stockStatus, leadTimeWeeks });
}

/** Полный сброс к сиду. */
export async function resetOverride(id: string): Promise<void> {
  await db().delete(schema.productOverrides).where(eq(schema.productOverrides.id, id));
  invalidateOverrides();
}
